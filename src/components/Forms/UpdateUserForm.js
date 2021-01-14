import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { updateUser } from '../../APIs/Update';
import { useTranslation } from 'react-i18next';

import CloseSVGIcon from '../../assets/icons/close-modal.svg';
import { ArrowSVGIcon, WarningSVGIcon } from '../../assets/icons/Icons';
import CreateNewRouteFormStyle from '../../styles/CreateNewRouteFormStyle';
import FormStyle from '../../styles/FormStyle';
import { toastEnums } from '../../_utils/constants';
import ButtonLoader from '../Loaders/ButtonLoader';
import getUsersEndpoints from '../../APIs/endpoints/users';
import { getUsers, useFetch } from '../../APIs/Read';
import { baseurl, capitalizeFirstLetter, uuid, phoneFormatter, lang } from '../../_utils/fx';
import CardFrequencyLoader from '../Loaders/CardFrequencyLoader';

function UpdateUserForm({ user, syncUp, setModal, updateTableData, endpointParams }) {
  const { t } = useTranslation();
  const { customerId, token } = endpointParams;

  const [formError, setFormError] = useState({
    showFormError: false,
    formErrorMessage: undefined,
  });

  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const { response } = useFetch(`/customer/${customerId}/sections`, token);

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

  const {
    handleSubmit,
    handleChange,
    values,
    // setFieldValue,
    errors,
    touched,
    isSubmitting,
    isValid,
    dirty,
  } = useFormik({
    initialValues: {
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      mobile: parseInt(user.mobile, 10) || '',
      department: user.departmentName || '',
      businessUnit: user.sectionName || '',
      country: user.country || '',
    },
    validationSchema: Yup.object().shape({
      first_name: Yup.string().required(`${t('forms.required')}`),
      last_name: Yup.string().required(`${t('forms.required')}`),
      email: Yup.string()
        .email(`${t('forms.invalid')}`)
        .required(`${t('forms.required')}`),
      mobile: Yup.string().required(`${t('forms.required')}`),
      department: Yup.string(),
      country: Yup.string().required(`${t('forms.required')}`),
    }),
    async onSubmit(values) {
      const { READ } = getUsersEndpoints({ customerId: endpointParams.customerId });
      const code = countries.find(item => item.country.toLowerCase() === values.country.toLowerCase()).phoneCode;

      try {
        const { mobile } = values;
        values.mobile = phoneFormatter(mobile.toString(), code);
        const putRes = await updateUser({ params: values, endpointParams });

        if (putRes) {
          const readRes = await getUsers({ endpoint: READ.users, token: endpointParams.token });
          const users = readRes.data.data.users;
          updateTableData({ tableData: users });

          if (readRes) {
            syncUp({
              toastType: 'success',
              toastMessage: 'User updated',
            });
          }
        }
      } catch ({ response }) {
        if (response) {
          // const { status: statusCode } = response;
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
              <h2 className='formTitle'>{t('forms.updateUser')}</h2>
            </header>
            <div className='formContent'>
              <div className='fields'>
                {/* First name */}
                <div className='first_name formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='first_name'>{t('forms.firstName')}</label>
                    <div className='errorMessageBlock'>
                      {errors['first_name'] && (
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
                      autoComplete='no'
                    />
                  </div>
                </div>
                {/* Last name */}
                <div className='last_name formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='last_name'>{t('forms.lastName')}</label>
                    <div className='errorMessageBlock'>
                      {errors['last_name'] && (
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
                      autoComplete='no'
                    />
                  </div>
                </div>
                {/* Email */}
                <div className='email formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='email'>{t('forms.email')}</label>
                    <div className='errorMessageBlock'>
                      {errors['email'] && (
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
                      autoComplete='no'
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

                {/* Business Unit */}
                <div className='country formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='businessUnit'>
                      <>{t('forms.businessUnit')}</>
                    </label>
                    {loading && <CardFrequencyLoader />}
                    <div className='errorMessageBlock'>
                      {touched['businessUnit'] && errors['businessUnit'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['businessUnit']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['businessUnit'] && errors['businessUnit']}>
                    <div className='selectContainer'>
                      <div className='select-arrow fa fa-chevron-down'>
                        <ArrowSVGIcon />
                      </div>
                      <select
                        value={values.businessUnit}
                        onChange={handleChange}
                        className='country formField'
                        name='businessUnit'
                        autoComplete='no'
                      >
                        <option defaultChecked>{t('forms.selectBusinessUnit')}</option>
                        {response &&
                          response.sections.length &&
                          response.sections.map(sect => (
                            <option value={sect.name} key={uuid()}>
                              {capitalizeFirstLetter(sect.name)}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
                {/* Mobile */}
                <div className='mobile formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='mobile'>
                      <>{t('forms.mobile')}</>
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
                    <input
                      value={values.mobile}
                      onChange={handleChange}
                      className='mobile formField'
                      type='number'
                      name='mobile'
                      autoComplete='no'
                    />
                  </div>
                </div>
                <div className='cta'>
                  <button type='submit' className='dp-flex' disabled={!(isValid && dirty) || isSubmitting}>
                    {(isSubmitting && <ButtonLoader />) || `${t('buttons.update')}`}
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

export default UpdateUserForm;
