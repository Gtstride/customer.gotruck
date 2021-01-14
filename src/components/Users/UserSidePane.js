import React from 'react';
import CloseSVGIcon from '../../assets/icons/close-modal.svg';
import EditIcon from '../../assets/icons/pencil-write.svg';
import tripWaybill from '../../assets/icons/trips-waybill.svg';
import RecipientSidePaneStyle from '../../styles/RecipientSidePaneStyle';
import { uuid } from '../../_utils/fx';

function UserSidePane({ setModal, user }) {
  return (
    <RecipientSidePaneStyle className='recipientSidePaneStyle'>
      {/* header */}
      <header>
        <h3>User's detail</h3>
        <button className='blockUpdateBtn'>
          <span className='blockActionIcon'>
            <img src={EditIcon} alt='Edit' />
          </span>
          edit
        </button>
      </header>
      <div className='tripStatusBlock'>
        {/* recipient */}
        <div className='recipientInfoBlock'>
          <div className='recipientInfoIcon'>
            <img src={tripWaybill} alt={'subheading'} />
          </div>
          <div className='recipientInfoContentBlock'>
            <p className='recipientInfoHeading'>User</p>
            <p className='recipientInfoSubheading'>{user.full_name}</p>
          </div>
        </div>
        {/* phone number */}
        <div className='recipientInfoBlock'>
          <div className='recipientInfoIcon'>
            <img src={tripWaybill} alt={'subheading'} />
          </div>
          <div className='recipientInfoContentBlock'>
            <p className='recipientInfoHeading'>Phone number</p>
            <p className='recipientInfoSubheading'>{user.mobile}</p>
          </div>
        </div>
      </div>
      {/* addresses */}
      <div className='recipientAddressesBlock'>
        <div className='recipientInfoBlock'>
          <div className='recipientInfoIcon'>
            <img src={tripWaybill} alt={'subheading'} />
          </div>
          <div className='addressesBlock'>
            {user.addresses.map(({ address }, index) => (
              <div className='recipientInfoContentBlock' key={uuid()}>
                <p className='recipientInfoHeading'>Address {(index && index + 1) || ''}</p>
                <p className='recipientInfoSubheading'>{address}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button
        type='button'
        className='cancel'
        data-align='center-both'
        onClick={() => setModal({ showModal: false, modalType: undefined, modalItemId: undefined })}
      >
        <span className='actionIcon cancel'>
          <img src={CloseSVGIcon} alt='cancel' />
        </span>
      </button>
    </RecipientSidePaneStyle>
  );
}

export default UserSidePane;
