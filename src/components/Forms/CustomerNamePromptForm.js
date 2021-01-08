import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { updateCustomerProfile } from '../../APIs/Update';
import { useUserState } from '../../contexts/UserContext';
import ButtonLoader from '../Loaders/ButtonLoader';
import Toast from '../Shared/Toast/Toast';
import { toast } from 'react-toastify';

function CustomerNamePromptForm({ modal, setModal }) {
  const { customerId, token } = useUserState();
  const [customToast, setToast] = useState({
    showToast: false,
    toastType: undefined,
    toastMessage: undefined,
  });
  const { t } = useTranslation();

  const { handleSubmit, isSubmitting, isValid, dirty, errors, touched, values, getFieldProps, setTouched } = useFormik({
    initialValues: {
      accountName: '',
    },
    validationSchema: Yup.object({
      accountName: Yup.string()
        .matches(/^[a-z0-9]+$/, `${t('forms.invalidChars')}`)
        .required(`${t('forms.required')}`),
    }),
    async onSubmit(values) {
      let message;
      try {
        const res = await updateCustomerProfile({
          endpoint: `/customer/${customerId}`,
          endpointParams: {
            params: {
              account_name: values['accountName'].split(' ').join('').toLowerCase(),
            },
            token,
          },
        });

        if (res) {
          setModal({
            ...modal,
            showModal: false,
          });
          message = t('forms.customerNameFormSuccess');
          toast.success(`${message} ${getAccountUrl()}`);

          setTimeout(() => {
            window.location.replace(getAccountUrl());
          }, 3000);
        }
      } catch (error) {
        message = t('forms.customerNameFormFailure');
        toast.error(`${message}`);
      }
    },
    validateOnChange: true,
  });
  // #endregion

  const getAccountUrl = () => {
    if (process.env.REACT_APP_ENVIRONMENT === 'development' || process.env.REACT_APP_ENVIRONMENT === 'staging') {
      return `http://stage.${values['accountName']}.customer.kobo360.com${window.location.pathname}`;
    } else {
      return `http://${values['accountName']}.customer.kobo360.com${window.location.pathname}`;
    }
  };

  useEffect(() => {
    if (Object.entries(errors).length > 0) {
      setTouched({ accountName: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors, setTouched]);

  return (
    <>
      <div className='consentModalContent' style={{ maxHeight: '275px', maxWidth: '500px' }}>
        <header className='consentHeader'>
          <p className='consentHeading'>{`${t('forms.completeYourProfile')}`}</p>
        </header>
        <div className='consentMessageBlock'>
          <p className='consentInfo'>{`${t('buttons.accountNameInfo')}`}</p>
        </div>
        <form style={{ padding: '0 20px' }} onSubmit={handleSubmit}>
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <div
              className='formFieldWrap'
              data-isinvalid={touched['accountName'] && errors['accountName']}
              style={{ flex: '1', marginRight: '12px' }}
            >
              <input
                style={{ textAlign: 'right' }}
                className='accountName formField'
                type='accountName'
                name='accountName'
                autoComplete='off'
                value={values.accountName}
                {...getFieldProps('accountName')}
                placeholder={`${t('buttons.enterAccountName')}`}
              />
            </div>
            <div
              className='errorMessageBlock'
              style={{ position: 'absolute', color: 'red', bottom: '0', fontSize: '12px' }}
            >
              {touched['accountName'] && errors['accountName'] && (
                <>
                  <p className='errorMessage'>{errors['accountName']}</p>
                </>
              )}
            </div>
            <h3 style={{ marginTop: '-.4em', fontSize: '1.8em' }}>.kobo360.com</h3>
          </div>
          <div className='consentMessageActions' style={{ boxShadow: 'unset' }}>
            <button
              type='submit'
              style={{ backgroundColor: '#59bb6d', color: 'white' }}
              disabled={!(isValid && dirty) || isSubmitting}
            >
              {(isSubmitting && <ButtonLoader />) || <>{t('buttons.submit')}</>}
            </button>
            <button
              className='delete'
              type='button'
              style={{ backgroundColor: '#e3e3e3', color: 'black' }}
              onClick={() =>
                setModal({
                  ...modal,
                  showModal: false,
                })
              }
            >
              <>{t('buttons.skip')}</>
            </button>
          </div>
        </form>
      </div>
      <Toast
        {...{
          showToast: customToast.showToast,
          toastType: customToast.toastType,
          toastMessage: customToast.toastMessage,
          setToast,
        }}
      />
    </>
  );
}

export default CustomerNamePromptForm;
