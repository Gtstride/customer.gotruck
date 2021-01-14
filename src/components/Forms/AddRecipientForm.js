import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { DebounceInput } from 'react-debounce-input';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { createRecipient } from '../../APIs/Create';
import getRecipientEndpoints from '../../APIs/endpoints/recipients';
import { getAddress, getLatLong, getRecipients, getStatesByCode } from '../../APIs/Read';
import CloseSVGIcon from '../../assets/icons/close-modal.svg';
import { WarningSVGIcon, ArrowSVGIcon } from '../../assets/icons/Icons';
import CreateNewRouteFormStyle from '../../styles/CreateNewRouteFormStyle';
import FormStyle from '../../styles/FormStyle';
// import { getCountriesInfo } from '../../_utils/db';
import { uuid, baseurl, capitalizeFirstLetter, phoneFormatter, lang } from '../../_utils/fx';
import ButtonLoader from '../Loaders/ButtonLoader';
import PopupLoader from '../Loaders/PopupLoader';
import FormError from './components/FormError';
import FormHeader from './components/FormHeader';
import CardFrequencyLoader from '../Loaders/CardFrequencyLoader';

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
      <p
        key={placeId}
        className='popupText'
        title={description}
        onClick={() => setAddress({ address: description, placeId: placeId })}
      >
        {description}
      </p>
    </div>
  ));
}

function AddRecipientForm({
  pageParams: { setModal, updateTableData, syncUp },
  endpointParams: { token, customerId },
}) {
  const { t } = useTranslation();
  const [formError, setFormError] = useState({
    showFormError: false,
    formErrorMessage: undefined,
  });
  const [isPopupActive, setIsPopupActive] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [address, setAddress] = useState();
  const [states, setStates] = useState([]);
  const [isPopupLoading, setIsPopupLoading] = useState();
  const [latLng, setLatLng] = useState();
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState([]);

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
    isValid,
    dirty,
    touched,
    isSubmitting,
    setFieldValue,
    getFieldProps,
  } = useFormik({
    initialValues: {
      fullName: '',
      mobile: '',
      businessAddress: '',
      state: '',
      country: '',
    },

    validationSchema: Yup.object().shape({
      fullName: Yup.string().required(`${t('forms.required')}`),
      mobile: Yup.string().required(`${t('forms.required')}`),
      businessAddress: Yup.string().required(`${t('forms.required')}`),
      country: Yup.string().required(`${t('forms.required')}`),
    }),

    async onSubmit(values) {
      const { READ } = getRecipientEndpoints({ customerId });
      const code = countries.find(item => item.country.toLowerCase() === values.country.toLowerCase()).phoneCode;
      try {
        const params = {
          address: values.businessAddress,
          customer_id: customerId,
          country: values.country,
          full_name: values.fullName,
          lat: latLng.lat,
          lng: latLng.lng,
          state: values.state,
          mobile: phoneFormatter(values.mobile.toString().toString(), code),
          state_code:
            states.length > 0
              ? states.find(state => state.state.toLowerCase() === values.state.toLowerCase()).code
              : '',
        };
        const postRes = await createRecipient({ params, token });
        if (postRes) {
          const readRes = await getRecipients({ endpoint: READ.recipients, token });
          updateTableData({ tableData: readRes.data.data.recipients });

          if (readRes) {
            syncUp({
              toastType: 'success',
              toastMessage: 'Recipient added',
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
            toastType: 'failure',
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
        // setUserCountry(getCountry(res.data.data.response.result.address_components));
        const lat = location.lat;
        const lng = location.lng;
        setFieldValue('businessAddress', address.address);
        setIsPopupActive(false);
        setLatLng({
          lat,
          lng,
        });
      })();
    }
  }, [address, setFieldValue, token]);

  // function getStates(country, token) {
  //   const endpoint = `/route/getStateCode/${country}`;
  //   return baseurl.get(endpoint, {
  //     headers: { Authorization: `Bearer ${token}`, Apptoken },
  //   });
  // }

  useEffect(() => {
    (async () => {
      if (values.country) {
        // setIsPickupStatesLoading(true);
        const countryCode = countries.find(item => item.country.toLowerCase() === values.country.toLowerCase())
          .countryCode;
        const response = await getStatesByCode(countryCode, token);
        if (response) {
          setStates(response.data.data.states);
          // setIsPickupStatesLoading(false);
        }
      }
    })();
  }, [countries, token, values.country]);

  return (
    <FormStyle id='formStyle'>
      <CreateNewRouteFormStyle id='createNewRouteFormStyle'>
        <form id='createNewRouteForm' noValidate onSubmit={handleSubmit}>
          <div className='formContentBlock'>
            {formError.showFormError && <FormError {...{ formErrorMessage: formError.formErrorMessage }} />}
            <FormHeader {...{ formTitle: `${t('forms.addRecipient')}` }} />
            <div className='formContent'>
              <div className='fields'>
                {/* Full name */}
                <div className='fullName formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='fullName'>
                      <>{t('forms.fullName')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {touched['fullName'] && errors['fullName'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['fullName']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['fullName'] && errors['fullName']}>
                    <input
                      value={values.fullName}
                      // onChange={handleChange}
                      className='fullName formField'
                      type='text'
                      {...getFieldProps('fullName')}
                      autoComplete='off'
                    />
                  </div>
                </div>
                {/* extension */}
                <div className='extension formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='extension'>
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
                    <select
                      className='country formField'
                      value={values.country}
                      // onChange={handleChange}
                      {...getFieldProps('country')}
                      autoComplete='off'
                    >
                      <option defaultChecked>{t('forms.selectCountry')}</option>
                      {countries.length > 0 &&
                        countries.map(({ phoneCode, country }) => (
                          <option value={country} key={uuid()}>
                            {capitalizeFirstLetter(country)}
                          </option>
                        ))}
                    </select>
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
                        autoComplete='off'
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
                {/* Mobile */}
                <div className='mobile formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='mobile'>
                      <>{t('forms.mobile')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {touched['mobile'] && errors['mobile'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['mobile']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['mobile'] && errors['mobile']}>
                    <input
                      value={values.mobile}
                      className='mobile formField'
                      type='number'
                      {...getFieldProps('mobile')}
                      autoComplete='off'
                    />
                  </div>
                </div>
                {/* Business Address */}
                <div className='businessAddress formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='businessAddress'>
                      <>{t('forms.bizAddress')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {touched['businessAddress'] && errors['businessAddress'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['businessAddress']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div
                    className='formFieldWrap'
                    data-isinvalid={touched['businessAddress'] && errors['businessAddress']}
                  >
                    <DebounceInput
                      value={values.businessAddress}
                      onChange={e => setBusinessAddress(e.target.value)}
                      className='businessAddress formField'
                      type='text'
                      minLength={0}
                      debounceTimeout={50}
                      // {...getFieldProps('businessAddress')}
                      autoComplete='off'
                      placeholder='Enter address'
                    />
                    {isPopupActive && (
                      <div className='popup'>
                        <AddressList {...{ isPopupLoading, addresses, setAddress }} />
                      </div>
                    )}
                  </div>
                </div>

                <div className='cta'>
                  <button type='submit' className='dp-flex' disabled={!(isValid && dirty) || isSubmitting}>
                    {(isSubmitting && <ButtonLoader />) || `${t('buttons.create')}`}
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

export default AddRecipientForm;
