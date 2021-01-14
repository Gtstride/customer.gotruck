import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ResetPasswordForm from '../../components/Forms/Auth/ResetPasswordForm';
import PageFooter from '../../components/PageFooter';
import PageTitle from '../../components/PageTitle';
import AuthPageStyle from '../../styles/AuthPageStyle';
import LoginPageStyle from '../../styles/LoginPageStyle';
import { setDocumentTitle } from '../../_utils/browser';

function LoginPage() {
  // #region Routing
  const { push } = useHistory();
  // #endregion
  const { t } = useTranslation();

  useEffect(() => {
    setDocumentTitle('Gotruck - Customer ', 'Reset Password');
  }, []); 

  // #region Returns
  return (
    <AuthPageStyle id='authPage'>
      <LoginPageStyle id='loginPage loginPageStyle'>
        <main>
          <PageTitle>{t('common.dashboardTitle')}</PageTitle>
          <ResetPasswordForm {...{ push }} />
        </main>
        <PageFooter />
      </LoginPageStyle>
    </AuthPageStyle>
  );
  // #endregion
}

export default LoginPage;
