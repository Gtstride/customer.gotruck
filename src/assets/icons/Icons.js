import React from 'react';

function WarningSVGIcon() {
  return (
    <svg
      style={{ height: '12px', width: '12px' }}
      className='warningSVGIcon'
      height='16'
      viewBox='0 0 16 16'
      width='16'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M10.115 1.308l5.635 11.269A2.365 2.365 0 0 1 13.634 16H2.365A2.365 2.365 0 0 1 .25 12.577L5.884 1.308a2.365 2.365 0 0 1 4.231 0zM8 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM8 9c.552 0 1-.32 1-.714V4.714C9 4.32 8.552 4 8 4s-1 .32-1 .714v3.572C7 8.68 7.448 9 8 9z'
        fillRule='evenodd'
      ></path>
    </svg>
  );
}

function TogglePasswordVisibilitySVGIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      width='17'
      height='17'
      className='togglePasswordVisibilitySVGIcon'
    >
      <path d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z'></path>
    </svg>
  );
}

function ArrowSVGIcon() {
  return (
    <svg
      style={{ height: '12px', width: '12px' }}
      className='arrow'
      height='16'
      viewBox='0 0 16 16'
      width='16'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M13.591 5.293a1 1 0 0 1 1.416 1.416l-6.3 6.3a1 1 0 0 1-1.414 0l-6.3-6.3A1 1 0 0 1 2.41 5.293L8 10.884z'
        fillRule='evenodd'
      ></path>
    </svg>
  );
}

function InfoSVGIcon() {
  return (
    <svg
      className='SVGInline-svg SVGInline--cleaned-svg SVG-svg Icon-svg Icon--info-svg Icon--hoverable-svg Icon-color-svg Icon-color--gray-svg'
      style={{ height: 12, width: 12 }}
      height='16'
      viewBox='0 0 16 16'
      width='16'
      xmlns='http://www.w3.org/2000/svg'
      fill='#8792a2'
    >
      <path
        d='M9 8a1 1 0 0 0-1-1H5.5a1 1 0 1 0 0 2H7v4a1 1 0 0 0 2 0zM4 0h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4zm4 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z'
        fillRule='evenodd'
      ></path>
    </svg>
  );
}

export { WarningSVGIcon, TogglePasswordVisibilitySVGIcon, ArrowSVGIcon, InfoSVGIcon };
