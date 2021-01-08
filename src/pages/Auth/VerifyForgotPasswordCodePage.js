import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import VerifyForgotPasswordCodeForm from '../../components/Forms/Auth/VerifyForgotPasswordCodeForm';
import PageFooter from '../../components/PageFooter';
import PageTitle from '../../components/PageTitle';
import AuthPageStyle from '../../styles/AuthPageStyle';
import LoginPageStyle from '../../styles/LoginPageStyle';
import { setDocumentTitle } from '../../_utils/browser';

function VerifyForgotPasswordCode() {
  // #region Routing
  const { push } = useHistory();
  // #endregion
  const { t } = useTranslation();

  useEffect(() => {
    setDocumentTitle('Kobo 360 - Customer ', 'Verify Code');
  }, []);

  // #region Returns
  return (
    <AuthPageStyle id='authPage'>
      <LoginPageStyle id='loginPage loginPageStyle'>
        <main>
          <PageTitle>{t('common.dashboardTitle')}</PageTitle>
          <VerifyForgotPasswordCodeForm {...{ push }} />
        </main>
        <PageFooter />
      </LoginPageStyle>
    </AuthPageStyle>
  );
  // #endregion
}

export default VerifyForgotPasswordCode;
