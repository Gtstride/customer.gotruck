import React from 'react';
import ModalPortal from '../Portals/ModalPortal';

function Modal({ children, modal, setModal }) {
  if (
    (modal.showModal && modal.modalType === 'delete') ||
    modal.modalType === 'cancel' ||
    modal.modalType === 'gallery' ||
    modal.modalType === 'confirm' ||
    modal.modalType === 'removeAllocation' ||
    modal.modalType === 'setToPositioned' ||
    modal.modalType === 'setToInPremise' ||
    modal.modalType === 'setToAccept' ||
    modal.modalType === 'upload' ||
    modal.modalType === 'form' ||
    modal.modalType === 'track' ||
    modal.modalType === 'history' ||
    modal.modalType === 'uploadWaybill' ||
    modal.modalType === 'waybillStatus' ||
    modal.modalType === 'enable' ||
    modal.modalType === 'assignDriverToTruck' ||
    modal.modalType === 'approve' ||
    modal.modalType === 'reject' ||
    modal.modalType === 'add-internal-transporter' ||
    modal.modalType === 'uploadProof' ||
    modal.modalType === 'uploadWorthiness'
  ) {
    return (
      <ModalPortal {...{ modal, setModal }}>
        <div className='consentModalBlock'>{children}</div>
      </ModalPortal>
    );
  }

  if (modal.showModal) {
    return (
      <ModalPortal {...{ modal, setModal }}>
        <div className='modalFormBlock'>{children}</div>
      </ModalPortal>
    );
  }

  return null;
}

export default Modal;
