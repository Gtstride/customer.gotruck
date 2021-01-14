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
import { setGlobalNavBarDetails, baseurl, lang } from '../../_utils/fx';
import Delete from '../../assets/icons/bin.svg';
// import { AnalyticsCard } from '../General/Card';
import ContentLoader from '../Loaders/ContentLoader';
import Modal from '../Modals/Modal';
import WaybillModal from '../Modals/WaybillModal';
import Error from '../Shared/Error';
import Toast from '../Shared/Toast/Toast';
import TruckDetails from './TruckDetails';
import Upload from '../../assets/icons/upload-big-green.svg';
import UploadTruckDoc from '../Modals/UploadTruckDoc';
import EditTruckInfo from '../Forms/EditTruckInfo';
import { toastEnums } from '../../_utils/constants';
import EditTruckInsurance from '../Forms/EditTruckInsurance';

const Apptoken = process.env.REACT_APP_APPTOKEN;

function Truck({ partnerId }) {
  const setGlobalNavDetails = useGlobalNavDispatch();
  const { token } = useUserState();
  const { truckId } = useParams();

  // const fileInput = useRef(null);
  const { t } = useTranslation();
  // #region States
  const [waybillClass, setwaybillClass] = useState('');
  const [urls, seturls] = useState([]);
  const [truckProfile, setTruckProfile] = useState(undefined);
  const { response, error, isLoading } = useFetch(`truck/${truckId}`, token);

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
    if (response) {
      setTruckProfile(response.fleet);
    }
  }, [response]);

  useEffect(() => {
    setGlobalNavBarDetails(
      { navTitle: <>{t('tableHeaders.truck')}</>, itemId: truckProfile ? truckProfile.regNumber : undefined },
      setGlobalNavDetails,
    );
  }, [setGlobalNavDetails, t, truckProfile]);

  function showWaybill(image) {
    seturls([].concat(image));

    setwaybillClass('showWaybill');
  }

  function closeWaybill() {
    setwaybillClass('');
  }

  function getModalToShow() {
    switch (modal.modalType) {
      case 'uploadProof':
        return <UploadTruckDoc {...{ truckProfile, setModal, modal, syncUp, setTruckProfile }} />;
      case 'uploadWorthiness':
        return <UploadTruckDoc {...{ truckProfile, setModal, modal, syncUp, setTruckProfile }} />;
      case 'editTruckInfo':
        return (
          <EditTruckInfo
            {...{
              truckProfile,
              token,
              setTruckProfile,
              syncUp,
            }}
          />
        );
      case 'editDriverDocs':
        return (
          <EditTruckInsurance
            {...{
              truckProfile,
              token,
              setTruckProfile,
              syncUp,
            }}
          />
        );

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

  async function deleteDoc(data) {
    try {
      const res = await baseurl.put(`/truck/${truckProfile._id}?language=${lang}`, data, {
        headers: { Authorization: `Bearer ${token}`, Apptoken },
      });
      if (res.data.data) {
        syncUp({
          toastType: toastEnums.SUCCESS,
          toastMessage: 'Successfully deleted',
        });

        setTruckProfile({ ...truckProfile, ...res.data.data });
      }
    } catch (error) {
      setToast({
        showToast: true,
        toastType: toastEnums.FAILURE,
        toastMessage: 'An error occur while performing this action',
      });
    }
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
      <TruckDetails
        {...{
          profileImageParams: {
            // preview,
            truckProfile,
            profileImagePlaceholder,
            showWaybill,
            // fileInput,
            // handleImageChange,
            // openDialog,
            // urls,
            // seturls,
          },
          profileParams: { partnerId },
          fnParams: { showWaybill },
          setTruckProfile
        }}
      />
      {/* middle */}
      <div className='middleContent'>
        <div className='accountOwnerBlock generalInfoBlock'>
          <header>
            <h1 className='title'>{t('invoices.generalInfo')}</h1>
            <button
              style={{ padding: 0 }}
              className='editButton'
              type='button'
              onClick={() => setModal({ showModal: true, modalType: 'editTruckInfo', modalItemId: undefined })}
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
              <p>{t('forms.regNumber')}</p>
              <p>{truckProfile.regNumber}</p>
            </div>

            <div className='contactPersonBlock'>
              <p>{t('forms.truckType')}</p>
              <p>
                {truckProfile.asset.type} {truckProfile.asset.size} {truckProfile.asset.unit}
              </p>
            </div>

            <div className='phoneNumberBlock'>
              <p>{t('forms.make')}</p>
              <p>{truckProfile.make}</p>
            </div>

            <div className='phoneNumberBlock'>
              <p>{t('forms.model')}</p>
              <p>{truckProfile.model}</p>
            </div>

            <div className='emailAddressBlock'>
              <p>{t('actions.status')}</p>
              <p>{truckProfile.active ? 'Active' : 'InActive'}</p>
            </div>
          </div>
        </div>

        {/* Driver's info */}
        <div className='generalInfoBlock'>
          <header>
            <h1 className='title'>
              <>{t('common.insuranceInfo')}</>
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
              <p><>{t('common.insuranceNum')}</></p>
              <p>{(truckProfile.insurance && truckProfile.insurance.insuranceNo) || 'N/A'}</p>
            </div>
            <div className='businessNameBlock'>
              <p>{t('tableHeaders.expirydate')}</p>
              {(truckProfile.insurance && (
                <p>
                  {truckProfile.insurance.expMnt} - {truckProfile.insurance.expYear}
                </p>
              )) || <p>N/A</p>}
            </div>

            {truckProfile.insurance && truckProfile.insurance.image && (
              <div className='businessNameBlock'>
                <p><>{t('common.insuranceImage')}</></p>
                <img src={truckProfile.insurance.image} alt='' width={50} />
              </div>
            )}
          </div>
        </div>

        {/* Truck Documents */}

        <div className='generalInfoBlock'>
          <header>
            <h1 className='title'>
              <>{t('common.truckDocuments')}</>
            </h1>
          </header>
          <div
            className='generalInfoContent'
            style={{ display: 'flex', marginTop: 20, marginBottom: '2em', justifyContent: 'space-evenly' }}
          >
            {(truckProfile.proofOfOwnership && truckProfile.proofOfOwnership !== ' ' && (
              <div class='container_'>
                <img src={truckProfile.proofOfOwnership} alt='proofOfOwnership' />
                <div class='overlay' onClick={() => showWaybill(truckProfile.proofOfOwnership)}>
                  <div class='actionIcons'>
                    <img
                      src={Delete}
                      alt=''
                      onClick={e => {
                        e.stopPropagation();

                        return deleteDoc({ prThumb: ' ' });
                      }}
                    />
                  </div>
                </div>
                <p><>{t('common.proofOfOwnership')}</></p>
              </div>
            )) || (
              <div
                className='uploadTruckDoc'
                onClick={() => setModal({ showModal: true, modalType: 'uploadProof', modalItemId: 'proof' })}
              >
                <div className='uploadTruckIcon'>
                  <img src={Upload} alt='upload truck doc' />
                </div>
                <br />
                <p><>{t('common.uploadProofOfOwnership')}</></p>
              </div>
            )}
            {(truckProfile.roadWorthiness && truckProfile.roadWorthiness !== ' ' && (
              <div className='container_'>
                <img src={truckProfile.roadWorthiness} alt='roadWorthiness' />
                <div class='overlay' onClick={() => showWaybill(truckProfile.roadWorthiness)}>
                  <div class='actionIcons'>
                    <img
                      src={Delete}
                      alt=''
                      onClick={e => {
                        e.stopPropagation();
                        deleteDoc({ rThumb: ' ' });
                      }}
                    />
                  </div>
                </div>
                <p><>{t('common.roadWorthiness')}</></p>
              </div>
            )) || (
              <div
                className='uploadTruckDoc'
                onClick={() => setModal({ showModal: true, modalType: 'uploadWorthiness', modalItemId: 'worthiness' })}
              >
                <div className='uploadTruckIcon'>
                  <img src={Upload} alt='upload truck doc' />
                </div>
                <p><>{t('common.uploadRoadWorthiness')}</></p>
              </div>
            )}
          </div>
        </div>

        {/* <BusinessUnit {...{ business_name: businessProfile.business_name }} /> */}
      </div>
      {/* right */}
      <div className='rightContent'>
        {/* <div>
          <p style={{ color: '#999999', marginBottom: 5, fontSize: '1.2em' }}>{t('tableHeaders.driverRating')}</p>
          <StarRating {...{ value: truckProfile.rate }} />
        </div> */}
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

export default Truck;
