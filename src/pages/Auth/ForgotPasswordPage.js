import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ForgotPasswordForm from '../../components/Forms/Auth/ForgotPasswordForm';
import PageFooter from '../../components/PageFooter';
import PageTitle from '../../components/PageTitle';
import AuthPageStyle from '../../styles/AuthPageStyle';
import LoginPageStyle from '../../styles/LoginPageStyle';
// import logo from '../../assets/images/kobo-logo.png';
import logo from '../../assets/images/gotruck-logo.png';
import { setDocumentTitle } from '../../_utils/browser';

function ForgotPasswordPage() {
  // #region Routing
  const { push } = useHistory();
  // #endregion
  const { t } = useTranslation();

  useEffect(() => {
    setDocumentTitle('Gotruck - Customer ', 'Forgot Password');
  }, []);

  // #region Returns
  return (
    <AuthPageStyle id='authPage'>
      <LoginPageStyle id='loginPage loginPageStyle'>
        <main>
          <div style={{ marginBottom: '1.5em' }}>
            <img src={logo} alt='logo' width={170} height={80} />
          </div>
          <PageTitle>{t('common.dashboardTitle')}</PageTitle>
          <ForgotPasswordForm {...{ push }} />
          <div className='alternateAuth'>
            <Link to='/'>{t('common.alreadyHaveAnAccount')}</Link>
          </div>
        </main>
        <PageFooter />
      </LoginPageStyle>
    </AuthPageStyle>
  );
  // #endregion
}

export default ForgotPasswordPage;
