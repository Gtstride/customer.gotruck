/* eslint-disable no-unused-vars */
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { createLogo } from '../../APIs/Create';
import getBusinessProfileEndpoints from '../../APIs/endpoints/business-profile';
import { useFetch } from '../../APIs/Read';
import profileImagePlaceholder from '../../assets/icons/profile-placeholder-img.svg';
import { useGlobalNavDispatch } from '../../contexts/GlobalNavContext';
import { useUserState } from '../../contexts/UserContext';
import BusinessProfilePageStyle from '../../styles/BusinessProfilePageStyle';
import { cardTypes } from '../../_utils/constants';
import { getDash, baseurl, lang } from '../../_utils/fx';
import ProfileDetails from '../BusinessProfile/ProfileDetails';
import { AnalyticsCard } from '../General/Card';
import ContentLoader from '../Loaders/ContentLoader';
import DeleteModal from '../Modals/DeleteModal';
import Modal from '../Modals/Modal';
import Error from '../Shared/Error';

const Apptoken = process.env.REACT_APP_APPTOKEN;

function Transporter() {
  const { t } = useTranslation();
  const setGlobalNavDetails = useGlobalNavDispatch();
  const { customerId, token } = useUserState();
  const { transporterId, customerId: customerName } = useParams();

  const businessProfileEndpoints = getBusinessProfileEndpoints({ customerId });
  const [preview, setPreview] = useState('');
  const [transporter, setTransporter] = useState({
    id: '',
    business_name: '',
    detail: {
      email: '',
      mobile: '',
      first_name: '',
      last_name: '',
    },
    location: '',
    country: '',
  });
  const [businessProfile, setBusinessProfile] = useState();
  const {
    response: transporterFetchRes,
    error: transporterFetchError,
    isLoading: transporterFetchIsLoading,
  } = useFetch(`/partner/${transporterId}`, token);
  const { response: routesRes, error: routesFetchErr, isLoading: routesFetchLoading } = useFetch(
    `/route?customerId=${customerId}&limit=30`,
    token,
  );

  const {
    response: businessProfileFetchResponse,
    error: businessProfileFetchError,
    isLoading: businessProfileFetchIsLoading,
  } = useFetch(businessProfileEndpoints.READ.businessProfile, token);
  const [modal, setModal] = useState({
    showModal: false, // true or false
    modalType: undefined, // string: create, read, update, or delete,
    modalItemId: undefined, // Used in times if updating or deleting.
  });
  const [urls, seturls] = useState([]);
  const [waybillClass, setwaybillClass] = useState('');

  // #region Refs
  const fileInput = useRef(null);
  // #endregion

  // #region Effects
  useEffect(() => {
    setGlobalNavDetails({
      navTitle: transporter.business_name,
      itemId: undefined,
    });
  }, [setGlobalNavDetails, transporter.business_name]);

  useEffect(() => {
    if (businessProfileFetchResponse) {
      setBusinessProfile(businessProfileFetchResponse.customer);
    }
  }, [businessProfileFetchResponse]);

  useEffect(() => {
    if (transporterFetchRes) {
      const {
        id,
        business_name,
        detail: { email, mobile, first_name, last_name },
        location,
        country,
      } = transporterFetchRes.partner;

      setTransporter({
        id,
        business_name,
        detail: { email, mobile, first_name, last_name },
        location,
        country,
      });
    }
  }, [transporterFetchRes]);

  const [noOfDrivers, setNoOfDrivers] = useState({
    isLoading: false,
    noOfDrivers: undefined,
  });
  const [noOfTrips, setNoOfTrips] = useState({
    isLoading: false,
    noOfTrips: undefined,
  });

  useEffect(() => {
    async function getNoOfDrivers() {
      try {
        setNoOfDrivers({
          ...noOfDrivers,
          isLoading: true,
        });
        const res = await baseurl.get(`/driver?partnerId=${transporter.id}?language=${lang}`, {
          headers: { Authorization: `Bearer ${token}`, Apptoken },
        });

        if (res) {
          setNoOfDrivers({
            isLoading: false,
            noOfDrivers: res.data.data.drivers.length,
          });
        }
      } catch (error) {
        setNoOfDrivers({
          isLoading: false,
          noOfDrivers: 0,
        });
      }
    }
    async function getNoOfTrips() {
      try {
        setNoOfTrips({
          ...noOfTrips,
          isLoading: true,
        });
        const res = await baseurl.get(`/trip?partnerId=${transporter.id}?language=${lang}`, {
          headers: { Authorization: `Bearer ${token}`, Apptoken },
        });

        if (res) {
          setNoOfTrips({
            isLoading: false,
            noOfTrips: res.data.data.trips.length,
          });
        }
      } catch (error) {
        setNoOfTrips({
          isLoading: false,
          noOfTrips: 0,
        });
      }
    }

    if (transporter.id.length !== 0) {
      getNoOfDrivers();
      getNoOfTrips();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setNoOfDrivers, token, transporter]);

  function getModalToShow() {
    switch (modal.modalType) {
      case 'delete':
        return <DeleteModal {...{ setModal, label: 'transporter', deleteAction }} />;
      default:
        return null;
    }
  }

  function deleteAction() {}

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

  function handleImageChange(e) {
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      setPreview(reader.result);
      postImage(file);
    };

    return reader.readAsDataURL(file);
  }

  function openDialog() {
    if (fileInput.current) {
      fileInput.current.click();
    }
  }

  function showWaybill(type) {
    if (type === 'id') {
      seturls([].concat(businessProfile.national_id_thumb));
    } else if (type === 'cert') {
      seturls([].concat(businessProfile.cac_thumb));
    } else {
      seturls([].concat(businessProfile.vat_thumb));
    }
    setwaybillClass('showWaybill');
  }

  if (transporterFetchIsLoading || businessProfileFetchIsLoading || routesFetchLoading) {
    return <ContentLoader />;
  }

  if (transporterFetchError) {
    return <Error {...{ error: transporterFetchError }} />;
  }

  return (
    <BusinessProfilePageStyle>
      <ProfileDetails
        {...{
          profileImageParams: {
            preview,
            businessProfile,
            profileImagePlaceholder,
            fileInput,
            handleImageChange,
            openDialog,
          },
          profileParams: { transporterName: transporter.business_name, transporterId: transporter.id },
          fnParams: { showWaybill, setModal },
        }}
      />
      <div className='middleContent'>
        <div className='middleContent'>
          <div className='generalInfoBlock'>
            <header>
              <h1 className='title'>
                <>{t('invoices.generalInfo')}</>
              </h1>
            </header>
            <div className='generalInfoContent'>
              <div className='businessNameBlock'>
                <p>
                  <>{t('forms.bizName')}</>
                </p>
                <p>{transporter.business_name}</p>
              </div>
              <div className='emailAddressBlock'>
                <p>{t('forms.email')}</p>
                <p>{transporter.detail.email}</p>
              </div>
              <div className='phoneNumberBlock'>
                <p>
                  <>{t('forms.phoneNumber')}</>
                </p>
                <p>{transporter.detail.mobile}</p>
              </div>
              <div className='contactPersonBlock'>
                <p>
                  <>{t('tableHeaders.contactPerson')}</>
                </p>
                <p>
                  {(transporter.detail.first_name.length < 1 && getDash()) || transporter.detail.first_name}{' '}
                  {(transporter.detail.last_name.length < 1 && getDash()) || transporter.detail.last_name}
                </p>
              </div>
              <div className='addressBlock'>
                <p>
                  <>{t('businessProfile.address')}</>
                </p>
                <p>{transporter.location}</p>
              </div>
              <div className='countryBlock'>
                <p>
                  <>{t('forms.country')}</>
                </p>
                <p>{transporter.country}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='rightContent'>
        <Link
          to={{
            pathname: `/${customerName}/drivers`,
            // search: `?partnerId=${transporter.id}`,
            state: { fromTransporter: true },
          }}
        >
          <AnalyticsCard
            {...{
              promises: {
                analyticsPromises: {
                  response: noOfDrivers.noOfDrivers,
                  isLoading: noOfDrivers.isLoading,
                  error: transporterFetchError,
                },
              },
              cardDisplayParams: {
                cardType: 'noOfDrivers',
                cardTitle: `${t('transporters.noOfDrivers')}`,
              },
              styles: {
                color: 'blue',
                icon: 'truck-cargo',
              },
            }}
          />
        </Link>
        <Link
          to={{
            pathname: `/${customerName}/trips`,
            search: `?partnerId=${transporter.id}`,
            state: { fromTransporter: true },
          }}
        >
          <AnalyticsCard
            {...{
              promises: {
                analyticsPromises: {
                  response: noOfTrips.noOfTrips,
                  isLoading: noOfTrips.isLoading,
                  error: transporterFetchError,
                },
              },
              cardDisplayParams: {
                cardType: 'noOfTrips',
                cardTitle: `${t('transporters.noOfTrips')}`,
              },
              styles: {
                color: 'lemon',
                icon: 'truck-white',
              },
            }}
          />
        </Link>
      </div>
      <Modal {...{ modal, setModal }}>{getModalToShow()}</Modal>
    </BusinessProfilePageStyle>
  );
}

export default Transporter;
