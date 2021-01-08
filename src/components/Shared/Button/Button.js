import * as React from 'react';
import './Button.scss';

function Button(props) {
  return (
    <button type={props.type} className={props.className} onClick={e => props.onClick && props.onClick(e)}>
      {props.icon && <img src={props.icon} alt='icon-button' />}
      {props.loading ? '...loading' : <>{props.title}</>}
    </button>
  );
}

export default Button;
