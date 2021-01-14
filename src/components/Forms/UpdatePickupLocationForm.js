import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { DebounceInput } from 'react-debounce-input';
import * as Yup from 'yup';
import { updateLocation } from '../../APIs/Update';
import { getAddress, getLatLong } from '../../APIs/Read';
import CloseSVGIcon from '../../assets/icons/close-modal.svg';
import { WarningSVGIcon, ArrowSVGIcon } from '../../assets/icons/Icons';
import CreateNewRouteFormStyle from '../../styles/CreateNewRouteFormStyle';
import FormStyle from '../../styles/FormStyle';
import { toastEnums } from '../../_utils/constants';
import PopupLoader from '../Loaders/PopupLoader';
import ButtonLoader from '../Loaders/ButtonLoader';
import { useTranslation } from 'react-i18next';
import { capitalizeFirstLetter, getCountry, baseurl, phoneFormatter, lang } from '../../_utils/fx';
import { uuid } from '../../_utils/fx';
import CardFrequencyLoader from '../Loaders/CardFrequencyLoader';

const Apptoken = process.env.REACT_APP_APPTOKEN;

function AddressList({ isPopupLoading, addresses, setAddress }) {
  if (isPopupLoading) {
    return (
      <div className='popupItemWrap loading'>
        <PopupLoader />
      </div>
    );
  }

  return addresses.map(({ description, placeId }) => (
    <div className='popupItemWrap' key={placeId}>
      <p className='popupText' title={description} onClick={() => setAddress({ address: description, placeId })}>
        {description}
      </p>
    </div>
  ));
}

