import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import CancelIcon from '../../assets/icons/close_white.svg';
import { useGlobalNavDispatch } from '../../contexts/GlobalNavContext';
import StyledLoadTrucks from '../../styles/StyledLoadTrucks';
import { setGlobalNavBarDetails } from '../../_utils/fx';
import Toast from '../Shared/Toast/Toast';
import CargoDetail from './CargoDetail';
import CustomerRoutes from './CustomerRoutes';
import TruckSummary from './TruckSummary';
import LoadBusinessAccountInfo from './LoadBusinessAccountInfo';

function LoadTrucks({ page, truckRequestsQueryParams, setTruckRequestsQueryParams, statusParams, partnerId }) {
  const { goBack } = useHistory();
  const { t } = useTranslation();
  const setGlobalNavDetails = useGlobalNavDispatch();
  const [toast, setToast] = useState({
    showToast: false,
    toastType: undefined,
    toastMessage: undefined,
  });

  const {
    state: { step, params, type, truckRequestId, truckPool },
  } = useLocation();

  useEffect(() => {
    setGlobalNavBarDetails(
      { navTitle: <>{t('truckRequests.truckRequest')}</>, itemId: undefined },
      setGlobalNavDetails,
    );
  }, [setGlobalNavDetails, t]);

  function syncUp({ toastType, toastMessage }) {
    setToast({
      showToast: true,
      toastType,
      toastMessage: toastMessage,
    });
  }

  if (step === 'business_account') {
    return (
      <StyledLoadTrucks>
        <div id='cancelBlock'>
          <button type='button' className='cancel' onClick={() => goBack()}>
            <span className='buttonIcon'>
              <img src={CancelIcon} alt='go to orders page' />
            </span>
            <span className='buttonText'>Cancel</span>
          </button>
        </div>
        <div id='formsBlock'>
          <LoadBusinessAccountInfo
            {...{
              params,
              page,
              truckRequestsQueryParams,
              setTruckRequestsQueryParams,
              statusParams,
              type,
              truckRequestId,
              truckPool,
            }}
          />
        </div>
      </StyledLoadTrucks>
    );
  }
  if (step === 'customer_routes') {
    return (
      <StyledLoadTrucks>
        <div id='cancelBlock'>
          <button type='button' className='cancel' onClick={() => goBack()}>
            <span className='buttonIcon'>
              <img src={CancelIcon} alt='go to orders page' />
            </span>
            <span className='buttonText'>Cancel</span>
          </button>
        </div>
        <div id='formsBlock'>
          <CustomerRoutes
            {...{
              params,
              page,
              truckRequestsQueryParams,
              setTruckRequestsQueryParams,
              statusParams,
              type,
              truckRequestId,
              truckPool,
              partnerId
            }}
          />
        </div>
      </StyledLoadTrucks>
    );
  }

  if (step === 'cargo_detail') {
    return (
      <StyledLoadTrucks>
        <div id='cancelBlock'>
          <button type='button' className='cancel' onClick={() => goBack()}>
            <span className='buttonIcon'>
              <img src={CancelIcon} alt='go to orders page' />
            </span>
            <span className='buttonText'>Cancel</span>
          </button>
        </div>
        <div id='formsBlock'>
          <CargoDetail {...{ params, type, truckRequestId, truckPool }} />
        </div>
      </StyledLoadTrucks>
    );
  }

  return (
    <StyledLoadTrucks>
      <div id='cancelBlock'>
        <button type='button' className='cancel' onClick={() => goBack()}>
          <span className='buttonIcon'>
            <img src={CancelIcon} alt='go to orders page' />
          </span>
          <span className='buttonText'>Cancel</span>
        </button>
      </div>
      <div id='formsBlock'>
        <TruckSummary {...{ params: { ...params }, type, truckRequestId, truckPool, syncUp }} />
      </div>
      <Toast {...{ ...toast, setToast }} />
    </StyledLoadTrucks>
  );
}

export default LoadTrucks;
