import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { updateBusinessUnitName } from '../../APIs/Update';
import CloseSVGIcon from '../../assets/icons/close-modal.svg';
import { WarningSVGIcon } from '../../assets/icons/Icons';
import CreateNewRouteFormStyle from '../../styles/CreateNewRouteFormStyle';
import FormStyle from '../../styles/FormStyle';
import { toastEnums } from '../../_utils/constants';
import ButtonLoader from '../Loaders/ButtonLoader';

function EditBusinessUnitNameForm({ setModal, token, customerId, syncUp, businessUnit, businessUnitId }) {
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

  const { handleSubmit, handleChange, values, errors, touched, isSubmitting, isValid, dirty } = useFormik({
    initialValues: {
      name: businessUnit.name || '',
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Invalid value'),
    }),
    async onSubmit(values) {
      console.log(values);
      try {
        await updateBusinessUnitName({
          params: values,
          endpointParams: {
            token,
            customerId,
            businessUnitId,
          },
        });

        syncUp({
          toastType: toastEnums.SUCCESS,
          toastMessage: 'Business unit name updated',
        });
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
              <h2 className='formTitle'>
                <>{t('forms.editBusinessUnit')}</>
              </h2>
            </header>
            <div className='formContent'>
              <div className='fields'>
                {/* Business Unit name */}
                <div className='name formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='name'>
                      <>{t('forms.bizUnit')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {errors['name'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['name']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['name'] && errors['name']}>
                    <input
                      value={values.name}
                      onChange={handleChange}
                      className='name formField'
                      type='text'
                      name='name'
                    />
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
              </div>
            </div>
          </div>
        </form>
      </CreateNewRouteFormStyle>
    </FormStyle>
  );
}

export default EditBusinessUnitNameForm;
