import React, { useEffect, useState } from 'react';
import { DebounceInput } from 'react-debounce-input';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ProfileDetailsStyle } from '../../styles/BusinessProfile/ProfileDetailsStyle';
import ButtonLoader from '../Loaders/ButtonLoader';
import PopupLoader from '../Loaders/PopupLoader';
import Modal from '../Modals/Modal';
import Toast from '../Shared/Toast/Toast';
import { useUserState } from '../../contexts/UserContext';
import { searchAllTruckRegNos, getTrip } from '../../APIs/Read';
// import { assignDriverToTruckForm } from '../../APIs/Update';
import { assignDriverToTruckForm, enableDriver } from '../../APIs/Update';
import Switch from '../Forms/Switch';
import EnableModal from '../Modals/EnableModal';
import { toastEnums } from '../../_utils/constants';

const StyledSearchModal = styled.div`
  div.formFieldBlock.search {
    position: relative;
  }

  .dropdown {
    background: white;
    border-radius: 5px;
    box-shadow: 0 7px 14px 0 rgba(60, 66, 87, 0.08), 0 3px 6px 0 rgba(0, 0, 0, 0.12);
    max-height: 250px;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: absolute;
    width: 100%;
    z-index: 2;

    button {
      margin: 3px 0;
      font-size: 15px;
      width: 100%;
      text-align: left;
      padding: 4px 10px;
      cursor: pointer;

      &:hover {
        background-color: #dde6f9;
      }
    }
  }
`;

