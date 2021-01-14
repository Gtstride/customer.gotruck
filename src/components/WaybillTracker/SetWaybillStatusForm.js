import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Close from '../../assets/icons/closes.svg';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { WarningSVGIcon } from '../../assets/icons/Icons';
import ButtonLoader from '../Loaders/ButtonLoader';
import FormStyle from '../../styles/FormStyle';
import moment from 'moment';
import { SingleDatePicker } from 'react-dates';
import { updateWaybillTrackerStatus } from '../../APIs/Update';

const StyledWaybillStatusForm = styled.div`
  width: 500px;

  .consentHeader {
    display: flex;
    justify-content: space-between;
  }

  .consentModalContent {
    max-width: 500px;
    max-height: 600px;
  }

  .consentMessageBlock {
    height: 570px;
    overflow: auto;
  }

  .consentMessageActions {
    justify-content: center;

    button {
      background-color: #36b37e !important;
      margin: 0;
    }
  }

  .comment .formFieldWrap {
    height: 70px;
  }

  .waybillTable {
    width: 100%;
    max-width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }

  .waybills {
    .formFieldWrap {
      box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1) !important;
      height: unset;
    }

    th {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #c6c6c6;
    }

    tbody tr:nth-child(even) {
      background-color: #f5f5f5;
    }

    .tableTitle,
    .tableItem > p {
      font-size: 16px;
    }

    .tableItem > p {
      padding: 10px;
    }
  }

  input,
  textarea {
    background-color: #f7fafc !important;
  }

  .waybillStatusForm {
    .DateInput_input,
    .DateInput,
    .DateInput .DateInput_1 {
      width: 100% !important;

      input {
        width: 100% !important;
      }
    }
  }
`;

