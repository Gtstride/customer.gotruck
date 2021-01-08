import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { logUserIn } from '../../../APIs/Create';
import { TogglePasswordVisibilitySVGIcon, WarningSVGIcon } from '../../../assets/icons/Icons';
import FormStyle from '../../../styles/FormStyle';
import { authUserAsIs, getCustomerIdFromToken } from '../../../_utils/auth';
import ButtonLoader from '../../Loaders/ButtonLoader';
import Toast from '../../Shared/Toast/Toast';
import { toastEnums } from '../../../_utils/constants';
import { environment } from "../../../_utils/environment" 
import { notAllowedSubDomain } from '../../../_utils/fx';

function LoginForm({ push, customerId }) {
  // #region States
  const [passwordFieldType, setPasswordFieldType] = useState('password');
  const [toast, setToast] = useState({
    showToast: false,
    toastType: undefined,
    toastMessage: undefined,
  });
  const { t } = useTranslation();
  const sub = window.location.hostname.split('.')[0];

  // #endregion

  // #region Functions
  function togglePasswordVisibility() {
    if (passwordFieldType === 'password') {
      setPasswordFieldType('text');
    } else {
      setPasswordFieldType('password');
    }
  }
  // #endregion

  // #region Custom Hooks
  const {
    handleSubmit,
    isSubmitting,
    isValid,
    dirty,
    errors,
    touched,
    values,
    setSubmitting,
    resetForm,
    getFieldProps,
  } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required(`${t('forms.required')}`),
      password: Yup.string().required(`${t('forms.required')}`),
    }),
    async onSubmit(values) {
      const { multiTenant } = environment(sub);
      try {
        let loginCredentials = {
          email: values.email,
          secret: values.password,
          user_type: 'customer',
        };
        if (!notAllowedSubDomain().includes(sub)) {
          if (multiTenant) {
            loginCredentials = { ...loginCredentials, customerId };
          }
        }
        const res = await logUserIn(loginCredentials);
        if (res) {
          // 1. Authenticate user into MainApp
          authUserAsIs(res.data);

          // 2. Get customer id from token
          let customerId;
          if (!notAllowedSubDomain().includes(sub)) {
            if (multiTenant) {
              customerId = 'app';
            } else {
              customerId = getCustomerIdFromToken(res.data.data.token);
            }
          } else {
            customerId = getCustomerIdFromToken(res.data.data.token);
          }
          // 3. Reset values
          values = null;

          // 3. Route to the dashboard
          push(`/${customerId}/dashboard`);

          resetForm();
        }
      } catch ({ response }) {
        if (response) {
          const { message: errorMessage } = response.data;
          setToast({
            showToast: true,
            toastType: toastEnums.FAILURE,
            toastMessage: errorMessage,
          });
        } else {
          setToast({
            showToast: true,
            toastType: toastEnums.FAILURE,
            toastMessage: 'Something went wrong. Try again.',
          });
        }
      }
      setSubmitting(false);
    },
  });
  // #endregion

  return (
    <>
      <FormStyle id='formStyle' dir={localStorage.i18nextLng === 'ar' ? 'rtl' : 'auto'}>
        <form id='loginForm' noValidate onSubmit={handleSubmit}>
          <div className='formContentBlock'>
            <header className='formHeader'>
              <h2 className='formTitle'>{t('common.signIn')}</h2>
            </header>
            <div className='formContent'>
              <div className='fields'>
                <div className='email formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='email'>{t('forms.email')}</label>
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
                    <input
                      className='email formField'
                      type='email'
                      name='email'
                      autoComplete='off'
                      {...getFieldProps('email')}
                    />
                  </div>
                </div>
                <div className='password formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='password'>{t('forms.password')}</label>
                    <div className='errorMessageBlock'>
                      {touched['password'] && errors['password'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['password']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['password'] && errors['password']}>
                    <input
                      className='password formField'
                      type={passwordFieldType}
                      name='password'
                      autoComplete='off'
                      data-isinvalid={touched['password'] && errors['password']}
                      {...getFieldProps('password')}
                    />
                    {values['password'].length > 0 && (
                      <span className='formFieldIconWrap' onClick={togglePasswordVisibility}>
                        <TogglePasswordVisibilitySVGIcon />
                      </span>
                    )}
                  </div>
                </div>
                <div className='forgotPasswordBlock'>
                  <Link to='/forgot-password'>{t('common.forgotPassword')}</Link>
                </div>
              </div>
            </div>
          </div>
          <div className='cta dp-flex ju-cont-ce'>
            <button type='submit' className='dp-flex' disabled={!(isValid && dirty) || isSubmitting}>
              {(isSubmitting && <ButtonLoader />) || <>{t('common.signIn')}</>}
            </button>
          </div>
        </form>
      </FormStyle>
      <Toast
        {...{ showToast: toast.showToast, toastType: toast.toastType, toastMessage: toast.toastMessage, setToast }}
      />
    </>
  );
}

export default LoginForm;
