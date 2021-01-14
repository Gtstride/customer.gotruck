import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { removeTransporter } from '../../APIs/Delete';
import { getTransporters, searchTransporter, useFetch } from '../../APIs/Read';
import { useGlobalNavDispatch } from '../../contexts/GlobalNavContext';
import { useUserState } from '../../contexts/UserContext';
import TableStyle from '../../styles/TableStyle';
import { isArrayEmpty } from '../../_utils/fx';
import { transporterHeaders } from '../../_utils/tableheaders';
import EmptyTable from '../EmptyData/EmptyTable';
import { AnalyticsCard } from '../General/Card';
import ContentLoader from '../Loaders/ContentLoader';
import DeleteModal from '../Modals/DeleteModal';
import FullPageModal from '../Modals/FullPageModal';
import Modal from '../Modals/Modal';
import PageActions from '../PageActions';
import PageContent from '../PageContent';
import Error from '../Shared/Error';
import Toast from '../Shared/Toast/Toast';
import TableContent from '../Tables/TableContent';
import TableHeader from '../Tables/TableHeader';
import { rateTransporter } from '../../APIs/Create';

function Table({
  tableParams: { tableFor, headers, onRateChange, user },
  promises: {
    transporterPromises: { transporters, transportersFetchError, transportersFetchIsLoading },
  },
  page,
  customerId,
  partnerId,
  setModal,
  pageQueryParams: { currentPageIndex },
  paginationData,
  setQueryParams,
  t,
}) {
  function paginateToNextPage() {
    setQueryParams({
      currentPageIndex: currentPageIndex + 1,
    });
  }

  function paginateToPrevPage() {
    setQueryParams({
      currentPageIndex: currentPageIndex - 1,
    });
  }

  if (transportersFetchIsLoading) {
    return <ContentLoader />;
  }

  if (isArrayEmpty(transporters)) {
    return (
      <main>
        <EmptyTable errorTitle='' errorSubtitle={`${t('emptyData.noAvailableData')}`} />
      </main>
    );
  }

  if (transportersFetchError) {
    return <Error {...{ error: transportersFetchError }} />;
  }

  return (
    <main>
      <TableStyle>
        <div className='table-wrap'>
          <table id='table' data-table-for={tableFor.toLowerCase()}>
            <TableHeader
              {...{
                headers,
              }}
            />
            <TableContent
              {...{
                tableData: transporters,
                tableFor,
                page,
                customerId,
                partnerId,
                setModal,
                onRateChange,
                user,
              }}
            />
          </table>
          {transporters.length > 1 && paginationData.totalPages > 1 && (
            <div id='tableFooter'>
              <div>
                {currentPageIndex > 1 && (
                  <i className='material-icons pointer' onClick={paginateToPrevPage}>
                    chevron_left
                  </i>
                )}
              </div>
              <div className='currentPage'>{currentPageIndex}</div>
              &nbsp; {t('pagination.of')} &nbsp;
              <div className='totalPages'>{paginationData.totalPages}</div>
              <div>
                {currentPageIndex < paginationData.totalPages && (
                  <i className='material-icons pointer' onClick={paginateToNextPage}>
                    chevron_right
                  </i>
                )}
              </div>
            </div>
          )}
        </div>
      </TableStyle>
    </main>
  );
}

