import React from 'react';

function FormHeader({ formTitle }) {
  return (
    <header className='formHeader'>
      <h2 className='formTitle'>{formTitle}</h2>
    </header>
  );
}

export default FormHeader;
