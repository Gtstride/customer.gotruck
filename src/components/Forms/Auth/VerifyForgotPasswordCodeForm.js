import { useFormik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { verifyForgotPassword } from '../../../APIs/Create';
import { WarningSVGIcon } from '../../../assets/icons/Icons';
import FormStyle from '../../../styles/FormStyle';
import { getItemFromLocalStorage } from '../../../_utils/browser';
import { toastEnums } from '../../../_utils/constants';
import ButtonLoader from '../../Loaders/ButtonLoader';
import { useTranslation } from 'react-i18next';

import Toast from '../../Shared/Toast/Toast';

function VerifyForgotPasswordCodeForm({ push }) {
  const { t } = useTranslation();

  const [toast, setToast] = useState({
    showToast: false,
    toastType: undefined,
    toastMessage: undefined,
  });

  const { errors, touched, getFieldProps, isValid, dirty, isSubmitting, handleSubmit } = useFormik({
    initialValues: {
      code: '',
    },
    validationSchema: Yup.object({
      code: Yup.string().required(`${t('forms.required')}`),
    }),
    async onSubmit(values) {
      try {
        const customerForgotPasswordCredentials = getItemFromLocalStorage('customerForgotPasswordCredentials');
        const params = {
          ...customerForgotPasswordCredentials,
          password: '',
          reset_code: values.code,
        };

        const res = await verifyForgotPassword({ params, token: customerForgotPasswordCredentials.token });

        if (res) {
          customerForgotPasswordCredentials['reset_code'] = values.code;
          customerForgotPasswordCredentials['token'] = res.data.data.token;
          localStorage.setItem('customerForgotPasswordCredentials', JSON.stringify(customerForgotPasswordCredentials));
          push('/reset-password');
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
    },
  });
  return (
    <>
      <FormStyle id='formStyle'>
        <form id='authForm' onSubmit={handleSubmit}>
          <div className='formContentBlock'>
            <header className='formHeader'>
              <h2 className='formTitle'>{t('forms.verifyCode')}</h2>
              <p className='formInfo'>{t('forms.forgotpasswordstory')}</p>
            </header>
            <div className='formContent'>
              <div className='fields'>
                <div className='email formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='code'>{t('forms.verificationCode')}</label>
                    <div className='errorMessageBlock'>
                      {touched['code'] && errors['code'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['code']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['code'] && errors['code']}>
                    <input
                      className='code formField'
                      type='text'
                      name='code'
                      autoComplete='off'
                      {...getFieldProps('code')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='cta dp-flex ju-cont-ce'>
            <button type='submit' className='dp-flex' disabled={!(isValid && dirty) || isSubmitting}>
              {(isSubmitting && <ButtonLoader />) || <>{t('forms.verifyCode')}</>}
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
export default VerifyForgotPasswordCodeForm;
