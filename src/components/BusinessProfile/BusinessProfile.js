import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { createLogo } from '../../APIs/Create';
import getBusinessProfileEndpoints from '../../APIs/endpoints/business-profile';
import getGeneralEndpoints from '../../APIs/endpoints/general';
import { useFetch } from '../../APIs/Read';
import EditIcon from '../../assets/icons/pencil-write.svg';
import profileImagePlaceholder from '../../assets/icons/profile-placeholder-img.svg';
import { useGlobalNavDispatch } from '../../contexts/GlobalNavContext';
import { useUserState } from '../../contexts/UserContext';
import BusinessProfilePageStyle from '../../styles/BusinessProfilePageStyle';
import { cardTypes } from '../../_utils/constants';
import { setGlobalNavBarDetails } from '../../_utils/fx';
import { useTranslation } from 'react-i18next';
import { AnalyticsCard } from '../General/Card';
import ButtonLoader from '../Loaders/ButtonLoader';
import ContentLoader from '../Loaders/ContentLoader';
import Modal from '../Modals/Modal';
import WaybillModal from '../Modals/WaybillModal';
import Error from '../Shared/Error';
import Toast from '../Shared/Toast/Toast';
import EditBusinessProfileForm from './EditBusinessProfileForm';
import ProfileDetails from './ProfileDetails';
import { uuid } from '../../_utils/fx';
import { getDash } from '../../_utils/fx';
import UploadProfileFile from '../Forms/UploadProfileFile';
import InnerPageBackButton from '../Shared/InnerPageBackButton';

