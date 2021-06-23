import { useFormik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
// import { forgotPassword } from '../../../APIs/Create';
import { WarningSVGIcon } from '../../../assets/icons/Icons';
import FormStyle from './FormStyle';
import { toastEnums } from '../../../_utils/constants';
// import ButtonLoader from '../../Loaders/ButtonLoader';
// import Toast from '../../Shared/Toast/Toast';

function ForgotPasswordForm({ push }) {
  const { t } = useTranslation();
  const [toast, setToast] = useState({
    showToast: false,
    toastType: undefined,
    toastMessage: undefined,
  });

  const { errors, touched, getFieldProps, isValid, dirty, isSubmitting, handleSubmit } = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email address required'),
    }),
    async onSubmit(values) {
      try {
        const params = {
          email: values.email,
        };

        // const res = await forgotPassword(params);
        // if (res) {
        //   localStorage.setItem(
        //     'customerForgotPasswordCredentials',
        //     JSON.stringify({
        //       ...params,
        //       reset_code: res.data.data.reset_code,
        //       token: res.data.data.token,
        //       password: '',
        //     }),
        //   );
        //   push('/verify-forgot-password-otp');
        // }
      } catch ({ response }) {
        if (response) {
          // const { status: statusCode } = response;
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
    },
  });
  return (
    <>
      <FormStyle id='formStyle'>
        <form id='loginForm' onSubmit={handleSubmit}>
          <div className='formContentBlock'>
            <header className='formHeader'>
              <h2 className='formTitle'>{('Reset Password')}</h2>
            </header>
            <div className='formContent'>
              <div className='fields'>
                <div className='email formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='email'>{('Registered Email')}</label>
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
              </div>
            </div>
          </div>
          <div className='cta dp-flex ju-cont-ce'>
            <button type='submit' className='dp-flex' disabled={!(isValid && dirty) || isSubmitting}>
              {/* {(isSubmitting && <BucttonLoader />) || `${t('forms.resetPassword')}`} */}
            </button>
          </div>
        </form>
      </FormStyle>
      {/* <Toast
        {...{ showToast: toast.showToast, toastType: toast.toastType, toastMessage: toast.toastMessage, setToast }}
      /> */}
    </>
  );
}
export default ForgotPasswordForm;