function AssignDriverToTruckForm({ setModal, driverProfile, syncUp, partnerId, t }) {
  const { token } = useUserState();
  const [fleets, setFleets] = useState([]);
  const [selectedRegNumber, setSelectedRegNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [searchIsLoading, setSearchIsLoading] = useState(false);
  async function onSearch(value) {
    try {
      setSearchIsLoading(true);
      let res;
      if (value.length > 0) {
        res = await searchAllTruckRegNos({ token, searchTerm: value, transporterId: partnerId });
        if (res) {
          setFleets(res.data.data.fleets);
        } else {
          setFleets([]);
        }
      } else {
        setSelectedRegNumber('');
        setFleets([]);
      }
    } catch (error) {
      console.log({ err: error });
    }
    setSearchIsLoading(false);
  }

  useEffect(() => {
    return () => setIsSubmitting(false);
  }, []);

  const [fleetId, setFleetId] = useState('');
  function selectRegNumber(regNumber) {
    setSelectedRegNumber(regNumber);
    const fleet = fleets.find(fleet => fleet.regNumber === regNumber);
    setFleetId(fleet._id);
    setFleets([]);
  }

  async function submitForm() {
    setIsSubmitting(true);
    try {
      const res = await assignDriverToTruckForm({
        endpoint: `/truck/${fleetId}/assignDriver`,
        params: {
          driverId: driverProfile.id,
          driverMobile: driverProfile.mobile,
          driverName: `${driverProfile.first_name} ${driverProfile.last_name}`,
        },
        token,
      });

      if (res) {
        // setTrip(trips.data.data.trip);
        syncUp({
          toastType: 'success',
          toastMessage: res.data.message,
        });
      }
      setIsSubmitting(false);
    } catch ({ response }) {
      if (response) {
        // const { status: statusCode } = response;
        const { message } = response.data;
        syncUp({
          toastType: 'failure',
          toastMessage: message,
        });
      } else {
        syncUp({
          toastType: 'failure',
          toastMessage: 'Something went wrong. Try again.',
        });
      }

      setIsSubmitting(false);
    }
  }

  return (
    <div className='consentModalContent'>
      <StyledSearchModal>
        <header className='consentHeader'>
          <p className='consentHeading'>{t('common.assignDriver')}</p>
        </header>
        <form
          id='addTransporterSearchForm'
          noValidate=''
          style={{ flex: '1', display: 'flex', flexDirection: 'column' }}
        >
          <div className='formContentBlock' style={{ flex: '1', padding: '20px' }}>
            <div className='formContent'>
              <div className='fields'>
                <div className='search formFieldBlock'>
                  <header className='formFieldHeader'>
                    <label htmlFor='amount'>Truck Registration Number</label>
                  </header>
                  <div className='formFieldWrap'>
                    <DebounceInput
                      onChange={e => onSearch(e.target.value)}
                      minLength={0}
                      debounceTimeout={50}
                      type='search'
                      name='search'
                      autoComplete='off'
                      className='search formField'
                      placeholder='Type to search for truck reg number'
                      value={selectedRegNumber}
                    />
                    {searchIsLoading && (
                      <div className='popupItemWrap loading'>
                        <PopupLoader />
                      </div>
                    )}
                  </div>
                  {fleets.length > 0 && (
                    <div className='dropdown'>
                      {fleets.map((fleet, index) => (
                        <button type='button' key={index} onClick={() => selectRegNumber(fleet.regNumber)}>
                          {fleet.regNumber}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className='consentMessageActions'>
            <button
              type='button'
              onClick={() => setModal({ showModal: false, modalType: undefined, modalItemId: undefined })}
            >
              Cancel
            </button>
            <button
              style={{ backgroundColor: '#37b47f' }}
              className='delete'
              type='button'
              onClick={() => submitForm()}
              disabled={!selectedRegNumber}
            >
              {(isSubmitting && <ButtonLoader />) || 'Assign'}
            </button>
          </div>
        </form>
      </StyledSearchModal>
    </div>
  );
}

function DriverDetails({
  profileImageParams: { driverProfile, profileImagePlaceholder, showWaybill },
  profileParams: { partnerId, setTruck },
  //   fnParams: { showWaybill },
}) {
  const { t } = useTranslation();
  const { token } = useUserState();
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
  const [checked, setChecked] = useState(driverProfile.enabled === 1);

  useEffect(() => {
    (async () => {
      try {
        const truckRes = await getTrip({ endpoint: `truck/driver/${driverProfile.id}`, token });
        if (truckRes.data.data) {
          setTruck(truckRes.data.data.fleet);
        }
      } catch (error) {}
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // function open(url) {
  //   window.open(
  //     url,
  //     '_blank', // <- This is what makes it open in a new window.
  //   );
  // }

  async function acceptAction() {
    try {
      if (driverProfile.enabled === 1) {
        const res = await enableDriver({ endpoint: `/driver/${partnerId}/enable`, data: { enabled: 0 }, token });
        if (res) {
          setChecked(false);
          driverProfile.enabled = 0;
        }
      } else {
        const res = await enableDriver({ endpoint: `/driver/${partnerId}/enable`, data: { enabled: 1 }, token });
        if (res) {
          setChecked(true);
          driverProfile.enabled = 1;
        }
      }

      syncUp({
        toastType: 'success',
        toastMessage: 'Driver account updated',
      });
    } catch ({ response }) {
      if (response) {
        const { message } = response.data;
        syncUp({
          toastType: 'failure',
          toastMessage: message,
        });
      } else {
        syncUp({
          toastType: toastEnums.FAILURE,
          toastMessage: 'Something went wrong. Try again.',
        });
      }
      setChecked(false);
    }
  }

  function getModalToShow() {
    switch (modal.modalType) {
      case 'assignDriverToTruck':
        return <AssignDriverToTruckForm {...{ setModal, driverProfile, syncUp, partnerId, t }} />;
      case 'enable':
        return <EnableModal {...{ setModal, driverProfile, syncUp, partnerId, type: 'Driver', setChecked, checked, acceptAction }} />;
      default:
        return null;
    }
  }

  function syncUp({ toastType, toastMessage }) {
    setModal({ showModal: false, modalType: undefined, modalItemId: undefined });
    setToast({
      showToast: true,
      toastType,
      toastMessage: toastMessage,
    });
  }

  function onChange() {
    if (checked) {
      setChecked(!checked);
      setModal({ showModal: true, modalType: 'enable', modalItemId: undefined });
    } else {
      setChecked(!checked);
      setModal({ showModal: true, modalType: 'enable', modalItemId: undefined });
    }
  }
  return (
    <ProfileDetailsStyle>
      <div className='profileImageBlock'>
        {driverProfile.image ? (
          <div className='profileImagePlaceholderBlock'>
            <img src={driverProfile.image} alt='profile placeholder' />
            {/* <input ref={fileInput} type='file' accept='image/*' onChange={handleImageChange} /> */}
          </div>
        ) : (
          <div className='profileImagePlaceholderBlock'>
            <img src={profileImagePlaceholder} alt='profile placeholder' />
            {/* <input ref={fileInput} type='file' accept='image/*' onChange={handleImageChange} /> */}
          </div>
        )}
      </div>
      <div className='profileIdBlock'>
        <p className='label'>{t('common.driverId')}</p>
        <p className='profileId'>{driverProfile.id}</p>
      </div>
      {partnerId && (
        <div className='profileCtaBlock'>
          {/* <button className='cta' onClick={() => showWaybill('id')}>
            <span className='icon'></span>
            <p className='actionText'>
              <>{t('profileDetails.nationalIdScannedImg')}</>
            </p>
          </button> */}

          <div>
            <button
              className='cta'
              disabled={
                driverProfile.license === undefined || driverProfile.license === null || driverProfile.license === ''
              }
              onClick={showWaybill}
            >
              <span className='icon'></span>
              <p className='actionText'>
                <>{t('profileDetails.viewDriverLicense')}</>
              </p>
            </button>
            {/* <img
              src={EditIcon}
              alt='Edit'
              // onClick={() => setModal({ showModal: true, modalType: 'cac', modalItemId: undefined })}
            /> */}
          </div>

          <div>
            <button
              className='cta'
              onClick={() => setModal({ showModal: true, modalType: 'assignDriverToTruck', modalItemId: undefined })}
            >
              <span className='icon'></span>

              <p className='actionText'>
                <>{t('common.assignToTruck')}</>
              </p>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '.5em', fontSize: '1.2em' }}>
            <p style={{ color: '#999', marginBottom: '.5em' }}><>{t('common.driverAccount')}</></p>
            <Switch onChange={onChange} checked={checked} text={checked ? 'Active' : 'InActive'} />
          </div>
        </div>
      )}
      <Modal {...{ modal, setModal }}>{getModalToShow()}</Modal>
      <Toast {...{ ...toast, setToast }} />
    </ProfileDetailsStyle>
  );
}

export default DriverDetails;
