import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import EmptyTable from '../EmptyData/EmptyTable';
import Modal from '../Modals/Modal';
import EnableTransporterModal from '../Modals/EnableTransporterModal';
import { useUserState } from '../../contexts/UserContext';
import PageContent from '../PageContent';
import { driversHeaders } from '../../_utils/tableheaders';
import Card from '../General/Card';
import PageActions from '../PageActions';
import UsersTableStyle from '../../styles/UsersTableStyle';
import Toast from '../Shared/Toast/Toast';
import { tableType, crudEnums } from '../../_utils/constants';
import Table from '../Tables/Table';
import { getParams, setGlobalNavBarDetails } from '../../_utils/fx';
import AddDriver from '../Forms/AddDriver';
import { getDrivers } from '../../APIs/Read';
import { useGlobalNavDispatch } from '../../contexts/GlobalNavContext';


function Drivers({ page, partnerId, admin }) {
  const { token, customerId } = useUserState();
  const setGlobalNavDetails = useGlobalNavDispatch();
  // eslint-disable-next-line no-unused-vars
  let status, mPage;

  const params = getParams(window.location.search);
  if (params.status) {
    status = params.status;
  } else {
    mPage = parseInt(params.page, 10);
  }

  const [currentPage, setcurrentPage] = useState(mPage > 1 ? mPage : 1);
  const [totalDrivers, setTotalDrivers] = useState(0);
  const [drivers, setDrivers] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [limit] = useState(30);
  const [loading, setLoading] = useState(false);

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
  const [searchTerm, setSearchTerm] = useState('');
  const [defaultEndpoint, setDefaultEndpoint] = useState(
    `/driver?customerId=${customerId}&partnerId=${partnerId}&limit=${limit}`
  );

  useEffect(() => {
    if(currentPage > 1) {
      setDefaultEndpoint(`/driver?customerId=${customerId}&partnerId=${partnerId}&page=${currentPage}&limit=${limit}`);
    }
  }, [currentPage, customerId, limit, partnerId]);

  useEffect(() => {
    setGlobalNavBarDetails(
      { navTitle: <>{t('tableHeaders.drivers')}</>, itemId: undefined },
      setGlobalNavDetails,
    );
  }, [setGlobalNavDetails, t]);

  useEffect(() => {
    if(partnerId !== null) {
      (async() => {
        setLoading(true);
        try {
          const res = await getDrivers({defaultEndpoint, token});
          if(res) {
            setTotalDrivers(res.data.data.total);
            setDrivers(res.data.data.drivers);
            setTotalPage(res.data.data.totalPages);
          }
          setLoading(false);

        } catch (error) {
          setLoading(false);
          
        }
      })();
    }
  }, [defaultEndpoint, partnerId, token]);

  function nextPage() {
    if (currentPage < totalPage) {
      setcurrentPage(currentPage + 1);
    }
  }

  function prevPage() {
    setcurrentPage(currentPage - 1);
  }

  function updateTableData({ tableData }) {
    setDrivers(tableData);
  }

  function syncUp({ toastType, toastMessage }) {
    setModal({ showModal: false, modalType: undefined, modalItemId: undefined });
    setToast({
      showToast: true,
      toastType: toastType,
      toastMessage: toastMessage,
    });
  }

  function getModalToShow() {
    switch (modal.modalType) {
      case 'enable':
        return <EnableTransporterModal {...{ setModal, modal, syncUp, admin }} />;
      case crudEnums.CREATE:
        return (
          <AddDriver
            {...{
              pageParams: { setModal, updateTableData, syncUp },
              endpointParams: {
                token,
                partnerId,
                customerId
              },
            }}
          />
        );

      default:
        return null;
    }
  }

  function onSearch(e) {
    setSearchTerm(e.target.value);
  }

  useEffect(() => {
    if (searchTerm !== '') {
      setDefaultEndpoint(`driver/search?searchTerm=${searchTerm}&partnerId=${partnerId}`);
    } else {
      setDefaultEndpoint(`/driver?customerId=${customerId}&partnerId=${partnerId}&page=${currentPage}&limit=${limit}`);
    }
  }, [currentPage, customerId, limit, partnerId, searchTerm]);
  
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
      <Card {...{ type: 'users', label: <>{t('tableHeaders.drivers')}</>, total: totalDrivers }} />
        <PageActions {...{ ownerComponent: 'drivers', modal, searchTerm, onSearch, setModal, customerId, showSearch: true, }} />
      </header>
      <div className='pageContent'>
        <UsersTableStyle>
          <Table
            {...{
              headers: driversHeaders,
              tableFor: tableType.drivers,
              tableData: drivers,
              page,
              customerId,
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

export default Drivers;