function UpdatePickupLocationForm({ endpointParams: { customerId, locationId, token }, location, setModal, syncUp }) {
  const { t } = useTranslation();
  const [formError, setFormError] = useState({
    showFormError: false,
    formErrorMessage: undefined,
  });
  const [isPopupActive, setIsPopupActive] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [address, setPickUpAddress] = useState();
  const [isPopupLoading, setIsPopupLoading] = useState();
  const [latLng, setLatLng] = useState();
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState([]);
  const [userCountry, setUserCountry] = useState(undefined);

  useEffect(() => {
    (async () => {
      try {
        if (countries.length === 0) {
          setLoading(true);
          const endpoint = `/route/country?language=${lang}`;
          const res = await baseurl.get(endpoint);
          if (res) {
            setLoading(false);
            setCountries(res.data.data.countries);
          }
        }
      } catch (error) {}
    })();
  }, [countries.length]);

  useEffect(() => {
    if (formError.showFormError) {
      setTimeout(() => {
        setFormError({
          showFormError: false,
          formErrorMessage: undefined,
        });
      }, 3000);
    }
  }, [formError.showFormError]);
  const {
    handleSubmit,
    handleChange,
    values,
    errors,
    touched,
    isSubmitting,
    setFieldValue,
    dirty,
    isValid,
  } = useFormik({
    initialValues: {
      contact_name: location.contact_name || '',
      name: location.name || '',
      contact_phone: parseInt(location.contact_phone, 10) || '',
      address: location.address || '',
      state: location.state || '',
      lat: location.lat || 0,
      lng: location.long || 0,
      country: location.country || '',
    },
    validationSchema: Yup.object().shape({
      contact_name: Yup.string().required(`${t('forms.required')}`),
      name: Yup.string().required(`${t('forms.required')}`),
      contact_phone: Yup.string().required(`${t('forms.required')}`),
      address: Yup.string().required(`${t('forms.required')}`),
      state: Yup.string().required(`${t('forms.required')}`),
      country: Yup.string().required(`${t('forms.required')}`),
    }),
    async onSubmit(values) {
      const code = countries.find(item => item.country.toLowerCase() === values.country.toLowerCase()).phoneCode;
      try {
        const params = {
          contact_name: values.contact_name,
          name: values.name,
          contact_phone: phoneFormatter(values.contact_phone.toString(), code),
          country: values.country,
          address: values.address,
          state: values.state,
          lat: latLng ? latLng.lat : values.lat,
          long: latLng ? latLng.lng : values.lng,
        };
        const res = await updateLocation({ params, endpointParams: { customerId, locationId, token } });
        if (res) {
        }
        syncUp({
          toastType: toastEnums.SUCCESS,
          toastMessage: 'Recipient updated',
        });
      } catch ({ response }) {
        if (response) {
          // const { status: statusCode } = response;
          const { message } = response.data;
          setFormError({
            showFormError: true,
            formErrorMessage: message,
          });
        } else {
          syncUp({
            toastType: toastEnums.FAILURE,
            toastMessage: 'Something went wrong. Try again.',
          });
        }
      }
    },
  });

  async function setBusinessAddress(value) {
    const valueLength = value.length;
    if (valueLength === 0) {
      setIsPopupLoading(false);
      setIsPopupActive(false);
    }
    if (valueLength > 0) {
      setIsPopupLoading(true);
      const res = await getAddress({ value, token });
      const predictions = res.data.data.autocomplete;
      setAddresses(predictions);
    }
  }

  useEffect(() => {
    // ?? We now have at least an address
    if (addresses.length > 0) {
      setIsPopupLoading(false);
      setIsPopupActive(true);
    } else {
      setIsPopupActive(false);
    }
  }, [addresses]);

  useEffect(() => {
    if (address && address.placeId) {
      (async () => {
        const res = await getLatLong({ placeId: address.placeId, token });
        const location = res.data.data.place.geometry.location;
        const lat = location.lat;
        const lng = location.lng;
        setFieldValue('address', address.address);
        setIsPopupActive(false);
        setUserCountry(getCountry(res.data.data.place.addressComponents));
        setLatLng({
          lat,
          lng,
        });
      })();
    }
  }, [address, setFieldValue, token]);

  function getStates(country, token) {
    const endpoint = `/route/getStateCode/${country}?language=${lang}`;
    return baseurl.get(endpoint, {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    });
  }

  const setAddress = address => {
    if (!address.address.toLowerCase().includes(values.state)) {
      setFormError({
        showFormError: true,
        formErrorMessage: `Please select an address with the correct pickup state`,
      });
    } else {
      setPickUpAddress(address);
    }
  };
  useEffect(() => {
    (async () => {
      if (userCountry) {
        // setIsPickupStatesLoading(true);
        const response = await getStates(userCountry, token);
        if (response) {
          setStates(response.data.data.states);
          // setIsPickupStatesLoading(false);
        }
      }
    })();
  }, [token, userCountry]);

  const customChangeHandler = e => {
    const value = e.target.value;
    setUserCountry(value);
    setFieldValue('country', value);
  };

  return (
    <FormStyle id='formStyle'>
      <CreateNewRouteFormStyle id='createNewRouteFormStyle'>
        <form id='createNewRouteForm' noValidate onSubmit={handleSubmit}>
          <div className='formContentBlock'>
            {formError.showFormError && (
              <div className='formErrorBlock'>
                <div className='formErrorIconBlock'>
                  <WarningSVGIcon />
                </div>
                <p className='formErrorMessage'>{formError.formErrorMessage}</p>
              </div>
            )}
            <header className='formHeader mt-2'>
              <h2 className='formTitle'>
                <>{t('forms.editPickupLocation')}</>
              </h2>
            </header>
            <div className='formContent'>
              <div className='fields'>
                {/* Store name */}
                <div className='mobile formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='mobile'>
                      <>{t('forms.storeName')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {errors['name'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['name']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['name'] && errors['name']}>
                    <input
                      value={values.name}
                      onChange={handleChange}
                      className='mobile formField'
                      type='text'
                      name='name'
                    />
                  </div>
                </div>
                {/* Full name */}
                <div className='fullName formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='fullName'>
                      <>{t('forms.contactName')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {errors['contact_name'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['contact_name']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['contact_name'] && errors['contact_name']}>
                    <input
                      value={values.contact_name}
                      onChange={handleChange}
                      className='fullName formField'
                      type='text'
                      name='contact_name'
                      autoComplete='off'
                    />
                  </div>
                </div>

                {/* Country */}
                <div className='country formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='country'>
                      <>{t('forms.country')}</>
                    </label>
                    {loading && <CardFrequencyLoader />}

                    <div className='errorMessageBlock'>
                      {touched['country'] && errors['country'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['country']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['country'] && errors['country']}>
                    <div className='selectContainer'>
                      <div className='select-arrow fa fa-chevron-down'>
                        <ArrowSVGIcon />
                      </div>
                      <select
                        value={values.country}
                        // onChange={handleChange}
                        onChange={customChangeHandler}
                        className='country formField'
                        name='country'
                        autoComplete='no'
                      >
                        <option defaultChecked>{t('forms.selectCountry')}</option>
                        {countries.length > 0 &&
                          countries.map(({ country }) => (
                            <option value={country} key={uuid()}>
                              {capitalizeFirstLetter(country)}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
                {/* State*/}
                <div className='state formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='state'>
                      <>{t('forms.storeState')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {errors['state'] && touched['state'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['state']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['state'] && errors['state']}>
                    <div className='selectContainer'>
                      <div className='select-arrow fa fa-chevron-down'>
                        <ArrowSVGIcon />
                      </div>
                      <select
                        onChange={e => setFieldValue('state', String(e.target.value))}
                        value={values.state}
                        className='state formField'
                        name='state'
                        autoComplete='no'
                      >
                        {location.state ? (
                          <option defaultChecked>{location.state}</option>
                        ) : (
                          <option defaultChecked>---Select state---</option>
                        )}
                        {states &&
                          states.map(({ state, code }) => (
                            <option value={`${code}-${state}`} key={state}>
                              {capitalizeFirstLetter(state)}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
                {/* Business Address */}
                <div className='businessAddress formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='businessAddress'>
                      <>{t('forms.storeAddress')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {errors['businessAddress'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['address']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['address'] && errors['address']}>
                    <DebounceInput
                      value={values.address}
                      onChange={e => setBusinessAddress(e.target.value)}
                      className='businessAddress formField'
                      type='text'
                      name='address'
                      minLength={0}
                      debounceTimeout={50}
                      autoComplete='no'
                    />
                    {isPopupActive && (
                      <div className='popup'>
                        <AddressList {...{ isPopupLoading, addresses, setAddress }} />
                      </div>
                    )}
                  </div>
                </div>

                {/* extension */}
                <div className='extension formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='contact_phone'>
                      <>{t('forms.contactPhone')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {errors['contact_phone'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['contact_phone']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['contact_phone'] && errors['contact_phone']}>
                    <input
                      value={values.contact_phone}
                      onChange={handleChange}
                      className='fullName formField'
                      type='number'
                      name='contact_phone'
                      autoComplete='no'
                    />
                  </div>
                </div>
                <div className='cta'>
                  <button type='submit' className='dp-flex' disabled={!(isValid && dirty) || isSubmitting}>
                    {(isSubmitting && <ButtonLoader />) || <>{t('buttons.update')}</>}
                  </button>
                  <button
                    type='button'
                    className='cancel'
                    data-align='center-both'
                    onClick={() => setModal({ showModal: false, modalType: undefined, modalItemId: undefined })}
                  >
                    <span className='actionIcon cancel'>
                      <img src={CloseSVGIcon} alt='cancel' />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </CreateNewRouteFormStyle>
    </FormStyle>
  );
}

export default UpdatePickupLocationForm;
