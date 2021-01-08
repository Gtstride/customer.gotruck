import React from 'react';
import EmptyTableContentStyle from '../../styles/EmptyTableContentStyle';
import EmptyTruck from '../../assets/images/empty-truck.png';

function EmptyTable({ errorTitle, errorSubtitle }) {
  return (
    <EmptyTableContentStyle className='emptyData' data-align='center-both'>
      <div className='errorImgBlock'>
        <img src={EmptyTruck} alt='Empty truck' />
      </div>
      <div className='errorContent'>
        <h1 className='errorTitle'>{errorTitle}</h1>
        <p className='errorSubtitle'>{errorSubtitle}</p>
      </div>
    </EmptyTableContentStyle>
  );
}

export default EmptyTable;