function SetWaybillStatusForm({ setModal, checkedWaybills, token, syncUp }) {
  const { t } = useTranslation();
  const [focusedInput, setFocusedInput] = useState(false);
  const [date, setDate] = useState(false);
  const [formError, setFormError] = useState({
    showFormError: false,
    formErrorMessage: undefined,
  });

  const { setFieldValue, getFieldProps, isValid, dirty, isSubmitting, handleSubmit, touched, errors } = useFormik({
    initialValues: {
      code: '',
      comment: '',
      recName: '',
      recNo: '',
      date: '',
    },
    validationSchema: Yup.object({
      code: Yup.string().required(`${t('forms.required')}`),
      date: Yup.string().required(`${t('forms.required')}`),
      comment: Yup.string().required(`${t('forms.required')}`),
      recName: Yup.string().required(`${t('forms.required')}`),
      recNo: Yup.string().required(`${t('forms.required')}`),
    }),
    async onSubmit(values) {
      try {
        const waybill = checkedWaybills.map(waybill => {
          return {
            tripId: waybill._tripId,
            dropOffId: waybill.validWaybill._id,
            tripReadId: waybill.tripId,
            waybillNumber: waybill.validWaybill.waybillNumber,
            comment: values.comment,
            trackingCode: waybill.waybHist.trackingCode,
            // status: waybill.validWaybill.waybillStatus,
            status: 'Received at Customer Office',
            dateReceived: new Date(values.date).toISOString(),
            fieldOfficerName: values.recName,
            fieldOfficerNumber: values.recNo,
          };
        });

        const res = await updateWaybillTrackerStatus({
          endpoint: '/trip/waybill/bulk/status',
          params: { waybill },
          token,
        });

        if (res) {
          syncUp({
            toastType: 'success',
            toastMessage: 'Status updated',
          });
        }
        window.location.reload();
      } catch ({ response }) {
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
      }
    },
  });

  function onDateChange(date) {
    setDate(moment(date));
    setFieldValue('date', moment(date).format('LL'));
  }

  return (
    <StyledWaybillStatusForm>
      <FormStyle>
        <form noValidate onSubmit={handleSubmit} className='waybillStatusForm'>
          <div className='consentModalContent'>
            {formError.showFormError && (
              <div className='formErrorBlock'>
                <div className='formErrorIconBlock'>
                  <WarningSVGIcon />
                </div>
                <p className='formErrorMessage'>{formError.formErrorMessage}</p>
              </div>
            )}
            <header className='consentHeader'>
              <p className='consentHeading'>
                <>{t('waybillTracker.setStat')}</>"<>{t('waybillTracker.recByCus')}</>"
              </p>
              <button
                type='button'
                onClick={() =>
                  setModal({
                    modalItemId: undefined,
                    showModal: false,
                    modalType: undefined,
                  })
                }
              >
                <img src={Close} alt='close modal' />
              </button>
            </header>
            <div className='consentMessageBlock'>
              <div className='currencyBlock formFieldBlock'>
                <header className='formFieldHeader'>
                  <label htmlFor='documentNumber'>
                    <>{t('forms.dateRec')}</>
                  </label>
                  <div className='errorMessageBlock'>
                    {touched['date'] && errors['date'] && (
                      <>
                        <WarningSVGIcon />
                        <p className='errorMessage'>{errors['date']}</p>
                      </>
                    )}
                  </div>
                </header>
                <div className='formFieldWrap'>
                  <SingleDatePicker
                    date={date}
                    onDateChange={date => onDateChange(date)}
                    focused={focusedInput}
                    placeholder={t('tableHeaders.date')}
                    onFocusChange={({ focused }) => setFocusedInput(focused)} // PropTypes.func.isRequired
                    id='single' // PropTypes.string.isRequired,
                    isRTL={localStorage.i18nextLng === 'ar'}
                    isOutsideRange={() => false}
                  />
                </div>
              </div>
              <div className='recName formFieldBlock'>
                <header className='formFieldHeader'>
                  <label htmlFor='recName'>
                    <>{t('waybillTracker.recName')}</>
                  </label>
                  <div className='errorMessageBlock'>
                    {touched['recName'] && errors['recName'] && (
                      <>
                        <WarningSVGIcon />
                        <p className='errorMessage'>{errors['recName']}</p>
                      </>
                    )}
                  </div>
                </header>
                <div className='formFieldWrap' data-isinvalid={touched['recName'] && errors['recName']}>
                  <input type='text' {...getFieldProps('recName')} />
                </div>
              </div>
              <div className='recNo formFieldBlock'>
                <header className='formFieldHeader'>
                  <label htmlFor='recNo'>
                    <>{t('waybillTracker.recNo')}</>
                  </label>
                  <div className='errorMessageBlock'>
                    {touched['recNo'] && errors['recNo'] && (
                      <>
                        <WarningSVGIcon />
                        <p className='errorMessage'>{errors['recNo']}</p>
                      </>
                    )}
                  </div>
                </header>
                <div className='formFieldWrap' data-isinvalid={touched['recNo'] && errors['recNo']}>
                  <input type='text' {...getFieldProps('recNo')} />
                </div>
              </div>
              <div className='code formFieldBlock'>
                <header className='formFieldHeader'>
                  <label htmlFor='code'>
                    <>{t('forms.trackingCode')}</>
                  </label>
                  <div className='errorMessageBlock'>
                    {touched['code'] && errors['code'] && (
                      <>
                        <WarningSVGIcon />
                        <p className='errorMessage'>{errors['code']}</p>
                      </>
                    )}
                  </div>
                </header>
                <div className='formFieldWrap' data-isinvalid={touched['code'] && errors['code']}>
                  <input type='text' {...getFieldProps('code')} />
                </div>
              </div>
              <div className='comment formFieldBlock'>
                <header className='formFieldHeader'>
                  <label htmlFor='comment'>
                    <>{t('trips.comment')}</>
                  </label>
                  <div className='errorMessageBlock'>
                    {touched['comment'] && errors['comment'] && (
                      <>
                        <WarningSVGIcon />
                        <p className='errorMessage'>{errors['comment']}</p>
                      </>
                    )}
                  </div>
                </header>
                <div className='formFieldWrap' data-isinvalid={touched['comment'] && errors['comment']}>
                  <textarea {...getFieldProps('comment')} rows={4} cols={50} style={{ resize: 'none' }}></textarea>
                </div>
              </div>
              <div className='waybills formFieldBlock'>
                <header className='formFieldHeader'>
                  <label htmlFor='waybills'>
                    <>{t('waybillTracker.tripWtoUpdate')}</>
                  </label>
                </header>
                <div className='formFieldWrap'>
                  <table className='waybillTable'>
                    <thead>
                      <tr>
                        <th>
                          <span className='tableTitle'>
                            <>{t('waybillTracker.tripId')}</>
                          </span>
                        </th>
                        <th>
                          <span className='tableTitle'>
                            <>{t('waybillTracker.waybillNo')}</>
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {checkedWaybills.map(waybill => (
                        <tr>
                          <td>
                            <div className='tableItem'>
                              <p>{waybill.tripId}</p>
                            </div>
                          </td>
                          <td>
                            <div className='tableItem'>
                              <p>{waybill.validWaybill.waybillNumber}</p>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className='consentMessageActions'>
              <button type='submit' disabled={!(isValid && dirty) || isSubmitting} style={{ width: 'unset' }}>
                {(isSubmitting && <ButtonLoader />) || <>{t('forms.updateStatus')}</>}
              </button>
            </div>
          </div>
        </form>
      </FormStyle>
    </StyledWaybillStatusForm>
  );
}

export default SetWaybillStatusForm;
