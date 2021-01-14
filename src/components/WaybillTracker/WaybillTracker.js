import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import { useFetch } from '../../APIs/Read';
import { useUserState } from '../../contexts/UserContext';
import Card from '../General/Card';
import Modal from '../Modals/Modal';
import PageActions from '../PageActions';
import PageContent from '../PageContent';
import Toast from '../Shared/Toast/Toast';
import SetWaybillStatusForm from './SetWaybillStatusForm';
import WaybillTrackerTable from './WaybillTrackerTable';

const StyledWaybillTracker = styled.div`
  .header-end {
    flex: 1;
    justify-content: space-between;
    display: flex;
    flex-direction: row-reverse;
    align-items: flex-end;
  }

  .status-button {
    width: 239px;
    height: 29px;
    background: #f4f4f4;
    border: 1px solid #d8d8d8;
    border-radius: 2px;
    opacity: 1;
    text-align: center;
    font-size: 15px;
    letter-spacing: 0px;
    color: #707070;
    font-family: var(--font-bold);
  }

  .cardBtn {
    padding: 0;
    background-color: unset;
    position: relative;

    .cardInfoBlock {
      text-align: left;
    }

    .active {
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 50%;
      position: absolute;
      bottom: 9px;
      right: 35px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .check {
      transform: scaleX(-1) rotate(-46deg);
      font-size: 14px;
      font-weight: bold;
    }
  }
`;

