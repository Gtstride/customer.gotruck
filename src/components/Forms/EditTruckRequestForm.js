import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { DebounceInput } from 'react-debounce-input';
import * as Yup from 'yup';
import { getAddress, getLatLong, getStates, getTruckRequest, useFetch } from '../../APIs/Read';
import { updateTruckRequest } from '../../APIs/Update';
import CloseSVGIcon from '../../assets/icons/close-modal.svg';
import { WarningSVGIcon } from '../../assets/icons/Icons';
import { useTranslation } from 'react-i18next';
import MinusSVG from '../../assets/icons/minus.svg';
import PlusSVG from '../../assets/icons/plus.svg';
import CreateNewRouteFormStyle from '../../styles/CreateNewRouteFormStyle';
import FormStyle from '../../styles/FormStyle';
import { capitalizeFirstLetter, getCountry, isArrayEmpty, isArraysEmpty, uuid } from '../../_utils/fx';
import ButtonLoader from '../Loaders/ButtonLoader';
import ContentLoader from '../Loaders/ContentLoader';
import PopupLoader from '../Loaders/PopupLoader';
import FormHeader from './components/FormHeader';

function AddressList({ isPopupLoading, addresses, setAddress }) {
  if (isPopupLoading) {
    return (
      <div className='popupItemWrap loading'>
        <PopupLoader />
      </div>
    );
  }

  return addresses.map(({ description, placeId }) => (
    <div className='popupItemWrap' key={uuid()}>
      <p
        className='popupText'
        title={description}
        onClick={() => setAddress({ address: description, placeId })}
      >
        {description}
      </p>
    </div>
  ));
}

