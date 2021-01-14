import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import getBusinessProfileEndpoints from '../../APIs/endpoints/business-profile';
import { updateCustomerProfile } from '../../APIs/Update';
import CloseSVGIcon from '../../assets/icons/close-modal.svg';
import { ArrowSVGIcon, WarningSVGIcon } from '../../assets/icons/Icons';
import CreateNewRouteFormStyle from '../../styles/CreateNewRouteFormStyle';
import FormStyle from '../../styles/FormStyle';
import { toastEnums } from '../../_utils/constants';
import { baseurl, capitalizeFirstLetter, uuid, lang } from '../../_utils/fx';
import ButtonLoader from '../Loaders/ButtonLoader';
import CardFrequencyLoader from '../Loaders/CardFrequencyLoader';
import { getAddress, getStatesByCode } from '../../APIs/Read';
import { DebounceInput } from 'react-debounce-input';
import AddressList from '../General/AddressList';

function EditBusinessProfileForm({
  endpointParams: { customerId, token },
  editBusinessProfileDetails,
  setModal,
  syncUp,
  setBusinessProfile,
  businessProfile,
}) {
  const { t } = useTranslation();
  const [formError] = useState({
    showFormError: false,
    formErrorMessage: undefined,
  });
  const [addresses, setAddresses] = useState([]);
  const [address, setAddress] = useState('');
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [isPopupLoading, setIsPopupLoading] = useState(false);
  const [popupActive, setIsPopupActive] = useState(false);

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

  const {
    handleSubmit,
    handleChange,
    errors,
    touched,
    getFieldProps,
    setFieldValue,
    isSubmitting,
    isValid,
    dirty,
    values,
  } = useFormik({
    initialValues: {
      businessName: editBusinessProfileDetails.businessName || '',
      country: editBusinessProfileDetails.country || '',
      location: editBusinessProfileDetails.address || '',
      reg_number: editBusinessProfileDetails.regNumber || '',
      tax_no: editBusinessProfileDetails.tax_no || '',
      tin: editBusinessProfileDetails.tin || '',
      kra_pin: editBusinessProfileDetails.kra_pin || '',
    },
    validationSchema: Yup.object().shape({
      businessName: Yup.string().required(`${t('forms.required')}`),
      country: Yup.string().required(`${t('forms.required')}`),
      location: Yup.string(),
      reg_number: Yup.string(),
      tax_no: Yup.string(),
      tin: Yup.string(),
      kra_pin: Yup.string(),
    }),
    async onSubmit(values) {
      // const code = countries.find(item => item.country.toLowerCase() === values.country.toLowerCase()).phoneCode;
      try {
        const { UPDATE } = getBusinessProfileEndpoints({ customerId });

        // const { mobile } = values;
        // values.mobile = phoneFormatter(mobile.toString(), code);
        const res = await updateCustomerProfile({
          endpoint: UPDATE.businessProfile,
          endpointParams: {
            params: values,
            country: values.country.toLowerCase(),
            token,
          },
        });
        setBusinessProfile({ ...businessProfile, ...values });
        if (res) {
          syncUp({
            toastType: toastEnums.SUCCESS,
            toastMessage: 'Customer profile successfully updated',
          });
        }
      } catch ({ response }) {
        if (response) {
          const { message } = response.data;
          syncUp({
            toastType: toastEnums.FAILURE,
            toastMessage: message,
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

  useEffect(() => {
    if (address && address.placeId) {
      setFieldValue('location', address.address);
      setIsPopupActive(false);
    }
  }, [address, setFieldValue, syncUp, token]);

  useEffect(() => {
    (async () => {
      if (values.country && countries.length) {
        // setIsPickupStatesLoading(true);
        const countryCode = countries.find(item => item.country.toLowerCase() === values.country.toLowerCase())
          .countryCode;
        const response = await getStatesByCode(countryCode, token);
        if (response) {
          setStates(response.data.data.states);
          // setIsPickupStatesLoading(false);
        }
      }
    })();
  }, [countries, token, values.country]);

  async function getAddresses(value, inputName) {
    const valueLength = value.length;

    if (valueLength === 0) {
      setIsPopupLoading(false);
      setIsPopupActive(false);
    }

    setIsPopupLoading(true);
    const res = await getAddress({ value, token });
    const predictions = res.data.data.autocomplete;
    setAddresses(predictions);
  }

  useEffect(() => {
    if (addresses.length > 0) {
      setIsPopupLoading(false);
      setIsPopupActive(true);
    } else {
      setIsPopupActive(false);
    }
  }, [addresses]);

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
                <>{t('forms.editBizProfile')}</>
              </h2>
            </header>
            <div className='formContent'>
              <div className='fields'>
                {/* Business name */}
                <div className='businessName formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='businessName'>
                      <>{t('forms.bizName')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {errors['businessName'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['businessName']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['businessName'] && errors['businessName']}>
                    <input
                      value={values.businessName}
                      onChange={handleChange}
                      className='businessName formField'
                      type='text'
                      name='businessName'
                    />
                  </div>
                </div>
                {/* Country */}
                <div className='extension formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='extension'>
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
                    <select
                      className='country formField'
                      value={values.country}
                      // onChange={handleChange}
                      {...getFieldProps('country')}
                      autoComplete='off'
                    >
                      <option defaultChecked>{t('forms.selectCountry')}</option>
                      {countries.length > 0 &&
                        countries.map(({ phoneCode, country }) => (
                          <option value={country} key={uuid()}>
                            {capitalizeFirstLetter(country)}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                {/* State */}
                <div className='state formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='state'>
                      <>{t('forms.state')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {touched['state'] && errors['state'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['state']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['state'] && errors['state']}>
                    <div className='selectContainer'>
                      <div className='select-arrow fa fa-chevron-down'>
                        <ArrowSVGIcon />
                      </div>
                      <select
                        onChange={e => setFieldValue('state', String(e.target.value))}
                        value={values.state}
                        className='state formField'
                        autoComplete='off'
                      >
                        <option defaultChecked>{t('forms.selectState')}</option>
                        {states &&
                          states.map(({ state, code }) => (
                            <option value={state} key={uuid()}>
                              {capitalizeFirstLetter(state)}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className='address formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='address'>
                      <>{t('forms.address')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {errors['location'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['location']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['location'] && errors['location']}>
                    <DebounceInput
                      value={values.location}
                      onChange={e => getAddresses(e.target.value, e.target.name)}
                      className='location formField'
                      type='text'
                      name='location'
                      minLength={0}
                      debounceTimeout={50}
                      autoComplete='off'
                    />
                    {popupActive && (
                      <div className='popup'>
                        <AddressList {...{ isPopupLoading, addresses, setAddress }} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Reg number */}
                <div className='reg_number formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='reg_number'>
                      <>{t('forms.regNumber')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {errors['reg_number'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['reg_number']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['reg_number'] && errors['reg_number']}>
                    <input
                      value={values.reg_number}
                      onChange={handleChange}
                      className='reg_number formField'
                      type='text'
                      name='reg_number'
                    />
                  </div>
                </div>
                {/* Tax Pin */}
                <div className='tax_no formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='tax_no'>
                      <>{t('forms.taxPin')}</>
                    </label>
                    <div className='errorMessageBlock'>
                      {errors['tax_no'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['tax_no']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['tax_no'] && errors['tax_no']}>
                    <input
                      value={values.tax_no}
                      onChange={handleChange}
                      className='tax_no formField'
                      type='text'
                      name='tax_no'
                    />
                  </div>
                </div>
                {/* Tin */}
                <div className='tin formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='tin'>
                      {/* <>{t('forms.tin')}</> */}
                      TIN
                    </label>
                    <div className='errorMessageBlock'>
                      {errors['tin'] && (
                        <>
                          <WarningSVGIcon />
                          <p className='errorMessage'>{errors['tin']}</p>
                        </>
                      )}
                    </div>
                  </header>
                  <div className='formFieldWrap' data-isinvalid={touched['tin'] && errors['tin']}>
                    <input
                      value={values.tin}
                      onChange={handleChange}
                      className='tin formField'
                      type='text'
                      name='tin'
                    />
                  </div>
                </div>
                {/* KRA pIN */}
                {editBusinessProfileDetails.country && editBusinessProfileDetails.country.toLowerCase() === 'kenya' && (
                  <div className='kra_pin formFieldBlock'>
                    <header className='formFieldHeader'>
                      <label htmlFor='kra_pin'>
                        <>{t('businessProfile.kraPin')}</>
                      </label>
                      <div className='errorMessageBlock'>
                        {errors['kra_pin'] && (
                          <>
                            <WarningSVGIcon />
                            <p className='errorMessage'>{errors['kra_pin']}</p>
                          </>
                        )}
                      </div>
                    </header>
                    <div className='formFieldWrap' data-isinvalid={touched['kra_pin'] && errors['kra_pin']}>
                      <input
                        value={values.kra_pin}
                        onChange={handleChange}
                        className='kra_pin formField'
                        type='text'
                        name='kra_pin'
                      />
                    </div>
                  </div>
                )}
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

export default EditBusinessProfileForm;
