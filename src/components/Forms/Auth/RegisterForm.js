import { ErrorMessage, Field, Form, withFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
// import { registerUser } from '../../../APIs/Create';
import { TogglePasswordVisibilitySVGIcon, WarningSVGIcon, ArrowSVGIcon } from '../../../assets/icons/Icons';
import NigeriaFlag from '../../../assets/icons/naija.png';
import FormStyle from "./FormStyle";
// import { authUserAsIs, getCustomerIdFromToken } from '../../../_utils/auth';
// import { toastEnums } from '../../../_utils/constants';
import { baseurl, capitalizeFirstLetter, uuid, phoneFormatter } from "../../../_utils/fx";
import ButtonLoader from '../Auth/ButtonLoader';
import CardFrequencyLoader from "../../Loaders/CardFrequencyLoader";

function BusinessCountryList({ setBusinessCountry, selectedCountry, countries }) {
  return countries.map(({ country, flag, phoneCode }) => {
    return (
      <div
        // className='popupItemWrap'
        // key={uuid()
        // }
        data-iscountryselected={country === selectedCountry}
        onClick={() => setBusinessCountry({ country, flag, phoneCode })}
      >
        <img src={flag} alt={`${country} flag`} className='popupIcon' />
        {/* <p className='countryName'>{capitalizeFirstLetter(country)}</p> */}
        <p className='countryDialingCode'>{phoneCode}</p>
      </div>
    );
  });
}

function RegisterForm({ isSubmitting, isValid, errors, touched, values, setValues, dirty }) {
  // #region States
  const [isPopupActive, setIsPopupActive] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({
    country: 'Nigeria',
    flag: NigeriaFlag,
    dialingCode: '+234',
  });
  const [dialingCode, setDialingCode] = useState('+234');
  const [phoneNumberFormat] = useState('0802-123-4567');
  const [passwordFieldType, setPasswordFieldType] = useState('password');
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);

  // #endregion
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      try {
        if (countries.length === 0) {
          setLoading(true);
          const endpoint = '/route/country';
          const res = await baseurl.get(endpoint);
          if (res) {
            setLoading(false);
            setCountries(res.data.data.countries);
          }
        }
      } catch (error) {}
    })();
  }, [countries.length]);

  // #region Functions
  function togglePasswordVisibility() {
    if (passwordFieldType === 'password') {
      setPasswordFieldType('text');
    } else {
      setPasswordFieldType('password');
    }
  }

  function setBusinessCountry({ country, flag, phoneCode }) {
    setSelectedCountry({ country, flag, phoneCode });
    setDialingCode(phoneCode);
    showPopup();
  }

  function showPopup() {
    setIsPopupActive(!isPopupActive);
  }
  // #endregion

  useEffect(() => {
    setValues({
      ...values,
      businessCountry: selectedCountry.country,
      dialingCode: selectedCountry.phoneCode,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry]);
  // #endregion

  // #region Returns
  return (
    <FormStyle id='formStyle' dir={localStorage.i18nextLng === 'ar' ? 'rtl' : 'auto'}>
      <Form id='registerForm' noValidate className='mg-hz-30'>
        <div className='formContentBlock'>
          <header className='formHeader'>
            <h2 className='formTitle'>{t('common.register')}</h2>
          </header>
          <div className='formContent'>
            <div className='fields'>
              {/* First and Last name */}
              <div className='dp-grid col-gap-10 formFieldSplit'>
                <div className='firstName formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='firstName'>{t('forms.firstName')}</label>
                    <div className='errorMessageBlock'>
                      <ErrorMessage name='firstName'>
                        {errMsg => (
                          <>
                            <WarningSVGIcon />
                            <p className='errorMessage'>{errMsg}</p>
                          </>
                        )}
                      </ErrorMessage>
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['firstName'] && errors['firstName']}>
                    <Field className='firstName' type='text' name='firstName' autoComplete='off' />
                  </div>
                </div>
                <div className='lastName formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='lastName'>{t('forms.lastName')}</label>
                    <div className='errorMessageBlock'>
                      <ErrorMessage name='lastName'>
                        {errMsg => (
                          <>
                            <WarningSVGIcon />
                            <p className='errorMessage'>{errMsg}</p>
                          </>
                        )}
                      </ErrorMessage>
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['lastName'] && errors['lastName']}>
                    <Field className='lastName' type='text' name='lastName' autoComplete='off' />
                  </div>
                </div>
              </div>
              {/* Email */}
              <div className='email formFieldBlock'>
                <header className='formFieldHeader'>
                  <label htmlFor='email'>{t('forms.email')}</label>
                  <div className='errorMessageBlock'>
                    <ErrorMessage name='email'>
                      {errMsg => (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errMsg}</p>
                        </>
                      )}
                    </ErrorMessage>
                  </div>
                </header>
                <div className='formFieldWrap' data-isinvalid={touched['email'] && errors['email']}>
                  <Field
                    className='email'
                    type='email'
                    name='email'
                    autoComplete='off'
                    data-isinvalid={touched['email'] && errors['email']}
                  />
                </div>
              </div>
              {/* Password */}
              <div className='password formFieldBlock'>
                <header className='formFieldHeader'>
                  <label htmlFor='password'>{t('forms.password')}</label>
                  <div className='errorMessageBlock'>
                    <ErrorMessage name='password'>
                      {errMsg => (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errMsg}</p>
                        </>
                      )}
                    </ErrorMessage>
                  </div>
                </header>
                <div className='formFieldWrap' data-isinvalid={touched['password'] && errors['password']}>
                  <Field className='password formField' type={passwordFieldType} name='password' autoComplete='off' />
                  {values['password'] && values['password'].length > 0 && (
                    <span className='formFieldIconWrap' onClick={togglePasswordVisibility}>
                      <TogglePasswordVisibilitySVGIcon />
                    </span>
                  )}
                </div>
              </div>
              {/* Business country and location */}
              <div className='dp-grid col-gap-10 formFieldSplit'>
                <div className='businessCountry formFieldBlock'>
                  <header className='formFieldHeader' onClick={showPopup}>
                    <label htmlFor='businessCountry'>{t('inputText.bizCountry')}</label>
                    {loading && <CardFrequencyLoader />}
                  </header>
                  <div className='formFieldWrap optionSwitcher' onClick={showPopup} role='button'>
                    <div className='optionIcon'>
                      <img src={selectedCountry.flag} alt='Nigeria flag' />
                    </div>
                    {/* <p className='optionValue'>{capitalizeFirstLetter(selectedCountry.country)}</p> */}
                    <div className='optionIndicator'>
                      <ArrowSVGIcon />
                    </div>
                  </div>
                  {isPopupActive && (
                    <div className='popup'>
                      <BusinessCountryList
                        countries={countries}
                        setBusinessCountry={setBusinessCountry}
                        // selectedCountry={capitalizeFirstLetter(selectedCountry.country)}
                      />
                    </div>
                  )}
                </div>
                <div className='location formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='location'>{t('inputText.location')}</label>
                    <div className='errorMessageBlock'>
                      <ErrorMessage name='location'>
                        {errMsg => (
                          <>
                            <WarningSVGIcon />
                            <p className='errorMessage'>{errMsg}</p>
                          </>
                        )}
                      </ErrorMessage>
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['location'] && errors['location']}>
                    <Field className='location' type='text' name='location' autoComplete='off' />
                  </div>
                </div>
              </div>
              {/* Company name*/}
              <div className='companyName formFieldBlock'>
                <header className='formFieldHeader'>
                  <label htmlFor='companyName'>{t('inputText.companyName')}</label>
                  <div className='errorMessageBlock'>
                    <ErrorMessage name='companyName'>
                      {errMsg => (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errMsg}</p>
                        </>
                      )}
                    </ErrorMessage>
                  </div>
                </header>
                <div className='formFieldWrap' data-isinvalid={touched['companyName'] && errors['companyName']}>
                  <Field className='companyName' type='text' name='companyName' autoComplete='off' />
                </div>
              </div>
              {/* Contact phone   */}
              <div className='contactPhone formFieldBlock forInputTypeNumber'>
                <header className='formFieldHeader'>
                  <label htmlFor='contactPhone'>{t('inputText.contactPhone')}</label>
                  <div className='errorMessageBlock'>
                    <ErrorMessage name='contactPhone'>
                      {errMsg => (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errMsg}</p>
                        </>
                      )}
                    </ErrorMessage>
                  </div>
                </header>
                <div className='formFieldWrap' data-isinvalid={touched['contactPhone'] && errors['contactPhone']}>
                  <div className='formFieldIconWrap'>
                    <p className='countryDialingCode'>{dialingCode}</p>
                  </div>
                  <div className='separator'></div>
                  <Field
                    className='contactPhone'
                    type='number'
                    name='contactPhone'
                    autoComplete='off'
                    min='0'
                    placeholder={phoneNumberFormat}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='cta dp-flex ju-cont-ce'>
          <button type='submit' className='dp-flex' disabled={!(isValid && dirty) || isSubmitting}>
            {(isSubmitting && <ButtonLoader />) || <>{t('common.register')}</>}
          </button>
        </div>
      </Form>
    </FormStyle>
  );
  // #endregion
}

