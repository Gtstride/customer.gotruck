import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

import CloseSVGIcon from '../../assets/icons/close-modal.svg';
import { WarningSVGIcon } from '../../assets/icons/Icons';
import CreateNewRouteFormStyle from '../../styles/CreateNewRouteFormStyle';
import FormStyle from '../../styles/FormStyle';
import ButtonLoader from '../Loaders/ButtonLoader';
import { getAddress, searchAllTruckRegNos } from '../../APIs/Read';
import { uuid, phoneFormatter, baseurl, lang } from '../../_utils/fx';
import PopupLoader from '../Loaders/PopupLoader';
import { DebounceInput } from 'react-debounce-input';
import { useUserState } from '../../contexts/UserContext';
import { addToPool } from '../../APIs/Create';
import { addToRequestPool } from '../../APIs/Create';
import MinusSVG from '../../assets/icons/minus.svg';
import PlusSVG from '../../assets/icons/plus.svg';
import { getTRPool, getTransporters } from '../../APIs/Read';

function AssignTruckForm({
  updateTruckRequest,
  updateTRPool,
  setModal,
  transporter,
  token,
  modal,
  truckRequest,
  syncUp,
}) {
  const { t } = useTranslation();

  const customer = useUserState();
  const [fleets, setFleets] = useState([]);
  const [fleet, setFleet] = useState([]);
  // @ts-ignore
  // eslint-disable-next-line no-unused-vars
  const [currentDriverAvailable, setCurrentDriverAvailable] = useState(false);
  const [popupisActive, setPopupisActive] = useState(false);
  const [addressPopup, setAddressPopup] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [popupIsLoading, setPopupIsLoading] = useState(false);
  const [addressLoader, setAddressLoader] = useState(false);
  const [formError, setFormError] = useState({
    showFormError: false,
    formErrorMessage: undefined,
  });

  const [countries, setCountries] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        if (countries.length === 0) {
          const endpoint = `/route/country?language=${lang}`;
          const res = await baseurl.get(endpoint);
          if (res) {
            setCountries(res.data.data.countries);
          }
        }
      } catch (error) {}
    })();
  }, [countries.length]);

  const {
    handleSubmit,
    touched,
    errors,
    isSubmitting,
    dirty,
    isValid,
    getFieldProps,
    setFieldValue,
    values,
  } = useFormik({
    initialValues: {
      truckRegNo: '',
      driverFullName: '',
      currentAddress: '',
      phone: '',
      truckType: '',
      truckCapacity: '',
      noOfContainer: transporter.quantity - transporter.fulfilled,
    },
    validationSchema: Yup.object().shape({
      truckRegNo: Yup.string().required(`${t('forms.required')}`),
      driverFullName: Yup.string().required(`${t('forms.required')}`),
      phone: Yup.string().required(`${t('forms.required')}`),
      truckType: Yup.string().required(`${t('forms.required')}`),
      truckCapacity:
        truckRequest.requestType.toLowerCase() === 'container'
          ? Yup.number()
          : Yup.number().required(`${t('forms.required')}`),
      currentAddress: Yup.string().required(`${t('forms.required')}`),
      noOfContainer:
        truckRequest.requestType.toLowerCase() === 'container'
          ? Yup.number()
              .min(0, 'Number must be greater than 0')
              .required(`${t('forms.required')}`)
          : Yup.number(),
    }),
    async onSubmit(values) {
      const code = countries.find(item => item.country.toLowerCase() === fleet['country'].toLowerCase()).phoneCode;
      const firstPayload = {
        partnerId: transporter.id,
        regNumber: values.truckRegNo,
        driverFullName: values.driverFullName,
        driverMobile: phoneFormatter(values.phone.toString(), code),
        loadStatus: 'ready',
        assetClass: fleet['assetClass'],
        staffIncharge: fleet['staffInCharge'] || '',
        currentAddress: values.currentAddress || fleet['lastKnownLocation'] || '',
        country: fleet['country'],
      };

      let driver = {
        id: null,
        name: null,
        mobile: null,
      };

      if (fleet['currentDriver']) {
        driver.id = fleet['currentDriver']['id'];
        driver.name = fleet['currentDriver']['name'];
        driver.mobile = fleet['currentDriver']['mobile'];
      } else {
        driver = null;
      }

      let secondPayload = {
        customerId: customer['customerId'],
        customerName: truckRequest['customerName'],
        customerPhone: customer['mobile'],
        pickupStation: {
          address: truckRequest['pickupStation']['address'],
          state: truckRequest['pickupStation']['state'],
          country: truckRequest['pickupStation']['country'],
          lat: truckRequest['pickupStation']['location']['coordinates'][0],
          long: truckRequest['pickupStation']['location']['coordinates'][1],
        },
        partnerId: transporter.id,
        partnerName: transporter.name,
        partnerPhone: values.phone,
        asset: {
          ...fleet['asset'],
          id: fleet['asset']._id,
        },
        fleet: fleet['_id'],
        regNumber: values.truckRegNo,
        truckRequestId: truckRequest._id,
        driver: {
          ...driver,
        },
      };

      if (truckRequest.requestType.toLowerCase() === 'container') {
        secondPayload = {
          ...secondPayload,
          noOfContainer: values.noOfContainer,
        };
      }

      try {
        const res1 = await addToPool({ params: firstPayload, token });
        const res2 = await addToRequestPool({ params: secondPayload, token });

        if (res1 && res2) {
          const truckRequestId = truckRequest._id;
          const endpoint = `/truck/truckRequestPool?truckRequestId=${truckRequestId}`;
          const readRes = await getTRPool({ endpoint, token });
          const getRes = await getTransporters({ endpoint: `/request/truck/${truckRequestId}`, token });
          updateTRPool({ editedTruckReqPool: readRes.data.data.truckrequestpool });
          updateTruckRequest(getRes.data.data.truckRequest);

          syncUp({
            toastType: 'success',
            toastMessage: 'Truck added to pool successfully',
          });
        }
      } catch ({ response }) {
        if (response) {
          const { message } = response.data;
          syncUp({
            toastType: 'failure',
            toastMessage: message,
          });
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

  async function searchTruckRegNos(value) {
    setFieldValue('truckRegNo', value);
    if (value === '') {
      values.truckRegNo = '';
    }
    try {
      if (value !== '') {
        setPopupIsLoading(true);
        let res = await searchAllTruckRegNos({
          token,
          searchTerm: value === '' ? values.truckRegNo : value,
          transporterId: transporter.id,
        });
        //filter active trips
        const activateFleets = res.data.data.fleets.filter(fleet => fleet.active);
        //filter on trips
        const onTripFleets = activateFleets.filter(fleet => fleet.onTrip === false);
        //filter based on fleet size
        const fleets = onTripFleets.filter(fleet => fleet.asset.size >= truckRequest.asset.size);
        setFleets(fleets);
        setPopupisActive(true);
        setPopupIsLoading(false);
      } else {
        setFleets([]);
        setPopupisActive(false);
      }
    } catch (error) {
      console.log({ err: error });
    }

    setPopupIsLoading(false);
  }

  async function searchAddress(value) {
    if (value === '') {
      values.searchAddress = '';
    }
    try {
      if (value !== '') {
        setAddressLoader(true);
        let res = await getAddress({ value: value === '' ? values.searchAddress : value, token });
        setAddresses(res.data.data.autocomplete);
        setAddressPopup(true);
        setAddressLoader(false);
      } else {
        setAddresses([]);
        setAddressPopup(false);
      }
    } catch (error) {
      console.log({ err: error });
    }
    setAddressLoader(false);
  }

  function setFormValues(fleet) {
    setFieldValue('truckRegNo', fleet.regNumber);

    if (fleet.onTrip) {
      setFormError({
        showFormError: true,
        formErrorMessage: 'This truck is already on a trip',
      });
    }

    if (fleet['currentDriver']) {
      setCurrentDriverAvailable(true);
      setFieldValue('driverFullName', fleet.currentDriver.name);
      setFieldValue('phone', fleet.currentDriver.mobile);
      setFieldValue('truckType', fleet.asset.name);
      setFieldValue('truckCapacity', fleet.asset.size);
      setFieldValue('currentAddress', fleet.lastKnownLocation);
    }
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
                {truckRequest.requestType.toLowerCase() === 'container' ? (
                  <>{t('truckRequests.assignContainerFor')}</>
                ) : (
                  <>{t('truckRequests.assignTrucksFor')}</>
                )}{' '}
                {transporter.name}
              </h2>
            </header>
            <div className='formContent'>
              <div className='fields'>
                {/* Truck Registration No */}
                <div className='truckRegNo formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='truckRegNo'>
                      <>{t('truckRequests.truckRegNo')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {touched['truckRegNo'] && errors['truckRegNo'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['truckRegNo']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['truckRegNo'] && errors['truckRegNo']}>
                    <DebounceInput
                      {...getFieldProps('truckRegNo')}
                      className='truckRegNo formField'
                      type='text'
                      onChange={e => searchTruckRegNos(e.target.value)}
                      list='truckRegNos'
                      minLength={0}
                      debounceTimeout={50}
                      autoComplete='off'
                    />
                    {popupIsLoading && (
                      <div className='popupItemWrap loading'>
                        <PopupLoader />
                      </div>
                    )}
                    {popupisActive && (
                      <div className='popup' style={{ maxHeight: '500px' }}>
                        {fleets.map(fleet => (
                          <div className='popupItemWrap' key={uuid()}>
                            <button
                              style={{ width: '100%', textAlign: 'left', padding: '14px' }}
                              className='popupText'
                              title={fleet.regNumber}
                              onClick={() => {
                                setFleet(fleet);
                                setFormValues(fleet);
                                setPopupisActive(false);
                              }}
                            >
                              {fleet.regNumber}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {fleet['onTrip'] && (
                    <p style={{ margin: '15px 0', fontSize: '1.2em', color: 'var(--red)' }}> Already on trip</p>
                  )}
                </div>
                {/* Driver fullname */}
                <div className='driverFullName formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='driverFullName'>
                      <>{t('truckRequests.driverFullname')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {touched['driverFullName'] && errors['driverFullName'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['driverFullName']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['driverFullName'] && errors['driverFullName']}>
                    <input
                      disabled
                      {...getFieldProps('driverFullName')}
                      className='driverFullName formField'
                      type='text'
                    />
                  </div>
                </div>

                {/* Truck current address */}
                {/*<div className='currentAddress formFieldBlock'>*/}
                {/*  <header className='formFieldHeader'>*/}
                {/*    <label htmlFor='currentAddress'>*/}
                {/*      <>{t('truckRequests.trucksCurrentAddress')}</>*/}
                {/*    </label>*/}
                {/*    <div className='errorMessageBlock'>*/}
                {/*      {touched['currentAddress'] && errors['currentAddress'] && (*/}
                {/*        <>*/}
                {/*          <WarningSVGIcon />*/}
                {/*          <p className='errorMessage'>{errors['currentAddress']}</p>*/}
                {/*        </>*/}
                {/*      )}*/}
                {/*    </div>*/}
                {/*  </header>*/}
                {/*  <div className='formFieldWrap' data-isinvalid={touched['currentAddress'] && errors['currentAddress']}>*/}
                {/*    <input*/}
                {/*      // disabled*/}
                {/*      {...getFieldProps('currentAddress')}*/}
                {/*      className='driverFullName formField'*/}
                {/*      type='text'*/}
                {/*    />*/}
                {/*  </div>*/}
                {/*</div>*/}

                {/* Truck current address */}
                <div className='currentAddress formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='currentAddress'>
                      <>{t('truckRequests.trucksCurrentAddress')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {touched['currentAddress'] && errors['currentAddress'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['currentAddress']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['currentAddress'] && errors['currentAddress']}>
                    {/*<input {...getFieldProps('currentAddress')} className='driverFullName formField' type='text' />*/}
                    <DebounceInput
                      {...getFieldProps('currentAddress')}
                      className='truckRegNo formField'
                      type='text'
                      onChange={e => searchAddress(e.target.value)}
                      list='addressList'
                      minLength={0}
                      debounceTimeout={50}
                      autoComplete='off'
                    />
                    {addressLoader && (
                      <div className='popupItemWrap loading'>
                        <PopupLoader />
                      </div>
                    )}

                    {addressPopup && (
                      <div className='popup' style={{ maxHeight: '500px' }}>
                        {addresses && addresses.length
                          ? addresses.map(address => (
                              <div className='popupItemWrap' key={uuid()}>
                                <button
                                  style={{ width: '100%', textAlign: 'left', padding: '14px' }}
                                  className='popupText'
                                  title={address.description}
                                  onClick={() => {
                                    setFieldValue('currentAddress', address.description);
                                    setAddressPopup(false);
                                  }}
                                >
                                  {address.description}
                                </button>
                              </div>
                            ))
                          : ''}
                      </div>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className='phone formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='phone'>
                      <>{t('tableHeaders.phone')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {touched['phone'] && errors['phone'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['phone']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['phone'] && errors['phone']}>
                    <input {...getFieldProps('phone')} className='phone formField' type='text' />
                  </div>
                </div>
                {/* Truck type */}
                <div className='truckType formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='truckType'>
                      <>{t('truckRequests.truckType')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {touched['truckType'] && errors['truckType'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['truckType']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['truckType'] && errors['truckType']}>
                    <input {...getFieldProps('truckType')} disabled className='truckType formField' type='text' />
                  </div>
                </div>
                {truckRequest.requestType.toLowerCase() === 'container' ? (
                  <div className='formFieldBlock truckRequest'>
                    <header className='formFieldHeader'>
                      <label htmlFor='truckQty'> {t('truckRequests.containerQuantity')} </label>
                    </header>
                    <div className='truckRequest counter'>
                      <button
                        type='button'
                        className='minus'
                        disabled={values.noOfContainer === 0}
                        onClick={() => setFieldValue('noOfContainer', values.noOfContainer - 1)}
                      >
                        <img src={MinusSVG} alt='truck' />
                      </button>
                      <p className='truckQtyCount'>
                        {values.noOfContainer} {t('truckRequests.container(s)')}{' '}
                      </p>
                      <button
                        type='button'
                        className='plus'
                        disabled={values.noOfContainer === transporter.quantity - transporter.fulfilled}
                        onClick={() => setFieldValue('noOfContainer', values.noOfContainer + 1)}
                      >
                        <img src={PlusSVG} alt='truck' />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className='truckCapacity formFieldBlock'>
                    <header className='formFieldHeader'>
                      <label htmlFor='truckCapacity'>
                        <>{t('truckRequests.truckCapacity')}</>
                      </label>
                      <div className='errorMessageBlock'>
                        {touched['truckCapacity'] && errors['truckCapacity'] && (
                          <>
                            <WarningSVGIcon />
                            <p className='errorMessage'>{errors['truckCapacity']}</p>
                          </>
                        )}
                      </div>
                    </header>
                    <div className='formFieldWrap' data-isinvalid={touched['truckCapacity'] && errors['truckCapacity']}>
                      <input
                        // disabled
                        {...getFieldProps('truckCapacity')}
                        name='truckCapacity'
                        value={values.truckCapacity}
                        className='truckCapacity formField'
                        type='number'
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className='cta'>
              <button
                type='submit'
                className='dp-flex'
                disabled={fleet['onTrip'] && (!(isValid && dirty) || isSubmitting)}
              >
                {(isSubmitting && <ButtonLoader />) ||
                  (truckRequest.requestType.toLowerCase() === 'container' && (
                    <>{t('truckRequests.assignContainer')}</>
                  )) || <>{t('truckRequests.assignTrucks')}</>}
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
        </form>
      </CreateNewRouteFormStyle>
    </FormStyle>
  );
}

export default AssignTruckForm;
