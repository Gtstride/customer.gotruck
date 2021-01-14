import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { DebounceInput } from 'react-debounce-input';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { createPickup } from '../../APIs/Create';
import { getAddress, getLatLong } from '../../APIs/Read';
import CloseSVGIcon from '../../assets/icons/close-modal.svg';
import { WarningSVGIcon, ArrowSVGIcon } from '../../assets/icons/Icons';
import CreateNewRouteFormStyle from '../../styles/CreateNewRouteFormStyle';
import FormStyle from '../../styles/FormStyle';
import { toastEnums } from '../../_utils/constants';
import PopupLoader from '../Loaders/PopupLoader';
import ButtonLoader from '../Loaders/ButtonLoader';
import { capitalizeFirstLetter, baseurl, sortArrayofObjectsByNumberProp, phoneFormatter, lang } from '../../_utils/fx';
import { uuid } from '../../_utils/fx';
import getPickupLocationsEndpoints from '../../APIs/endpoints/pickup-locations';
import { getPickupLocations } from '../../APIs/Read';
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
    <div className='popupItemWrap' key={uuid()}>
      <p className='popupText' title={description} onClick={() => setAddress({ address: description, placeId })}>
        {description}
      </p>
    </div>
  ));
}

function CreateNewPickupLocationForm({ setModal, token, customerId, syncUp, updateTableData }) {
  const { t } = useTranslation();
  const [formError, setFormError] = useState({
    showFormError: false,
    formErrorMessage: undefined,
  });
  const [isPopupActive, setIsPopupActive] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [address, setAddress] = useState();
  const [countries, setCountries] = useState([]);
  const [isPopupLoading, setIsPopupLoading] = useState();
  const [latLng, setLatLng] = useState();
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [userCountry, setUserCountry] = useState(undefined);
  // const [countryCode, setCountryCode] = useState(undefined);

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
    // handleChange,
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    dirty,
    setFieldValue,
    getFieldProps,
  } = useFormik({
    initialValues: {
      contact_name: '',
      name: '',
      contact_phone: '',
      address: '',
      state: '',
      country: '',
      countryCode: '',
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
      const { READ } = getPickupLocationsEndpoints({ customerId });
      const code = countries.find(item => item.country === values.country).phoneCode;

      try {
        const params = {
          contact_name: values.contact_name,
          name: values.name,
          contact_phone: phoneFormatter(values.contact_phone.toString(), code),
          country: values.country,
          // eslint-disable-next-line quotes
          address: values.address.replace("Côte d'Ivoire", 'Ivory Coast'),
          state: values.state,
          lat: latLng.lat,
          long: latLng.lng,
          state_code: states.find(state => state.state.toLowerCase() === values.state.toLowerCase()).code,
        };
        const postRes = await createPickup({ params, customerId, token });

        if (postRes) {
          const readRes = await getPickupLocations({ endpoint: READ.pickupLocations, token });
          const pickupLocations = readRes.data.data.locations;
          sortArrayofObjectsByNumberProp(pickupLocations, 'created_at', 'desc');
          updateTableData({ tableData: pickupLocations });

          if (readRes) {
            syncUp({
              toastType: 'success',
              toastMessage: 'Pickup location added',
            });
          }
        }
      } catch ({ response }) {
        if (response) {
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
        try {
          const res = await getLatLong({ placeId: address.placeId, token });
          const location = res.data.data.place.geometry.location;
          const lat = location.lat;
          const lng = location.lng;
          setFieldValue('address', address.address);
          setIsPopupActive(false);
          // setUserCountry(getCountry(res.data.data.response.result.address_components).country);
          setLatLng({
            lat,
            lng,
          });
        } catch (error) {
          syncUp({
            toastType: toastEnums.FAILURE,
            toastMessage: 'Country not found.',
          });
        }
      })();
    }
  }, [address, setFieldValue, syncUp, token]);

  useEffect(() => {
    (async () => {
      if (values.country) {
        // setIsPickupStatesLoading(true);
        const countryCode = countries.find(item => item.country.toLowerCase() === values.country.toLowerCase())
          .countryCode;
        const response = await getStatesByCode(countryCode, token);
        if (response) {
          setStates(response.data.data.states);
        }
      }
    })();
  }, [countries, token, values.country]);

  function getStatesByCode(code, token) {
    const endpoint = `/route/country/${code}/states?language=${lang}`;
    return baseurl.get(endpoint, {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    });
  }

  const setPickUpAddress = address => {
    if (!address.address.toLowerCase().includes(values.state)) {
      setFormError({
        showFormError: true,
        formErrorMessage: `Please select an address with the correct pickup state`,
      });
    } else {
      setAddress(address);
    }
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
            <header className='formHeader'>
              <h2 className='formTitle'>
                <>{t('forms.addPickupLocation')}</>
              </h2>
            </header>
            <div className='formContent'>
              <div className='fields'>
                {/* Store name */}
                <div className='name formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='name'>
                      <>{t('forms.storeName')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {touched['name'] && errors['name'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['name']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['name'] && errors['name']}>
                    <input className='name formField' type='text' {...getFieldProps('name')} autoComplete='no' />
                  </div>
                </div>
                {/* Full name */}
                <div className='fullName formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='fullName'>
                      <>{t('forms.contactName')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {touched['contact_name'] && errors['contact_name'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['contact_name']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['contact_name'] && errors['contact_name']}>
                    <input
                      className='fullName formField'
                      type='text'
                      {...getFieldProps('contact_name')}
                      autoComplete='no'
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
                      <select className='country formField' autoComplete='no' {...getFieldProps('country')}>
                        <option defaultChecked>{t('forms.selectCountry')}</option>
                        {countries.length > 0 &&
                          countries.map(({ country, countryCode }) => (
                            <option value={country} key={uuid()}>
                              {capitalizeFirstLetter(country)}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* State */}
                <div className='state formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='state'>
                      <>{t('forms.storeState')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {touched['state'] && errors['state'] && (
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
                        autoComplete='no'
                        {...getFieldProps('state')}
                      >
                        <option defaultChecked>{t('forms.selectState')}</option>
                        {states &&
                          states.map(({ state, code }) => (
                            <option value={state} key={uuid()}>
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
                      {touched['address'] && errors['businessAddress'] && (
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
                      minLength={0}
                      debounceTimeout={50}
                      placeholder='Add store address'
                      autoComplete='no'
                    />
                    {isPopupActive && (
                      <div className='popup'>
                        <AddressList {...{ isPopupLoading, addresses, setAddress: setPickUpAddress }} />
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
                      {touched['contact_phone'] && errors['contact_phone'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['contact_phone']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['contact_phone'] && errors['contact_phone']}>
                    <input
                      className='fullName formField'
                      type='number'
                      {...getFieldProps('contact_phone')}
                      autoComplete='no'
                    />
                  </div>
                </div>
                <div className='cta'>
                  <button type='submit' className='dp-flex' disabled={!(isValid && dirty) || isSubmitting}>
                    {(isSubmitting && <ButtonLoader />) || <>{t('buttons.create')}</>}
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

export default CreateNewPickupLocationForm;