function WaybillTracker({ page, waybillTrackerParams: { currentPageIndex }, setWaybillTrackerQueryParams }) {
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
  const [isBtnVisible, setIsBtnVisible] = useState(true);
  const [waybillCheckboxSelected, setWaybillCheckboxSelected] = useState(false);
  const { url } = useRouteMatch();
  const { push } = useHistory();
  const { t } = useTranslation();
  const { customerId, token, businessUnit, businessId } = useUserState();
  const isNotAdmin = businessUnit !== 'admin';
  const appendBusinessUnit = isNotAdmin ? `&businessId=${businessId}` : '';
  const [defaultStatus, setDefaultStatus] = useState('Dispatched to Customer Office');
  const [defaultEndpoint, setDefaultEndpoint] = useState(
    `/trip/waybill/status?waybillStatus=${defaultStatus}&customerId=${customerId}${appendBusinessUnit}`,
  );
  const { response, isLoading, error } = useFetch(defaultEndpoint, token);
  const { response: response2 } = useFetch(`/trip/waybill/count/${customerId}`, token);
  const [cardDetails, setCardDetails] = useState();
  const [waybills, setWaybills] = useState([]);
  const [tripsWithWaybills, setTripWithWaybills] = useState([]);
  const [paginationData, setPaginationData] = useState({
    totalPages: null,
  });
  const [checkedWaybills, setCheckedWaybills] = React.useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (response2) {
      setCardDetails(response2.count);
    }
  }, [response2]);

  useEffect(() => {
    if (response) {
      setWaybills(response.trips);
      setPaginationData({ totalPages: response.totalPages });
      const tripsWithWaybills = response.trips
        .map(trip => {
          const validWaybills = trip.dropOff.filter(dropOff => {
            return dropOff.waybillNumber && dropOff.waybillStatusHistory.length > 0;
          });

          if (validWaybills.length === 0) {
            return undefined;
          }
          return { _tripId: trip._id, tripId: trip.tripId, validWaybills };
        })
        .filter(res => !!res);

      setTripWithWaybills(tripsWithWaybills);
    }
  }, [response]);

  useEffect(() => {
    let newURL;
    if (currentPageIndex !== 1) {
      if (searchTerm.length > 0) {
        setDefaultEndpoint(
          `/trip/waybill/search?waybillStatus=${defaultStatus}&searchTerm=${searchTerm}&customerId=${customerId}${appendBusinessUnit}`,
        );
      } else {
        setDefaultEndpoint(
          `/trip/waybill/status?waybillStatus=${defaultStatus}&customerId=${customerId}&page=${currentPageIndex}${appendBusinessUnit}`,
        );
      }
    } else {
      if (searchTerm.length > 0) {
        setDefaultEndpoint(
          `/trip/waybill/search?waybillStatus=${defaultStatus}&searchTerm=${searchTerm}&customerId=${customerId}${appendBusinessUnit}`,
        );
      } else {
        setDefaultEndpoint(
          `/trip/waybill/status?waybillStatus=${defaultStatus}&customerId=${customerId}${appendBusinessUnit}`,
        );
      }
    }

    if (currentPageIndex > paginationData.totalPages || currentPageIndex === 1) {
      newURL = url;
    } else {
      newURL = `${url}?status=${defaultStatus}page=${currentPageIndex}`;
    }

    push(newURL);
    // eslint-disable-next-line
  }, [currentPageIndex, customerId, paginationData, paginationData.totalPages, push, url, defaultStatus, searchTerm]);

  function getModalToShow() {
    switch (modal.modalType) {
      case 'waybillStatus':
        return <SetWaybillStatusForm {...{ setModal, checkedWaybills, token, syncUp }} />;
      default:
        return null;
    }
  }

  function switchStatus(status) {
    setSearchTerm('');
    if (status === 'receive') {
      setIsBtnVisible(false);
      setDefaultStatus('Received at Customer Office');
    } else {
      setIsBtnVisible(true);
      setDefaultStatus('Dispatched to Customer Office');
    }
  }

  function syncUp({ toastType, toastMessage }) {
    setModal({ showModal: false, modalType: undefined, modalItemId: undefined });
    setToast({
      showToast: true,
      toastType: toastType,
      toastMessage: toastMessage,
    });
  }

  function onSearch(e) {
    setSearchTerm(e.target.value);
  }

  return (
    <StyledWaybillTracker>
      <PageContent>
        <header className='pageHeader'>
          <button type='button' onClick={() => switchStatus('dispatch')} className='cardBtn'>
            <Card
              {...{
                type: 'activeTrip',
                label: <>{t('waybillTracker.dispToCus')}</>,
                value: 'trips',
                total: (cardDetails && cardDetails.dispatchedToCustomer) || '',
              }}
            />
            {defaultStatus === 'Dispatched to Customer Office' && (
              <>
                <div className='active'>
                  <div className='check'>L</div>
                </div>
              </>
            )}
          </button>
          <button type='button' onClick={() => switchStatus('receive')} className='cardBtn'>
            <Card
              {...{
                type: 'flaggedTrip',
                label: <>{t('waybillTracker.recByCus')}</>,
                value: 'trips',
                total: (cardDetails && cardDetails.receivedAtCustomer) || '',
              }}
            />
            {defaultStatus === 'Received at Customer Office' && (
              <>
                <div className='active'>
                  <div className='check'>L</div>
                </div>
              </>
            )}
          </button>
          <div className='header-end'>
            <PageActions
              {...{
                showSearch: true,
                ownerComponent: 'trips',
                onSearch,
                searchTerm,
              }}
            />
            {isBtnVisible && (
              <button
                className='status-button'
                type='button'
                disabled={checkedWaybills.length > 0 ? false : true}
                onClick={() =>
                  setModal({
                    ...modal,
                    showModal: true,
                    modalType: 'waybillStatus',
                  })
                }
              >
                <>{t('waybillTracker.recByCus')}</>
              </button>
            )}
          </div>
        </header>
        <section className='pageContent'>
          <WaybillTrackerTable
            {...{
              isLoading,
              t,
              waybills,
              tripsWithWaybills,
              fetchError: error,
              pageQueryParams: { currentPageIndex, paginationData },
              setWaybillTrackerQueryParams,
              waybillCheckboxSelected,
              setWaybillCheckboxSelected,
              checkedWaybills,
              setCheckedWaybills,
              defaultStatus,
            }}
          />
        </section>
      </PageContent>
      <Modal {...{ modal, setModal }}>{getModalToShow()}</Modal>
      <Toast {...{ ...toast, setToast }} />
    </StyledWaybillTracker>
  );
}

export default WaybillTracker;
