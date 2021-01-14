import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import EmptyTable from '../EmptyData/EmptyTable';
import Modal from '../Modals/Modal';
import EnableTransporterModal from '../Modals/EnableTransporterModal';
import { useUserState } from '../../contexts/UserContext';
import PageContent from '../PageContent';
import { trucksHeaders } from '../../_utils/tableheaders';
import Card from '../General/Card';
import PageActions from '../PageActions';
import UsersTableStyle from '../../styles/UsersTableStyle';
import Toast from '../Shared/Toast/Toast';
import { tableType, crudEnums } from '../../_utils/constants';
import Table from '../Tables/Table';
import { getParams, setGlobalNavBarDetails } from '../../_utils/fx';
import { getDrivers } from '../../APIs/Read';
import AddTruck from '../Forms/AddTruck';
import { useParams } from 'react-router-dom';
import { useGlobalNavDispatch } from '../../contexts/GlobalNavContext';

function Trucks({ page, businessProfile: { partnerId, admin, businessName } }) {
  const { token, customerId: customerId2 } = useUserState();
  const setGlobalNavDetails = useGlobalNavDispatch();

  const { customerId } = useParams();

  // eslint-disable-next-line no-unused-vars
  let status, mPage;

  const params = getParams(window.location.search);
  if (params.status) {
    // eslint-disable-next-line no-unused-vars
    status = params.status;
  } else {
    mPage = parseInt(params.page, 10);
  }

  const [currentPage, setcurrentPage] = useState(mPage > 1 ? mPage : 1);
  const [totalDrivers, setTotalDrivers] = useState(0);
  const [trucks, setTrucks] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [limit] = useState(30);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  const [defaultEndpoint, setDefaultEndpoint] = useState(`/truck?partnerId=${partnerId}&limit=${limit}`);

  useEffect(() => {
    setGlobalNavBarDetails({ navTitle: <>{t('tableHeaders.trucks')}</>, itemId: undefined }, setGlobalNavDetails);
  }, [setGlobalNavDetails, t]);

  useEffect(() => {
    if (currentPage > 1) {
      setDefaultEndpoint(`/truck?partnerId=${partnerId}&page=${currentPage}&limit=${limit}`);
    }
  }, [currentPage, customerId2, limit, partnerId]);

  useEffect(() => {
    fetchDrivers();
    // eslint-disable-next-line
  }, [defaultEndpoint, partnerId, token]);

  const fetchDrivers = () => {
    if (partnerId !== null) {
      (async () => {
        setLoading(true);
        try {
          const res = await getDrivers({ defaultEndpoint, token });
          if (res) {
            setTotalDrivers(res.data.data.total);
            setTrucks(res.data.data.fleets);
            setTotalPage(res.data.data.totalPages);
          }
          setLoading(false);
        } catch (error) {
          setLoading(false);
        }
      })();
    }
  };

  function nextPage() {
    if (currentPage < totalPage) {
      setcurrentPage(currentPage + 1);
    }
  }

  function prevPage() {
    setcurrentPage(currentPage - 1);
  }

  function updateTableData({ tableData }) {
    setTrucks(tableData);
  }

  function syncUp({ toastType, toastMessage }) {
    setModal({ showModal: false, modalType: undefined, modalItemId: undefined });
    setToast({
      showToast: true,
      toastType: toastType,
      toastMessage: toastMessage,
    });
    fetchDrivers();
  }

  function onSearch(e) {
    setSearchTerm(e.target.value);
  }

  useEffect(() => {
    if (searchTerm !== '') {
      setDefaultEndpoint(`truck/search?searchTerm=${searchTerm}&partnerId=${partnerId}`);
    } else {
      setDefaultEndpoint(`/truck?partnerId=${partnerId}&page=${currentPage}&limit=${limit}`);
    }
  }, [currentPage, customerId2, limit, partnerId, searchTerm]);

  function getModalToShow() {
    switch (modal.modalType) {
      case 'enable':
        return <EnableTransporterModal {...{ setModal, modal, syncUp, admin }} />;
      case crudEnums.CREATE:
        return (
          <AddTruck
            {...{
              pageParams: { setModal, updateTableData, syncUp, setTotalPage },
              endpointParams: {
                token,
                partnerId,
                customerId2,
                businessName,
              },
            }}
          />
        );

      default:
        return null;
    }
  }

  if (partnerId === null) {
    return (
      <div style={{ marginTop: '-4em' }}>
        <main>
          <EmptyTable
            errorTitle='Transporter module has not been enabled yet'
            errorSubtitle='Click below to enable transporter module'
          />
        </main>
        <div className='enableContainer'>
          <button
            className='enable'
            onClick={() =>
              setModal({
                showModal: true,
                modalType: 'enable',
                //   modalItemId: _id,
              })
            }
          >
            {t('buttons.enableTransporter')}
          </button>
        </div>
        <Modal {...{ modal, setModal }}>{getModalToShow()}</Modal>
        <Toast {...{ ...toast, setToast }} />
      </div>
    );
  }

  return (
    <PageContent>
      <header className='pageHeader'>
        <Card {...{ type: 'users', label: <>{t('forms.trucks')}</>, total: totalDrivers }} />
        <PageActions
          {...{ ownerComponent: 'trucks', modal, searchTerm, setModal, onSearch, customerId2, showSearch: true }}
        />
      </header>
      <div className='pageContent'>
        <UsersTableStyle>
          <Table
            {...{
              headers: trucksHeaders,
              tableFor: tableType.trucks,
              tableData: trucks,
              page,
              customerId,
              partnerId,
              currentPage,
              totalPage,
              nextPage,
              prevPage,
              token,
              setModal,
              loading,
              t,
            }}
          />
        </UsersTableStyle>
      </div>
      <Modal {...{ modal, setModal }}>{getModalToShow()}</Modal>
      <Toast {...{ ...toast, setToast }} />
    </PageContent>
  );
}

export default Trucks;
