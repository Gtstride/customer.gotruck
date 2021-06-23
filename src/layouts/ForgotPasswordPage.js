import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ForgotPasswordForm from '../components/Forms/Auth/ForgotPasswordForm';
import PageFooter from '../components/PageFooter';
import PageTitle from '../components/PageTitle';
import AuthPageStyle from '../layouts/AuthPageStyle';
import LoginPageStyle from '../layouts/LoginPageStyle';
import logo from '../assets/img/logo-green.png';
import { setDocumentTitle } from '../_utils/browser';

function ForgotPasswordPage() {
  // #region Routing
  const { push } = useHistory();
  // #endregion
  const { t } = useTranslation();

  useEffect(() => {
    setDocumentTitle('Uzi Logistics - Customer ', 'Forgot Password');
  }, []);

  // #region Returns
  return (
    <AuthPageStyle id='authPage'>
      <LoginPageStyle id='loginPage loginPageStyle'>
        <main>
          <div style={{ marginBottom: '1.5em' }}>
            <img src={logo} alt='logo' width={170} height={80} />
          </div>
          <PageTitle>{('Customer DashBoard')}</PageTitle>
          <ForgotPasswordForm {...{ push }} />
          <div className='alternateAuth'>
            <Link to='/'>{('Have An Account | Login')}</Link>
          </div>
        </main>
        {/* <PageFooter /> */}
      </LoginPageStyle>
    </AuthPageStyle>
  );
  // #endregion
}

export default ForgotPasswordPage;
