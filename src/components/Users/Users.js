import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGlobalNavDispatch } from '../../contexts/GlobalNavContext';
import { useUserState } from '../../contexts/UserContext';
import UsersTableStyle from '../../styles/UsersTableStyle';
import { crudEnums, tableType } from '../../_utils/constants';
import { setGlobalNavBarDetails } from '../../_utils/fx';
import { usersHeaders } from '../../_utils/tableheaders';
import AddUserForm from '../Forms/AddUserForm';
import UpdateUserForm from '../Forms/UpdateUserForm';
import Card from '../General/Card';
import Modal from '../Modals/Modal';
import PageActions from '../PageActions';
import PageContent from '../PageContent';
import Toast from '../Shared/Toast/Toast';
import TableWithoutBizId from '../Tables/TableWithoutBizId';
import UserSidePane from './UserSidePane';

function Users() {
  // #region Contexts
  const setGlobalNavDetails = useGlobalNavDispatch();
  const { customerId, token } = useUserState();
  // #endregion

  // #region States
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [toast, setToast] = useState({
    showToast: false,
    toastType: undefined,
    toastMessage: undefined,
  });
  const [modal, setModal] = useState({
    showModal: false, // true or false
    modalType: undefined, // string: create, read, update, or delete,
    modalItemId: crudEnums.UPDATE, // Used in times if updating or deleting.
  });
  // #endregion
  const { t } = useTranslation();

  // #region Effects

  useEffect(() => {
    setGlobalNavBarDetails({ navTitle: <>{t('common.users')}</>, itemId: undefined }, setGlobalNavDetails);
  }, [customerId, setGlobalNavDetails, t, token]);
  // #endregion

  // #region Functions
  function getModalToShow() {
    const user = users.find(user => user.id === modal.modalItemId);

    switch (modal.modalType) {
      case crudEnums.CREATE:
        return (
          <AddUserForm
            {...{
              pageParams: {
                syncUp,
                setModal,
                updateTableData,
              },
              endpointParams: { token, customerId },
            }}
          />
        );
      case crudEnums.UPDATE:
        return (
          <UpdateUserForm
            {...{
              user,
              syncUp,
              setModal,
              updateTableData,
              endpointParams: {
                customerId,
                userId: modal.modalItemId,
                token,
              },
            }}
          />
        );

      case crudEnums.READ:
        return <UserSidePane {...{ setModal, user }} />;
      default:
        return null;
    }
  }

  function updateTableData({ tableData }) {
    setUsers(tableData);
  }

  function syncUp({ toastType, toastMessage }) {
    setModal({ showModal: false, modalType: undefined, modalItemId: undefined });
    setToast({
      showToast: true,
      toastType: toastType,
      toastMessage: toastMessage,
    });
  }

  // #endregion

  // #region Renders
  return (
    <PageContent>
      <header className='pageHeader'>
        <Card {...{ type: 'users', label: <>{t('common.users')}</>, total: totalUsers, currency: '' }} />
        <PageActions {...{ ownerComponent: 'users', modal, setModal, customerId }} />
      </header>
      <div className='pageContent'>
        <UsersTableStyle>
          <TableWithoutBizId
            {...{
              headers: usersHeaders,
              tableFor: tableType.users,
              updatedTableData: users,
              setTableItem: setUsers,
              setTableItemsTotal: setTotalUsers,
              endpoint: `/customer/${customerId}/users`,
              token,
              setModal,
            }}
          />
        </UsersTableStyle>
      </div>
      <Modal {...{ modal, setModal }}>{getModalToShow()}</Modal>
      <Toast {...{ ...toast, setToast }} />
    </PageContent>
  );
  // #endregion
}

export default Users;
