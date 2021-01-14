import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { updateWithEndpointDataToken } from '../../APIs/Update';
import { WarningSVGIcon } from '../../assets/icons/Icons';
import CreateNewRouteFormStyle from '../../styles/CreateNewRouteFormStyle';
import FormStyle from '../../styles/FormStyle';
import ButtonLoader from '../Loaders/ButtonLoader';
import FormError from './components/FormError';
import FormHeader from './components/FormHeader';

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

function getYears() {
  const currentYear = new Date().getFullYear();
  const numberOfYears = 31;
  let years = new Array(numberOfYears).fill(currentYear);
  years = years.map((year, index) => year + index);
  return years;
}

function EditDriverDocsForm({
  driverId,
  token,
  setDriverProfile,
  syncUp,
  licenseNumber = '',
  expMonth = '',
  expYear = '',
}) {
  const { t } = useTranslation();
  const [formError, setFormError] = useState({
    showFormError: false,
    formErrorMessage: undefined,
  });

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
      licNumber: licenseNumber,
      expMonth,
      expYear,
    },

    validationSchema: Yup.object().shape({
      licNumber: Yup.string().required(`${t('forms.required')}`),
      expMonth: Yup.number().required(`${t('forms.required')}`),
      expYear: Yup.number().required(`${t('forms.required')}`),
    }),

    async onSubmit(values) {
      const params = {
        licenseExpMnt: Number(values.expMonth),
        licenseExpYear: Number(values.expYear),
        licenseNo: values.licNumber,
      };
      const endpoint = `driver/${driverId}/updateProfile`;
      try {
        const res = await updateWithEndpointDataToken({ method: 'put', endpoint, params, token });
        setDriverProfile(res.data.data.driver);
        syncUp({ toastType: 'success', toastMessage: 'Profile updated' });
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
            <FormHeader {...{ formTitle: `${t('forms.editDriverDocs')}` }} />
            <div className='formContent'>
              <div className='fields'>
                {/* License Number */}
                <div className='licNumber formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='licNumber'>
                      <>{t('forms.licNumber')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {touched['licNumber'] && errors['licNumber'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['licNumber']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['licNumber'] && errors['licNumber']}>
                    <input
                      value={values.licNumber}
                      className='licNumber formField'
                      type='text'
                      {...getFieldProps('licNumber')}
                      autoComplete='off'
                    />
                  </div>
                </div>

                {/* Expiry Month */}
                <div className='expMonth formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='expMonth'>
                      <>{t('forms.expMonth')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {touched['expMonth'] && errors['expMonth'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['expMonth']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['expMonth'] && errors['expMonth']}>
                    <select
                      value={values.expMonth}
                      className='expMonth formField'
                      {...getFieldProps('expMonth')}
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

export default EditDriverDocsForm;
