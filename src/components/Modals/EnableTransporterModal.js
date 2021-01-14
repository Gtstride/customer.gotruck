import React, { useState } from 'react';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import ButtonLoader from '../Loaders/ButtonLoader';
import { useUserState } from '../../contexts/UserContext';
import { useFormik } from 'formik';
import { baseurl, lang } from '../../_utils/fx';
import Toast from '../Shared/Toast/Toast';
import { toastEnums } from '../../_utils/constants';

function EnableTransporterModal({ setModal, modal, syncUp, acceptAction = undefined, admin, label = '' }) {
  const { token, customerId } = useUserState();
  const { t } = useTranslation();
  const [toast, setToast] = useState({
    showToast: false,
    toastType: undefined,
    toastMessage: undefined,
  });
  const { handleSubmit, isSubmitting, isValid, dirty, errors, touched, values, getFieldProps } = useFormik({
    initialValues: {
      business_name: '',
      customer_id: customerId,
    },
    validationSchema: Yup.object({
      business_name: Yup.string().required(`${t('forms.required')}`),
    }),
    async onSubmit(values) {
      try {
        const res = await baseurl.put(`/user/${admin.user_id}/beAPartner?language=${lang}`, values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res) {
          syncUp({
            toastType: toastEnums.SUCCESS,
            toastMessage: 'Transporter successfully enabled',
          });
          window.location.reload();
        }
      } catch ({ response }) {
        syncUp({
          toastType: toastEnums.FAILURE,
          toastMessage: response.data.message,
        });
      
      }
    },
  });
  // #endregion
  return (
    <div className='consentModalContent'>
      <header className='consentHeader'>
        <p className='consentHeading'>{t('buttons.enableTransporter')}</p>
      </header>
      <form style={{ padding: '20px' }} onSubmit={handleSubmit}>
        <div>
          <header className='formFieldHeader'>
            <label for='business_name'>Transporter Business Name</label>
          </header>
          <div
            className='formFieldWrap'
            data-isinvalid={touched['business_name'] && errors['business_name']}
            style={{ flex: '1', marginRight: '12px' }}
          >
            <input
              className='accountName formField'
              type=''
              name='business_name'
              autoComplete='off'
              value={values.business_name}
              {...getFieldProps('business_name')}
              placeholder={`${t('forms.enterTransporterName')}`}
            />
          </div>
          {/* <div
              className='errorMessageBlock'
              style={{ position: 'absolute', color: 'red', bottom: '0', fontSize: '12px' }}
            >
              {touched['business_name'] && errors['business_name'] && (
                <>
                  <p className='errorMessage'>{errors['business_name']}</p>
                </>
              )}
            </div> */}
        </div>
        <div className='consentMessageActions' style={{ boxShadow: 'unset' }}>
          <button
            className='delete'
            type='button'
            style={{ backgroundColor: '#e3e3e3', color: 'black' }}
            onClick={() =>
              setModal({
                ...modal,
                showModal: false,
                modalType: undefined,
              })
            }
          >
            <>{t('buttons.cancel')}</>
          </button>
          <button
            type='submit'
            style={{ backgroundColor: '#59bb6d', color: 'white' }}
            disabled={!(isValid && dirty) || isSubmitting}
          >
            {(isSubmitting && <ButtonLoader />) || <>{t('buttons.submit')}</>}
          </button>
        </div>
      </form>
      <Toast
        {...{ showToast: toast.showToast, toastType: toast.toastType, toastMessage: toast.toastMessage, setToast }}
      />
    </div>
  );
}
export default EnableTransporterModal;
