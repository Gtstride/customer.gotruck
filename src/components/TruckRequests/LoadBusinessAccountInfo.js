import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
// import { useFetch } from '../../APIs/Read';
import { useUserState } from '../../contexts/UserContext';
import { baseurl, capitalizeFirstLetter, lang } from '../../_utils/fx';
import ButtonLoader from '../Loaders/ButtonLoader';
import ContentLoader from '../Loaders/ContentLoader';
import ArrowCircleRight from '../../assets/icons/arrow-btn-circle-right.svg';
import { WarningSVGIcon } from '../../assets/icons/Icons';
// import ArrowCircleLeft from '../../assets/icons/arrow-btn-circle-left.svg';
import { useHistory, useParams } from 'react-router-dom';

const Apptoken = process.env.REACT_APP_APPTOKEN;

const StyledBusinessAccountInfo = styled.div`
  background-color: white;
  box-shadow: 0px 2px 8px #00000022;
  width: 550px;
  padding: 20px;
  border-radius: 5px;
  > .error {
    font-size: 1.5em;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3em;
  }

  header {
    h1 {
      font-size: 20px;
    }
  }

  .bizUnits {
    max-height: 1000px;
    overflow-y: auto;

    .bizUnit {
      margin-top: 30px;
      border: 2px solid #e7efff;
      border-radius: 5px;
      display: flex;
      align-items: center;
      cursor: pointer;

      &.active,
      &:hover {
        border-color: #41b785;
      }

      > * {
        padding: 10px;
      }

      .checkPart {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
      }

      .check {
        height: 17px;
        width: 17px;
        border-radius: 50%;
        cursor: pointer;
      }

      .infoPart {
        flex: 6;
        position: relative;

        &::before {
          position: absolute;
          content: '';
          height: 80%;
          background-color: #dddbd7;
          width: 1px;
          left: -12px;
          transform: translateY(-50%);
          top: 50%;
        }
      }

      .infoPart > div {
        display: flex;
        font-size: 16px;
        margin: 15px 0;
        flex: 1;
        justify-content: space-between;
      }

      .title {
        color: #6f6f6f;
        margin-right: 10px;
      }
    }
  }

  .bizAccounts {
    display: flex;
    flex-direction: column;
    margin-top: 30px;

    .formFieldHeader {
      display: flex;
      justify-content: space-between;
      overflow: hidden;
      align-items: center;

      label {
        font-size: 14px;
        color: var(--form-label-color);
      }

      .errorMessageBlock {
        display: flex;
        .errorMessage {
          line-height: 14px;
          color: var(--warning-color);
          margin-left: 9px;
          font-size: 12px;
        }
      }
    }

    select {
      width: 100%;
      font-weight: 200;
      font-size: 16px;
      font-family: 'Avenir';
      background-color: transparent;
      padding: 8px 15px;
      margin: 16px 0;
      margin-top: 16px;
      border: var(--form-field-border);
      margin-top: 10px;
      border-radius: 5px;
      position: relative;
      height: 40px;
      -webkit-appearance: none;
    }

    .error {
      font-size: 14px;
      line-height: 1.5;
    }
  }
  .bizAccountLoader {
    font-size: 14px;
    margin-top: 30px;
    display: flex;

    > div {
      margin-right: 10px;
    }
  }
`;

