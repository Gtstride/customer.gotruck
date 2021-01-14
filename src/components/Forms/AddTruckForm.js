import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import CloseSVGIcon from '../../assets/icons/close-modal.svg';
import { WarningSVGIcon } from '../../assets/icons/Icons';
import CreateNewRouteFormStyle from '../../styles/CreateNewRouteFormStyle';
import FormStyle from '../../styles/FormStyle';
import ButtonLoader from '../Loaders/ButtonLoader';
import { baseurl, capitalizeFirstLetter, uuid, lang } from '../../_utils/fx';
import { createTruck } from '../../APIs/Create';
import { toastEnums } from '../../_utils/constants';
import { useFetch } from '../../APIs/Read';

const Apptoken = process.env.REACT_APP_APPTOKEN;

function AddTruck({
  pageParams: { syncUp, setModal, updateTableData, setTotalPage },
  endpointParams: { token, partnerId, customerId2, businessName },
}) {
  const { t } = useTranslation();
  const [assetClassSizes, setAssetClassSizes] = useState([]);
  const [assetClassUnit, setAssetClassUnit] = useState();
  const [assetClasses, setAssetClasses] = useState([]);
  const { response } = useFetch('asset/grouped', token);

  const [formError, setFormError] = useState({
    showFormError: false,
    formErrorMessage: undefined,
  });

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
      }, 1000);
    }
  }, [formError.showFormError]);

  const {
    handleSubmit,
    values,
    handleChange,
    setFieldValue,
    errors,
    touched,
    isSubmitting,
    isValid,
    dirty,
    getFieldProps,
  } = useFormik({
    initialValues: {
      regNumber: '',
      assetClass: '',
      assetSize: '',
      ownerBusinessName: businessName,
      make: '',
      model: '',
      // insuranceNo: ''
    },
    validationSchema: Yup.object().shape({
      regNumber: Yup.string().required(`${t('forms.required')}`),
      assetClass: Yup.string().required(`${t('forms.required')}`),
      assetSize: Yup.string().required(`${t('forms.required')}`),
      make: Yup.string().required(`${t('forms.required')}`),
      model: Yup.string().required(`${t('forms.required')}`),
    }),
    async onSubmit(values) {
      //   const { READ } = getUsersEndpoints({ partnerId });

      values.ownerId = partnerId;
      values.assetClass = values.assetSize;
      const { assetSize, ...rest } = values;
      try {
        const postRes = await createTruck({ params: rest, token });
        if (postRes) {
          const readRes = await baseurl.get(
            `/truck?customerId=${customerId2}&partnerId=${partnerId}?language=${lang}`,
            {
              headers: { Authorization: `Bearer ${token}`, Apptoken },
            },
          );
          updateTableData({ tableData: readRes.data.data.fleets });
          setTotalPage(readRes.data.data.fleets.length);

          if (readRes) {
            syncUp({
              toastType: 'success',
              toastMessage: 'Truck added',
            });
          }
        }
      } catch ({ response }) {
        if (response) {
          const { message } = response.data;
          setFormError({
            showFormError: true,
            formErrorMessage: message,
          });

          syncUp({
            toastType: toastEnums.FAILURE,
            toastMessage: message,
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
                <>{t('forms.addTruck')}</>
              </h2>
            </header>
            <div className='formContent'>
              <div className='fields'>
                {/* Reg No */}
                <div className='regNumber formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='regNumber'>
                      <>{t('forms.regNumber')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {touched['regNumber'] && errors['regNumber'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['regNumber']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['regNumber'] && errors['regNumber']}>
                    <input
                      {...getFieldProps('regNumber')}
                      autoComplete='no'
                      className='regNumber formField'
                      type='text'
                    />
                  </div>
                </div>
                <div className='horizontalForms'>
                  {/* Asset class typee */}
                  <div className='assetClass formFieldBlock'>
                    <header className='formFieldHeader'>
                      <label htmlFor='assetClassType'>Asset class type {assetClassUnit && `(${assetClassUnit})`}</label>
                      <div className='errorMessageBlock'>
                        {touched['assetClass'] && errors['assetClass'] && (
                          <>
                            <WarningSVGIcon />
                            <p className='errorMessage'>{errors['assetClass']}</p>
                          </>
                        )}
                      </div>
                    </header>
                    <div className='formFieldWrap' data-isinvalid={touched['assetClass'] && errors['assetClass']}>
                      <select name='assetClass' id='assetClass' onChange={e => populateSelectedAssetClassSizes(e)}>
                        <option className='placeholderOption'>Select asset type</option>
                        {assetClasses.map(({ name }) => (
                          <option value={name} key={name}>
                            {capitalizeFirstLetter(name)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {/* Asset Size */}
                  <div className='assetClass formFieldBlock'>
                    <header className='formFieldHeader'>
                      <label htmlFor='assetClass'>Asset size</label>
                      <div className='errorMessageBlock'>
                        {touched['assetSize'] && errors['assetSize'] && (
                          <>
                            <WarningSVGIcon />
                            <p className='errorMessage'>{errors['assetSize']}</p>
                          </>
                        )}
                      </div>
                    </header>
                    <div className='formFieldWrap' data-isinvalid={touched['assetSize'] && errors['assetSize']}>
                      <select name='assetSize' id='assetSize' onChange={handleChange} value={values.assetSize}>
                        <option>Select asset size</option>
                        {assetClassSizes.map(({ size, _id }) => (
                          <option value={_id} key={uuid()}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className='horizontalForms'>
                  {/* Make */}
                  <div className='make formFieldBlock'>
                    <header className='formFieldHeader'>
                      <label htmlFor='make'>
                        <>{t('forms.make')}</>
                      </label>
                      <div className='errorMessageBlock'>
                        {touched['make'] && errors['make'] && (
                          <>
                            <WarningSVGIcon />
                            <p className='errorMessage'>{errors['make']}</p>
                          </>
                        )}
                      </div>
                    </header>
                    <div className='formFieldWrap' data-isinvalid={touched['make'] && errors['make']}>
                      <input {...getFieldProps('make')} autoComplete='no' className='make formField' type='text' />
                    </div>
                  </div>

                  {/* Model */}
                  <div className='model formFieldBlock'>
                    <header className='formFieldHeader'>
                      <label htmlFor='model'>
                        <>{t('forms.model')}</>
                      </label>
                      <div className='errorMessageBlock'>
                        {touched['model'] && errors['model'] && (
                          <>
                            <WarningSVGIcon />
                            <p className='errorMessage'>{errors['model']}</p>
                          </>
                        )}
                      </div>
                    </header>
                    <div className='formFieldWrap' data-isinvalid={touched['model'] && errors['model']}>
                      <input {...getFieldProps('model')} autoComplete='no' className='model formField' type='text' />
                    </div>
                  </div>
                </div>

                <div className='cta'>
                  <button type='submit' className='dp-flex' disabled={!(isValid && dirty) || isSubmitting}>
                    {(isSubmitting && <ButtonLoader />) || `${t('buttons.create')}`}
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

export default AddTruck;
