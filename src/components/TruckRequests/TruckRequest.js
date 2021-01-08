import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { cancelTruckRequest } from '../../APIs/Delete';
import { getTRPool, getTruckRequest, useFetch } from '../../APIs/Read';
import { confirmTsAllocation, removeAllocationDriver, setTRInPosition } from '../../APIs/Update';
import binBtn from '../../assets/icons/bin.svg';
import check from '../../assets/icons/check-circle.svg';
import { useGlobalNavDispatch } from '../../contexts/GlobalNavContext';
import { useUserState } from '../../contexts/UserContext';
import AllocatedTransportersStyle from '../../styles/AllocatedTransportersStyle';
import OrderStyle from '../../styles/OrderStyle';
import { toastEnums } from '../../_utils/constants';
import { getDash, getParams, isArrayEmpty, setGlobalNavBarDetails } from '../../_utils/fx';
import EmptyTable from '../EmptyData/EmptyTable';
import AdjustAllocationForm from '../Forms/AdjustAllocationForm';
import AssignTruckForm from '../Forms/AssignTruckForm';
import AssignTruckRequestToTransporterForm from '../Forms/AssignTruckRequestToTransporterForm';
import EditTruckRequestForm from '../Forms/EditTruckRequestForm';
import Block from '../General/Block';
import ContentLoader from '../Loaders/ContentLoader';
import AcceptModal from '../Modals/AcceptModal';
import DeleteModal from '../Modals/DeleteModal';
import Modal from '../Modals/Modal';
import WaybillModal from '../Modals/WaybillModal';
import Error from '../Shared/Error';
import InnerPageBackButton from '../Shared/InnerPageBackButton';
import Toast from '../Shared/Toast/Toast';
import TruckRequestSidePane from './TruckRequestSidePane';
import { createTruckRequest } from '../../APIs/Create';

