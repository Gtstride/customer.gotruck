import React from 'react';
import ModalPortal from '../Portals/ModalPortal';

function FullPageModal({ children, modal, setModal }) {
  return (
    <ModalPortal {...{ modal, setModal }}>
      <div className='fullpageModalBlock'>{children}</div>
    </ModalPortal>
  );
}

export default FullPageModal;
