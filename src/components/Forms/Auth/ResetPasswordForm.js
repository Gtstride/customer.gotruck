import { useFormik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { resetPassword } from '../../../APIs/Create';
import { WarningSVGIcon } from '../../../assets/icons/Icons';
import FormStyle from '../../../styles/FormStyle';
import ButtonLoader from '../../Loaders/ButtonLoader';
import Toast from '../../Shared/Toast/Toast';
import { getItemFromLocalStorage } from '../../../_utils/browser';
import { useTranslation } from 'react-i18next';

function ResetPasswordForm({ push }) {
  const { t } = useTranslation();

  const [toast, setToast] = useState({
    showToast: false,
    toastType: undefined,
    toastMessage: undefined,
  });

  const { errors, touched, getFieldProps, isValid, dirty, isSubmitting, handleSubmit } = useFormik({
    initialValues: {
      password: '',
      confirm_password: '',
    },
    validationSchema: Yup.object({
      password: Yup.string().required(`${t('forms.required')}`),
      confirm_password: Yup.string().required(`${t('forms.required')}`),
    }),
    async onSubmit(values) {
      try {
        const customerForgotPasswordCredentials = getItemFromLocalStorage('customerForgotPasswordCredentials');
        const params = {
          ...customerForgotPasswordCredentials,
          ...values,
        };
        const res = await resetPassword({ params, token: customerForgotPasswordCredentials.token });
        if (res) {
          setToast({
            showToast: true,
            toastType: 'success',
            toastMessage: 'Password changed successfully',
          });

          localStorage.removeItem('customerForgotPasswordCredentials');

          setTimeout(() => {
            push('/');
          }, 2000);
        }
      } catch ({ response }) {
        if (response) {
          const { message: errorMessage } = response.data;
          setToast({
            showToast: true,
            toastType: 'failure',
            toastMessage: errorMessage,
          });
        } else {
          setToast({
            showToast: true,
            toastType: 'failure',
            toastMessage: 'Something went wrong. Try again.',
          });
        }
      }
    },
  });
  return (
    <>
      <FormStyle id='formStyle'>
        <form id='loginForm' onSubmit={handleSubmit}>
          <div className='formContentBlock'>
            <header className='formHeader'>
              <h2 className='formTitle'>{t('forms.resetPassword')}</h2>
            </header>
            <div className='formContent'>
              <div className='fields'>
                <div className='password formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='password'>{t('forms.newPassword')}</label>
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
                      type='password'
                      name='password'
                      autoComplete='off'
                      {...getFieldProps('password')}
                    />
                  </div>
                </div>
                <div className='confirm_password formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='confirm_password'>{t('forms.confirmPassword')}</label>
                    <div className='errorMessageBlock'>
                      {touched['confirm_password'] && errors['confirm_password'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['confirm_password']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div
                    className='formFieldWrap'
                    data-isinvalid={touched['confirm_password'] && errors['confirm_password']}
                  >
                    <input
                      className='confirm_password formField'
                      type='password'
                      name='confirm_password'
                      autoComplete='off'
                      {...getFieldProps('confirm_password')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='cta dp-flex ju-cont-ce'>
            <button type='submit' className='dp-flex' disabled={!(isValid && dirty) || isSubmitting}>
              {(isSubmitting && <ButtonLoader />) || <>{t('forms.resetPassword')}</>}
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
export default ResetPasswordForm;