function LoadBusinessAccountInfo({
  params,
  page,
  truckRequestsQueryParams,
  setTruckRequestsQueryParams,
  statusParams,
  type,
  truckRequestId,
  truckPool,
}) {
  const { t } = useTranslation();
  const { customerId: customerId2 } = useParams();
  const { customerId, token, role, accountId } = useUserState();
  const { push } = useHistory();

  const [koboBizUnits, setKoboBizUnits] = useState(null);
  const [bizUnitCheckedIndex, setBizUnitCheckedIndex] = useState();
  const [bizAccounts, setBizAccounts] = useState([]);
  const [bizAccountErrMsg, setBizAccountErrMsg] = useState('');
  const [bizAccountLoading, setBizAccountLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  //   const { response, error, isLoading } = useFetch(`/customer/${customerId}/business_unit`, token);

  useEffect(() => {
    if (customerId) {
      (async () => {
        setIsLoading(true);
        try {
          const res = await baseurl.get(`/customer/${customerId}/business_unit?language=${lang}`, {
            headers: { Authorization: `Bearer ${token}`, Apptoken },
          });

          setKoboBizUnits(res.data.data.KoboBusinessUnit);
          setIsLoading(false);
        } catch (error) {
          setError(true);
        }
      })();
    }
  }, [customerId, token]);

  useEffect(() => {
    async function getBizAccounts() {
      try {
        setBizAccountLoading(true);
        const res = await baseurl.get(
          `/customer/${customerId}/business/${koboBizUnits[bizUnitCheckedIndex].kobo_biz_unit_id}?language=${lang}`,
          {
            headers: { Authorization: `Bearer ${token}`, Apptoken },
          },
        );
        if (role.toLowerCase() === 'superadmin' || role.toLowerCase() === 'admin') {
          setBizAccounts(res.data.data.accounts);
          setBizAccountErrMsg(
            'Customer has no business accounts. Contact B.I team or your business head to create a business account for this customer.',
          );
        } else {
          if (koboBizUnits[bizUnitCheckedIndex].officers) {
            const valid = koboBizUnits[bizUnitCheckedIndex].officers.some(({ auth_id }) => auth_id === accountId);
            if (valid) {
              setBizAccounts(res.data.data.accounts);
              setBizAccountErrMsg(
                'Customer has no business accounts. Contact B.I team or your business head to create a business account for this customer.',
              );
            } else {
              setBizAccounts([]);
              setBizAccountErrMsg(
                'You have not been attached to this business account, and so you cannot create a trip for this account. Reach to your business head or Bi Team to add you to this account.',
              );
            }
          }
        }
        // checkValidity();
      } catch (error) {}
      setBizAccountLoading(false);
    }

    if (koboBizUnits) getBizAccounts();
  }, [accountId, bizUnitCheckedIndex, customerId, koboBizUnits, role, token]);

  const { handleSubmit, setFieldValue, isValid, errors, touched, values } = useFormik({
    initialValues: {
      customerAccountName: '',
    },
    validationSchema: Yup.object({
      customerAccountName: Yup.string().required('Required'),
    }),
    onSubmit(values) {
      push(`/${customerId2}/truck_requests/load_trucks`, {
        step: 'customer_routes',
        type,
        truckRequestId,
        truckPool,
        params: {
          ...params,
          customerAccountName: values.customerAccountName,
          customerAccountId: bizAccounts.find(
            unit => unit.name.toLowerCase() === values.customerAccountName.toLowerCase(),
          ).id,
          bnrsName: koboBizUnits[bizUnitCheckedIndex].biz_unit_name,
          bnrsId: koboBizUnits[bizUnitCheckedIndex].kobo_biz_unit_id,
        },
      });
    },
  });
  if (isLoading) {
    return <ContentLoader />;
  }

  return (
    <form id='businessAccountInfo' onSubmit={handleSubmit}>
      <div className='businessAccountInfo'>
        <StyledBusinessAccountInfo>
          {error ? (
            <div className='error'>No Kobo Business Unit Assigned to this customer ID</div>
          ) : (
            <>
              <header>
                <h1>
                  <>{t('truckRequests.bizAccountInfo')}</>
                </h1>
              </header>
              <div className='bizUnits'>
                {koboBizUnits.map((koboBizUnit, index) => {
                  return (
                    <div
                      className={`bizUnit ${(bizUnitCheckedIndex === index && 'active') || ''}`}
                      key={index}
                      onClick={() => setBizUnitCheckedIndex(index)}
                    >
                      <div className='checkPart'>
                        <div
                          className='check'
                          style={{ border: `${(bizUnitCheckedIndex !== index && '1px solid #95989A') || 'none'}` }}
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='17.98'
                            height='17.98'
                            viewBox='0 0 17.98 17.98'
                          >
                            <path
                              id='check-circle-1'
                              d='M8.99,0a8.99,8.99,0,1,0,8.99,8.99A8.99,8.99,0,0,0,8.99,0Zm5.189,6.143L9.051,13.1a.757.757,0,0,1-1.071.141L4.318,10.315a.749.749,0,1,1,.936-1.17l3.054,2.443,4.665-6.331a.749.749,0,1,1,1.206.886Z'
                              fill={`${(bizUnitCheckedIndex === index && '#36b37e') || 'none'}`}
                            />
                          </svg>
                        </div>
                      </div>
                      <div className='infoPart'>
                        <div className='bizName'>
                          <p className='title'>
                            <>{t('forms.bizName')}</>
                          </p>
                          <p className='subtitle'>{koboBizUnit.biz_unit_name}</p>
                        </div>
                        <div className='bizHead'>
                          <p className='title'>
                            <>{t('truckRequests.bizUnitHead')}</>
                          </p>
                          <p className='subtitle'>{`${koboBizUnit.first_name} ${koboBizUnit.last_name}`}</p>
                        </div>
                        <div className='bizHeadPhone'>
                          <p className='title'>
                            <>{t('truckRequests.bizUnitHeadPhone')}</>
                          </p>
                          <p className='subtitle'>{koboBizUnit.mobile}</p>
                        </div>
                        <div className='country'>
                          <p className='title'>
                            <>{t('businessProfile.country')}</>
                          </p>
                          <p className='subtitle'>{koboBizUnit.country}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {(bizAccountLoading && (
                <div className='bizAccountLoader'>
                  <ButtonLoader />
                  <p>Loading Business Accounts...</p>
                </div>
              )) || (
                <div className='bizAccounts'>
                  {(bizAccounts.length > 0 && (
                    <>
                      <header className='formFieldHeader'>
                        <label htmlFor='customerAccountName'>
                          <>{t('truckRequests.bizAccount')}</>
                        </label>
                        <div className='errorMessageBlock'>
                          {touched['customerAccountName'] && errors['customerAccountName'] && (
                            <>
                              <WarningSVGIcon />
                              <p className='errorMessage'>{errors['customerAccountName']}</p>
                            </>
                          )}
                        </div>
                      </header>
                      <select
                        name='customerAccountName'
                        id='customerAccountName'
                        onChange={e => setFieldValue('customerAccountName', String(e.target.value))}
                        value={values.customerAccountName}
                      >
                        <option value=''>--Select value--</option>
                        {bizAccounts.map(bizAccount => (
                          <option key={bizAccount.id}>{capitalizeFirstLetter(bizAccount.name)}</option>
                        ))}
                      </select>
                    </>
                  )) || <p className='error'>{bizAccountErrMsg}</p>}
                </div>
              )}{' '}
            </>
          )}
        </StyledBusinessAccountInfo>
        <div id='navButtonsBlock' style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {/* <button type='button' className='previous' onClick={() => console.log('Holla')}>
            <span className='buttonIcon'>
              <img src={ArrowCircleLeft} alt='previous step' />
            </span>
            <span className='buttonText'>
              <>{t('buttons.previous')}</>
            </span>
          </button> */}
          <button type='submit' className='next' disabled={error || !isValid}>
            <span className='buttonIcon'>
              <img src={ArrowCircleRight} alt='next step' />
            </span>
            <span className='buttonText'>
              <>{t('buttons.next')}</>
            </span>
          </button>
        </div>
      </div>
    </form>
  );
}

export default LoadBusinessAccountInfo;