export default withFormik({
  validationSchema: Yup.object().shape({
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Required'),
    password: Yup.string().required('Required'),
    location: Yup.string().required('Invalid location'),
    companyName: Yup.string().required('Please provide a country name'),
    contactPhone: Yup.number()
      .positive('Invalid phone number (pos)')
      .required('Required'),
  }),

  mapPropsToValues() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      location: '',
      companyName: '',
      contactPhone: '',
    };
  },

  async handleSubmit(values, { resetForm, setSubmitting, props }) {
    try {
      const registrationCredentials = {
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        secret: values.password,
        // country: capitalizeFirstLetter(values.businessCountry),
        location: values.location,
        business_name: values.companyName,
        // mobile: phoneFormatter(values.contactPhone.toString(), values.dialingCode),
        user_type: 'customer',
      };

      // const res = await registerUser(registrationCredentials);

      // if (res) {
      //   // 1. Get user token
      //   // let token = res.data.data.token;

      //   // 2. Authenticate user into MainApp
      //   // authUserAsIs(res.data);

      //   // 6. Route to the dashboard
      //   // props.push(`/${getCustomerIdFromToken(token)}/dashboard`);
      // }
      resetForm();
    } catch ({ response }) {
      if (response) {
        // const { status: statusCode } = response;
        const { message: errorMessage } = response.data;
        props.setToast({
          // showToast: true,
          // toastType: toastEnums.FAILURE,
          // toastMessage: errorMessage,
        });
      } else {
        props.setToast({
          showToast: true,
          // toastType: toastEnums.FAILURE,
          toastMessage: 'Something went wrong; Try again',
        });
      }
    }
    setSubmitting(false);
  },
})(RegisterForm);
