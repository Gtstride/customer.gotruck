import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { deletePickupLocation } from '../../APIs/Delete';
import { useGlobalNavDispatch } from '../../contexts/GlobalNavContext';
import { useUserState } from '../../contexts/UserContext';
import PickpLocationTableStyle from '../../styles/PickpLocationTableStyle';
import { tableType } from '../../_utils/constants';
import { setGlobalNavBarDetails } from '../../_utils/fx';
import { pickupLocationHeaders } from '../../_utils/tableheaders';
import CreateNewPickupLocationForm from '../Forms/CreateNewPickupLocationForm';
import UpdatePickupLocationForm from '../Forms/UpdatePickupLocationForm';
import Card from '../General/Card';
import DeleteModal from '../Modals/DeleteModal';
import Modal from '../Modals/Modal';
import PageActions from '../PageActions';
import PageContent from '../PageContent';
import Toast from '../Shared/Toast/Toast';
import TableWithoutBizId from '../Tables/TableWithoutBizId';
import { toastEnums } from '../../_utils/constants';

function PickupLocations() {
  // #region Contexts
  const setGlobalNavDetails = useGlobalNavDispatch();
  const { customerId, token } = useUserState();
  // #endregion
  const { t } = useTranslation();

  // #region States
  const [totalPickupLocations, setTotalPickupLocations] = useState();
  const [locations, setLocations] = useState([]);
  const [toast, setToast] = useState({
    showToast: false,
    toastType: undefined,
    toastMessage: undefined,
  });
  const [modal, setModal] = useState({
    showModal: false, // true or false
    modalType: undefined, // string: create, read, update, or delete,
    modalItemId: undefined, // Used in times if updating or deleting.
  });
  // #endregion

  // #region Effects
  useEffect(() => {
    setGlobalNavBarDetails({ navTitle: <>{t('navTitle.pickup')}</>, itemId: undefined }, setGlobalNavDetails);
  }, [setGlobalNavDetails, t]);
  // #endregion

  // #region Functions
  function getModalToShow() {
    switch (modal.modalType) {
      case 'create':
        return <CreateNewPickupLocationForm {...{ updateTableData, token, setModal, customerId, syncUp }} />;
      case 'update':
        return (
          <UpdatePickupLocationForm
            {...{
              updateTableData,
              setModal,
              location: locations.find(location => location.id === modal.modalItemId),
              syncUp,
              endpointParams: {
                customerId,
                locationId: modal.modalItemId,
                token,
              },
            }}
          />
        );
      case 'delete':
        return <DeleteModal {...{ setModal, label: `${t('common.pickupLocation')}`, deleteAction }} />;
      default:
        return null;
    }
  }

  function removeItemFromArray({ array, itemId }) {
    return array.filter(arrayItem => arrayItem.id !== itemId);
  }

  async function deleteAction() {
    try {
      const res = await deletePickupLocation({ customerId, pickupLocationId: modal.modalItemId, token });

      if (res.status === 200) {
        const filteredArray = removeItemFromArray({ array: locations, itemId: modal.modalItemId });
        setLocations(filteredArray);
        setModal({ showModal: false, modalType: undefined, modalItemId: undefined });
        syncUp({ toastType: toastEnums.SUCCESS, toastMessage: 'Location deleted' });
      }
    } catch ({ response }) {
      let message = 'failure deleting location';
      message = (response && response.data.message) || message;
      syncUp({ toastType: toastEnums.FAILURE, toastMessage: message });
    }
  }

  function updateTableData({ tableData }) {
    setLocations(tableData);
  }

  function syncUp({ toastType, toastMessage }) {
    setModal({ showModal: false, modalType: undefined, modalItemId: undefined });
    setToast({
      showToast: true,
      toastType,
      toastMessage: toastMessage,
    });
  }

  // #endregion

  // #region Renders
  return (
    <PageContent>
      <header className='pageHeader'>
        <Card
          {...{
            type: tableType.pickupLocations,
            label: <>{t('navTitle.pickup')}</>,
            total: totalPickupLocations,
            currency: '',
          }}
        />
        <PageActions {...{ ownerComponent: 'pickup locations', modal, setModal, customerId }} />
      </header>
      <div className='pageContent'>
        <PickpLocationTableStyle>
          <TableWithoutBizId
            {...{
              headers: pickupLocationHeaders,
              tableFor: tableType.pickupLocations,
              updatedTableData: locations,
              setTableItemsTotal: setTotalPickupLocations,
              setTableItem: setLocations,
              endpoint: `/customer/locations?customer_id=${customerId}`,
              token,
              setModal,
              t,
            }}
          />
        </PickpLocationTableStyle>
      </div>
      <Modal {...{ modal, setModal }}>{getModalToShow()}</Modal>
      <Toast {...{ ...toast, setToast }} />
    </PageContent>
  );
  // #endregion
}

export default PickupLocations;
