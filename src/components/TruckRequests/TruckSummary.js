import { useFormik } from 'formik';
import React, { useState, useEffect } from 'react';
import { object } from 'yup';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import AddSVGIcon from '../../assets/icons/add-circle.svg';
import ArrowCircleLeft from '../../assets/icons/arrow-btn-circle-left.svg';
import FormStyle from '../../styles/FormStyle';
import OrderDetailStyle from '../../styles/OrderDetailStyle';
import { getDash } from '../../_utils/fx';
import Block from '../General/Block';
import { useUserState } from '../../contexts/UserContext';
import { useFetch } from '../../APIs/Read';
import { uuid } from '../../_utils/fx';
import { loadTruck } from '../../APIs/Update';
import ButtonLoader from '../Loaders/ButtonLoader';

function TruckSummary({ params, truckPool, syncUp, truckRequestId, type }) {
  const { customerId, token, userType, user_type } = useUserState();
  const { customerId: customerId2 } = useParams();
  const { t } = useTranslation();
  const [recipients, setRecipients] = useState([]);
  const { push, goBack } = useHistory();

  // eslint-disable-next-line no-unused-vars
  const [_, setDropOffs] = useState([
    {
      dropOffLat: 0,
      dropOffLong: 0,
    },
  ]);
  const { response } = useFetch(`/customer/${customerId}/recipients`, token);

  useEffect(() => {
    if (response) {
      setRecipients(response.recipients);
    }
  }, [response]);

  const [customerInfo] = useState([
    { title: <>{t('invoices.customer')}</>, subtitle: params.customerName || getDash() },
    { title: <>{t('inputText.pickupAddress')}</>, subtitle: params.pickupStation.address || getDash() },
    { title: <>{t('forms.deliveryAddress')}</>, subtitle: params.deliveryStation.address || getDash() },
    { title: <>{t('trips.tripPrice')}</>, subtitle: `${params.currency} ${params.price} ` || getDash() },
  ]);
  const [truckDriverInfo] = useState([
    { title: <>{t('truckRequests.truck')}</>, subtitle: getDash() },
    { title: <>{t('tableHeaders.driver')}</>, subtitle: params.driver.name || getDash() },
    { title: <>{t('truckRequests.partner')}</>, subtitle: params.partner.name || getDash() },
  ]);
  const { handleSubmit, setFieldValue, touched, errors, values, isSubmitting } = useFormik({
    initialValues: {
      dropOffs: [
        {
          recipient: '',
          address: '',
          recipientMobile: '',
          salesOrderNo: '',
          orderNote: '',
          state: '',
          id: '',
          dropOffLat: 0,
          dropOffLong: 0,
        },
      ],
    },

    validationSchema: object().shape({
      // dropOffs: array().of(
      //   object().shape({
      //     recipient: string()
      //       .ensure()
      //       .required('Field is required'),
      //     address: string()
      //       .ensure()
      //       .required('Field is required'),
      //     recipientMobile: string()
      //       .ensure()
      //       .required('Field is required'),
      //     salesOrderNo: string(),
      //     orderNote: string(),
      //   }),
      // ),
    }),
    async onSubmit(values) {
      const { driver, partner, ...others } = params;
      const paramz = {
        ...others,
        dropOff: values.dropOffs,
      };

      try {
        const endpoint = `/truck/${truckPool}/loadTruckPool`;

        const res = await loadTruck({ endpoint, params: paramz, token });
        
        // Only customer should be able to do this
        if (userType.toLowerCase() === 'customer' || user_type.toLowerCase() === 'customer') {
          const res_ = await loadTruck({
            endpoint: `/trip/${res.data.data.tripId}/updateStatus`,
            params: { status: 'Loaded' },
            token,
          });
          if (res && res_) {
            syncUp({
              toastType: 'success',
              toastMessage: 'Success Loading Truck',
            });

            setTimeout(() => {
              push(`/${customerId2}/trips`);
            }, 1000);
          }
        }

        if (res) {
          syncUp({
            toastType: 'success',
            toastMessage: 'Success Loading Truck',
          });

          setTimeout(() => {
            push(`/${customerId2}/trips`);
          }, 1000);
        }
      } catch ({ response }) {
        if (response) {
          const { message: errorMessage } = response.data;
          syncUp({
            toastType: 'failure',
            toastMessage: errorMessage,
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

  function createNewDropoff() {
    const stuff = [
      ...values.dropOffs,
      {
        dropOffLat: 0,
        dropOffLong: 0,
        recipient: '',
        address: '',
        recipientMobile: '',
        salesOrderNo: '',
        orderNote: '',
        state: '',
        id: '',
      },
    ];

    values.dropOffs = stuff;
    setDropOffs(stuff);
  }

  function removeDropoff(index) {
    let mDropOffs = [...values.dropOffs];
    const del = mDropOffs.filter((_, i) => i !== index);
    mDropOffs = del;
    values.dropOffs = del;
    setDropOffs(mDropOffs);
  }

  function onInputChange(e, index) {
    const { name, value } = e.target;
    let currentDropOffs = [...values.dropOffs];
    if (name === 'recipient') {
      if (index !== undefined && value !== 'Select recipient') {
        setFieldValue(`dropOffs[${index}].id`, value);
        setFieldValue(`dropOffs[${index}].recipientId`, parseInt(recipients[value].id, 10));
        setFieldValue(`dropOffs[${index}].recipientName`, recipients[value].full_name);
        setFieldValue(`dropOffs[${index}].recipient`, recipients[value].full_name);
        setFieldValue(`dropOffs[${index}].recipientMobile`, recipients[value].mobile);
      }
    } else if (name === 'address') {
      if (recipients[index].addresses.length > 0) {
        const address = recipients
          .find(item => item.id === currentDropOffs[index].recipientId)
          .addresses.find(item => item.address === value);
        setFieldValue(`dropOffs[${index}].state`, address ? address.state : '');
        setFieldValue(`dropOffs[${index}].address`, value);
        setFieldValue(`dropOffs[${index}].addressId`, address ? address.id : '');
      } else {
        setFieldValue(`dropOffs[${index}].state`, '');
        setFieldValue(`dropOffs[${index}].address`, value);
        setFieldValue(`dropOffs[${index}].addressId`, '');
      }
    } else {
      setFieldValue(`dropOffs[${index}][${name}]`, value);
    }
  }

  return (
    <OrderDetailStyle data-style-comp-for='OrderDetail'>
      <div>
        <Block {...{ blockTitle: <>{t('forms.customer&RouteInfo')}</>, blockInfo: customerInfo }} />
        <Block {...{ blockTitle: <>{t('forms.truck&DriverInfo')}</>, blockInfo: truckDriverInfo }} />
      </div>
      <div>
        <FormStyle>
          <form onSubmit={handleSubmit}>
            <div className='recipientOrderDetailBlock' style={{ minHeight: 350 }}>
              <div id='orderDetail'>
                <div className='recipientOrderDetailContent'>
                  <header className='blockHeading'>
                    <h1 className='blockTitle'>
                      <>{t('forms.recipientOrderDetail')}</>
                    </h1>
                    <p className='blockLabel'>
                      <>{t('forms.totalNoOfDropoffs')}</>
                    </p>
                    <p className='blockCounter'>{values.dropOffs.length}</p>
                  </header>

                  {values.dropOffs.map((dropOff, index) => (
                    <div className='recipientOrderBlock' key={index}>
                      <div id='dropoffform'>
                        <div
                          style={{
                            border: '2px dashed #99909082',
                            borderRadius: 10,
                            padding: '20px 20px 40px 20px',
                            margin: '30px 0',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '0 30px',
                            position: 'relative',
                          }}
                        >
                          {/* Recipient */}
                          <div className='formFieldBlock  recipient'>
                            <header className='formFieldHeader'>
                              <label htmlFor='recipient'>
                                <>{t('orders.recipient')}</>
                              </label>
                            </header>
                            <div
                              className='formFieldWrap'
                              style={{ height: 50 }}
                              data-isinvalid={touched['recipient'] && errors['recipient']}
                            >
                              <select
                                name='recipient'
                                id='recipient'
                                value={values.dropOffs[index].id ? values.dropOffs[index].id : ''}
                                onChange={e => {
                                  return onInputChange(e, index);
                                }}
                              >
                                <option>Select recipient </option>
                                {recipients.map((recipient, index) => (
                                  <option key={uuid()} value={index}>
                                    {recipient.full_name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          {/* Address */}
                          <div className='formFieldBlock'>
                            <header className='Address'>
                              <label htmlFor='recipient'>
                                <>{t('tableHeaders.address')}</>
                              </label>
                              <div className='errorMessageBlock'></div>
                            </header>

                            <div className='formFieldWrap' style={{ height: 50 }}>
                              <select
                                name='address'
                                id='address'
                                value={values.dropOffs[index].address}
                                onChange={e => onInputChange(e, index)}
                              >
                                <option>Select address </option>
                                {dropOff.id &&
                                recipients &&
                                recipients[dropOff.id] &&
                                recipients[dropOff.id].addresses &&
                                recipients[dropOff.id].addresses.length > 0 ? (
                                  recipients[dropOff.id].addresses.map((address, index) => (
                                    <option key={index} value={address.address}>
                                      {address.address}
                                    </option>
                                  ))
                                ) : (
                                  <option value={recipients[dropOff.id] ? recipients[dropOff.id].address : ''}>
                                    {recipients[dropOff.id] ? recipients[dropOff.id].address : ''}
                                  </option>
                                )}
                              </select>
                            </div>
                          </div>
                          {/* Phone */}
                          <div className='formFieldBlock recipientBlock'>
                            <header className='formFieldHeader'>
                              <label htmlFor='phone'>
                                <>{t('forms.phoneNumber')}</>
                              </label>
                              <div className='errorMessageBlock'></div>
                            </header>
                            <div className='formFieldWrap' style={{ height: 50 }}>
                              <input
                                name='recipientMobile'
                                disabled
                                value={
                                  values.dropOffs[index].recipientMobile ? values.dropOffs[index].recipientMobile : ''
                                }
                              />
                            </div>
                          </div>
                          {/*Sales order no */}
                          <div className='formFieldBlock recipientBlock'>
                            <header className='formFieldHeader'>
                              <label htmlFor='recipient'>
                                <>{t('orders.salesOrderNum')}</>
                              </label>
                              <div className='errorMessageBlock'></div>
                            </header>
                            <div className='formFieldWrap' style={{ height: 50 }}>
                              <input
                                name='salesOrderNo'
                                defaultValue={
                                  values.dropOffs[index].salesOrderNo ? values.dropOffs[index].salesOrderNo : ''
                                }
                                onChange={e => onInputChange(e, index)}
                                autoComplete='off'
                              />
                            </div>
                          </div>

                          {/* order Note. */}
                          <div className='formFieldBlock orderNote' style={{ gridColumn: '1/-1', height: '100px' }}>
                            <header className='formFieldHeader'>
                              <label htmlFor='recipient'>
                                <>{t('orders.orderNote')}</>
                              </label>
                              <div className='errorMessageBlock'></div>
                            </header>
                            <div className='formFieldWrap' style={{ height: '100px' }}>
                              {/* <textarea name='orderNote' value={dropOff.orderNote} onChange={e => onInputChange(e, index)} /> */}
                              <textarea
                                name='orderNote'
                                value={values.dropOffs[index].orderNote ? values.dropOffs[index].orderNote : ''}
                                onChange={e => onInputChange(e, index)}
                                autoComplete='off'
                              />
                            </div>
                          </div>

                          {values.dropOffs.length > 1 && (
                            <button
                              type='button'
                              style={{
                                position: 'absolute',
                                top: '-10px',
                                background: 'red',
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: 'white',
                                right: '9px',
                              }}
                              onClick={() => removeDropoff(index)}
                            >
                              <span className='buttonIcon'>X</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className='formContent'>
                    <div className='addMoreBlock'>
                      <button
                        className='addMore'
                        type='button'
                        style={{ margin: 0, marginLeft: 'auto', color: 'var(--blue)' }}
                        onClick={() => createNewDropoff()}
                      >
                        <span className='buttonIcon'>
                          <img src={AddSVGIcon} alt='add more recipient order' />
                        </span>
                        <span className='buttonText'>
                          <>{t('buttons.addNewDropoff')}</>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='cta' style={{ justifyContent: 'space-between' }}>
              <button
                type='button'
                className='previous'
                style={{ backgroundColor: 'initial', color: 'black', boxShadow: 'initial' }}
                onClick={() => goBack()}
              >
                <span className='buttonIcon' style={{ transform: 'rotate(180deg)' }}>
                  <img src={ArrowCircleLeft} alt='previous step' />
                </span>
                <span className='buttonText'>
                  <>{t('buttons.previous')}</>
                </span>
              </button>
              <button type='submit'>{(isSubmitting && <ButtonLoader />) || <>{t('buttons.createTrip')}</>}</button>
            </div>
          </form>
        </FormStyle>
      </div>
    </OrderDetailStyle>
  );
}

export default TruckSummary;
