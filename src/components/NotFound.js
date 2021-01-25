import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

// import EmptyTruck from '../assets/images/empty-truck.png';

const StyledNotFound = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .notFound {
    font-size: 30px;
  }
  .title {
    font-size: 500px;
    font-family: var(--font-bold);
    color: #29489b;
    opacity: 0.5;
  }

  .image {
    width: 600px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%);
  }

  .login {
    padding: 13px 50px;
    background-color: var(--green);
    box-shadow: 0px 1px 1px #00000029;
    font-size: 16px;
    font-weight: 400;
    border: none;
    color: var(--white);
    cursor: pointer;
    border-radius: var(--button-border-radius);
    z-index: 1;
  }
`;

function NotFound() {
  const { t } = useTranslation();

  return (
    <StyledNotFound>
      <h1 className='notFound'>{t('common.notFound')}</h1>
      <h1 className='title'>404</h1>
      {/* <div className='image'>
        <img src={EmptyTruck} alt='404' />
      </div> */}
      <div onClick={() => window.open(`//${process.env.REACT_APP_DOMAIN}/register`, '_self')} className='login'>
        <>{t('common.register')}</>
      </div>
    </StyledNotFound>
  );
}

export default NotFound;
