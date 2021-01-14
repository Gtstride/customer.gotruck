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
import { searchAllTruckRegNos } from '../../APIs/Read';
// import { assignDriverToTruckForm } from '../../APIs/Update';
import { assignDriverToTruckForm, updateWithEndpointDataToken } from '../../APIs/Update';
import Switch from '../Forms/Switch';
import EnableModal from '../Modals/EnableModal';
import { toastEnums } from '../../_utils/constants';
import { useParams } from 'react-router-dom';

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

function AssignDriverToTruckForm({ setModal, truckProfile, syncUp, partnerId, t }) {
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
          driverId: truckProfile.id,
          driverMobile: truckProfile.mobile,
          driverName: `${truckProfile.first_name} ${truckProfile.last_name}`,
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

function TruckDetails({
  profileImageParams: { truckProfile, profileImagePlaceholder, showWaybill },
  profileParams: { partnerId, setTruck },
  //   fnParams: { showWaybill },
  setTruckProfile
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
  const {truckId } = useParams();
  const [checked, setChecked] = useState(truckProfile.active === true);
 

  async function acceptAction() {
    try {
      if (truckProfile.active) {
        const res = await updateWithEndpointDataToken({method: 'put', endpoint: `/truck/${truckId}`, params: { active: false }, token });
        if (res) {
          setChecked(false);
          truckProfile.active = false;
          setTruckProfile({ ...truckProfile, ...{ active: false } });
        }
      } else {
        const res = await updateWithEndpointDataToken({method: 'put', endpoint: `/truck/${truckId}`, params: { active: true }, token });
        if (res) {
          setChecked(true);
          truckProfile.active = true;
          setTruckProfile({ ...truckProfile, ...{ active: true } });
        }
      }

      syncUp({
        toastType: 'success',
        toastMessage: 'Truck succesfully activated',
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
        return <AssignDriverToTruckForm {...{ setModal, truckProfile, syncUp, partnerId, t }} />;
      case 'enable':
        return <EnableModal {...{ setModal, truckProfile, syncUp, partnerId, setChecked, type: 'Truck', checked, acceptAction }} />;
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
      {/* <div className='profileImageBlock'>
        {truckProfile.image ? (
          <div className='profileImagePlaceholderBlock'>
            <img src={truckProfile.image} alt='profile placeholder' />
          </div>
        ) : (
          <div className='profileImagePlaceholderBlock'>
            <img src={profileImagePlaceholder} alt='profile placeholder' />
          </div>
        )}
      </div> 
      <div className='profileIdBlock'>
        <p className='label'>{t('common.driverId')}</p>
        <p className='profileId'>{truckProfile.id}</p>
      </div>*/}
      {partnerId && (
        <div className='profileCtaBlock'>
          {/* <button className='cta' onClick={() => showWaybill('id')}>
            <span className='icon'></span>
            <p className='actionText'>
              <>{t('profileDetails.nationalIdScannedImg')}</>
            </p>
          </button> */}

          <div>
            {/* <button
              className='cta'
              disabled={
                truckProfile.license === undefined || truckProfile.license === null || truckProfile.license === ''
              }
              onClick={showWaybill}
            >
              <span className='icon'></span>
              <p className='actionText'>
                <>{t('profileDetails.viewDriverLicense')}</>
              </p>
            </button> */}
            {/* <img
              src={EditIcon}
              alt='Edit'
              // onClick={() => setModal({ showModal: true, modalType: 'cac', modalItemId: undefined })}
            /> */}
          </div>


          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '.5em', fontSize: '1.2em' }}>
            <p style={{ color: '#999', marginBottom: '.5em' }}><>{t('incomingTruck.truckStatus')}</></p>
            <Switch onChange={onChange} checked={checked} text={checked ? 'Activated' : 'Deactivated'} />
          </div>
        </div>
      )}
      <Modal {...{ modal, setModal }}>{getModalToShow()}</Modal>
      <Toast {...{ ...toast, setToast }} />
    </ProfileDetailsStyle>
  );
}

export default TruckDetails;
