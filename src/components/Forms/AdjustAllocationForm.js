import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { adjustAllocation } from '../../APIs/Update';
import CloseSVGIcon from '../../assets/icons/close-modal.svg';
import { WarningSVGIcon } from '../../assets/icons/Icons';
import MinusSVG from '../../assets/icons/minus.svg';
import PlusSVG from '../../assets/icons/plus.svg';
import CreateNewRouteFormStyle from '../../styles/CreateNewRouteFormStyle';
import FormStyle from '../../styles/FormStyle';
import ButtonLoader from '../Loaders/ButtonLoader';

function AdjustAllocationForm({ setModal, transporter, token, modal, truckRequest, syncUp }) {
  const { t } = useTranslation();

  const [formError, setFormError] = useState({
    showFormError: false,
    formErrorMessage: undefined,
  });

  useEffect(() => {
    if (formError.showFormError) {
      setTimeout(() => {
        setFormError({
          showFormError: false,
          formErrorMessage: undefined,
        });
      }, 5000);
    }
  }, [formError.showFormError]);

  const { handleSubmit, isSubmitting, dirty, isValid, setFieldValue, values } = useFormik({
    initialValues: {
      truckQty: transporter.quantity,
    },
    validationSchema: Yup.object().shape({
      truckQty: Yup.number().required(`${t('forms.required')}`),
    }),
    async onSubmit(values) {
      try {
        await adjustAllocation({
          endpoint: `request/${truckRequest._id}/withdraw`,
          endpointParams: {
            params: {
              partnerId: transporter.id,
              quantity: values.truckQty,
            },
            token,
          },
        });

        syncUp({
          toastType: 'success',
          toastMessage: 'Succes adjusting allocation',
        });
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
                {t('truckRequests.adjustAllocationFor')} {transporter.name}
              </h2>
            </header>
            <div className='formContent'>
              <div className='fields'>
                {/* Truck Quantity */}
                <div className='formFieldBlock truckRequest'>
                  <header className='formFieldHeader'>
                    <label htmlFor='truckQty'>
                      {truckRequest.requestType.toLowerCase() === 'container' ? (
                        <>{t('truckRequests.containerQuantity')}</>
                      ) : (
                        <>{t('truckRequests.truckQuantity')}</>
                      )}
                    </label>
                  </header>
                  <div className='truckRequest counter'>
                    <button
                      type='button'
                      className='minus'
                      disabled={values.truckQty === 0}
                      onClick={() => setFieldValue('truckQty', values.truckQty - 1)}
                    >
                      <img src={MinusSVG} alt='truck' />
                    </button>
                    <p className='truckQtyCount'>
                      {values.truckQty}{' '}
                      {truckRequest.requestType.toLowerCase() === 'container' ? (
                        <>{t('truckRequests.container(s)')}</>
                      ) : (
                        <>{t('truckRequests.truck(s)')}</>
                      )}
                    </p>
                    <button
                      type='button'
                      className='plus'
                      disabled={values.truckQty === transporter.quantity}
                      onClick={() => setFieldValue('truckQty', values.truckQty + 1)}
                    >
                      <img src={PlusSVG} alt='truck' />
                    </button>
                  </div>
                </div>

                <div className='cta'>
                  <button type='submit' className='dp-flex' disabled={!(isValid && dirty) || isSubmitting}>
                    {(isSubmitting && <ButtonLoader />) || <>{t('buttons.adjustAllocation')}</>}
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

export default AdjustAllocationForm;