function EditTruckRequestForm({ setModal, endpointParams: { token }, syncUp, truckRequest, updateAction }) {
  const { t } = useTranslation();

  const [assetClasses, setAssetClasses] = useState([]);
  const [assetClassUnit, setAssetClassUnit] = useState(truckRequest.asset ? truckRequest.asset.unit : '');
  const [assetClassSizes, setAssetClassSizes] = useState([]);
  const { response } = useFetch('asset/grouped', token);
  const [formError, setFormError] = useState({
    showFormError: false,
    formErrorMessage: undefined,
  });
  const [isPAPopupActive, setIsPAPopupActive] = useState(false);
  const [PAaddresses, setPAaddresses] = useState([]);
  const [PAaddress, setPAaddress] = useState(null);
  const [isPAPopupLoading, setIsPAPopupLoading] = useState();
  const [pickupStates, setPickupStates] = useState([]);
  const [PAlatLng, setPALatLng] = useState({
    lat: truckRequest.pickupStation.location.coordinates[0],
    lng: truckRequest.pickupStation.location.coordinates[1],
  });
  const [pickupLocationCountry, setPickupLocationCountry] = useState(truckRequest.sourceCountry);
  const [selectedAssetClass, setSelectedAssetClass] = useState();

  useEffect(() => {
    if (response) {
      setAssetClasses(response.assetClasses);
    }
  }, [response]);

  useEffect(() => {
    if (formError.showFormError) {
      setTimeout(() => {
        setFormError({
          showFormError: false,
          formErrorMessage: undefined,
        });
      }, 3000);
    }
  }, [formError.showFormError]);

  const {
    touched,
    errors,
    isValid,
    isSubmitting,
    values,
    dirty,
    setFieldValue,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues: {
      location: truckRequest.pickupStation.address,
      state: truckRequest.pickupStation.state || '',
      truckQty: truckRequest.requestedQuantity || 0,
      assetClass: truckRequest.asset ? truckRequest.asset.name : '',
      assetSize: truckRequest.asset ? truckRequest.asset.size : '',
    },

    validationSchema: Yup.object().shape({
      location: Yup.string().required(`${t('forms.required')}`),
      state: Yup.string().required(`${t('forms.required')}`),
      truckQty: Yup.string().required(`${t('forms.required')}`),
    }),

    async onSubmit(values) {
      let params;

      try {
        if (truckRequest.requestType.toLowerCase() === 'bulk') {
          params = {
            pickupStation: {
              address: values.location,
              state: values.state || truckRequest.pickupStation.state,
              country: (pickupLocationCountry && pickupLocationCountry.country) || truckRequest.country,
              lat: PAlatLng.lat,
              long: PAlatLng.lng,
            },
            expiryDate: undefined,
          };
        } else {
          if (truckRequest.requestType.toLowerCase() === 'container') {
            params = {
              pickupStation: {
                address: values.location,
                state: values.state || truckRequest.pickupStation.state,
                country: (pickupLocationCountry && pickupLocationCountry.country) || truckRequest.country,
                lat: PAlatLng.lat,
                long: PAlatLng.lng,
              },
              expiryDate: truckRequest.expiryDate,
            };
          } else {
            params = {
              pickupStation: {
                address: values.location,
                state: values.state || truckRequest.pickupStation.state,
                country: (pickupLocationCountry && pickupLocationCountry.country) || truckRequest.country,
                lat: PAlatLng.lat,
                long: PAlatLng.lng,
              },
              expiryDate: truckRequest.expiryDate,
              asset: {
                ...selectedAssetClass,
                ...assetClassSizes.find(item => {
                  return item.size === parseInt(values.assetSize, 10);
                }),
                quantiy: values.truckQty,
              },
            };
          }
        }

        const truckRequestId = truckRequest._id;
        const putRes = await updateTruckRequest({ params, token, truckRequestId });
        if (putRes) {
          const endpoint =
            truckRequest.requestType.toLowerCase() === 'bulk'
              ? `/request/bulktruck/${truckRequestId}`
              : `/request/truck/${truckRequestId}`;
          const readRes = await getTruckRequest({ endpoint, token });
          updateAction({ editedTruckReq: readRes.data.data.truckRequest });

          syncUp({
            toastType: 'success',
            toastMessage: 'Truck request updated',
          });
        }
      } catch (err) {
        const { response } = err;
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

  function populateSelectedAssetClassSizes(selectedAssetClassName) {
    const selectedAssetClass = assetClasses.find(assetClass => assetClass.name === selectedAssetClassName.target.value);
    setAssetClassUnit(selectedAssetClass.unit);
    setFieldValue('assetClass', selectedAssetClass.name);

    // 1. Reset asset classes first
    setAssetClassSizes([]);
    const selectedAssetClassSizes = assetClasses.find(
      assetClass => assetClass.name === selectedAssetClassName.target.value,
    ).size;

    setAssetClassSizes(selectedAssetClassSizes);
    setFieldValue('assetSize', selectedAssetClassSizes[0]['size']);
  }

  useEffect(() => {
    if (!isArrayEmpty(assetClasses)) {
      if (truckRequest.asset && truckRequest.requestType.toLowerCase() === 'regular') {
        const selectedAssetClass = assetClasses.find(assetClass => assetClass.name === values.assetClass);
        setSelectedAssetClass(selectedAssetClass);
        setAssetClassUnit(selectedAssetClass.unit);
        const selectedAssetClassSizes = assetClasses.find(assetClass => assetClass.name === values.assetClass).size;
        setAssetClassSizes(selectedAssetClassSizes);
      }
    }
  }, [assetClasses, truckRequest.asset, truckRequest.requestType, values.assetClass]);

  async function setAddresses(value) {
    const valueLength = value.length;
    if (valueLength === 0) {
      setIsPAPopupLoading(false);
      setIsPAPopupActive(false);
    }
    if (valueLength > 0) {
      setIsPAPopupLoading(true);
      const res = await getAddress({ value, token });
      const predictions = res.data.data.autocomplete;
      setPAaddresses(predictions);
    }
  }

  useEffect(() => {
    // ?? We now have at least an address
    if (PAaddresses.length > 0) {
      setIsPAPopupLoading(false);
      setIsPAPopupActive(true);
    } else {
      setIsPAPopupActive(false);
    }
  }, [PAaddresses]);

  useEffect(() => {
    if (PAaddress && PAaddress.placeId) {
      (async () => {
        const res = await getLatLong({ placeId: PAaddress.placeId, token });
        const location = res.data.data.place.geometry.location;
        const lat = location.lat;
        const lng = location.lng;
        setFieldValue('location', PAaddress.address);
        setIsPAPopupActive(false);

        const pickupLocationCountry = getCountry(res.data.data.place.addressComponents);
        const res2 = await getStates({ country: pickupLocationCountry.country, token });

        setPickupLocationCountry(pickupLocationCountry);
        setPickupStates(res2.data.data.states);
        setPALatLng({
          lat,
          lng,
        });
      })();
    }
  }, [PAaddress, setFieldValue, token]);

  useEffect(() => {
    (async () => {
      const pickupRes = await getStates({ country: truckRequest.country, token });
      setPickupStates(pickupRes.data.data.states);
    })();
  }, [token, truckRequest.country]);
  // #endregion

  if (!isArraysEmpty(pickupStates, assetClasses)) {
    return (
      <div className='sideNavLoadingBlock'>
        <ContentLoader />
      </div>
    );
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
            <FormHeader {...{ formTitle: `${t('truckRequests.editTruckRequest')}` }} />
            <div className='formContent'>
              <div className='fields'>
                {/* location */}
                <div className='location formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='location'>
                      <>{t('trips.pickupLocation')}</>
                    </label>
                    {touched['location'] && errors['location'] && (
                      <>
                        <WarningSVGIcon />
                        <p className='errorMessage'>{errors['location']}</p>
                      </>
                    )}
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['location'] && errors['location']}>
                    <DebounceInput
                      value={values.location}
                      onChange={e => setAddresses(e.target.value)}
                      className='location formField'
                      type='text'
                      name='location'
                      minLength={0}
                      debounceTimeout={50}
                    />
                    {isPAPopupActive && (
                      <div className='popup'>
                        <AddressList
                          {...{ isPopupLoading: isPAPopupLoading, addresses: PAaddresses, setAddress: setPAaddress }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                {/* State */}
                <div className='state formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='state'>
                      <>{t('common.pickupState')}</>
                    </label>
                    {touched['state'] && errors['state'] && (
                      <>
                        <WarningSVGIcon />
                        <p className='errorMessage'>{errors['state']}</p>
                      </>
                    )}
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['state'] && errors['state']}>
                    <select
                      name='state'
                      id='state'
                      value={values.state}
                      onChange={e => {
                        setFieldValue('state', e.target.value);
                      }}
                    >
                      {<option value={truckRequest.pickupStation.state}>{truckRequest.pickupStation.state}</option>}
                      {pickupStates.map(({ state }) => (
                        <option value={state} key={uuid()}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* Truck */}
                {truckRequest.asset &&
                  (truckRequest.requestType.toLowerCase() !== 'container' && (
                    <div className='dp-grid grid-col-2-all col-gap-20'>
                      {/* Truck Type */}
                      <div className='assetClass formFieldBlock'>
                        <header className='formFieldHeader'>
                          <label htmlFor='assetClass'>
                            <>{t('truckRequests.truckType')}</>
                            {assetClassUnit && `(${assetClassUnit})`}
                          </label>
                          {touched['assetClass'] && errors['assetClass'] && (
                            <>
                              <WarningSVGIcon />
                              <p className='errorMessage'>{errors['assetClass']}</p>
                            </>
                          )}
                        </header>
                        <div className='formFieldWrap' data-isinvalid={touched['assetClass'] && errors['assetClass']}>
                          <select
                            name='assetClass'
                            id='assetClass'
                            value={values.assetClass}
                            onChange={e => {
                              if (truckRequest.asset) {
                                populateSelectedAssetClassSizes(e);
                              }
                            }}
                          >
                            {assetClasses.map(({ name }) => (
                              <option value={name} key={name}>
                                {capitalizeFirstLetter(name)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      {/* Truck Tonnage */}
                      <div className='assetSize formFieldBlock'>
                        <header className='formFieldHeader'>
                          <label htmlFor='assetSize'>
                            <>{t('truckRequests.truckTon')}</>
                          </label>
                          {touched['assetSize'] && errors['assetSize'] && (
                            <>
                              <WarningSVGIcon />
                              <p className='errorMessage'>{errors['assetSize']}</p>
                            </>
                          )}
                        </header>
                        <div className='formFieldWrap' data-isinvalid={touched['assetSize'] && errors['assetSize']}>
                          <select name='assetSize' id='assetSize' onChange={handleChange} value={values.assetSize}>
                            {assetClassSizes.map(({ size, _id }) => (
                              <option value={size} key={uuid()}>
                                {size}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                {/* Truck Quantity */}
                <div className='formFieldBlock truckRequest'>
                  <header className='formFieldHeader'>
                    <label htmlFor='truckQty'>
                      <>{t('truckRequests.truckQty')}</>
                    </label>
                  </header>
                  <div className='truckRequest counter'>
                    <button
                      type='button'
                      className='minus'
                      disabled={values.truckQty === 1}
                      onClick={() => setFieldValue('truckQty', values.truckQty === 0 ? 0 : values.truckQty - 1)}
                    >
                      <img src={MinusSVG} alt='truck' />
                    </button>
                    <p className='truckQtyCount'>
                      {values.truckQty}
                      <>{t('forms.trucks')}</>
                    </p>
                    <button
                      type='button'
                      className='plus'
                      disabled={values.truckQty === truckRequest.requestedQuantity}
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
              {(isSubmitting && <ButtonLoader />) || <>{t('buttons.update')}</>}
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

export default EditTruckRequestForm;
