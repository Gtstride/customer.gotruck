import { useFormik } from 'formik';
import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { updateWithEndpointDataToken } from '../../APIs/Update';
import { WarningSVGIcon } from '../../assets/icons/Icons';
import CreateNewRouteFormStyle from '../../styles/CreateNewRouteFormStyle';
import FormStyle from '../../styles/FormStyle';
import ButtonLoader from '../Loaders/ButtonLoader';
import FormError from './components/FormError';
import FormHeader from './components/FormHeader';
import { formatBytes } from '../../_utils/fx';
import FileCSVSVGIcon from '../../assets/icons/upload-top.svg';
import ProgressUploadStyle from '../../styles/ProgressUploadStyle';
import Axios from 'axios';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const Apptoken = process.env.REACT_APP_APPTOKEN;


function getYears() {
  const currentYear = new Date().getFullYear();
  const numberOfYears = 31;
  let years = new Array(numberOfYears).fill(currentYear);
  years = years.map((year, index) => year + index);
  return years;
}

function EditTruckInsurance({
    truckProfile,
    token,
    setTruckProfile,
    syncUp,
}) {
  const { t } = useTranslation();

  const [preview, setPreview] = useState('');
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [, setLoading] = useState(false);
  const [, setMessage] = useState('');
  const [error, setError] = useState(false);

  const [formError, setFormError] = useState({
    showFormError: false,
    formErrorMessage: undefined,
  });

  const { _id, insurance } = truckProfile;

  const fileInput = useRef(null);

  function openFileDialog() {
    if (fileInput.current) {
      fileInput.current.click();
    }
  }

  function handleImageChange(e) {
    let reader = new FileReader();
    let file = e.target.files[0];
    setError(false);
    setProgress(0);
    setMessage('');
    reader.onloadend = () => {
      setFile(file);
      setPreview(reader.result);
      postImage(file);
    };

    return reader.readAsDataURL(file);
  }

  async function postImage(file) {
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': file.type,
          Authorization: `Bearer ${token}`,
          Apptoken
        },
        onUploadProgress: progressEvent => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      };

      const data = new FormData();
      data.append('media', file);

      const res = await Axios.post(
        `${process.env.REACT_APP_DATA_URL}/upload/insurance`,
        data,
        config,
      );
      if (res && res.data.data && res.data.data.media) {
        setLoading(true);
        setFieldValue('insThumb', res.data.data.media.thumb);
      }
    } catch (error) {
      setProgress(0);
      setLoading(false);
      setError(true);
    }
  }

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

  const { handleSubmit, values, errors, isValid, dirty, touched, isSubmitting, getFieldProps, setFieldValue } = useFormik({
    initialValues: {
      insuranceNo: (insurance && insurance.insuranceNo) || '',
      expYear: (insurance && insurance.expYear) || '',
      expMnt: (insurance && insurance.expMnt) || '',
      insThumb: (insurance && insurance.insThumb) || ''
    },

    validationSchema: Yup.object().shape({
      insuranceNo: Yup.string().required(`${t('forms.required')}`),
      expMnt: Yup.string().required(`${t('forms.required')}`),
      expYear: Yup.string().required(`${t('forms.required')}`),
      insThumb: Yup.string().required(`${t('forms.required')}`),
    }),

    async onSubmit(values) {
      const params = {
        expMnt: values.expMnt,
        expYear: values.expYear,
        insuranceNo: values.insuranceNo,
        insThumb: values.insThumb
      };
      const endpoint = `truck/${_id}`;
      try {
        await updateWithEndpointDataToken({ method: 'put', endpoint, params, token });
        insurance.insuranceNo = values.insuranceNo;
        insurance.expYear = values.expYear;
        insurance.expMnt = values.expMnt;
        insurance.image = values.insThumb;

        syncUp({ toastType: 'success', toastMessage: 'Truck info updated' });
      } catch (error) {
        if (error.response) {
          const { message } = error.response.data;
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
    },
  });

  return (
    <FormStyle id='formStyle'>
      <CreateNewRouteFormStyle id='createNewRouteFormStyle'>
        <form id='createNewRouteForm' noValidate onSubmit={handleSubmit}>
          <div className='formContentBlock'>
            {formError.showFormError && <FormError {...{ formErrorMessage: formError.formErrorMessage }} />}
            <FormHeader {...{ formTitle: `${t('forms.editTruckInsurance')}` }} />
            <div className='formContent'>
              <div className='fields'>
                {/* License Number */}
                <div className='insuranceNo formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='insuranceNo'>
                      <>{t('common.insuranceNum')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {touched['insuranceNo'] && errors['insuranceNo'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['insuranceNo']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['insuranceNo'] && errors['insuranceNo']}>
                    <input
                      value={values.insuranceNo}
                      className='insuranceNo formField'
                      type='text'
                      {...getFieldProps('insuranceNo')}
                      autoComplete='off'
                    />
                  </div>
                </div>

                {/* Expiry Month */}
                <div className='expMnt formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='expMnt'>
                      <>{t('forms.expMonth')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {touched['expMnt'] && errors['expMnt'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['expMnt']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['expMnt'] && errors['expMnt']}>
                    <select
                      value={values.expMnt}
                      className='expMnt formField'
                      {...getFieldProps('expMnt')}
                      autoComplete='off'
                    >
                      <option style={{ display: 'none' }}>Select Month</option>
                      {months.map((month, index) => (
                        <option key={month} value={index + 1}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Expiry Year */}
                <div className='expYear formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='expYear'>
                      <>{t('forms.expYear')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {touched['expYear'] && errors['expYear'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['expYear']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['expYear'] && errors['expYear']}>
                    <select
                      value={values.expYear}
                      className='expYear formField'
                      {...getFieldProps('expYear')}
                      autoComplete='off'
                    >
                      <option style={{ display: 'none' }}>Select Year</option>
                      {getYears().map(year => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Insurance Thumb */}
                <div className='insThumb formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='insThumb'>
                      <>{t('common.insuranceImage')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {touched['insThumb'] && errors['insThumb'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['insThumb']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  {!preview && (
                    <div className='formFieldWrap' data-isinvalid={touched['insThumb'] && errors['insThumb']}>
                      <div style={{ display: 'flex', placeItems: 'center', cursor: 'pointer'}} onClick={openFileDialog}>{t('forms.clickToUploadIns')}</div>
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
                             <p className='cancelUploadIconBlock'>X</p> 
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
                      <div className='formFieldWrap' data-isinvalid={touched['insThumb'] && errors['insThumb']}>
                      <div style={{ display: 'flex', placeItems: 'center', cursor: 'pointer'}} onClick={openFileDialog}>Click to upload insurance image</div>
                      <input
                        ref={fileInput}
                        type='file'
                        accept='image/jpeg,image/gif,image/png,application/pdf,image/x-eps'
                        onChange={handleImageChange}
                      />
                    </div>
                    )
                  )}
                </div> 

                <div className='cta'>
                  <button type='submit' className='dp-flex' disabled={!(isValid && dirty) || isSubmitting}>
                    {(isSubmitting && <ButtonLoader />) || `${t('buttons.update')}`}
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

export default EditTruckInsurance;