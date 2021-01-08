import React from 'react';
import ArrowCircleLeft from '../../assets/icons/back.svg';

function InnerPageBackButton({ action }) {
  return (
    <button type='button' data-align='center-both' onClick={action}>
      <span className='' data-align='center-both'>
        <img src={ArrowCircleLeft} alt='go back' />
      </span>
    </button>
  );
}

export default InnerPageBackButton;