function BusinessUnit({ business_name }) {
  // #region Contexts
  const { customerId, token } = useUserState();
  // #endregion

  // #region States
  // const [businessUnit, setBusinessUnit] = useState([]);
  const [details, setDetails] = useState([]);
  const { response, error, isLoading } = useFetch(`/customer/${customerId}/business_unit`, token);
  const { t } = useTranslation();
  useEffect(() => {
    if (response) {
      // const { biz_unit_name, email, first_name, last_name, mobile } = response.KoboBusinessUnit[0];

      // setBusinessUnit([
      //   { title: <>{t('businessProfile.bizUnitName')}</>, subtitle: biz_unit_name },
      //   { title: <>{t('businessProfile.email')}</>, subtitle: email },
      //   { title: <>{t('businessProfile.firstName')}</>, subtitle: first_name },
      //   { title: <>{t('businessProfile.lastName')}</>, subtitle: last_name },
      //   { title: <>{t('businessProfile.mobile')}</>, subtitle: mobile },
      // ]);

      const details = response.KoboBusinessUnit.reduce((prev, next) => {
        return [
          ...prev,
          {
            name: `${next.first_name} ${next.last_name}`,
            email: next.email,
            mobile: next.mobile,
          },
        ];
      }, []);

      setDetails(details);

      // console.log({ details });
    }
  }, [response, t]);

  if (error) {
    return null;
  }

  if (isLoading) {
    return (
      <div className='blockError'>
        <ButtonLoader />
      </div>
    );
  }
  return (
    <div className='businessProfileBlock'>
      {/* <Block {...{ blockTitle: 'Business Account Owners', blockInfo: businessUnit }} /> */}
      <div className='block'>
        <header className='blockHeader dp-flex'>
          <h1 className='blockTitle bold'>{t('common.businessAccountManagers')}</h1>
        </header>
        <div className='content'>
          {details.map(({ name, email, mobile }) => {
            return (
              <div key={uuid()}>
                <p>{name}</p>
                <p>{email}</p>
                <p>{mobile}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BusinessProfile() {
  // #region Contexts
  const setGlobalNavDetails = useGlobalNavDispatch();
  const { customerId, token } = useUserState();
  const { customerId: customerId2 } = useParams();
  const history = useHistory();

  // #endregion

  // #region Endpoints
  const businessProfileEndpoints = getBusinessProfileEndpoints({ customerId });
  const customerAnalyticsEndpoints = getGeneralEndpoints({ customerId });
  // #endregion

  const fileInput = useRef(null);
  const { t } = useTranslation();

  // #region States
  const [businessProfile, setBusinessProfile] = useState(undefined);
  const {
    response: businessProfileFetchResponse,
    error: businessProfileFetchError,
    isLoading: businessProfileFetchIsLoading,
  } = useFetch(businessProfileEndpoints.READ.businessProfile, token);

  const [analytics, setAnalytics] = useState({});
  const {
    response: customerAnalyticsFetchRes,
    error: customerAnalyticsError,
    isLoading: customerAnalyticsIsLoading,
  } = useFetch(customerAnalyticsEndpoints.READ.analytics, token);

  const [waybillClass, setwaybillClass] = useState('');
  const [urls, seturls] = useState([]);

  const [modal, setModal] = useState({
    showModal: false, // true or false
    modalType: undefined, // string: create, read, update, or delete,
    modalItemId: undefined, // Used in times if updating or deleting.
  });
  const [preview, setPreview] = useState('');
  const [toast, setToast] = useState({
    showToast: false,
    toastType: undefined,
    toastMessage: undefined,
  });
  // #endregion

  // #region Effects
  useEffect(() => {
    setGlobalNavBarDetails(
      { navTitle: <>{t('businessProfile.bizProfile')}</>, itemId: undefined },
      setGlobalNavDetails,
    );
  }, [setGlobalNavDetails, t]);

  useEffect(() => {
    if (businessProfileFetchResponse) {
      setBusinessProfile(businessProfileFetchResponse.customer);
    }
  }, [businessProfileFetchResponse]);

  useEffect(() => {
    if (customerAnalyticsFetchRes) {
      setAnalytics(customerAnalyticsFetchRes.overview);
    }
  }, [customerAnalyticsFetchRes]);

  // #endregion

  // #region Functions
  function getModalToShow() {
    switch (modal.modalType) {
      case 'update': {
        const editBusinessProfileDetails = {
          businessName: businessProfile.business_name,
          country: businessProfile.country,
          address: businessProfile.location,
          regNumber: businessProfile.reg_number,
          tax_no: businessProfile.tax_no,
          nationalId: businessProfile.national_id,
          mobile: businessProfile.admin.mobile,
          kra_pin: businessProfile.kra_pin,
          tin: businessProfile.tin,
        };

        return (
          <EditBusinessProfileForm
            {...{
              setModal,
              editBusinessProfileDetails,
              endpointParams: {
                customerId,
                token,
              },
              setBusinessProfile,
              businessProfile,
              syncUp,
            }}
          />
        );
      }

      case 'cac':
        return (
          <UploadProfileFile {...{ setModal, token, customerId, type: 'CAC', setBusinessProfile, businessProfile }} />
        );

      case 'vat':
        return (
          <UploadProfileFile {...{ setModal, token, customerId, type: 'VAT', setBusinessProfile, businessProfile }} />
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

  function openDialog() {
    if (fileInput.current) {
      fileInput.current.click();
    }
  }

  function handleImageChange(e) {
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      setPreview(reader.result);
      postImage(file);
    };

    return reader.readAsDataURL(file);
  }

  async function postImage(file) {
    try {
      const config = {
        headers: {
          'Content-Type': file.type,
          Authorization: `Bearer ${token}`,
        },
      };
      const data = new FormData();
      data.append('media', file);

      const res = await axios.post(
        `${process.env.REACT_APP_DATA_URL}/upload/customerprofile?purpose=customerprofile&tag=${customerId}`,
        data,
        config,
      );
      if (res && res.data.data && res.data.data.media) {
        uploadLogo(res.data.data.media.thumb);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function uploadLogo(image) {
    try {
      const data = { thumb: image };
      const res = await createLogo(data, customerId, token);
      if (res) {
        console.log(res, 'res');
      }
    } catch (error) {
      console.log(error);
    }
  }

  function showWaybill(type) {
    if (type === 'id') {
      seturls([].concat(businessProfile.national_id_thumb));
    } else if (type === 'cert') {
      seturls([].concat(businessProfile.cac_thumb));
    } else {
      seturls([].concat(businessProfile.tax_thumb));
    }
    setwaybillClass('showWaybill');
  }

  function closeWaybill() {
    setwaybillClass('');
  }
  // #endregion

  // #region Renders
  if (businessProfileFetchIsLoading) {
    return <ContentLoader />;
  }
  if (businessProfileFetchError) {
    return <Error {...{ error: businessProfileFetchError }} />;
  }
  return (
    <>
      <div className='p-1-7'>
        <InnerPageBackButton action={() => history.goBack()} />
      </div>
      <BusinessProfilePageStyle>
        {/* left */}
        <ProfileDetails
          {...{
            profileImageParams: {
              preview,
              businessProfile,
              profileImagePlaceholder,
              fileInput,
              handleImageChange,
              openDialog,
              urls,
              seturls,
            },
            profileParams: { customerId },
            fnParams: { showWaybill, setModal },
          }}
        />
        {/* middle */}
        <div className='middleContent'>
          <div className='accountOwnerBlock generalInfoBlock'>
            <header>
              <h1 className='title'>
                <>{t('common.accountOwner')}</>
              </h1>
            </header>
            <div className='generalInfoContent'>
              <div className='contactPersonBlock'>
                <p>{t('tableHeaders.name')}</p>
                <p>
                  {(businessProfile.admin && businessProfile.admin.first_name) || getDash()}{' '}
                  {(businessProfile.admin && businessProfile.admin.last_name) || getDash()}
                </p>
              </div>
              <div className='emailAddressBlock'>
                <p>{t('businessProfile.email')}</p>
                <p>{(businessProfile.admin && businessProfile.admin.email) || getDash()}</p>
              </div>
              <div className='phoneNumberBlock'>
                <p>{t('businessProfile.phoneNumber')}</p>
                <p>{(businessProfile.admin && businessProfile.admin.mobile) || getDash()}</p>
              </div>
            </div>
          </div>
          <div className='generalInfoBlock'>
            <header>
              <h1 className='title'>
                <>{t('invoices.generalInfo')}</>
              </h1>
              <button
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
              </button>
            </header>
            <div className='generalInfoContent'>
              <div className='businessNameBlock'>
                <p>{t('forms.bizName')}</p>
                <p>{businessProfile.business_name || 'N/A'}</p>
              </div>
              <div className='countryBlock'>
                <p>{t('businessProfile.country')}</p>
                <p>{businessProfile.country || 'N/A'}</p>
              </div>
              <div className='addressBlock'>
                <p>{t('forms.location')}</p>
                <p>{businessProfile.location || 'N/A'}</p>
              </div>
              <div className='regNumberBlock'>
                <p>{t('businessProfile.regNumber')}</p>
                <p>{businessProfile.reg_number || 'N/A'}</p>
              </div>
              <div className='taxPinBlock'>
                <p>{t('businessProfile.taxNo')}</p>
                <p>{businessProfile.tax_no || 'N/A'}</p>
              </div>
              <div className='tinBlock'>
                <p>{t('businessProfile.tin')}</p>
                <p>{businessProfile.tin || 'N/A'}</p>
              </div>
              {businessProfile.country && businessProfile.country.toLowerCase() === 'kenya' && (
                <div className='kraPinBlock'>
                  <p>{t('businessProfile.kraPin')}</p>
                  <p>{businessProfile.kra_pin || 'N/A'}</p>
                </div>
              )}
              <div className='nationalIdBlock'>
                <p>{t('businessProfile.regDate')}</p>
                <p>{format(new Date(businessProfile.reg_date), 'MMMM d, yyyy hh:mm aaa') || getDash()}</p>
              </div>
            </div>
          </div>
          <BusinessUnit {...{ business_name: businessProfile.business_name }} />
        </div>
        {/* right */}
        <div className='rightContent'>
          <Link to={`/${customerId2}/trips`}>
            <AnalyticsCard
              {...{
                promises: {
                  analyticsPromises: {
                    response: analytics,
                    isLoading: customerAnalyticsIsLoading,
                    error: customerAnalyticsError,
                  },
                },
                cardDisplayParams: {
                  cardType: cardTypes.TRIP,
                  cardTitle: <>{t('cards.trips')}</>,
                },
                styles: {
                  color: 'yellow',
                  icon: 'truck-cargo',
                },
              }}
            />
          </Link>
          <Link to={`/${customerId2}/truck_requests?status=open_requests&page=1`}>
            <AnalyticsCard
              {...{
                promises: {
                  analyticsPromises: {
                    response: analytics,
                    isLoading: customerAnalyticsIsLoading,
                    error: customerAnalyticsError,
                  },
                },
                cardDisplayParams: {
                  cardType: cardTypes.REQUEST,
                  cardTitle: <>{t('cards.requests')}</>,
                },
                styles: {
                  color: 'green',
                  icon: 'common-file-text-edit',
                },
              }}
            />
          </Link>
        </div>
        <Modal {...{ modal, setModal }}>{getModalToShow()}</Modal>
        <WaybillModal {...{ closeWaybill, waybillClass, urls }} />
        <Toast {...{ ...toast, setToast }} />
      </BusinessProfilePageStyle>
    </>
  );
  // #endregion
}

export default BusinessProfile;
