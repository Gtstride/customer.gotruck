import { useFormik } from 'formik';
import { DebounceInput } from 'react-debounce-input';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { getAddress, getLatLong } from '../../APIs/Read';
import CloseSVGIcon from '../../assets/icons/close-modal.svg';
import { ArrowSVGIcon, WarningSVGIcon } from '../../assets/icons/Icons';
import CreateNewRouteFormStyle from '../../styles/CreateNewRouteFormStyle';
import FormStyle from '../../styles/FormStyle';
import { toastEnums } from '../../_utils/constants';
import ButtonLoader from '../Loaders/ButtonLoader';
import { baseurl, uuid, capitalizeFirstLetter, phoneFormatter, getRandomPassword, lang } from '../../_utils/fx';
import CardFrequencyLoader from '../Loaders/CardFrequencyLoader';
import PopupLoader from '../Loaders/PopupLoader';
import { registerTransporter } from '../../APIs/Create';

function AddressList({ isPopupLoading, addresses, setAddress }) {
  if (isPopupLoading) {
    return (
      <div className='popupItemWrap loading'>
        <PopupLoader />
      </div>
    );
  }

  return addresses.map(({ description, placeId }) => (
    <div className='popupItemWrap' key={uuid()} onClick={() => setAddress({ address: description, placeId })}>
      <p className='popupText' title={description}>
        {description}
      </p>
    </div>
  ));
}

function AddMoreTransporterForm({ customerId, token, setModal, hideModalShowToast }) {
  const { t } = useTranslation();

  const [formError, setFormError] = useState({
    showFormError: false,
    formErrorMessage: undefined,
  });
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPopupLoading, setIsPopupLoading] = useState();
  const [address, setAddress] = useState();
  const [latLng, setLatLng] = useState();
  const [isPopupActive, setIsPopupActive] = useState(false);

  const [addresses, setAddresses] = useState([]);

  const {
    handleSubmit,
    values,
    setFieldValue,
    errors,
    touched,
    isSubmitting,
    isValid,
    dirty,
    getFieldProps,
    handleChange,
  } = useFormik({
    initialValues: {
      business_name: '',
      first_name: '',
      last_name: '',
      email: '',
      mobile: '',
      country: '',
      location: '',
    },
    validationSchema: Yup.object().shape({
      business_name: Yup.string().required(`${t('forms.required')}`),
      first_name: Yup.string().required(`${t('forms.required')}`),
      last_name: Yup.string().required(`${t('forms.required')}`),
      email: Yup.string()
        .email(`${t('forms.invalid')}`)
        .required(`${t('forms.required')}`),
      mobile: Yup.string().required(`${t('forms.required')}`),
      country: Yup.string().required(`${t('forms.required')}`),
      location: Yup.string().required(`${t('forms.required')}`),
    }),
    async onSubmit(values) {
      const code = countries.find(item => item.country === values.country).phoneCode;
      const params = {
        ...values,
        mobile: phoneFormatter(values.mobile.toString(), code),
        lat: latLng.lat,
        long: latLng.lng,
        secret: getRandomPassword(),
        user_type: 'partner',
      };

      try {
        const res = await registerTransporter({ params, token });
        if (res) {
          hideModalShowToast({
            toastType: toastEnums.SUCCESS,
            toastMessage: 'Transporter successfully created',
          });
          window.location.reload();
        }
      } catch ({ response }) {
        console.log('error', response.data.message);
        hideModalShowToast({
          toastType: toastEnums.FAILURE,
          toastMessage: response.data.message,
        });
      }
    },
  });

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
      }, 1000);
    }
  }, [formError.showFormError]);

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
          setFieldValue('location', address.address);
          setIsPopupActive(false);
          // setUserCountry(getCountry(res.data.data.response.result.address_components).country);
          setLatLng({
            lat,
            lng,
          });
        } catch (error) {
          hideModalShowToast({
            toastType: toastEnums.FAILURE,
            toastMessage: 'Country not found.',
          });
        }
      })();
    }
    //  hideModalShowToast
    // eslint-disable-next-line
  }, [address, setFieldValue, token]);

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
              <h2 className='formTitle'>{t('transporters.addTrans')}</h2>
            </header>
            <div className='formContent'>
              <div className='fields'>
                {/* Business name */}
                <div className='business_name formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='business_name'>{t('forms.bizName')}</label>
                    <div className='errorMessageBlock'>
                      {touched['business_name'] && errors['business_name'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['business_name']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['business_name'] && errors['business_name']}>
                    <input
                      {...getFieldProps('business_name')}
                      autoComplete='off'
                      className='business_name formField'
                      type='text'
                    />
                  </div>
                </div>

                {/* First name */}
                <div className='first_name formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='first_name'>
                      <>{t('forms.firstName')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {touched['first_name'] && errors['first_name'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['first_name']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['first_name'] && errors['first_name']}>
                    <input
                      {...getFieldProps('first_name')}
                      autoComplete='off'
                      className='first_name formField'
                      type='text'
                    />
                  </div>
                </div>

                {/* Last name */}
                <div className='last_name formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='last_name'>
                      <>{t('forms.lastName')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {touched['last_name'] && errors['last_name'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['last_name']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['last_name'] && errors['last_name']}>
                    <input
                      {...getFieldProps('last_name')}
                      autoComplete='off'
                      className='last_name formField'
                      type='text'
                    />
                  </div>
                </div>

                {/* Email */}
                <div className='email formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='email'>
                      <>{t('forms.email')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {touched['email'] && errors['email'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['email']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['email'] && errors['email']}>
                    <input {...getFieldProps('email')} autoComplete='off' className='email formField' type='email' />
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
                    <input {...getFieldProps('mobile')} autoComplete='off' className='mobile formField' type='number' />
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
                        onChange={handleChange}
                        className='country formField'
                        name='country'
                        autoComplete='off'
                      >
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

                {/* Location */}
                <div className='businessAddress formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='businessAddress'>
                      <>{t('forms.storeAddress')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {touched['location'] && errors['businessAddress'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['location']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['location'] && errors['location']}>
                    <DebounceInput
                      value={values.location}
                      onChange={e => setBusinessAddress(e.target.value)}
                      className='businessAddress formField'
                      type='text'
                      minLength={0}
                      name='location'
                      debounceTimeout={50}
                      placeholder='Add store address'
                      autoComplete='off'
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
                    {(isSubmitting && <ButtonLoader />) || t('transporters.addTrans')}
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

export default AddMoreTransporterForm;
