/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { deleteRecipient } from '../../APIs/Delete';

import { getPolicyRequestByCustomer } from '../../APIs/Read';

import { useGlobalNavDispatch } from '../../contexts/GlobalNavContext';

import { useUserState } from '../../contexts/UserContext';

import RecipientTableStyle from '../../styles/RecipientTableStyle';

import TableStyle from '../../styles/TableStyle';

import { crudEnums, toastEnums } from '../../_utils/constants';

import { isArrayEmpty, setGlobalNavBarDetails } from '../../_utils/fx';

import { policyRequestHeaders } from '../../_utils/tableheaders';

import EmptyTable from '../EmptyData/EmptyTable';

import AddInsuranceForm from '../Forms/AddInsuranceForm';

import UpdateRecipientForm from '../Forms/UpdateRecipientForm';

import ContentLoader from '../Loaders/ContentLoader';

import DeleteModal from '../Modals/DeleteModal';

import Modal from '../Modals/Modal';

import PageActions from '../PageActions';

import PageContent from '../PageContent';

import Error from '../Shared/Error';

import Toast from '../Shared/Toast/Toast';

import TableContent from '../Tables/TableContent';

import TableHeader from '../Tables/TableHeader';

import PolicyRequestSidePane from './PolicyRequestSidePane';


function Table({

  promises: {

    recipientsPromise: { recipients, recipientsFetchError, recipientsFetchIsLoading },

  },

  tableParams: { tableFor, headers },

  pageParams: { page, setModal },

  t,

}) {

  if (recipientsFetchIsLoading) {

    return <ContentLoader />;

  }


  if (isArrayEmpty(recipients)) {

    return (

      <main>

        <EmptyTable errorTitle='' errorSubtitle={`${t('emptyData.noAvailableRecipients')}`} />

      </main>

    );

  }


  if (recipientsFetchError) {

    return <Error {...{ error: recipientsFetchError }} />;

  }


  return (

    <main>

      <TableStyle>

        <table id='table' data-table-for={tableFor.toLowerCase()}>

          <TableHeader

            {...{

              headers,

            }}

          />

          

          <TableContent

            {...{

              tableData: recipients,

              tableFor,

              page,

              setModal,

            }}

          />

        </table>
      </TableStyle>

    </main>

  );

}


function PolicyRequest() {

  // #region Contexts

  const setGlobalNavDetails = useGlobalNavDispatch();

  const { customerId, token } = useUserState();

  // #endregion

  const { t } = useTranslation();


  // #region States

  const [toast, setToast] = useState({ showToast: false, toastType: undefined, toastMessage: undefined });

  const [modal, setModal] = useState({

    showModal: false, // true or false

    modalType: undefined, // string: create, read, update, or delete,

    modalItemId: crudEnums.UPDATE, // Used in times if updating or deleting.

  });


  const [recipients, setRecipients] = useState([]);

  const [policyRequests, setPolicyRequests] = useState([]);

  const [loading, setLoading] = useState(false);


  // #endregion

  useEffect(() => {

    getCustomerPolicies();

    // eslint-disable-next-line

  }, [customerId, token]);


  const getCustomerPolicies = () => {

    setLoading(true);

    getPolicyRequestByCustomer(customerId, token)

      .then(res => {

        setLoading(false);

        console.log('policies', res);

        setPolicyRequests(res && res.data && res.data.data ? res.data.data : []);

      })

      .catch(e => {

        setLoading(false);

        console.log('err', e);

      });

  };


  // #region Effects

  useEffect(() => {

    setGlobalNavBarDetails({ navTitle: <>{'Insurance'}</>, itemId: undefined }, setGlobalNavDetails);

  }, [customerId, setGlobalNavDetails, t, token]);

  // #region Functions

  function getModalToShow() {

    const recipient = recipients.find(recipient => recipient.id === modal.modalItemId);


    switch (modal.modalType) {

      case crudEnums.CREATE:

        return (

          <AddInsuranceForm

            {...{

              pageParams: { setModal, updateTableData, syncUp },

              endpointParams: {

                token,

                customerId,

                // id,

              },

            }}

          />

        );

      case crudEnums.UPDATE:

        return (

          <UpdateRecipientForm

            {...{

              pageParams: {

                setModal,

                updateTableData,

                syncUp,

                recipient,

              },

              endpointParams: {

                customerId,

                recipientId: modal.modalItemId,

                token,

              },

            }}

          />

        );

      case crudEnums.DELETE:

        return <DeleteModal {...{ setModal, label: `${t('navTitle.recipients')}`, deleteAction }} />;

      case crudEnums.READ:

        return <PolicyRequestSidePane {...{ setModal, recipient }} />;

      default:

        return null;

    }

  }


  function removeItemFromArray({ array, itemId }) {

    return array.filter(arrayItem => arrayItem.id !== itemId);

  }


  async function deleteAction() {

    try {

      const res = await deleteRecipient({ customerId, recipientId: modal.modalItemId, token });


      if (res.status === 200) {

        const filteredArray = removeItemFromArray({ array: recipients, itemId: modal.modalItemId });

        setRecipients(filteredArray);

        setModal({ showModal: false, modalType: undefined, modalItemId: undefined });

        syncUp({ toastType: toastEnums.SUCCESS, toastMessage: 'success deleting recipient' });

      }

    } catch ({ response }) {

      let message = (response && response.data.message) || 'failure deleting recipient';

      syncUp({ toastType: toastEnums.FAILURE, toastMessage: message });

    }

  }


  function updateTableData({ tableData }) {

    setRecipients(tableData);

  }


  function syncUp({ toastType, toastMessage }) {

    setModal({ showModal: false, modalType: undefined, modalItemId: undefined });

    setToast({

      showToast: true,

      toastType,

      toastMessage: toastMessage,

    });

    getCustomerPolicies();

  }


  // #endregion

  // #region Renders

  return (

    <PageContent>

      <header className='pageHeader'>
        <PageActions {...{ ownerComponent: 'Insurances', modal, setModal, customerId }} />

      </header>

      <div className='pageContent'>

        <RecipientTableStyle>

          <Table

            {...{

              promises: {

                recipientsPromise: {

                  recipients: policyRequests,

                  // recipientsFetchError,

                  recipientsFetchIsLoading: loading,

                },

              },

              tableParams: {

                headers: policyRequestHeaders,

                tableFor: 'policyRequest',

              },

              pageParams: {

                page: 'insurance',

                setModal,

              },

              t,

            }}

          />

        </RecipientTableStyle>

      </div>

      <Modal {...{ modal, setModal }}>{getModalToShow()}</Modal>

      <Toast {...{ ...toast, setToast }} />

    </PageContent>

  );

  // #endregion

}


export default PolicyRequest;
