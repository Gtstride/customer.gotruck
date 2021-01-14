import React from 'react';
import { uuid } from '../../_utils/fx';
import PopupLoader from '../Loaders/PopupLoader';

function AddressList({ isPopupLoading, addresses, setAddress }) {
  if (isPopupLoading) {
    return (
      <div className='popupItemWrap loading'>
        <PopupLoader />
      </div>
    );
  }

  return addresses.map(prop => {
    const { description, placeId } = prop;
    console.log('props address ', prop);
    return (
      <div className='popupItemWrap' key={uuid()} onClick={() => setAddress({ address: description, placeId })}>
        <p className='popupText' title={description}>
          {description}
        </p>
      </div>
    );
  });
}

export default AddressList;
