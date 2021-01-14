import { useFormik } from 'formik';
import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { updateUserProfile } from '../../APIs/Update';
import CloseSVGIcon from '../../assets/icons/close-modal.svg';
import { ArrowSVGIcon, WarningSVGIcon } from '../../assets/icons/Icons';
import CreateNewRouteFormStyle from '../../styles/CreateNewRouteFormStyle';
import FormStyle from '../../styles/FormStyle';
import { capitalizeFirstLetter, uuid, baseurl, phoneFormatter, lang } from '../../_utils/fx';
import { useTranslation } from 'react-i18next';
import ButtonLoader from '../Loaders/ButtonLoader';
import CardFrequencyLoader from '../Loaders/CardFrequencyLoader';
import SupportCard from '../Shared/SupportCard/SupportCard';

function UpdateUserProfileForm({ setModal, userDetail, userId, syncUp, token, updateProfileData }) {
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
      }, 3000);
    }
  }, [formError.showFormError]);
  const { values, handleChange, handleSubmit, isSubmitting, isValid, errors, touched, dirty } = useFormik({
    initialValues: {
      ...userDetail,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required(`${t('forms.required')}`),
      first_name: Yup.string().required(`${t('forms.required')}`),
      last_name: Yup.string().required(`${t('forms.required')}`),
      mobile: Yup.string().required(`${t('forms.required')}`),
      country: Yup.string().required(`${t('forms.required')}`),
    }),

    async onSubmit(values) {
      const code = countries.find(item => item.country.toLowerCase() === values.country.toLowerCase()).phoneCode;
      const { mobile } = values;
      values.mobile = phoneFormatter(mobile.toString(), code);

      //invalidate user varification status
      if (values.email || values.mobile) {
      values.mobile_verified = 0;
      values.email_verified = 0;
      }
      
      try {
        const res = await updateUserProfile({
          endpoint: `/user/${userId}/detail`,
          endpointParams: {
            params: values,
            token,
          },
        });
        updateProfileData({ updatedUserDetail: res.data.data.user });
        if (res) {
          syncUp({
            toastType: 'success',
            toastMessage: 'profile successfully updated',
          });
        }
      } catch ({ response }) {
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
    },
  });

  return (
    <FormStyle id='formStyle'>
      <CreateNewRouteFormStyle id='createNewRouteFormStyle'>
        <form id='createNewRouteForm' noValidate onSubmit={handleSubmit}>
          <div className='formContentBlock'>
            <SupportCard heading={'Contact Support'} />

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
                <>{t('forms.editUserProfile')}</>
              </h2>
            </header>
            <div className='formContent'>
              <div className='fields'>
                {/* First name */}
                <div className='first_name formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='first_name'>
                      <>{t('forms.firstName')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {errors['first_name'] && touched['first_name'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['first_name']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['first_name'] && errors['first_name']}>
                    <input
                      value={values.first_name}
                      onChange={handleChange}
                      className='first_name formField'
                      type='text'
                      name='first_name'
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
                      {errors['last_name'] && touched['last_name'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['last_name']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['last_name'] && errors['last_name']}>
                    <input
                      value={values.last_name}
                      onChange={handleChange}
                      className='last_name formField'
                      type='text'
                      name='last_name'
                    />
                  </div>
                </div>
                {/* Email */}
                <div className='email formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='email'>
                      <>{t('forms.email')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {errors['email'] && touched['email'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['email']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['email'] && errors['email']}>
                    <input
                      value={values.email}
                      onChange={handleChange}
                      className='email formField'
                      type='text'
                      name='email'
                    />
                  </div>
                </div>
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
                        autoComplete='off'
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
                {/* Mobile */}
                <div className='businessName formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='businessName'>
                      <>{t('forms.phoneNumber')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {errors['mobile'] && touched['mobile'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['mobile']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['mobile'] && errors['mobile']}>
                    <input
                      value={values.mobile}
                      onChange={handleChange}
                      className='mobile formField'
                      type='text'
                      name='mobile'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='cta'>
            <button type='submit' className='dp-flex' disabled={!(isValid && dirty) || isSubmitting}>
              {(isSubmitting && <ButtonLoader />) || `${t('buttons.save')}`}
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

export default UpdateUserProfileForm;
