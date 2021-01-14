import { useFormik } from 'formik';
import React, { useEffect, useState} from 'react';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import CloseSVGIcon from '../../assets/icons/close-modal.svg';
import { ArrowSVGIcon, WarningSVGIcon } from '../../assets/icons/Icons';
import CreateNewRouteFormStyle from '../../styles/CreateNewRouteFormStyle';
import FormStyle from '../../styles/FormStyle';
import ButtonLoader from '../Loaders/ButtonLoader';
import { baseurl, uuid, capitalizeFirstLetter, phoneFormatter, lang } from '../../_utils/fx';
import CardFrequencyLoader from '../Loaders/CardFrequencyLoader';
import { createDriver } from '../../APIs/Create';
import { toastEnums } from '../../_utils/constants';

const Apptoken = process.env.REACT_APP_APPTOKEN;

function AddDriver({ pageParams: { syncUp, setModal, updateTableData }, endpointParams: { token, partnerId, customerId } }) {
  const { t } = useTranslation();

  const [formError, setFormError] = useState({
    showFormError: false,
    formErrorMessage: undefined,
  });
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    (async () => {
      try {
        if (countries.length === 0) {
          setLoading(true);
          const endpoint = `/route/country?language=${lang}`;
          const res = await baseurl.get(endpoint);
          if (res) {
            setLoading(false);
            setCountries(res.data.data.countries);
          }
        }
      } catch (error) {}
    })();
  }, [countries.length]);
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
    errors,
    touched,
    isSubmitting,
    isValid,
    dirty,
    getFieldProps,
    handleChange,
  } = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      secret: '',
      country: '',
      mobile: '',
    },
    validationSchema: Yup.object().shape({
      first_name: Yup.string().required(`${t('forms.required')}`),
      last_name: Yup.string().required(`${t('forms.required')}`),
      secret: Yup.string().required(`${t('forms.required')}`),
      mobile: Yup.string().required(`${t('forms.required')}`),
      country: Yup.string().required(`${t('forms.required')}`),
    }),
    async onSubmit(values) {
      //   const { READ } = getUsersEndpoints({ partnerId });
      const code = countries.find(item => item.country.toLowerCase() === values.country.toLowerCase()).phoneCode;
      const { mobile } = values;
      values.mobile = phoneFormatter(mobile.toString(), code);
      values.user_type = 'driver';
      values.partner_id = partnerId;
        try {
          const postRes = await createDriver({ params: values, token });
          if (postRes) {
            const readRes = await baseurl.get(`/driver?customerId=${customerId}&partnerId=${partnerId}$language=${lang}`,  { headers: { Authorization: `Bearer ${token}`, Apptoken } } );
            updateTableData({ tableData: readRes.data.data.drivers });

            if (readRes) {
              syncUp({
                toastType: 'success',
                toastMessage: 'Driver added',
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
          } else {
            syncUp({
              toastType: toastEnums.FAILURE,
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
                <>{t('forms.addDriver')}</>
              </h2>
            </header>
            <div className='formContent'>
              <div className='fields'>
                <div className='horizontalForms'>
                  {/* First name */}
                  <div className='first_name formFieldBlock'>
                    <header className='formFieldHeader'>
                      <label htmlFor='first_name'>
                        <>{t('forms.firstName')}</>
                      </label>
                      <div className='errorMessageBlock'>
                        {touched['first_name'] && errors['first_name'] && (
                          <>
                            <WarningSVGIcon />
                            <p className='errorMessage'>{errors['first_name']}</p>
                          </>
                        )}
                      </div>
                    </header>
                    <div className='formFieldWrap' data-isinvalid={touched['first_name'] && errors['first_name']}>
                      <input
                        {...getFieldProps('first_name')}
                        autoComplete='no'
                        className='first_name formField'
                        type='text'
                      />
                    </div>
                  </div>
                  {/* Last name */}
                  <div className='last_name formFieldBlock'>
                    <header className='formFieldHeader'>
                      <label htmlFor='last_name'>
                        <>{t('forms.lastName')}</>
                      </label>
                      <div className='errorMessageBlock'>
                        {touched['last_name'] && errors['last_name'] && (
                          <>
                            <WarningSVGIcon />
                            <p className='errorMessage'>{errors['last_name']}</p>
                          </>
                        )}
                      </div>
                    </header>
                    <div className='formFieldWrap' data-isinvalid={touched['last_name'] && errors['last_name']}>
                      <input
                        {...getFieldProps('last_name')}
                        autoComplete='no'
                        className='last_name formField'
                        type='text'
                      />
                    </div>
                  </div>
                </div>
                
                {/* Mobile */}
                <div className='mobile formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='mobile'>
                      <>{t('common.phoneNumber')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {touched['mobile'] && errors['mobile'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['mobile']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['mobile'] && errors['mobile']}>
                    <input {...getFieldProps('mobile')} autoComplete='no' className='mobile formField' type='number' />
                  </div>
                </div>
                
                <div className='horizontalForms'>
                  {/* Country */}
                  <div className='country formFieldBlock'>
                    <header className='formFieldHeader'>
                      <label htmlFor='country'>
                        <>{t('forms.country')}</>
                      </label>
                      {loading && <CardFrequencyLoader />}
                      <div className='errorMessageBlock'>
                        {touched['country'] && errors['country'] && (
                          <>
                            <WarningSVGIcon />
                            <p className='errorMessage'>{errors['country']}</p>
                          </>
                        )}
                      </div>
                    </header>
                    <div className='formFieldWrap' data-isinvalid={touched['country'] && errors['country']}>
                      <div className='selectContainer'>
                        <div className='select-arrow fa fa-chevron-down'>
                          <ArrowSVGIcon />
                        </div>
                        <select
                          value={values.country}
                          onChange={handleChange}
                          className='country formField'
                          name='country'
                          autoComplete='no'
                        >
                          <option defaultChecked>{t('forms.selectCountry')}</option>
                          {countries.length > 0 &&
                            countries.map(({ country, countryCode }) => (
                              <option value={country} key={uuid()}>
                                {capitalizeFirstLetter(country)}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className='location formFieldBlock'>
                    <header className='formFieldHeader'>
                      <label htmlFor='location'>Location</label>
                      <div className='errorMessageBlock'>
                        {touched['location'] && errors['location'] && (
                          <>
                            <WarningSVGIcon />
                            <p className='errorMessage'>{errors['location']}</p>
                          </>
                        )}
                      </div>
                    </header>
                    <div className='formFieldWrap' data-isinvalid={touched['location'] && errors['location']}>
                      <input
                        {...getFieldProps('location')}
                        autoComplete='no'
                        className='location formField'
                        type='text'
                      />
                    </div>
                  </div>
                </div>

                {/* Secret */}
                <div className='secret formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='secret'>
                      <>{t('forms.password')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {touched['secret'] && errors['secret'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['secret']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['secret'] && errors['secret']}>
                    <input
                      {...getFieldProps('secret')}
                      autoComplete='new-password'
                      className='secret formField'
                      type='password'
                    />
                  </div>
                </div>
                {/* License */}
                {/* <div className='email formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='email'>
                      <>Driver License Image</>
                    </label>
                    <div className='errorMessageBlock'>
                      {touched['email'] && errors['email'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['email']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  {!preview && (
                    <div className='formFieldWrap' data-isinvalid={touched['mobile'] && errors['mobile']}>
                      <button onClick={openFileDialog}>Click to upload driver's license</button>
                      <input
                        ref={fileInput}
                        type='file'
                        accept='image/jpeg,image/gif,image/png,application/pdf,image/x-eps'
                        onChange={handleImageChange}
                      />
                    </div>
                  )}
                  {progress > 0 && !error ? (
                    <ProgressUploadStyle>
                      <div className='uploadProgressBlock'>
                        <div className='uploadIconBlock'>
                          <img src={FileCSVSVGIcon} alt='file' />
                        </div>
                        <div className='progressLineBlock'>
                          <div className='top dp-flex'>
                            <p className='fileTitle'>{file.name}</p>
                            <p className='fileSize'>{formatBytes(file.size)}</p>
                            {/* <p className='cancelUploadIconBlock'>X</p> 
                          </div>

                          <div className='middle'>
                            <div className='progressBar'></div>
                            <div className='progressLine' style={{ width: `${progress}%` }}></div>
                          </div>
                          <div className='bottom'>
                            <p className='progessPercent'>{progress}% done</p>
                          </div>
                        </div>
                      </div>
                    </ProgressUploadStyle>
                  ) : (
                    error && (
                      <div className='cta'>
                        <button onClick={openFileDialog}>CHOOSE FILE</button>
                        <input
                          ref={fileInput}
                          type='file'
                          accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                          onChange={handleImageChange}
                        />
                      </div>
                    )
                  )}
                </div> */}
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

export default AddDriver;
