import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useFetch, getTransporters } from '../../APIs/Read';
import { assignTransporter } from '../../APIs/Update';
import CloseSVGIcon from '../../assets/icons/close-modal.svg';
import { WarningSVGIcon } from '../../assets/icons/Icons';
import MinusSVG from '../../assets/icons/minus.svg';
import PlusSVG from '../../assets/icons/plus.svg';
import TruckSVG from '../../assets/icons/truck.svg';
import { useUserState } from '../../contexts/UserContext';
import CreateNewRouteFormStyle from '../../styles/CreateNewRouteFormStyle';
import FormStyle from '../../styles/FormStyle';
import { uuid, getDash } from '../../_utils/fx';
import ButtonLoader from '../Loaders/ButtonLoader';
import ContentLoader from '../Loaders/ContentLoader';
import { createTruckRequest } from '../../APIs/Create';

function AssignTruckRequestToTransporterForm({ updateTruckRequest, setModal, truckRequest, syncUp, bulk }) {
  const { t } = useTranslation();

  const { token, customerId } = useUserState();
  const { response, isLoading } = useFetch(`/partner/customer/${customerId}`, token);
  const [partners, setPartners] = useState([]);
  const [formError, setFormError] = useState({
    showFormError: false,
    formErrorMessage: undefined,
  });

  const {
    handleSubmit,
    getFieldProps,
    touched,
    errors,
    isSubmitting,
    dirty,
    setFieldValue,
    values,
    isValid,
  } = useFormik({
    initialValues: {
      transporter: '',
      truckQty: truckRequest.requestedQuantity
        ? truckRequest.requestedQuantity - truckRequest.acceptedQuantity ||
          truckRequest.requestedQuantity ||
          truckRequest.allocation - truckRequest.assignedAllocation
        : 0,
    },

    validationSchema: Yup.object({
      transporter: Yup.string().required(`${t('forms.required')}`),
      truckQty: Yup.string().required(`${t('forms.required')}`),
    }),

    async onSubmit(values) {
      const { partnerId, partnerPhone } = partners
        .map(partner => {
          if (partner.business_name.toLowerCase() === values.transporter.toLowerCase()) {
            return { partnerId: partner.id, partnerPhone: partner.detail.mobile };
          }

          return undefined;
        })
        .filter(x => x !== undefined)[0];

      if (bulk) {
        const {
          _id,
          createdBy,
          createdDate,
          expiryDate,
          storageDate,
          allocation,
          assignedAllocation,
          ...rest
        } = truckRequest;
        let {
          location: { coordinates },
        } = rest.pickupStation;
        rest.pickupStation.lat = coordinates[0];
        rest.pickupStation.long = coordinates[1];

        if (rest.deliveryStation) {
          let { location } = rest.deliveryStation;
          rest.deliveryStation.lat = location.coordinates[0];
          rest.deliveryStation.long = location.coordinates[1];
        }

        const request = [
          {
            accessType: 'DT',
            allocation: values.truckQty,
            asset: {},
            expiryDate: new Date(expiryDate).valueOf(),
            partnerId,
            partnerName: values.transporter,
            partnerPhone: partnerPhone,
            storage: new Date(storageDate).valueOf(),
          },
        ];
        try {
          const params = { ...rest, bulkId: _id, requestType: 'bulk', requestedTons: values.truckQty, request };
          const res = await createTruckRequest({ params, token });

          updateTruckRequest({
            ...truckRequest,
            assignedAllocation: truckRequest.assignedAllocation + values.truckQty,
          });

          if (res) {
            syncUp({
              toastType: 'success',
              toastMessage: 'Transporter assigned',
            });
          }
        } catch (err) {
          const { response } = err;
          if (response) {
            const { message } = response.data;
            syncUp({
              toastType: 'failure',
              toastMessage: message,
            });
          } else {
            syncUp({
              toastType: 'failure',
              toastMessage: 'Something went wrong. Try again.',
            });
          }
        }
      } else {
        try {
          const params = {
            partnerId,
            partnerName: values.transporter,
            quantity: values.truckQty,
            partnerPhone,
          };
          const truckRequestId = truckRequest._id;

          const res = await assignTransporter({
            endpoint: `request/${truckRequestId}/acceptTruckRequest`,
            endpointParams: {
              params,
              token,
            },
          });

          const getRes = await getTransporters({ endpoint: `/request/truck/${truckRequestId}`, token });
          updateTruckRequest(getRes.data.data.truckRequest);

          if (res) {
            syncUp({
              toastType: 'success',
              toastMessage: 'Transporter assigned',
            });
          }
        } catch (err) {
          const { response } = err;
          if (response) {
            const { message } = response.data;
            syncUp({
              toastType: 'failure',
              toastMessage: message,
            });
          } else {
            syncUp({
              toastType: 'failure',
              toastMessage: 'Something went wrong. Try again.',
            });
          }
        }
      }
    },
  });

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
    if (response) {
      setPartners(response.partners);
    }
  }, [response]);

  if (isLoading) {
    return <ContentLoader />;
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
              <h2 className='formTitle'>
                <>{t('truckRequests.assignToTransporter')}</>
              </h2>
            </header>

            <div className='formContent' id='truckReqFormContent'>
              <div className='fields'>
                {truckRequest['asset'] && (
                  <header className='formContentHeader' id='truckRequestDetail'>
                    <div className='img'>
                      <img src={TruckSVG} alt='truck' />
                    </div>
                    <div className='truckRequestDetail'>
                      <span className='title'>
                        <>{t('truckRequests.truckType')}</>
                      </span>
                      {truckRequest.asset.size &&
                        ((
                          <p className='truckType'>{`${truckRequest.asset.name} ${truckRequest.asset.size} ${truckRequest.accessType}`}</p>
                        ) ||
                          getDash())}
                    </div>
                    {values.truckQty > 0 && (
                      <p className='truckQty'>{`${values.truckQty} ${(values.truckQty > 1 && 'Trucks') || 'Truck'}`}</p>
                    )}
                  </header>
                )}
                {/* Transporter */}
                <div className='transporter formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='transporter'>
                      <>{t('forms.transporter')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {touched['transporter'] && errors['transporter'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['transporter']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['transporter'] && errors['transporter']}>
                    <input
                      {...getFieldProps('transporter')}
                      className='transporter formField'
                      type='text'
                      list='transporters'
                      autoComplete='off'
                    />
                    <datalist id='transporters'>
                      {partners.map(partner => (
                        <React.Fragment key={uuid()}>
                          <option value={`${partner.business_name}`}></option>
                        </React.Fragment>
                      ))}
                    </datalist>
                  </div>
                </div>
                {/* Truck Quantity */}
                <div className='formFieldBlock truckRequest'>
                  <header className='formFieldHeader'>
                    <label htmlFor='truckQty'>
                      {truckRequest.requestType.toLowerCase() === 'container' ? (
                        'Container quantity'
                      ) : (
                        <>{t('truckRequests.truckQty')}</>
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
                      {values.truckQty} <>{t('forms.trucks')}</>
                    </p>
                    <button
                      type='button'
                      className='plus'
                      disabled={
                        values.truckQty ===
                        (truckRequest.requestedQuantity - truckRequest.acceptedQuantity ||
                          truckRequest.allocation - truckRequest.assignedAllocation)
                      }
                      onClick={() => setFieldValue('truckQty', values.truckQty + 1)}
                    >
                      <img src={PlusSVG} alt='truck' />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='cta'>
            <button type='submit' className='dp-flex' disabled={!(isValid && dirty) || isSubmitting}>
              {(isSubmitting && <ButtonLoader />) || <>{t('truckRequests.assignToTransporter')}</>}
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
        </form>
      </CreateNewRouteFormStyle>
    </FormStyle>
  );
}

export default AssignTruckRequestToTransporterForm;
