import React from 'react';
import LoaderStyle from '../../styles/LoaderStyle';

function ContentLoader() {
  return (
    <LoaderStyle>
      <div>
        <div className='spinner width-50 height-50 border-color-black'>
          <div className='right-side'>
            <div className='bar border-width-4'></div>
          </div>
          <div className='left-side'>
            <div className='bar border-width-4'></div>
          </div>
        </div>
      </div>
    </LoaderStyle>
  );
}

export default ContentLoader;
