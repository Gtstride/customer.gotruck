import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonLoader from '../Loaders/ButtonLoader';

function EnableModal({ setModal, acceptAction = undefined, label = '', type, setChecked, checked }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    return () => setIsSubmitting(false);
  }, []);

  return (
    <div className='consentModalContent'>
      <header className='consentHeader'>
        <p className='consentHeading'>{`${!checked ? `Disabled ${type}` : `Enable ${type}`}`}</p>
      </header>
      <div className='consentMessageBlock'>
        <p className='consentInfo'>{`Are you sure you want to ${!checked ? `Disabled ${type}` : `Enable ${type}`}?`}</p>
      </div>
      <div className='consentMessageActions'>
        <button
          type='button'
          onClick={() => 
           {  
              setChecked(!checked);

             return (
              setModal({ showModal: false, modalType: undefined, modalItemId: undefined })
             );
           }
          }
        >
          {t('buttons.cancel')}
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
export default EnableModal;
