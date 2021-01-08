import React from 'react';
import { useEffect } from 'react';
import { useGlobalNavDispatch } from '../../contexts/GlobalNavContext';
import { useState } from 'react';
import { useFetch, getTRPool } from '../../APIs/Read';
import { useParams, useHistory } from 'react-router-dom';
import { useUserState } from '../../contexts/UserContext';
import ContentLoader from '../Loaders/ContentLoader';
import Error from '../Shared/Error';
import Block from '../General/Block';
import { getDash, capitalizeFirstLetter } from '../../_utils/fx';
import { useTranslation } from 'react-i18next';
import IncomingSidePane from '../Panes/IncomingSidePane';
import IncomingTimeline from '../Timeline/IncomingTimeline';
import TripStyle from '../../styles/TripStyle';
import AcceptModal from '../Modals/AcceptModal';
import Modal from '../Modals/Modal';
import { setTRInPosition, removeAllocationDriver } from '../../APIs/Update';
import Toast from '../Shared/Toast/Toast';
import { toastEnums } from '../../_utils/constants';
import DeleteModal from '../Modals/DeleteModal';
import InnerPageBackButton from '../Shared/InnerPageBackButton';

function IncomingTruck() {
  const { token, businessId, businessUnit } = useUserState();
  const { customerId, incomingTruckId } = useParams();
  const { push } = useHistory();
  const setGlobalNavDetails = useGlobalNavDispatch();
  const [truck, setTruck] = useState({});
  const endpoint =
    businessUnit !== 'admin'
      ? `/truck/truckRequestPool/${incomingTruckId}?businessId=${businessId}`
      : `/truck/truckRequestPool/${incomingTruckId}`;
  const { response, error, isLoading } = useFetch(endpoint, token);
  const [routeInfo, setRouteInfo] = useState([]);
  const [assetInfo, setAssetInfo] = useState([]);
  const [driverInfo, setDriverInfo] = useState([]);
  const [carrierInfo, setCarrierInfo] = useState();

  const [modal, setModal] = useState({
    showModal: false, // true or false
    modalType: undefined, // string: create, read, update, or delete,
    modalItemId: undefined, // Used in times of updating or deleting.
  });

  const [toast, setToast] = useState({
    showToast: false,
    toastType: undefined,
    toastMessage: undefined,
  });

  const { t } = useTranslation();

  useEffect(() => {
    if (truck) {
      setGlobalNavDetails({ navTitle: <>{t('incomingTrucks.incomingTruck')}</>, itemId: truck.regNumber });
    }
  }, [truck, setGlobalNavDetails, t]);

  function syncUp({ toastType, toastMessage }) {
    setModal({ showModal: false, modalType: undefined, modalItemId: undefined });
    setToast({
      showToast: true,
      toastType,
      toastMessage: toastMessage,
    });
  }

  function getModalToShow() {
    switch (modal.modalType) {
      case 'setToAccept':
        return <AcceptModal {...{ setModal, label: 'set To Accept', acceptAction: setPositioned }} />;
      case 'setToPositioned':
        return <AcceptModal {...{ setModal, label: 'set To Positioned', acceptAction: setPositioned }} />;
      case 'setToInPremise':
        return <AcceptModal {...{ setModal, label: 'set To in premise', acceptAction: setPositioned }} />;
      case 'removeAllocation':
        return <DeleteModal {...{ setModal, label: 'truck', deleteAction: removeDriver }} />;
      default:
        return null;
    }
  }

  async function removeDriver() {
    try {
      await removeAllocationDriver({ endpoint: `truck/${modal.modalItemId}/pullout`, token });
      syncUp({
        toastType: 'success',
        toastMessage: 'Truck pulled out',
      });
      push(`/${customerId}/incoming_trucks`);
    } catch ({ response }) {
      if (response) {
        const { message } = response.data;
        syncUp({
          toastType: 'failure',
          toastMessage: message,
        });
      } else {
        syncUp({
          toastType: toastEnums.FAILURE,
          toastMessage: 'Something went wrong. Try again.',
        });
      }
    }
  }

  async function setPositioned() {
    try {
      await setTRInPosition({
        endpoint: `/truck/${modal.modalItemId}/updatePoolStatus`,
        params: {
          status:
            (modal.modalType === 'setToInPremise' && 'In-premise') ||
            (modal.modalType === 'setToAccept' && 'Available') ||
            'Positioned',
        },
        token,
      });
      const res = await getTRPool({ endpoint: `/truck/truckRequestPool/${incomingTruckId}`, token });
      if (res) {
        const truck = res.data.data.truckRequestPool;
        localStorage.setItem('truck', JSON.stringify(truck));
        setTruck(truck);
      }
      syncUp({
        toastType: 'success',
        toastMessage: 'Status updated',
      });
    } catch ({ response }) {
      if (response) {
        const { message } = response.data;
        syncUp({
          toastType: 'failure',
          toastMessage: message,
        });
      } else {
        syncUp({
          toastType: toastEnums.FAILURE,
          toastMessage: 'Something went wrong. Try again.',
        });
      }
    }
  }

  useEffect(() => {
    if (response) {
      setTruck(response.truckRequestPool);
      const { asset, pickupStation, deliveryStation, requestType, carriage, driver } = response.truckRequestPool;

      if (asset) {
        setAssetInfo([
          {
            title: <>{t('orders.truckType')}</>,
            subtitle: `${asset.size} ${asset.unit} ${asset.name}` || getDash(),
          },
          { title: <>{t('orders.category')}</>, subtitle: requestType || getDash() },
        ]);
      }

      setRouteInfo([
        { title: <>{t('orders.pickupAddress')}</>, subtitle: (pickupStation && pickupStation.address) || getDash() },
        {
          title: <>{t('common.pickupState')}</>,
          subtitle: (pickupStation && capitalizeFirstLetter(pickupStation.state)) || getDash(),
        },
        {
          title: <>{t('orders.deliveryAddress')}</>,
          subtitle: (deliveryStation && deliveryStation.address) || getDash(),
        },
        {
          title: <>{t('common.deliveryState')}</>,
          subtitle: (deliveryStation && capitalizeFirstLetter(deliveryStation.state)) || getDash(),
        },
      ]);

      setCarrierInfo([
        { title: <>{t('incomingTruck.carrierName')}</>, subtitle: (carriage && carriage.name) || getDash() },
        { title: <>{t('incomingTruck.carrierMobile')}</>, subtitle: (carriage && carriage.phone) || getDash() },
      ]);

      setDriverInfo([
        { title: <>{t('trips.driverName')}</>, subtitle: (driver && driver.name) || getDash() },
        { title: <>{t('incomingTruck.driverMobile')}</>, subtitle: (driver && driver.mobile) || getDash() },
      ]);
    }
  }, [response, t]);

  if (isLoading) {
    return <ContentLoader />;
  }

  if (error) {
    return <Error {...{ error: error }} />;
  }
  return (
    <>
      <TripStyle id='tripInfoContentBlock'>
        <InnerPageBackButton action={() => push(`/${customerId}/incoming_trucks`)} />
        <IncomingTimeline {...{ truck }} />
        <div className='blocks'>
          <div className='blockStart'>
            <Block blockTitle={t('incomingTruck.assetInfo')} blockInfo={assetInfo} />
            <Block blockTitle={t('truckRequests.routeInfo')} blockInfo={routeInfo} />
          </div>

          <div className='blockEnd'>
            <Block blockTitle={t('incomingTruck.carrierInfo')} blockInfo={carrierInfo} />
            <Block blockTitle={t('incomingTruck.driverInfo')} blockInfo={driverInfo} />
          </div>
        </div>

        <IncomingSidePane {...{ truck, t, setModal }} />
      </TripStyle>
      <Modal {...{ modal, setModal }}>{getModalToShow()}</Modal>
      <Toast {...{ ...toast, setToast }} />
    </>
  );
}

export default IncomingTruck;