function Transporters({
  page,
  transportersQueryParams: { currentPageIndex },
  setTransportersQueryParams,
  businessProfile,
}) {
  const setGlobalNavDetails = useGlobalNavDispatch();
  const { token, customerId: customerId2, ...userProps } = useUserState();
  const { customerId } = useParams();
  const { push } = useHistory();
  const { t } = useTranslation();
  const { url } = useRouteMatch();

  const [defaultEndpoint, setDefaultEndpoint] = useState(`/partner/customer/${customerId2}?page=${currentPageIndex}`);
  const {
    response: transportersFetchRes,
    error: transportersFetchError,
    isLoading: transportersFetchIsLoading,
  } = useFetch(defaultEndpoint, token);

  const [transporters, setTransporters] = useState([]);

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
  const [paginationData, setPaginationData] = useState({
    totalPages: undefined,
  });

  // #region Effects
  useEffect(() => {
    setGlobalNavDetails({
      navTitle: `${t('transporters.transManagement')}`,
      itemId: undefined,
    });
  }, [setGlobalNavDetails, t]);

  useEffect(() => {
    if (transportersFetchRes) {
      const { partners, ...paginationData } = transportersFetchRes;
      setPaginationData({ ...paginationData });
      setTransporters(partners);
    }
  }, [currentPageIndex, customerId2, push, transportersFetchRes, url]);

  useEffect(() => {
    setDefaultEndpoint(`/partner/customer/${customerId2}?page=${currentPageIndex}`);
    push(`${url}?page=${currentPageIndex}`);
  }, [currentPageIndex, customerId2, push, url, paginationData]);
  // #endregion

  function getModalToShow() {
    switch (modal.modalType) {
      case 'delete':
        return <DeleteModal {...{ setModal, label: 'transporter', deleteAction }} />;
      case 'create':
        setTransportersQueryParams({ currentPageIndex: 1 });
        addTransporter();
        break;
      default:
        return null;
    }
  }

  function addTransporter() {
    if (businessProfile.partnerId) {
      push(`/${customerId}/${page}/add_transporter`);
    } else {
      push(`/${customerId}/${page}/add_transporter_prompt`);
    }
  }

  function removeItemFromArray({ array, itemId }) {
    const filteredArray = array.filter(arrayItem => arrayItem.id !== itemId);
    setTransporters(filteredArray);
  }

  async function deleteAction() {
    try {
      const res = await removeTransporter({ transporterId: modal.modalItemId, customerId: customerId2, token });
      if (res.status === 200) {
        removeItemFromArray({ array: transporters, itemId: modal.modalItemId });
        setModal({ showModal: false, modalType: undefined, modalItemId: undefined });
        syncUp({ toastType: 'success', toastMessage: 'Transporter removed' });
      }
    } catch ({ response }) {
      let message = (response && response.data.message) || 'failure removing Transporter';
      syncUp({ toastType: 'failure', toastMessage: message });
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

  async function onSearch(e) {
    try {
      const searchTerm = e.target.value;
      let res;
      if (searchTerm.length > 0) {
        res = await searchTransporter({ value: searchTerm, token, customerId });
        if (res) {
          console.log('res search', res);
          setTransporters(res.data.data.partners);
        }
      } else {
        res = await getTransporters({ endpoint: `/partner/customer/${customerId2}`, token });
        if (res) {
          setTransporters(res.data.data.partners);
        }
      }
    } catch (error) {
      console.log({ err: error });
    }
  }

  if (transportersFetchIsLoading) {
    return <ContentLoader />;
  }

  if (transportersFetchError) {
    return <Error {...{ error: transportersFetchError }} />;
  }

  const onRateChange = rating => {
    console.log('rating', rating);

    rateTransporter({ param: { rating }, token })
      .then(res => {
        if (res) {
          syncUp({ toastType: 'success', toastMessage: 'transporter had been rated!' });
        }
      })
      .catch(e => {
        console.log('e', e);
        syncUp({ toastType: 'failure', toastMessage: 'unable to rate transporter at the moment!' });
      });
  };

  // #region Returns
  return (
    <PageContent>
      <header className='pageHeader'>
        <AnalyticsCard
          {...{
            promises: {
              analyticsPromises: {
                response: transportersFetchRes,
                isLoading: transportersFetchIsLoading,
                error: transportersFetchError,
              },
            },
            cardDisplayParams: {
              cardType: 'transporter',
              cardTitle: <>{t('transporters.activePartners')}</>,
              cardText: transporters && transporters.length,
            },
            styles: {
              color: 'purple',
              icon: 'business-deal-handshake-circle',
            },
          }}
        />
        <PageActions
          {...{
            actions: [],
            showSearch: true,
            ownerComponent: 'transporters',
            setModal,
            onSearch,
          }}
        />
      </header>
      <section className='pageContent'>
        <Table
          {...{
            tableParams: {
              tableFor: 'transporters',
              headers: transporterHeaders,
              onRateChange,
              user: userProps,
            },
            promises: {
              transporterPromises: {
                transporters,
                transportersFetchError,
                transportersFetchIsLoading,
              },
            },
            pageQueryParams: { currentPageIndex },
            page,
            customerId,
            partnerId: businessProfile.partnerId,
            setModal,
            paginationData,
            setQueryParams: setTransportersQueryParams,
            t,
          }}
        />
      </section>

      {(modal.showModal && modal.modalType === 'create' && (
        <FullPageModal {...{ modal, setModal }}>{getModalToShow()}</FullPageModal>
      )) || <Modal {...{ modal, setModal }}>{getModalToShow()}</Modal>}
      <Toast {...{ ...toast, setToast }} />
    </PageContent>
  );
  // #endregion
}

export default Transporters;
