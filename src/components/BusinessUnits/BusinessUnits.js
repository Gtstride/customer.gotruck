import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGlobalNavDispatch } from '../../contexts/GlobalNavContext';
import { useUserState } from '../../contexts/UserContext';
import { setGlobalNavBarDetails } from '../../_utils/fx';
import CreateBusinessUnitForm from '../Forms/CreateBusinessUnitForm';
import EditBusinessUnitNameForm from '../Forms/EditBusinessUnitNameForm';
import Card from '../General/Card';
import Modal from '../Modals/Modal';
import PageActions from '../PageActions';
import PageContent from '../PageContent';
import Toast from '../Shared/Toast/Toast';
import BusinessUnitCards from './BusinessUnitCards';
import { useFetch } from '../../APIs/Read';

function BusinessUnits() {
  // #region Contexts
  const setGlobalNavDetails = useGlobalNavDispatch();
  const { customerId, token, businessUnit, businessId } = useUserState();
  // #endregion
  const { t } = useTranslation();
  const isNotAdmin = businessUnit && typeof businessUnit === 'string' && businessUnit.toLowerCase() !== 'admin';

  // #region States
  const { response, error, isLoading } = useFetch(`/customer/${customerId}/sections`, token);
  const [totalBusinessUnit, setTotalBusinessUnits] = useState(0);
  const [businessUnits, setBusinessUnits] = useState([]);

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
    setGlobalNavBarDetails({ navTitle: <>{t('bizUnit.businessUnits')}</>, itemId: undefined }, setGlobalNavDetails);
  }, [setGlobalNavDetails, t]);
  // #endregion

  // #region Fnctions
  function getModalToShow() {
    switch (modal.modalType) {
      case 'create':
        return (
          <CreateBusinessUnitForm
            {...{
              setModal,
              endpointParams: { token, customerId },
              syncUp,
              tableUpdateParams: {
                prependTableRow,
              },
            }}
          />
        );
      case 'editBusinessUnitName':
        return (
          <EditBusinessUnitNameForm
            {...{
              setModal,
              token,
              customerId,
              syncUp,
              businessUnitId: modal.modalItemId,
              businessUnit: businessUnits.find(({ id }) => id === modal.modalItemId),
            }}
          />
        );
      default:
        return null;
    }
  }

  function prependTableRow({ data }) {
    const newData = businessUnits.unshift(data.section);
    setBusinessUnits(businessUnits);
    setTotalBusinessUnits(newData);
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

  useEffect(() => {
    // shows the appropriate business Unit if the user isn't an admin
    const filteredResponses =
      isNotAdmin && response && response.sections && response.sections.length
        ? response.sections.filter(res => res.id === businessId)
        : response && response.sections
        ? response.sections
        : [];
    setBusinessUnits(filteredResponses);
    setTotalBusinessUnits((response && response.sections && response.sections.length) || 0);
    // eslint-disable-next-line
  }, [response]);

  // #region Renders
  return (
    <PageContent>
      <header className='pageHeader'>
        <Card
          {...{
            type: 'businessUnits',
            label: <>{t('bizUnit.businessUnit')}</>,
            currency: '',
            total: totalBusinessUnit,
          }}
        />
        {!isNotAdmin && <PageActions {...{ modal, setModal, ownerComponent: 'business units' }} />}
      </header>
      <BusinessUnitCards
        {...{
          response,
          error,
          isLoading,
          setModal,
          setTotalBusinessUnits,
          businessUnits,
          setParentCompBusinessUnits: setBusinessUnits,
          t,
        }}
      />
      <Modal {...{ modal, setModal }}>{getModalToShow()}</Modal>
      <Toast {...{ ...toast, setToast }} />
    </PageContent>
  );
  // #endregion
}

export default BusinessUnits;
