import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { WarningSVGIcon } from '../../assets/icons/Icons';
import CreateNewRouteFormStyle from '../../styles/CreateNewRouteFormStyle';
import FormStyle from '../../styles/FormStyle';
import ButtonLoader from '../Loaders/ButtonLoader';
import FormError from './components/FormError';
import FormHeader from './components/FormHeader';
import { updateWithEndpointDataToken } from '../../APIs/Update';

function EditDriverInfoForm({ firstName = '', lastName = '', phone = '', auth_id, token, setDriverProfile, syncUp }) {
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
      firstName,
      lastName,
      phone,
    },

    validationSchema: Yup.object().shape({
      firstName: Yup.string().required(`${t('forms.required')}`),
      lastName: Yup.string().required(`${t('forms.required')}`),
      phone: Yup.number().required(`${t('forms.required')}`),
    }),

    async onSubmit(values) {
      const params = {
        first_name: values.firstName,
        last_name: values.lastName,
        mobile: values.phone,
      };
      const endpoint = `user/${auth_id}/detail`;
      try {
        const res = await updateWithEndpointDataToken({ method: 'post', endpoint, params, token });
        setDriverProfile(res.data.data.user);
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
            <FormHeader {...{ formTitle: `${t('forms.editDriverInfo')}` }} />
            <div className='formContent'>
              <div className='fields'>
                {/* First name */}
                <div className='firstName formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='firstName'>
                      <>{t('forms.firstName')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {touched['firstName'] && errors['firstName'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['firstName']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['firstName'] && errors['firstName']}>
                    <input
                      value={values.firstName}
                      className='firstName formField'
                      type='text'
                      {...getFieldProps('firstName')}
                      autoComplete='off'
                    />
                  </div>
                </div>
                {/* Last name */}
                <div className='lastName formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='lastName'>
                      <>{t('forms.lastName')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {touched['lastName'] && errors['lastName'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['lastName']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['lastName'] && errors['lastName']}>
                    <input
                      value={values.lastName}
                      className='lastName formField'
                      type='text'
                      {...getFieldProps('lastName')}
                      autoComplete='off'
                    />
                  </div>
                </div>
                {/* Phone number */}
                <div className='phone formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='phone'>
                      <>{t('inputText.mobile')}</>
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
                    <input
                      value={values.phone}
                      className='phone formField'
                      type='number'
                      {...getFieldProps('phone')}
                      autoComplete='off'
                    />
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

export default EditDriverInfoForm;