function TruckRequest() {
  const { t } = useTranslation();
  const { customerId, truckRequestId } = useParams();
  const { token, adminId } = useUserState();
  const { type } = getParams(window.location.search);
  const { pathname } = useLocation();
  const clone = pathname.includes('clone_truck_request');
  const edit = pathname.includes('edit_truck_request');
  const setGlobalNavDetails = useGlobalNavDispatch();
  const {
    response: truckRequestsFetchRes,
    error: truckRequestsFetchError,
    isLoading: truckRequestsFetchIsLoading,
  } = useFetch(type === 'bulk' ? `/request/bulktruck/${truckRequestId}` : `/request/truck/${truckRequestId}`, token);
  const { response, isLoading } = useFetch(
    type === 'bulk' ? `request/truck?requestType=bulk&bulkId=${truckRequestId}` : '',
    token,
  );
  const [truckRequest, setTruckRequest] = useState([]);
  const [request, setRequest] = useState([]);
  const [customerInfo, setCustomerInfo] = useState([]);
  const [routeInfo, setRouteInfo] = useState([]);
  const [expiryDateTime, setExpiryDateTime] = useState([]);
  const [truckTypes, setTruckTypes] = useState([]);
  const [otherInfo, setOtherInfo] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [waybillClass, setwaybillClass] = useState('');
  const [urls, seturls] = useState([]);
  const [containerInfo, setContainerInfo] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const [transporter, setTransporter] = useState([]);
  const [allocationInfo, setAllocationInfo] = useState([]);
  const [partners, setPartners] = useState([]);
  const { push, goBack } = useHistory();
  // eslint-disable-next-line no-unused-vars
  const { response: res, error: err, isLoading: pending } = useFetch(
    `/truck/truckRequestPool?truckRequestId=${truckRequestId}&all=true`,
    token,
  );
  const [allocTransDetails, setAllocTransDetails] = useState([]);
  const [isAccordActive, setIsAccordActive] = useState(false);

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
  const [accordionList, setAccordionList] = React.useState([]);
  const [editedTruckRequest, setEditedTruckRequest] = useState({
    pickupStation: undefined,
  });
  const [updatedTruckRequest, setUpdatedTruckRequest] = useState(null);
  const [updatedPartners, setUpdatedPartners] = useState(null);

  useEffect(() => {
    if (res) {
      setAllocTransDetails(res.truckrequestpool);
    }
  }, [res]);

  useEffect(() => {
    if (truckRequestsFetchRes !== null) {
      if (type) {
        setTruckRequest(
          truckRequestsFetchRes.bulkTruckRequest
            ? truckRequestsFetchRes.bulkTruckRequest
            : truckRequestsFetchRes.truckRequest,
        );
      } else {
        setTruckRequest(
          truckRequestsFetchRes.truckRequest
            ? truckRequestsFetchRes.truckRequest
            : truckRequestsFetchRes.bulkTruckRequest,
        );
      }
    } else {
      setTruckRequest([]);
    }
  }, [truckRequestsFetchRes, type, truckRequest, setTruckRequest]);

  useEffect(() => {
    if (response) {
      if (type) {
        setRequest(response.truckrequests);
      }
    }
  }, [response, type]);

  useEffect(() => {
    if (clone) {
      setGlobalNavBarDetails({ navTitle: <>{t('forms.cloneTruckRequest')}</>, itemId: undefined }, setGlobalNavDetails);
    } else if (edit) {
      setGlobalNavBarDetails({ navTitle: <>{t('forms.editTruckRequest')}</>, itemId: undefined }, setGlobalNavDetails);
    } else {
      setGlobalNavBarDetails(
        { navTitle: <>{t('truckRequests.truckRequest')}</>, itemId: undefined },
        setGlobalNavDetails,
      );
    }
    // eslint-disable-next-line
  }, [setGlobalNavDetails, t]);

  useEffect(() => {
    if (type === 'bulk') {
      setGlobalNavBarDetails({ navTitle: <>{t('truckRequests.bulkAlloc')}</>, itemId: '' }, setGlobalNavDetails);
      if (!isArrayEmpty(truckRequest)) {
        const {
          customerName,
          customerPhone,
          pickupStation,
          deliveryStation,
          // expiryDate,
          // storageDate,
          assignedAllocation,
          allocation,
          comment,
          // partnerPayout,
          // currency,
        } = truckRequest;
        setCustomerInfo([
          { title: <>{t('tableHeaders.customers')}</>, subtitle: customerName || getDash() },
          { title: <>{t('tableHeaders.phoneNumber')}</>, subtitle: customerPhone || getDash() },
        ]);

        setRouteInfo([
          { title: <>{t('trips.pickupLocation')}</>, subtitle: pickupStation ? pickupStation.address : getDash() },
          {
            title: <>{t('trips.deliveryLocation')}</>,
            subtitle: deliveryStation ? deliveryStation.address : getDash(),
          },
        ]);

        setAllocationInfo([
          { title: <>{t('tableHeaders.totalAllocation')}</>, subtitle: allocation || getDash() },
          { title: <>{t('truckRequests.assignedAllocation')}</>, subtitle: assignedAllocation || getDash() },
          {
            title: <>{t('truckRequests.remainingTruckAllocation')}</>,
            subtitle: allocation - assignedAllocation || '0',
          },
        ]);

        setOtherInfo([
          // { title: <>{t('truckRequests.partnerPayout')}</>, subtitle: `${currency} ${partnerPayout}` || getDash() },
          { title: <>{t('trips.comment')}</>, subtitle: comment || getDash() },
        ]);
      }
    } else {
      if (!isArrayEmpty(truckRequest)) {
        setGlobalNavBarDetails(
          {
            navTitle: (
              <>
                {clone
                  ? t('forms.cloneTruckRequest')
                  : edit
                  ? t('forms.editTruckRequest')
                  : t('truckRequests.truckRequest')}
              </>
            ),
            itemId: truckRequest.requestType,
          },
          setGlobalNavDetails,
        );
        let {
          customerName,
          customerPhone,
          pickupStation,
          deliveryStation,
          expiryDate,
          storageDate,
          asset,
          requestedQuantity,
          acceptedQuantity,
          acceptedPartner,
          partner,
          bulkId,
          comment,
          // partnerPayout,
          // currency,
        } = truckRequest;

        if (updatedTruckRequest) {
          customerName = updatedTruckRequest.customerName;
          customerPhone = updatedTruckRequest.customerPhone;
          pickupStation = updatedTruckRequest.pickupStation;
          deliveryStation = updatedTruckRequest.deliveryStation;
          expiryDate = updatedTruckRequest.expiryDate;
          storageDate = updatedTruckRequest.storageDate;
          asset = updatedTruckRequest.asset;
          requestedQuantity = updatedTruckRequest.requestedQuantity;
          acceptedQuantity = updatedTruckRequest.acceptedQuantity;
          acceptedPartner = updatedTruckRequest.acceptedPartner;
          partner = updatedTruckRequest.partner;
          bulkId = updatedTruckRequest.bulkId;
          comment = updatedTruckRequest.comment;
          // partnerPayout = updatedTruckRequest.partnerPayout;
          // currency = updatedTruckRequest.currency;
          requestedQuantity = updatedTruckRequest.requestedQuantity;
          acceptedQuantity = updatedTruckRequest.acceptedQuantity;
        }

        setCustomerInfo([
          { title: <>{t('tableHeaders.customers')}</>, subtitle: customerName || getDash() },
          { title: <>{t('tableHeaders.phoneNumber')}</>, subtitle: customerPhone || getDash() },
        ]);
        setRouteInfo([
          {
            title: <>{t('trips.pickupLocation')}</>,
            subtitle: editedTruckRequest.pickupStation
              ? editedTruckRequest.pickupStation.address
              : pickupStation
              ? pickupStation.address
              : getDash(),
          },
          {
            title: <>{t('trips.deliveryLocation')}</>,
            subtitle: editedTruckRequest.deliveryStation
              ? editedTruckRequest.deliveryStation.address
              : deliveryStation
              ? deliveryStation.address
              : getDash(),
          },
        ]);
        setExpiryDateTime([
          {
            title: <>{t('tableHeaders.expirydate')}</>,
            subtitle: expiryDate ? format(new Date(expiryDate), 'd MMMM, yyyy') : getDash(),
          },
          {
            title: <>{t('forms.storageDate')}</>,
            subtitle: storageDate ? format(new Date(storageDate), 'd MMMM, yyyy') : getDash(),
          },
          {
            title: <>{t('forms.time')}</>,
            subtitle: expiryDate ? format(new Date(expiryDate), 'hh:mm aaa') : getDash(),
          },
        ]);
        setOtherInfo([
          // { title: <>{t('truckRequests.partnerPayout')}</>, subtitle: `${currency} ${partnerPayout}` || getDash() },
          { title: <>{t('trips.comment')}</>, subtitle: comment ? comment : getDash() },
        ]);

        if (truckRequest.requestType && truckRequest.requestType.toLowerCase() === 'container') {
          setContainerInfo([
            {
              title: <>{t('truckRequests.containerSize')}</>,
              subtitle:
                `${truckRequest.containerSize ? truckRequest.containerSize.length : 0} ${t('truckRequests.ft')}` ||
                getDash(),
            },
            {
              title: <>{t('truckRequests.isContainerEmpty')}</>,
              subtitle: `${
                (truckRequest.isContainerEmpty && `${t('truckRequests.yes')}`) || `${t('truckRequests.no')}`
              }`,
            },
            {
              title: <>{t('truckRequests.containerWeight')}</>,
              subtitle: `${truckRequest.containerWeight}${t('truckRequests.tons')}` || getDash(),
            },
            {
              title: <>{t('truckRequests.numberOfContainers')}</>,
              subtitle: `${
                isNaN(requestedQuantity) ? getDash() : `${requestedQuantity} ${t('truckRequests.containers')}`
              }`,
            },
            {
              title: <>{t('truckRequests.remainingAllocation')}</>,
              subtitle: `${
                isNaN(requestedQuantity - acceptedQuantity)
                  ? getDash()
                  : `${requestedQuantity - acceptedQuantity} ${t('truckRequests.containersleft')}`
              }`,
            },
          ]);
        }

        let docs =
          truckRequest.document && truckRequest.document.length > 0
            ? truckRequest.document.map(doc => ({
                title: doc.name,
                subtitle: (
                  <>
                    {doc.documentNo}{' '}
                    <img
                      onClick={() => showWaybill(doc.thumb)}
                      className='img-overlay'
                      src={doc.thumb}
                      alt=''
                      width={25}
                    />
                  </>
                ),
              }))
            : [];

        setDocuments(docs);
        setTruckTypes([
          {
            title: <>{t('forms.truckType')}</>,
            subtitle:
              truckRequest.requestType && truckRequest.requestType.toLowerCase() === 'bulk' ? (
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={() => push(`/${customerId}/truck_requests/${bulkId}?type=bulk`)}
                >
                  <>{t('forms.viewBulkAllocation')}</>
                </span>
              ) : asset && asset.size && asset.unit && asset.name ? (
                `${asset && `${asset.size} ${asset.unit} ${asset.name}`}`
              ) : (
                'N/A'
              ),
          },
          { title: <>{t('truckRequests.noOfTrucks')}</>, subtitle: requestedQuantity || getDash() },
          {
            title: <>{t('truckRequests.remTrAlloc')}</>,
            subtitle: `${
              isNaN(requestedQuantity - acceptedQuantity) ? acceptedQuantity : requestedQuantity - acceptedQuantity
            } ${t('truckRequests.trucksRemaining')}`,
          },
        ]);

        if (partner) {
          setTruckTypes(truckTypes => [
            ...truckTypes,
            { title: <>{t('truckRequests.transName')}</>, subtitle: partner.name || getDash() },
          ]);
        }

        setTransporter(
          acceptedPartner
            ? [
                ...acceptedPartner.map(partner => ({
                  title: partner.name,
                  subtitle: `${partner.quantity} ${
                    (partner.quantity > 1 && `${t('forms.trucks')}`) || `${t('truckRequests.truck')}`
                  }`,
                })),
              ]
            : [],
        );
      }
    }
    // eslint-disable-next-line
  }, [
    setGlobalNavDetails,
    truckRequest,
    t,
    type,
    push,
    customerId,
    editedTruckRequest.pickupStation,
    editedTruckRequest.deliveryStation,
    updatedTruckRequest,
  ]);

  useEffect(() => {
    if (type !== 'bulk' && !isArrayEmpty(truckRequest)) {
      if (!isArrayEmpty(truckRequest['acceptedPartner'])) {
        setPartners(truckRequest['acceptedPartner']);
        const partners = truckRequest['acceptedPartner'];
        const accordionList = partners
          ? partners.map((partner, i) => ({ key: i, isOpen: false, partnerId: partner.id }))
          : [];
        setAccordionList(accordionList);
      }
    }
  }, [truckRequest, type]);

  useEffect(() => {
    if (type !== 'bulk') {
      if (updatedPartners) {
        setPartners(updatedPartners);
        const accordionList = updatedPartners
          ? updatedPartners.map((partner, i) => ({ key: i, isOpen: false, partnerId: partner.id }))
          : [];
        setAccordionList(accordionList);
      }
    }
  }, [updatedPartners, type, partners]);

  function getModalToShow() {
    switch (modal.modalType) {
      case 'cancel':
        return <DeleteModal {...{ setModal, label: `${t('truckRequests.truckRequest')}`, deleteAction }} />;
      case 'removeAllocation':
        return <DeleteModal {...{ setModal, label: `${t('truckRequests.truck')}`, deleteAction: removeDriver }} />;
      case 'setToAccept':
        return (
          <AcceptModal {...{ setModal, label: `${t('truckRequests.setToAccept')}`, acceptAction: setPositioned }} />
        );
      case 'setToPositioned':
        return (
          <AcceptModal {...{ setModal, label: `${t('truckRequests.setToPositioned')}`, acceptAction: setPositioned }} />
        );
      case 'setToInPremise':
        return (
          <AcceptModal {...{ setModal, label: `${t('truckRequests.setToInPremise')}`, acceptAction: setPositioned }} />
        );
      case 'clone':
        return (
          <AcceptModal
            {...{
              setModal,
              label: `${t('forms.cloneTruckRequest')}`,
              type: 'success',
              acceptAction: cloneTruckRequest,
            }}
          />
        );
      case 'edit':
        return (
          <EditTruckRequestForm
            {...{
              setModal,
              endpointParams: { token },
              syncUp,
              truckRequest: updatedTruckRequest ? updatedTruckRequest : truckRequest,
              updateAction,
            }}
          />
        );
      case 'assign':
        return <AssignTruckRequestToTransporterForm {...{ updateTruckRequest, setModal, truckRequest, syncUp }} />;
      case 'assignBulk':
        return (
          <AssignTruckRequestToTransporterForm
            {...{ updateTruckRequest, setModal, truckRequest, syncUp, bulk: true }}
          />
        );
      case 'confirm':
        return (
          <AcceptModal
            {...{ setModal, acceptAction: confirmTransporterAllocation, label: `${t('forms.transporter')}` }}
          />
        );
      case 'assignTruck':
        return (
          <AssignTruckForm
            {...{
              setModal,
              transporter: partners[modal.modalItemId],
              token,
              modal,
              truckRequest,
              syncUp,
              updateTRPool,
              updateTruckRequest,
            }}
          />
        );
      case 'adjustAllocation':
        return (
          <AdjustAllocationForm
            {...{ setModal, transporter: partners[modal.modalItemId], token, modal, truckRequest, syncUp }}
          />
        );
      default:
        return null;
    }
  }

  function updateAction({ editedTruckReq }) {
    setEditedTruckRequest(editedTruckReq);
    setUpdatedTruckRequest(editedTruckReq);
  }

  function updateTRPool({ editedTruckReqPool }) {
    setAllocTransDetails(editedTruckReqPool);
  }

  async function deleteAction() {
    try {
      const res = await cancelTruckRequest({ truckRequestId: truckRequest._id, token });
      if (res.status === 200) {
        setModal({ showModal: false, modalType: undefined, modalItemId: undefined });

        const res2 = await getTruckRequest({
          endpoint: type === 'bulk' ? `/request/bulktruck/${truckRequestId}` : `/request/truck/${truckRequestId}`,
          token,
        });

        let truckRequestsFetchRes = res2.data.data;

        if (truckRequestsFetchRes !== null) {
          if (type) {
            setUpdatedTruckRequest(
              truckRequestsFetchRes.bulkTruckRequest
                ? truckRequestsFetchRes.bulkTruckRequest
                : truckRequestsFetchRes.truckRequest,
            );
          } else {
            setUpdatedTruckRequest(
              truckRequestsFetchRes.truckRequest
                ? truckRequestsFetchRes.truckRequest
                : truckRequestsFetchRes.bulkTruckRequest,
            );
          }
        } else {
          setUpdatedTruckRequest([]);
        }

        setToast({
          showToast: true,
          toastType: toastEnums.SUCCESS,
          toastMessage: 'Truck request cancelled',
        });
      }
    } catch ({ response }) {
      setModal({ showModal: false, modalType: undefined, modalItemId: undefined });
      let message = 'truck request not cancelled';
      message = (response && response.data.message) || message;
      setToast({
        showToast: true,
        toastType: toastEnums.FAILURE,
        toastMessage: message,
      });
    }
  }

  function updateTableData({ tableData }) {
    setTruckRequest(tableData);
  }

  function showWaybill(url) {
    seturls([].concat(url));

    setwaybillClass('showWaybill');
  }

  function closeWaybill() {
    setwaybillClass('');
  }

  function syncUp({ toastType, toastMessage }) {
    setModal({ showModal: false, modalType: undefined, modalItemId: undefined });
    setToast({
      showToast: true,
      toastType,
      toastMessage: toastMessage,
    });
  }

  const cloneTruckRequest = async () => {
    const {
      partner,
      asset,
      accessType,
      pickupStation,
      deliveryStation,
      expiryDate,
      partnerPayout,
      showPartnerPayout,
      customerId,
      country,
      customerName,
      customerPhone,
      customerAccountId,
      requestedQuantity,
      acceptedQuantity,
      customerAccountName,
      businessId,
      businessUnit,
      requestType,
      document,
    } = truckRequest;

    console.log('truck request', truckRequest);
    const params = {
      customerName,
      customerPhone,
      country,
      customerAccountId,
      customerAccountName,
      businessId,
      businessUnit,
      customerId,
      requestType,
      requestedTons: asset.size,
      document,
      pickupStation: {
        ...pickupStation,
        lat: pickupStation.location.coordinates[0],
        long: pickupStation.location.coordinates[1],
      },
      deliveryStation: {
        ...deliveryStation,
        lat: deliveryStation.location.coordinates[0],
        long: deliveryStation.location.coordinates[1],
      },
      request: [
        {
          accessType,
          partnerId: partner.id,
          partnerName: partner.name,
          expiryDate: new Date(expiryDate).valueOf(),
          partnerPayout,
          showPartnerPayout,
          asset: {
            ...asset,
            id: asset._id,
            quantity: parseInt(requestedQuantity || 0) + parseInt(acceptedQuantity || 0),
          },
        },
      ],
    };
    console.log('params', params);
    try {
      await createTruckRequest({ params, token });

      syncUp({
        toastType: 'success',
        toastMessage: 'truck request created',
      });
      setTimeout(() => goBack(), 3000);
    } catch (err) {
      if (err.response) {
        const { message: errorMessage } = err.response.data;
        syncUp({
          toastType: toastEnums.FAILURE,
          toastMessage: errorMessage,
        });
      } else {
        syncUp({
          toastType: toastEnums.FAILURE,
          toastMessage: 'Error cloning truck request',
        });
      }
    }
  };

  async function confirmTransporterAllocation() {
    const partnerToConfirm = partners.find((partner, index) => index === modal.modalItemId);

    try {
      await confirmTsAllocation({
        endpoint: `/request/${truckRequestId}/confirmTruckRequest`,
        endpointParams: {
          params: {
            partnerId: partnerToConfirm.id,
            status: 'accepted',
          },
          token,
        },
      });

      const acceptedPartner = truckRequest.acceptedPartner.map(partner => {
        if (partner.id === partnerToConfirm.id) {
          partner.status = 'accepted';
        }
        return partner;
      });
      setTruckRequest({ ...truckRequest, acceptedPartner });
      syncUp({
        toastType: 'success',
        toastMessage: 'Transporter confirmed',
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

  async function removeDriver() {
    try {
      const res = await removeAllocationDriver({ endpoint: `truck/${modal.modalItemId}/pullout`, token });
      if (res) {
        syncUp({
          toastType: 'success',
          toastMessage: 'Truck pulled out',
        });
        window.location.reload();
      }
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
      const res = await getTRPool({ endpoint: `/truck/truckRequestPool?truckRequestId=${truckRequestId}`, token });
      if (res) {
        setAllocTransDetails(res.data.data.truckrequestpool);
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

  function updateTruckRequest(editedTruckReq) {
    setTruckRequest(editedTruckReq);
    setEditedTruckRequest(editedTruckReq);
    setUpdatedTruckRequest(editedTruckReq);

    if (type !== 'bulk') {
      if (!isArrayEmpty(editedTruckReq['acceptedPartner'])) {
        const partners = editedTruckReq['acceptedPartner'];
        setUpdatedPartners(partners);
        const accordionList = partners
          ? partners.map((partner, i) => ({ key: i, isOpen: false, partnerId: partner.id }))
          : [];
        setAccordionList(accordionList);
      }
    }
  }

  if (truckRequestsFetchIsLoading || pending) {
    return <ContentLoader />;
  }

  if (truckRequestsFetchRes.truckRequest === null || truckRequestsFetchRes.bulkTruckRequest === null) {
    return <EmptyTable errorTitle='' errorSubtitle={t('truckRequests.noDataAvailableForThisTruckRequest')} />;
  }

  if (truckRequestsFetchError) {
    return <Error {...{ error: truckRequestsFetchError }} />;
  }

  if (type === 'bulk') {
    return (
      <OrderStyle>
        <InnerPageBackButton action={() => goBack()} />
        <div className='orderInfoContent'>
          <div className='blocks'>
            <div>
              <Block blockTitle={t('truckRequests.cusInfo')} blockInfo={customerInfo} />
              <Block blockTitle={t('common.routeInformation')} blockInfo={routeInfo} />
              {documents.length > 0 && <Block blockTitle={t('truckRequests.documents')} blockInfo={documents} />}
            </div>
            <div>
              <Block blockTitle={t('tableHeaders.bulkAlloc')} blockInfo={allocationInfo} />
              {isLoading ? (
                <ContentLoader />
              ) : (
                <AllocatedTransportersStyle>
                  <header className='heading'>
                    <h1 className='title'>
                      <>{t('truckRequests.assignedRequest')}</>
                    </h1>
                  </header>
                  {(request.length > 0 && (
                    <>
                      <div className='head'>
                        <p>
                          <>{t('truckRequests.requestType')}</>
                        </p>
                        <p>
                          <>{t('truckRequests.partner')}</>
                        </p>
                        <p>
                          <>{t('truckRequests.quantity(mTon)')}</>
                        </p>
                        <p></p>
                      </div>
                      <div className='transporters'>
                        {request.map(({ requestedQuantity, partner, _id }, index) => {
                          return (
                            <div className='bulkRow' key={index}>
                              <p style={partner ? { color: '#29489b' } : { color: '#36B37E' }}>
                                {partner ? <>{t('truckRequests.assigned')}</> : <>{t('truckRequests.open')}</>}
                              </p>
                              <p className='partnerName'>{partner ? partner.name : 'N/A'}</p>

                              <p style={{ color: '#29489b' }}>{requestedQuantity}</p>

                              <p className='view' onClick={() => push(`/${customerId}/truck_requests/${_id}`)}>
                                <>{t('truckRequests.view')}</>
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )) || (
                    <div className='emptyBlock'>
                      <h1 className='emptyBlockMessage'>
                        <>{t('truckRequests.noAcceptedPartner')}</>
                      </h1>
                    </div>
                  )}
                </AllocatedTransportersStyle>
              )}
            </div>
          </div>
        </div>
        <TruckRequestSidePane
          {...{
            status: truckRequest
              ? truckRequest.allocation - truckRequest.assignedAllocation < 1
                ? 'closed'
                : 'open'
              : 'closed',
            setModal,
            updateTableData,
            truckRequest,
          }}
        />
        <Modal {...{ modal, setModal }}>{getModalToShow()}</Modal>
        <Toast {...{ ...toast, setToast }} />
      </OrderStyle>
    );
  }
  return (
    <OrderStyle>
      <InnerPageBackButton action={() => goBack()} />
      <div className='orderInfoContent'>
        <div className='blocks'>
          <div>
            <Block blockTitle={t('truckRequests.cusInfo')} blockInfo={customerInfo} />
            <Block blockTitle={t('common.routeInformation')} blockInfo={routeInfo} />
            <Block blockTitle={t('tableHeaders.expiryDate')} blockInfo={expiryDateTime} />
            {documents.length > 0 && <Block blockTitle={t('truckRequests.documents')} blockInfo={documents} />}
          </div>
          <div>
            {(truckRequest.requestType && truckRequest.requestType.toLowerCase() === 'container' && (
              <Block blockTitle={t('truckRequests.containerInformation')} blockInfo={containerInfo} />
            )) || <Block blockTitle={`${t('forms.truckType')}  (${truckRequest.accessType})`} blockInfo={truckTypes} />}
            <AllocatedTransportersStyle>
              <header className='heading'>
                <h1 className='title'>
                  <>{t('truckRequests.acceptedTransporter')}</>
                </h1>
              </header>
              {(partners && partners.length > 0 && (
                <div className='transporters'>
                  {accordionList.map((a, index) => {
                    return (
                      <div className={`row ${(accordionList[index]['isOpen'] && 'active') || ''}`} key={index}>
                        <header className='rowHeader'>
                          <p
                            className='name pointer'
                            onClick={() => push(`/${customerId}/transporters/${a.partnerId}`)}
                          >
                            {partners[index].name}
                          </p>
                          <button
                            className='trucksCount'
                            onClick={() =>
                              setModal({
                                showModal: true,
                                modalType: 'adjustAllocation',
                                modalItemId: index,
                              })
                            }
                          >
                            {`${partners[index].fulfilled}/${partners[index].quantity} (${
                              (partners[index].quantity > 1 &&
                                `${
                                  truckRequest
                                    ? truckRequest.requestType.toLowerCase() === 'container'
                                      ? t('truckRequests.containers')
                                      : t('tableHeaders.trucks')
                                    : t('tableHeaders.trucks')
                                }`) ||
                              `${
                                truckRequest
                                  ? truckRequest.requestType.toLowerCase() === 'container'
                                    ? t('truckRequests.container')
                                    : t('tableHeaders.truck')
                                  : t('tableHeaders.truck')
                              }`
                            })`}
                          </button>
                          <div
                            className='icon'
                            style={{ opacity: (partners[index].status.toLowerCase() === 'accepted' && 1) || 0 }}
                          >
                            <img src={check} alt='' />
                          </div>

                          {(partners[index].status.toLowerCase() === 'accepted' &&
                            ((partners[index].quantity > partners[index].fulfilled && (
                              <button
                                className='assignTruckAction'
                                onClick={() =>
                                  setModal({
                                    showModal: true,
                                    modalType: 'assignTruck',
                                    modalItemId: index,
                                  })
                                }
                              >
                                {truckRequest.requestType.toLowerCase() === 'container' ? (
                                  <>{t('truckRequests.assignContainer')}</>
                                ) : (
                                  <>{t('truckRequests.assignTrucks')}</>
                                )}
                              </button>
                            )) || <div />)) || (
                            <button
                              className='assignTruckAction'
                              onClick={() =>
                                setModal({
                                  showModal: true,
                                  modalType: 'confirm',
                                  modalItemId: index,
                                })
                              }
                            >
                              confirm
                            </button>
                          )}

                          <button
                            className={`accordionTruck ${(accordionList[index]['isOpen'] && 'active') || ''}`}
                            onClick={() => {
                              setAccordionList(
                                accordionList.map(acc => {
                                  if (acc.key === index) {
                                    acc.isOpen = !acc.isOpen;
                                  }
                                  return acc;
                                }),
                              );
                              setIsAccordActive(!isAccordActive);
                            }}
                          >
                            <svg
                              id='arrow'
                              className='arrow'
                              height='16'
                              viewBox='0 0 16 16'
                              width='16'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                d='M13.591 5.293a1 1 0 0 1 1.416 1.416l-6.3 6.3a1 1 0 0 1-1.414 0l-6.3-6.3A1 1 0 0 1 2.41 5.293L8 10.884z'
                                fillRule='evenodd'
                              />
                            </svg>
                          </button>
                        </header>

                        <div className='rowDetails'>
                          {allocTransDetails.map((allocTransDetail, i) => {
                            if (partners[index].id === allocTransDetail.partner.id) {
                              return (
                                <div
                                  className={
                                    !['positioned', 'available', 'pending', 'in-premise'].includes(
                                      allocTransDetail.status.toLowerCase(),
                                    )
                                      ? 'acceptedRow'
                                      : 'rowDetail'
                                  }
                                  key={i}
                                >
                                  <div
                                    className='col1 assetCol pointer'
                                    onClick={() => push(`/${customerId}/incoming_trucks/${allocTransDetail._id}`)}
                                  >
                                    <p className='name'>{allocTransDetail.regNumber}</p>
                                    <p className='asset'>{`${allocTransDetail.asset.size} ${allocTransDetail.asset.unit} ${allocTransDetail.asset.name}`}</p>
                                  </div>
                                  <div className='col2 driverCol'>
                                    <p className='name'>{allocTransDetail.driver.name}</p>
                                    <p className='mobile'>{allocTransDetail.driver.mobile}</p>
                                  </div>
                                  {['positioned', 'available', 'pending', 'in-premise'].includes(
                                    allocTransDetail.status.toLowerCase(),
                                  ) && (
                                    <button
                                      className='delete'
                                      onClick={() =>
                                        setModal({
                                          showModal: true,
                                          modalItemId: allocTransDetail._id,
                                          modalType: 'removeAllocation',
                                        })
                                      }
                                    >
                                      <img src={binBtn} alt='delete' />
                                    </button>
                                  )}
                                  {(allocTransDetail.status.toLowerCase() === 'pending' && (
                                    <button
                                      className='setAct'
                                      style={{ backgroundColor: '#23a4d7' }}
                                      onClick={() =>
                                        setModal({
                                          showModal: true,
                                          modalItemId: allocTransDetail._id,
                                          modalType: 'setToAccept',
                                        })
                                      }
                                    >
                                      <>{t('buttons.setToAccept')}</>
                                    </button>
                                  )) ||
                                    (allocTransDetail.status.toLowerCase() === 'available' && (
                                      <button
                                        className='setAct'
                                        style={{ backgroundColor: '#23a4d7' }}
                                        onClick={() =>
                                          setModal({
                                            showModal: true,
                                            modalItemId: allocTransDetail._id,
                                            modalType: 'setToPositioned',
                                          })
                                        }
                                      >
                                        <>{t('buttons.setToPos')}</>
                                      </button>
                                    )) ||
                                    (allocTransDetail.status.toLowerCase() === 'positioned' && (
                                      <button
                                        className='setAct'
                                        style={{ backgroundColor: '#fcab31' }}
                                        onClick={() =>
                                          setModal({
                                            showModal: true,
                                            modalItemId: allocTransDetail._id,
                                            modalType: 'setToInPremise',
                                          })
                                        }
                                      >
                                        <>{t('buttons.setToInPrem')}</>
                                      </button>
                                    )) ||
                                    (!['positioned', 'available', 'pending', 'in-premise'].includes(
                                      allocTransDetail.status.toLowerCase(),
                                    ) && (
                                      <button
                                        className='setAct'
                                        style={{ backgroundColor: '#36B37E' }}
                                        onClick={() => push(`/${customerId}/trips/${allocTransDetail.tripId}`)}
                                      >
                                        <>{t('buttons.viewTrip')}</>
                                      </button>
                                    )) ||
                                    (allocTransDetail.status.toLowerCase() === 'in-premise' &&
                                      (adminId && allocTransDetail.customerAccountName === '' ? (
                                        <button
                                          style={{ backgroundColor: '#37b47f' }}
                                          className='setAct'
                                          onClick={() =>
                                            push(`/${customerId}/truck_requests/load_trucks`, {
                                              step: 'business_account',
                                              truckPool: allocTransDetail._id,
                                              truckRequestId,
                                              type,
                                              params: {
                                                driver: allocTransDetail.driver,
                                                customerId: allocTransDetail.customerId,
                                                customerName: allocTransDetail.customerName,
                                                customerPhone: allocTransDetail.customerPhone,
                                                partner: allocTransDetail.partner,
                                                requestType: allocTransDetail.requestType || 'new',
                                              },
                                            })
                                          }
                                        >
                                          <>{t('buttons.loadTrucks')}</>
                                        </button>
                                      ) : (
                                        <button
                                          style={{ backgroundColor: '#37b47f' }}
                                          className='setAct'
                                          // disabled={!allocTransDetail.carriage}
                                          onClick={() =>
                                            push(`/${customerId}/truck_requests/load_trucks`, {
                                              step: 'customer_routes',
                                              truckPool: allocTransDetail._id,
                                              truckRequestId,
                                              type,
                                              params: {
                                                driver: allocTransDetail.driver,
                                                customerId: allocTransDetail.customerId,
                                                customerName: allocTransDetail.customerName,
                                                customerPhone: allocTransDetail.customerPhone,
                                                partner: allocTransDetail.partner,
                                                requestType: allocTransDetail.requestType || 'new',
                                                carriage: allocTransDetail.carriage
                                                  ? allocTransDetail.carriage
                                                  : allocTransDetail.partner,
                                              },
                                            })
                                          }
                                        >
                                          <>{t('buttons.loadTrucks')}</>
                                        </button>
                                      )))}
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )) || (
                <div className='emptyBlock'>
                  {/* <h1 className='emptyBlockMessage'>{<>{t('common.noDataAvailable')}</>}</h1> */}
                  <h1 className='emptyBlockMessage'>
                    <>{t('truckRequests.noAcceptedTransporter')}</>
                  </h1>
                </div>
              )}
            </AllocatedTransportersStyle>
            <Block blockTitle={t('truckRequests.otherInformation')} blockInfo={otherInfo} />
          </div>
        </div>
      </div>
      <TruckRequestSidePane
        {...{
          truckRequest: updatedTruckRequest ? updatedTruckRequest : truckRequest,
          setModal,
          clone,
        }}
      />
      <Modal {...{ modal, setModal }}>{getModalToShow()}</Modal>
      <WaybillModal {...{ closeWaybill, waybillClass, urls }} />
      <Toast {...{ ...toast, setToast }} />
    </OrderStyle>
  );
}

export default TruckRequest;
