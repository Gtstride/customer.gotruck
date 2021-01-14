import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getCustomerPolicies } from '../../APIs/Read';
import { useGlobalNavDispatch } from '../../contexts/GlobalNavContext';
import { useUserState } from '../../contexts/UserContext';
import { addCommas, formatNumber, getDash, setGlobalNavBarDetails } from '../../_utils/fx';
import PageContent from '../PageContent';
import Toast from '../Shared/Toast/Toast';
import Table from '../Shared/Table/Table';
import Button from '../Shared/Button/Button';
import Prompt from '../Shared/Prompt/Prompt';
import { togglePolicy, setDefaultPolicy } from '../../APIs/Update';
import moment from 'moment';

function Policy() {
  // #region Contexts
  const setGlobalNavDetails = useGlobalNavDispatch();
  const { customerId, token } = useUserState();
  // #endregion
  const { t } = useTranslation();

const [toast, setToast] = useState({ showToast: false, toastType: undefined, toastMessage: undefined });
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [defaultPrompt, setDefaultPrompt] = useState(false);
  const [deactivatePrompt, setDeactivatePrompt] = useState(false);
  const [policy, setPolicy] = useState(null);

  useEffect(() => {
    getPolicies();
  // eslint-disable-next-line
}, [customerId, token]);

const getPolicies = () => {
  setLoading(true);
  getCustomerPolicies(customerId, token)

      .then(res => {

        console.log('res', res);

        setLoading(false);

        setPolicies(res && res.data && res.data.data ? res.data.data : []);

      })

      .catch(e => {

        setLoading(false);

        console.log('err', e);

      });

  };

  const onSetDefault = () => {
    setLoading(true);
    setDefaultPolicy({ id: policy._id, customer: customerId, token })
      .then(() => {
        setLoading(false);
        setDefaultPrompt(!defaultPrompt);
        syncUp({
          toastType: 'success',
          toastMessage: `New Default Policy Set!`,
        });
        getPolicies();
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onTogglePolicy = () => {
    setLoading(true);
    togglePolicy({ id: policy._id, token })
      .then(() => {
        setLoading(false);
        setDeactivatePrompt(!deactivatePrompt);
        syncUp({
          toastType: 'success',
          toastMessage: `policy ${policy.status === 'ACTIVE' ? 'deactivated' : 'activated'}`,
        });
        getPolicies();
      })
      .catch(() => {
        setLoading(false);
      });
  };

  // #region Effects

  useEffect(() => {

    setGlobalNavBarDetails({ navTitle: <>{'Insurance'}</>, itemId: undefined }, setGlobalNavDetails);

  }, [customerId, setGlobalNavDetails, t, token]);

  function syncUp({ toastType, toastMessage }) {
    setToast({

      showToast: true,

      toastType,

      toastMessage: toastMessage,

    });
  }

  // #endregion

  const Headings = [
    {
      key: 'policyNum',
      title: `${t('tableHeaders.policyNum')}`,
    },
    {
      key: 'policyValue',
      title: `${t('tableHeaders.policyValue')}`,
      formatter: data => {
        return (
          <div className='min-width-100'>
            {data && data.policyValue ? `${formatNumber({ amount: data.policyValue })}` : getDash()}
          </div>
        );
      },
    },
    {
      key: '',
      title: `${t('tableHeaders.maxTrips')}`,
      formatter: data => {
        return (data && data.maxTrips && addCommas(data.maxTrips)) || getDash();
      },
    },
    {
      key: 'country',
      title: `${t('tableHeaders.country')}`,
      formatter: data => {
        return (data && data.country) || getDash();
      },
    },
    {
      key: 'insuranceType',
      title: `${t('tableHeaders.insuranceType')}`,
      formatter: data => {
        return (data && data.insuranceType) || getDash();
      },
    },
    {
      key: 'coverPeriod',
      title: `${t('tableHeaders.coverPeriod')}`,
      formatter: data => {
        return (
          <div className='min-width-120'>
            <strong className='font-bold'>
              {(data && data.startDate && moment(data.startDate).format('ll')) || getDash()}
            </strong>
            <div className='font-bold'>
              <strong className='font-bold'>
                to &nbsp; {(data && data.expiryDate && moment(data.expiryDate).format('ll')) || getDash()}
              </strong>
            </div>
          </div>
        );
      },
    },
    {
      key: '',
      title: `${t('tableHeaders.policyContract')}`,
      formatter: data => {
        return (
          (
            <a className='text-blue' href={data.policyContract} target='_blank' rel='noopener noreferrer'>
              View Document
            </a>
          ) || getDash()
        );
      },
    },
    {
      key: 'status',
      title: `${t('tableHeaders.status')}`,
      formatter: data => {
        return (
          <div className='d-flex align-center '>
            <div
              className={`customer__analytics__label mr-0-5  ${
                (data && data.status === 'INACTIVE') || (data && data.status === 'REJECTED')
                  ? 'label__red'
                  : data && data.status === 'ACTIVE' && data.isDefault
                  ? 'label__blue'
                  : data && data.status && !data.isDefault
                  ? 'label__green'
                  : ''
              }`}
            >
              {data && data.status && data.status === 'ACTIVE' && data.isDefault
                ? 'DEFAULT'
                : data && data.status === 'ACTIVE' && !data.isDefault
                ? 'ACTIVE'
                : 'INACTIVE'}
            </div>
          </div>
        );
      },
    },
    {
      key: '',
      title: `${t('tableHeaders.default')}`,
      formatter: data => {
        return data.isDefault ? (
          ''
        ) : (
          <Button
            type='button'
            onClick={e => {
              setDefaultPrompt(!defaultPrompt);
              setPolicy(data);
            }}
            className='button--sm ml-0 button--green'
            title='Set Default'
          />
        );
      },
    },
    {
      key: '',
      title: `${t('tableHeaders.activate')}`,
      formatter: data => {
        return data.status === 'ACTIVE' ? (
          <Button
            type='button'
            onClick={e => {
              setPolicy(data);
              setDeactivatePrompt(!deactivatePrompt);
            }}
            className='button--sm ml-0 button--red'
            title='Deactivate'
          />
        ) : (
          <Button
            type='button'
            onClick={e => {
              setPolicy(data);
              setDeactivatePrompt(!deactivatePrompt);
            }}
            className='button--sm ml-0 button--blue'
            title='Activate'
          />
        );
      },
    },
  ];

  return (

    <PageContent>

      <header className='pageHeader'>
        <></>
      </header>

      <div className='pageContent'>
        <Table loading={loading} headings={Headings} data={policies} />
      </div>
      {defaultPrompt ? (
        <Prompt
          loading={loading}
          onNullClick={e => e.stopPropagation()}
          heading='Default Policy'
          onYes={onSetDefault}
          onNo={e => setDefaultPrompt(!defaultPrompt)}
          description='Are you sure you want to set to default ?'
          onClosePrompt={e => setDefaultPrompt(!defaultPrompt)}
        />
      ) : (
        ''
      )}
      {deactivatePrompt ? (
        <Prompt
          loading={loading}
          onNullClick={e => e.stopPropagation()}
          heading={`${policy && policy.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}`}
          onYes={onTogglePolicy}
          onNo={e => setDeactivatePrompt(!deactivatePrompt)}
          description={`Are you sure you want to ${
            policy && policy.status === 'ACTIVE' ? 'deactivate' : 'activate'
          } this policy ?`}
          onClosePrompt={e => setDeactivatePrompt(!deactivatePrompt)}
        />
      ) : (
        ''
      )}
      <Toast {...{ ...toast, setToast }} />

    </PageContent>

  );

  // #endregion

}


export default Policy;
