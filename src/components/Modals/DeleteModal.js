import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonLoader from '../Loaders/ButtonLoader';

function DeleteModal({ setModal, deleteAction = undefined, label = '' }) {
  const { t } = useTranslation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    return () => setIsSubmitting(false);
  }, []);

  if (label.toLowerCase() === 'unapproved route') {
    return (
      <div className='consentModalContent'>
        <header className='consentHeader'>
          <p className='consentHeading'>{`Reject ${label}?`}</p>
        </header>
        <div className='consentMessageBlock'>
          <p className='consentInfo'>Are you sure you want to do this</p>
        </div>
        <div className='consentMessageActions'>
          <button
            type='button'
            onClick={() => setModal({ showModal: false, modalType: undefined, modalItemId: undefined })}
          >
            <>{t('buttons.no')}</>
          </button>
          <button
            className='delete'
            type='button'
            onClick={() => {
              setIsSubmitting(true);
              return deleteAction();
            }}
          >
            {(isSubmitting && <ButtonLoader />) || <>{t('buttons.yes')}</>}
          </button>
        </div>
      </div>
    );
  }

  if (label.toLowerCase() === 'order' || label.toLowerCase() === 'truck request') {
    return (
      <div className='consentModalContent'>
        <header className='consentHeader'>
          <p className='consentHeading'>{`Cancel this ${label}?`}</p>
        </header>
        <div className='consentMessageBlock'>
          <p className='consentInfo'>{`Are you sure you want to cancel this ${label}?`}</p>
        </div>
        <div className='consentMessageActions'>
          <button
            type='button'
            onClick={() => setModal({ showModal: false, modalType: undefined, modalItemId: undefined })}
          >
            <>{t('buttons.no')}</>
          </button>
          <button
            className='delete'
            type='button'
            onClick={() => {
              setIsSubmitting(true);
              return deleteAction();
            }}
          >
            {(isSubmitting && <ButtonLoader />) || <>{t('buttons.yes')}</>}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='consentModalContent'>
      <header className='consentHeader'>
        <p className='consentHeading'>{`${t('forms.deleteThis')} ${label}?`}</p>
      </header>
      <div className='consentMessageBlock'>
        <p className='consentInfo'>{`${t('forms.deletingThis')} ${label} ${t(
          'forms.willDeleteEveryInfoAssociatedWitIt',
        )}.`}</p>
      </div>
      <div className='consentMessageActions'>
        <button
          type='button'
          onClick={() => setModal({ showModal: false, modalType: undefined, modalItemId: undefined })}
        >
          <>{t('buttons.cancel')}</>
        </button>
        <button
          className='delete'
          type='button'
          onClick={() => {
            setIsSubmitting(true);
            return deleteAction();
          }}
        >
          {(isSubmitting && <ButtonLoader />) || <>{t('buttons.delete')}</>}
        </button>
      </div>
    </div>
  );
}
export default DeleteModal;
