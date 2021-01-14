import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
// import { DebounceInput } from 'react-debounce-input';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { createPolicyRequest } from '../../APIs/Create';
// import getRecipientEndpoints from '../../APIs/endpoints/recipients';
// import { getAddress, getLatLong } from '../../APIs/Read';
import CloseSVGIcon from '../../assets/icons/close-modal.svg';
import { WarningSVGIcon } from '../../assets/icons/Icons';
import CreateNewRouteFormStyle from '../../styles/CreateNewRouteFormStyle';
import FormStyle from '../../styles/FormStyle';
import { dataUrl } from '../../_utils/fx';
import { baseurl, insuranceUrl, fileSizeWithLimit, lang } from '../../_utils/fx';
import ButtonLoader from '../Loaders/ButtonLoader';
import FormError from './components/FormError';
import FormHeader from './components/FormHeader';
import Upload from '../Upload/Upload';
import { useUserState } from '../../contexts/UserContext';

function AddInsuranceForm({
  pageParams: { setModal, updateTableData, syncUp },
  endpointParams: { token, customerId },
}) {
  const { t } = useTranslation();
  const [formError, setFormError] = useState({
    showFormError: false,
    formErrorMessage: undefined,
  });
  const [countries, setCountries] = useState([]);
  const [insuranceTypes, setInsuranceTypes] = useState([]);
  const { country } = useUserState();

  const [companies, setCompanies] = useState([]);
  // const [toast, setToast] = useState({ showToast: false, toastType: undefined, toastMessage: undefined });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({ fileName: '', fileSize: '', policyContract: '' });

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
      } catch (error) {
        setLoading(!loading);
      }
    })();
    // eslint-disable-next-line
  }, [countries.length]);

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

  const { handleSubmit, values, errors, isValid, dirty, touched, isSubmitting, getFieldProps } = useFormik({
    initialValues: {
      insuranceType: '',
      policyNumber: '',
      companyKey: '',
      country: '',
    },

    validationSchema: Yup.object().shape({
      policyNumber: Yup.string().required(`${t('forms.required')}`),
      insuranceType: Yup.string().required(`${t('forms.required')}`),
      companyKey: Yup.string().required(`${t('forms.required')}`),
    }),

    onSubmit: values => {
      const params = {
        country: country,
        companyKey: values.companyKey,
        insuranceType: values.insuranceType,
        policyNumber: values.policyNumber,
        policyContract: uploadForm.policyContract,
        state: values.state,
      };
      createPolicyRequest({ params, customerId, token })
        .then(res => {
          syncUp({
            toastType: 'success',
            toastMessage: 'Policy Request Created!',
          });
        })
        .catch(err => {
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
        });
    },
  });

  // GET INSURANCE TYPES && GET COMPANIES
  useEffect(() => {
    insuranceUrl
      .get('/insurance/type?country=nigeria', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setInsuranceTypes(res.data.data.insuranceTypes);
      })
      .catch(e => {
        console.log('e country', e);
      });
    insuranceUrl
      .get('/insurance/company', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setCompanies(res.data.data.insuranceCompanies);
      })
      .catch(e => {
        console.log('e country', e);
      });
    // eslint-disable-next-line
  }, []);

  const handleImageUpload = event => {
    let reader = new FileReader();
    let file = event.target.files[0];
    reader.onloadend = () => {
      // setPreview(reader.result);
      postImage(file);
    };
    return reader.readAsDataURL(file);
  };

  function postImage(file) {
    const config = {
      headers: {
        'Content-Type': file.type,
        Authorization: `Bearer ${token}`,
      },
    };
    const data = new FormData();
    data.append('media', file);
    setUploading(true);
    dataUrl
      .post('/upload/policy', data, config)
      .then(res => {
        if (res && res.data.data && res.data.data.media) {
          setUploading(false);
          setUploadForm({
            ...uploadForm,
            fileName: file.name,
            fileSize: fileSizeWithLimit(file.size),
            policyContract: res.data.data.media.url,
            policyDocId: res.data.data.media.media_id,
          });
        }
      })
      .catch(error => {
        setUploading(false);
      });
  }

  return (
    <>
      <FormStyle id='formStyle'>
        <CreateNewRouteFormStyle id='createNewRouteFormStyle'>
          <form id='createNewRouteForm' noValidate onSubmit={handleSubmit}>
            <div className='formContentBlock'>
              {formError.showFormError && <FormError {...{ formErrorMessage: formError.formErrorMessage }} />}
              <FormHeader {...{ formTitle: `${t('forms.addInsurance')}` }} />
              <div className='formContent'>
                <div className='fields'>
                  {/* Full name */}
                  <div className='fullName formFieldBlock'>
                    <header className='formFieldHeader'>
                      <label htmlFor='CompanyKey'>
                        <>{t('forms.companyKey')}</>
                      </label>
                      <div className='errorMessageBlock'>
                        {touched['companyKey'] && errors['companyKey'] && (
                          <>
                            <WarningSVGIcon />
                            <p className='errorMessage'>{errors['companyKey']}</p>
                          </>
                        )}
                      </div>
                    </header>
                    <div className='formFieldWrap' data-isinvalid={touched['companyKey'] && errors['companyKey']}>
                      <select className='fullName formField' {...getFieldProps('companyKey')}>
                        <option value={'-1'}>Choose Company</option>
                        {companies && companies.length
                          ? companies.map((com, i) => {
                              return (
                                <option key={i} value={com.key}>
                                  {com.name}
                                </option>
                              );
                            })
                          : ''}
                      </select>
                    </div>
                  </div>

                  {/* insurance type */}
                  <div className='mobile formFieldBlock'>
                    <header className='formFieldHeader'>
                      <label htmlFor='insuranceType'>
                        <>{t('forms.insuranceType')}</>
                      </label>
                      <div className='errorMessageBlock'>
                        {touched['insuranceType'] && errors['insuranceType'] && (
                          <>
                            <WarningSVGIcon />
                            <p className='errorMessage'>{errors['insuranceType']}</p>
                          </>
                        )}
                      </div>
                    </header>
                    <div className='formFieldWrap' data-isinvalid={touched['insuranceType'] && errors['insuranceType']}>
                      <select
                        value={values.insuranceType}
                        className='fullName formField'
                        {...getFieldProps('insuranceType')}
                      >
                        <option value={'-1'}>Choose Insurance type</option>
                        {insuranceTypes && insuranceTypes.length
                          ? insuranceTypes.map((it, i) => {
                              return (
                                <option key={i} value={it.name}>
                                  {it.name}
                                </option>
                              );
                            })
                          : ''}
                      </select>
                    </div>
                  </div>

                  {/* policy number */}
                  <div className='mobile formFieldBlock'>
                    <header className='formFieldHeader'>
                      <label htmlFor='mobile'>
                        <>{t('forms.policyNumber')}</>
                      </label>
                      <div className='errorMessageBlock'>
                        {touched['policyNumber'] && errors['policyNumber'] && (
                          <>
                            <WarningSVGIcon />
                            <p className='errorMessage'>{errors['policyNumber']}</p>
                          </>
                        )}
                      </div>
                    </header>
                    <div className='formFieldWrap' data-isinvalid={touched['policyNumber'] && errors['policyNumber']}>
                      <input
                        value={values.policyNumber}
                        className='mobile formField'
                        type='text'
                        {...getFieldProps('policyNumber')}
                        autoComplete='off'
                      />
                    </div>
                  </div>
                  {/* policy contract */}
                  <div className='mobile formFieldBlock'>
                    <header className='formFieldHeader'>
                      <label htmlFor='policyContract'>
                        <>{t('forms.policyContract')}</>
                      </label>
                      <div className='errorMessageBlock'>
                        {touched['policyContract'] && errors['policyContract'] && (
                          <>
                            <WarningSVGIcon />
                            <p className='errorMessage'>{errors['policyContract']}</p>
                          </>
                        )}
                      </div>
                    </header>
                    {/* <div className='formFieldWrap' data-isinvalid={touched['policyContract'] && errors['policyContract']}> */}
                    <Upload
                      loading={uploading}
                      imgDescription={`${uploadForm.fileName} ${uploadForm.fileSize ? `(${uploadForm.fileSize})` : ''}`}
                      onChange={handleImageUpload}
                      label={'Click to Upload Policy Contract'}
                    />
                  </div>

                  <div className='cta'>
                    <button
                      type='submit'
                      className='dp-flex add_policy'
                      disabled={!(isValid && dirty && uploadForm.policyContract) || isSubmitting}
                    >
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
        {/* <Toast {...{ toast, setToast }} /> */}
      </FormStyle>
    </>
  );
}

export default AddInsuranceForm;
