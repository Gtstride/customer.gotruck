import React from 'react';
import { useTranslation } from 'react-i18next';

function VerifyEmailBanner({ show, fxParams: { sendVerification, resendVerification } }) {
  const { t } = useTranslation();

  if (!show) {
    return (
      <div className='verify'>
        <p>
          <>{t('notifBanner.emailVerif')}</>
        </p>
        <div role='button' className='verifyBtn' onClick={() => sendVerification()}>
          <>{t('notifBanner.verify')}</>
        </div>
      </div>
    );
  }

  return (
    <div className='verify'>
      <p>
        <>{t('notifBanner.linkSent')}</>
      </p>
      <div role='button' className='verifyBtn' onClick={() => resendVerification()}>
        <>{t('notifBanner.resend')}</>
      </div>
    </div>
  );
}

export default VerifyEmailBanner;
