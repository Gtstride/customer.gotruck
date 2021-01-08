import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import failureSuccessSVGIcon from '../../../assets/icons/toast-failure.svg';
import toastSuccessSVGIcon from '../../../assets/icons/toast-success.svg';
import ToastStyle from '../../../styles/ToastStyle';
import { calcTimeToReadInSeconds } from '../../../_utils/fx';

function Toast({ showToast = false, toastType, toastMessage, setToast }) {
  useEffect(() => {
    setTimeout(() => {
      setToast({
        showToast: false,
        toastType: undefined,
        toastMessage: undefined,
      });
    }, calcTimeToReadInSeconds(toastMessage));
  }, [setToast, toastMessage]);

  const toastIcon =
    (toastType === 'success' && toastSuccessSVGIcon) || (toastType === 'failure' && failureSuccessSVGIcon);

  return (
    <ToastStyle id={(showToast && 'show') || ''}>
      <div className='toastIconBlock' data-toast-type={toastType}>
        {(toastType === 'success' && <img src={toastIcon} alt={toastType} />) || (
          <i className='material-icons'>error</i>
        )}
      </div>
      <div className='toastMessageBlock'>
        <p className='toastMessage'>{toastMessage}</p>
      </div>
    </ToastStyle>
  );
}

Toast.propTypes = {
  showToast: PropTypes.bool,
  toastType: PropTypes.oneOf(['success', 'failure']),
  toastMessage: PropTypes.string,
  setToast: PropTypes.func,
};

export default Toast;
