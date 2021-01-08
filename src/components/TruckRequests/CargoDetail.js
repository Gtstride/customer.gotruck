import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { useFetch } from '../../APIs/Read';
import ArrowCircleLeft from '../../assets/icons/arrow-btn-circle-left.svg';
import ArrowCircleRight from '../../assets/icons/arrow-btn-circle-right.svg';
import { WarningSVGIcon } from '../../assets/icons/Icons';
import { useUserState } from '../../contexts/UserContext';
import CreateNewRouteFormStyle from '../../styles/CreateNewRouteFormStyle';
import FormStyle from '../../styles/FormStyle';

function CargoDetail({ params, type, truckRequestId, truckPool }) {
  // console.log({ params });
  const { t } = useTranslation();
  const { token } = useUserState();
  const { push, goBack } = useHistory();
  const { customerId } = useParams();
  const { response } = useFetch('/category', token);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    if (response) {
      setCategories(response);
    }
  }, [response]);

  const { handleSubmit, handleChange, errors, touched, values, setFieldValue } = useFormik({
    initialValues: {
      category: '',
      subCategory: '',
      tonnage: '',
    },
    validationSchema: Yup.object().shape({
      category: Yup.string().required(`${t('forms.required')}`),
      subCategory: Yup.string().required(`${t('forms.required')}`),
      tonnage: Yup.string().required(`${t('forms.required')}`),
    }),
    async onSubmit(values) {
      push(`/${customerId}/truck_requests/load_trucks`, {
        step: 'default',
        type,
        truckRequestId,
        truckPool,
        params: {
          ...params,
          category: values.category,
          cargoTonnage: values.tonnage,
          goodType: values.subCategory,
        },
      });
    },
  });

  return (
    <FormStyle id='formStyle'>
      <CreateNewRouteFormStyle id='createNewRouteFormStyle'>
        <form id='createNewRouteForm' noValidate onSubmit={handleSubmit} style={{ width: 500 }}>
          <div className='formContentBlock'>
            <header className='formHeader' style={{ border: 0 }}>
              <h2 className='formTitle' style={{ margin: 0, textTransform: 'capitalize' }}>
                <>{t('orders.cargoDetail')}</>
              </h2>
            </header>
            <div className='formContent'>
              <div className='fields'>
                {/* Category */}
                <div className='category formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='category'>
                      <>{t('orders.category')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {errors['category'] && touched['category'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['category']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['category'] && errors['category']}>
                    <select
                      value={values.category}
                      name='category'
                      id='category'
                      onChange={e => {
                        setFieldValue('category', String(e.target.value));
                        const subCategories = categories.filter(category => {
                          return category.name === e.target.value;
                        })[0];
                        setSubCategories(subCategories.subcategory);
                      }}
                    >
                      <option value=''>--{t('inputText.enterCategory')}--</option>
                      {categories.map(({ _id, name }) => (
                        <option key={_id} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* SubCategory */}
                <div className='subCategory formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='subCategory'>
                      <>{t('orders.subCategory')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {errors['subCategory'] && touched['subCategory'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['subCategory']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['subCategory'] && errors['subCategory']}>
                    <select
                      value={values.subCategory}
                      name='subCategory'
                      id='subCategory'
                      onChange={e => {
                        setFieldValue('subCategory', String(e.target.value));
                      }}
                    >
                      <option value=''>--{t('inputText.enterSubCategory')}--</option>
                      {subCategories.map(({ _id, name }) => (
                        <option key={_id} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* Tonnage */}
                <div className='tonnage formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='tonnage'>
                      <>{t('trips.tonnage')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {errors['tonnage'] && touched['tonnage'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['tonnage']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['tonnage'] && errors['tonnage']}>
                    <input
                      value={values.tonnage}
                      onChange={handleChange}
                      className='tonnage formField'
                      type='number'
                      name='tonnage'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id='navButtonsBlock'>
            <button type='button' className='previous' onClick={() => goBack()}>
              <span className='buttonIcon'>
                <img src={ArrowCircleLeft} alt='previous step' />
              </span>
              <span className='buttonText'>
                <>{t('buttons.previous')}</>
              </span>
            </button>

            <button type='submit' className='next'>
              <span className='buttonIcon'>
                <img src={ArrowCircleRight} alt='next step' />
              </span>
              <span className='buttonText'>
                <>{t('buttons.next')}</>
              </span>
            </button>
          </div>
        </form>
      </CreateNewRouteFormStyle>
    </FormStyle>
  );
}

export default CargoDetail;
