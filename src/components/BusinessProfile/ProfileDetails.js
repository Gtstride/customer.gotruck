import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ProfileDetailsStyle } from '../../styles/BusinessProfile/ProfileDetailsStyle';
import EditIcon from '../../assets/icons/pencil-write.svg';
import TripDistance from '../../assets/icons/trip-distance2.svg';
import { useHistory, useParams } from 'react-router-dom';

function ProfileDetails({
  profileImageParams: { preview, businessProfile, profileImagePlaceholder, fileInput, handleImageChange, openDialog },
  profileParams: { customerId, transporterId, transporterName },
  fnParams: { showWaybill, setModal },
}) {
  const { t } = useTranslation();
  const { push } = useHistory();
  const { customerId: customerId2 } = useParams();

  useEffect(() => {
    if (transporterId) {
      localStorage.setItem('transporterId', transporterId);
      localStorage.setItem('transporterName', transporterName);
    }
  }, [transporterId, transporterName]);

  function open(url) {
    window.open(
      url,
      '_blank', // <- This is what makes it open in a new window.
    );
  }
  return (
    <ProfileDetailsStyle>
      <div className='profileImageBlock'>
        {businessProfile.image ? (
          <div className='profileImagePlaceholderBlock' onClick={openDialog}>
            <img src={preview ? preview : businessProfile.image} alt='profile placeholder' />
            <input ref={fileInput} type='file' accept='image/*' onChange={handleImageChange} />
          </div>
        ) : (
          <div className='profileImagePlaceholderBlock' onClick={openDialog}>
            <img src={preview ? preview : profileImagePlaceholder} alt='profile placeholder' />
            <input ref={fileInput} type='file' accept='image/*' onChange={handleImageChange} />
          </div>
        )}
      </div>
      <div className='profileIdBlock'>
        <p className='label'>
          {(customerId && <>{t('profileDetails.customerId')}</>) ||
            (transporterId && <>{t('profileDetails.transporterId')}</>)}
        </p>
        <p className='profileId'>{customerId || transporterId}</p>
      </div>
      {transporterId && (
        <div className='profileCtaBlock'>
          <div>
            <button className='cta routes' onClick={() => push(`/${customerId2}/routes`)}>
              <img style={{ width: 20 }} className='icon' src={TripDistance} alt='' />
              <p className='actionText' style={{ marginLeft: '10px' }}>
                Manage Routes
              </p>
            </button>
          </div>
        </div>
      )}
      {customerId && (
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
                businessProfile.cac_thumb === undefined ||
                businessProfile.cac_thumb === null ||
                businessProfile.cac_thumb === ''
              }
              onClick={
                businessProfile.cac_thumb && businessProfile.cac_thumb.includes('pdf')
                  ? () => open(businessProfile.cac_thumb)
                  : () => showWaybill('cert')
              }
            >
              {/* <span className='icon'></span> */}
              <p className='actionText'>
                <>{t('profileDetails.viewCertOfInc')}</>
              </p>
            </button>
            <img
              src={EditIcon}
              alt='Edit'
              onClick={() => setModal({ showModal: true, modalType: 'cac', modalItemId: undefined })}
            />
          </div>

          <div>
            <button
              className='cta'
              disabled={
                businessProfile.tax_thumb === undefined ||
                businessProfile.tax_thumb === null ||
                businessProfile.tax_thumb === ''
              }
              onClick={
                businessProfile.tax_thumb && businessProfile.tax_thumb.includes('pdf')
                  ? () => open(businessProfile.tax_thumb)
                  : () => showWaybill('vat')
              }
            >
              {/* <span className='icon'></span> */}
              <p className='actionText'>
                <>{t('profileDetails.vatDocumentTax')}</>
              </p>
            </button>
            <img
              src={EditIcon}
              alt='Edit'
              onClick={() => setModal({ showModal: true, modalType: 'vat', modalItemId: undefined })}
            />
          </div>
        </div>
      )}
    </ProfileDetailsStyle>
  );
}

export default ProfileDetails;
