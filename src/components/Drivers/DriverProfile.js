// import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
// import { format } from 'date-fns';
// import { createLogo } from '../../APIs/Create';
import { useFetch } from '../../APIs/Read';
import EditIcon from '../../assets/icons/pencil-write.svg';
import profileImagePlaceholder from '../../assets/icons/profile-placeholder-img.svg';
import { useGlobalNavDispatch } from '../../contexts/GlobalNavContext';
import { useUserState } from '../../contexts/UserContext';
import BusinessProfilePageStyle from '../../styles/BusinessProfilePageStyle';
// import { cardTypes } from '../../_utils/constants';
import { setGlobalNavBarDetails } from '../../_utils/fx';
import EditDriverDocsForm from '../Forms/EditDriverDocsForm';
import EditDriverInfoForm from '../Forms/EditDriverInfoForm';
import StarRating from '../General/StarRating';
// import { AnalyticsCard } from '../General/Card';
import ContentLoader from '../Loaders/ContentLoader';
import Modal from '../Modals/Modal';
import WaybillModal from '../Modals/WaybillModal';
import Error from '../Shared/Error';
import Toast from '../Shared/Toast/Toast';
import DriverDetails from './DriverDetails';

function DriverProfile({ partnerId }) {
  const setGlobalNavDetails = useGlobalNavDispatch();
  const { token } = useUserState();
  const { driverId } = useParams();

  // const fileInput = useRef(null);
  const { t } = useTranslation();
  // #region States
  const [waybillClass, setwaybillClass] = useState('');
  const [urls, seturls] = useState([]);
  const [driverProfile, setDriverProfile] = useState(undefined);
  const { response, error, isLoading } = useFetch(`driver/${driverId}`, token);
  const [truck, setTruck] = useState(undefined);

  // const [waybillClass, setwaybillClass] = useState('');
  const [modal, setModal] = useState({
    showModal: false, // true or false
    modalType: undefined, // string: create, read, update, or delete,
    modalItemId: undefined, // Used in times if updating or deleting.
  });
  const [toast, setToast] = useState({
    showToast: false,
    toastType: undefined,
    toastMessage: undefined,
  });

  useEffect(() => {
    setGlobalNavBarDetails({ navTitle: <>{t('common.driverProfile')}</>, itemId: undefined }, setGlobalNavDetails);
  }, [setGlobalNavDetails, t]);

  useEffect(() => {
    if (response) {
      setDriverProfile(response.driver);
    }
  }, [response]);

  function showWaybill() {
    seturls([].concat(driverProfile.license));

    setwaybillClass('showWaybill');
  }

  function closeWaybill() {
    setwaybillClass('');
  }

  function getModalToShow() {
    switch (modal.modalType) {
      case 'editDriverInfo':
        return (
          <EditDriverInfoForm
            {...{
              firstName: driverProfile.first_name,
              lastName: driverProfile.last_name,
              phone: driverProfile.mobile,
              auth_id: driverProfile.auth_id || driverProfile.id,
              token,
              setDriverProfile,
              syncUp,
            }}
          />
        );
      case 'editDriverDocs':
        return (
          <EditDriverDocsForm
            {...{
              licenseNumber: driverProfile.license_no,
              expMonth: driverProfile.license_exp_mnt,
              expYear: driverProfile.license_exp_year,
              driverId: driverProfile.id,
              token,
              setDriverProfile,
              syncUp,
            }}
          />
        );
      // case 'editPartnerInfo':
      //   return (
      //     <EditPartnerInfoForm
      //       {...{ driverId: driverProfile.id, token, driverName: driverProfile.partner.business_name }}
      //     />
      //   );
      default:
        return null;
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

  // #region Renders
  if (isLoading) {
    return <ContentLoader />;
  }
  if (error) {
    return <Error {...{ error }} />;
  }

  return (
    <BusinessProfilePageStyle>
      {/* left */}
      <DriverDetails
        {...{
          profileImageParams: {
            // preview,
            driverProfile,
            profileImagePlaceholder,
            showWaybill,
            // fileInput,
            // handleImageChange,
            // openDialog,
            // urls,
            // seturls,
          },
          profileParams: { partnerId, setTruck },
          fnParams: { showWaybill },
        }}
      />
      {/* middle */}
      <div className='middleContent'>
        <div className='accountOwnerBlock generalInfoBlock'>
          <header>
            <h1 className='title'>{t('incomingTruck.driverInfo')}</h1>
            <button
              style={{ padding: 0 }}
              className='editButton'
              type='button'
              onClick={() => setModal({ showModal: true, modalType: 'editDriverInfo', modalItemId: undefined })}
            >
              <span className='icon'>
                <img src={EditIcon} alt='Edit' />
              </span>
              <span>
                <>{t('buttons.edit')}</>
              </span>
            </button>
          </header>
          <div className='generalInfoContent'>
            <div className='contactPersonBlock'>
              <p>{t('forms.firstName')}</p>
              <p>{driverProfile.first_name}</p>
            </div>

            <div className='contactPersonBlock'>
              <p>{t('forms.lastName')}</p>
              <p>{driverProfile.last_name}</p>
            </div>

            <div className='phoneNumberBlock'>
              <p>{t('businessProfile.phoneNumber')}</p>
              <p>{driverProfile.mobile}</p>
            </div>

            <div className='emailAddressBlock'>
              <p>{t('actions.status')}</p>
              <p>{driverProfile.status === 1 ? 'Available' : 'Not-Avaialble'}</p>
            </div>
          </div>
        </div>

        {/* Driver's info */}
        <div className='generalInfoBlock'>
          <header>
            <h1 className='title'>
              <>{t('common.driverDocuments')}</>
            </h1>
            <button
              style={{ padding: 0 }}
              className='editButton'
              type='button'
              onClick={() => setModal({ showModal: true, modalType: 'editDriverDocs', modalItemId: undefined })}
            >
              <span className='icon'>
                <img src={EditIcon} alt='Edit' />
              </span>
              <span>
                <>{t('buttons.edit')}</>
              </span>
            </button>
          </header>
          <div className='generalInfoContent'>
            <div className='businessNameBlock'>
              <p>{t('common.driverLicenseNo')}</p>
              <p>{driverProfile.license_no || 'N/A'}</p>
            </div>
            <div className='businessNameBlock'>
              <p>{t('tableHeaders.expirydate')}</p>
              {(driverProfile.license_exp_mnt && (
                <p>
                  {driverProfile.license_exp_mnt} - {driverProfile.license_exp_year}
                </p>
              )) || <p>N/A</p>}
            </div>
          </div>
        </div>

        {/* Partner info */}
        {
          <div className='generalInfoBlock'>
            <header>
              <h1 className='title'>
                <>{t('incomingTruck.partnerInfo')}</>
              </h1>
              {/* <button
                className='editButton'
                type='button'
                onClick={() => setModal({ showModal: true, modalType: 'editPartnerInfo', modalItemId: undefined })}
              >
                <span className='icon'>
                  <img src={EditIcon} alt='Edit' />
                </span>
                <span>
                  <>{t('buttons.edit')}</>
                </span>
              </button> */}
            </header>
            <div className='generalInfoContent'>
              <div className='businessNameBlock'>
                <p>{t('tableHeaders.partner')}</p>
                <p>{driverProfile.partner.business_name || 'N/A'}</p>
              </div>
              <div className='businessNameBlock'>
                <p>{t('incomingTruck.driverMobile')}</p>
                <p>{driverProfile.partner.mobile || 'N/A'}</p>
              </div>
            </div>
          </div>
        }

        {/* Truck info */}
        {truck && (
          <div className='generalInfoBlock'>
            <header>
              <h1 className='title'>
                <>{t('common.truckInfo')}</>
              </h1>
              {/* <button
                style={{ padding: 0 }}
                className='editButton'
                type='button'
                  onClick={() => setModal({ showModal: true, modalType: 'update', modalItemId: undefined })}
              >
                <span className='icon'>
                  <img src={EditIcon} alt='Edit' />
                </span>
                <span>
                  <>{t('buttons.edit')}</>
                </span>
              </button> */}
            </header>
            <div className='generalInfoContent'>
              <div className='businessNameBlock'>
                <p>{t('trips.truckRegistration')}</p>
                <p>{truck.regNumber || 'N/A'}</p>
              </div>
              <div className='businessNameBlock'>
                <p>{t('forms.assetClass')}</p>
                <p>{`${truck.asset.type} ${truck.asset.size} ${truck.asset.unit}` || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}
        {/* <BusinessUnit {...{ business_name: businessProfile.business_name }} /> */}
      </div>
      {/* right */}
      <div className='rightContent'>
        <div>
          <p style={{ color: '#999999', marginBottom: 5, fontSize: '1.2em' }}>{t('tableHeaders.driverRating')}</p>
          <StarRating {...{ value: driverProfile.rate }} />
        </div>
        <Link to={`/${partnerId}/truck_requests?status=open_requests&page=1`}>
          {/* <AnalyticsCard
            {...{
            //   promises: {
            //     analyticsPromises: {
            //       response: analytics.noDrivers,
            //       isLoading: customerAnalyticsIsLoading,
            //       error: customerAnalyticsError,
            //     },
            //   },
              cardDisplayParams: {
                cardType: cardTypes.DRIVERS,
                cardTitle: 'Drivers',
              },
              styles: {
                color: 'green',
                icon: 'common-file-text-edit',
              },
            }}
          /> */}
        </Link>
      </div>
      <Modal {...{ modal, setModal }}>{getModalToShow()}</Modal>
      <WaybillModal {...{ closeWaybill, waybillClass, urls }} />
      <Toast {...{ ...toast, setToast }} />
    </BusinessProfilePageStyle>
  );
  // #endregion
}

export default DriverProfile;
