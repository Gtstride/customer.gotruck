import React from 'react';

function PopupLoader() {
  return (
    <div className='spinner width-20 height-20 border-color-white'>
      <div className='right-side'>
        <div className='bar border-width-2'></div>
      </div>
      <div className='left-side'>
        <div className='bar border-width-2'></div>
      </div>
    </div>
  );
}

export default PopupLoader;
