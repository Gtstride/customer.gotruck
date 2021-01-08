import React from 'react';

function CardFrequencyLoader() {
  return (
    <div className='spinner margin-top--7 width-20 height-20 border-color-white'>
      <div className='right-side'>
        <div className='bar border-width-2'></div>
      </div>
      <div className='left-side'>
        <div className='bar border-width-2'></div>
      </div>
    </div>
  );
}

export default CardFrequencyLoader;
