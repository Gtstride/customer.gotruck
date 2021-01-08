import React, { useState, useEffect } from 'react';
import ButtonLoader from '../Loaders/ButtonLoader';

function AcceptModal({ setModal, acceptAction = undefined, label = '', type }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    return () => setIsSubmitting(false);
  }, []);

  if (label.toLowerCase() === 'rejected route' || label.toLowerCase() === 'unapproved route') {
    return (
      <div className='consentModalContent'>
        <header className='consentHeader'>
          <p className='consentHeading'>{`Approve ${label}?`}</p>
        </header>
        <div className='consentMessageBlock'>
          <p className='consentInfo'>Are you sure you want to do this?</p>
        </div>
        <div className='consentMessageActions'>
          <button
            type='button'
            onClick={() => setModal({ showModal: false, modalType: undefined, modalItemId: undefined })}
          >
            Cancel
          </button>
          <button
            style={{ backgroundColor: '#36b37e' }}
            className='delete'
            type='button'
            onClick={() => {
              setIsSubmitting(true);
              return acceptAction();
            }}
          >
            {(isSubmitting && <ButtonLoader />) || 'Approve'}
          </button>
        </div>
      </div>
    );
  }

  if (label.toLowerCase() === 'set to Accept') {
    return (
      <div className='consentModalContent'>
        <header className='consentHeader'>
          <p className='consentHeading'>{`${label}?`}</p>
        </header>
        <div className='consentMessageBlock'>
          <p className='consentInfo'>Are you sure you want to do this?</p>
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
            onClick={() => {
              setIsSubmitting(true);
              return acceptAction();
            }}
          >
            {(isSubmitting && <ButtonLoader />) || 'Confirm'}
          </button>
        </div>
      </div>
    );
  }

  if (label.toLowerCase() === 'set to positioned') {
    return (
      <div className='consentModalContent'>
        <header className='consentHeader'>
          <p className='consentHeading'>{`${label}?`}</p>
        </header>
        <div className='consentMessageBlock'>
          <p className='consentInfo'>Are you sure you want to do this?</p>
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
            onClick={() => {
              setIsSubmitting(true);
              return acceptAction();
            }}
          >
            {(isSubmitting && <ButtonLoader />) || 'Confirm'}
          </button>
        </div>
      </div>
    );
  }

  if (label.toLowerCase() === 'set to in premise') {
    return (
      <div className='consentModalContent'>
        <header className='consentHeader'>
          <p className='consentHeading'>{`${label}?`}</p>
        </header>
        <div className='consentMessageBlock'>
          <p className='consentInfo'>Are you sure you want to do this?</p>
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
            onClick={() => {
              setIsSubmitting(true);
              return acceptAction();
            }}
          >
            {(isSubmitting && <ButtonLoader />) || 'Confirm'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='consentModalContent'>
      <header className='consentHeader'>
        <p className='consentHeading'>{`confirm this ${label}?`}</p>
      </header>
      <div className='consentMessageBlock'>
        <p className='consentInfo'>{`Are you sure you want to confirm this ${label}?`}</p>
      </div>
      <div className='consentMessageActions'>
        <button
          type='button'
          onClick={() => setModal({ showModal: false, modalType: undefined, modalItemId: undefined })}
        >
          Cancel
        </button>
        <button
          className={type === 'success' ? 'success' : 'delete'}
          type='button'
          onClick={() => {
            setIsSubmitting(true);
            return acceptAction();
          }}
        >
          {(isSubmitting && <ButtonLoader />) || 'Confirm'}
        </button>
      </div>
    </div>
  );
}
export default AcceptModal;
