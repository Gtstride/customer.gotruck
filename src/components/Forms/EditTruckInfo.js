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

function EditTruckInfo({
    truckProfile,
    token,
    setTruckProfile,
    syncUp,
 }) {
  const { t } = useTranslation();
  const [formError, setFormError] = useState({
    showFormError: false,
    formErrorMessage: undefined,
  });

  const { regNumber, make, model, _id } = truckProfile;

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
      regNumber,
      make,
      model
    },

    validationSchema: Yup.object().shape({
      regNumber: Yup.string().required(`${t('forms.required')}`),
      make: Yup.string().required(`${t('forms.required')}`),
      model: Yup.string().required(`${t('forms.required')}`),
    }),

    async onSubmit(values) {
      const params = {
        regNumber: values.regNumber,
        make: values.make,
        model: values.model,
      };
      const endpoint = `truck/${_id}`;
      try {
        await updateWithEndpointDataToken({ method: 'put', endpoint, params, token });
        truckProfile.regNumber = values.regNumber;
        truckProfile.make = values.make;
        truckProfile.model = values.model;

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
            <FormHeader {...{ formTitle: `${t('forms.editTruckInfo')}` }} />
            <div className='formContent'>
              <div className='fields'>
                {/* First name */}
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
                      value={values.regNumber}
                      className='regNumber formField'
                      type='text'
                      {...getFieldProps('regNumber')}
                      autoComplete='off'
                    />
                  </div>
                </div>
                {/* Last name */}
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
                    <input
                      value={values.make}
                      className='make formField'
                      type='text'
                      {...getFieldProps('make')}
                      autoComplete='off'
                    />
                  </div>
                </div>
                {/* model*/}
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
                    <input
                      value={values.model}
                      className='model formField'
                      {...getFieldProps('model')}
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

export default EditTruckInfo;
