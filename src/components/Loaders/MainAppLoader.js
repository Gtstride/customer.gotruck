import React from 'react';

function MainAppLoader() {
  return (
    <div className='mainAppLoader'>
      <div className='spinner width-50 height-50 border-color-black'>
        <div className='right-side'>
          <div className='bar border-width-4'></div>
        </div>
        <div className='left-side'>
          <div className='bar border-width-4'></div>
        </div>
      </div>
    </div>
  );
}

export default MainAppLoader;
