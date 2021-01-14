import { ErrorMessage, Field, Form, Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { createBusinessUnit } from '../../APIs/Create';
import CloseSVGIcon from '../../assets/icons/close-modal.svg';
import { WarningSVGIcon } from '../../assets/icons/Icons';
import CreateNewRouteFormStyle from '../../styles/CreateNewRouteFormStyle';
import FormStyle from '../../styles/FormStyle';
import ButtonLoader from '../Loaders/ButtonLoader';
import { toastEnums } from '../../_utils/constants';

function CreateBusinessUnitForm({
  setModal,
  endpointParams: { customerId, token },
  syncUp,
  tableUpdateParams: { prependTableRow },
}) {
  const { t } = useTranslation();
  const initialValues = {
    businessUnit: '',
  };

  const validationSchema = () =>
    Yup.object().shape({
      businessUnit: Yup.string().required(`${t('forms.required')}`),
    });

  async function onSubmit(values) {
    try {
      const params = {
        name: values.businessUnit,
      };

      const postRes = await createBusinessUnit({
        params,
        endpointParams: {
          customerId,
          token,
        },
      });

      if (postRes) {
        prependTableRow({ data: postRes.data.data });

        syncUp({
          toastType: toastEnums.SUCCESS,
          toastMessage: 'Business unit added',
        });
      }
    } catch ({ response }) {
      if (response) {
        const { message: errorMessage } = response.data;
        syncUp({
          toastType: toastEnums.FAILURE,
          toastMessage: errorMessage,
        });
      } else {
        syncUp({
          toastType: toastEnums.FAILURE,
          toastMessage: 'Business unit not added',
        });
      }
    }
  }

  return (
    <FormStyle id='formStyle'>
      <CreateNewRouteFormStyle id='createNewRouteFormStyle'>
        <Formik {...{ initialValues, validationSchema, onSubmit }}>
          {({ errors, touched, isValid, dirty, isSubmitting }) => (
            <Form id='createNewRouteForm' noValidate className=''>
              <div className='formContentBlock'>
                <header className='formHeader'>
                  <h2 className='formTitle'>
                    <>{t('forms.addBusinessUnit')}</>
                  </h2>
                </header>
                
                <div className='formContent'>
                  <div className='fields'>
                    <div className='businessUnit formFieldBlock'>
                      <header className='formFieldHeader'>
                        <label htmlFor='businessUnit'>
                          <>{t('forms.bizUnit')}</>
                        </label>
                        <div className='errorMessageBlock'>
                          <ErrorMessage name='businessUnit'>
                            {errMsg => (
                              <>
                                <WarningSVGIcon />
                                <p className='errorMessage'>{errMsg}</p>
                              </>
                            )}
                          </ErrorMessage>
                        </div>
                      </header>
                      <div className='formFieldWrap' data-isinvalid={touched['businessUnit'] && errors['businessUnit']}>
                        <Field className='businessUnit formField' type='text' name='businessUnit' />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className='cta'>
                <button type='submit' className='dp-flex' disabled={!(isValid && dirty) || isSubmitting}>
                  {(isSubmitting && <ButtonLoader />) || <>{t('buttons.save')}</>}
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
            </Form>
          )}
        </Formik>
      </CreateNewRouteFormStyle>
    </FormStyle>
  );
}

export default CreateBusinessUnitForm;
