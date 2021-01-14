import React from 'react';
import { WarningSVGIcon } from '../../../assets/icons/Icons';

function FormError({ formErrorMessage }) {
  return (
    <div className='formErrorBlock'>
      <div className='formErrorIconBlock'>
        <WarningSVGIcon />
      </div>
      <p className='formErrorMessage'>{formErrorMessage}</p>
    </div>
  );
}

export default FormError;
