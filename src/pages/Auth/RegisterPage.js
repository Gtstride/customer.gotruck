import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RegisterForm from '../../components/Forms/Auth/RegisterForm';
import PageFooter from '../../components/PageFooter';
import PageTitle from '../../components/PageTitle';
import Toast from '../../components/Shared/Toast/Toast';
import AuthPageStyle from '../../styles/AuthPageStyle';
import RegisterPageStyle from '../../styles/RegisterPageStyle';
import { setDocumentTitle } from '../../_utils/browser';

function RegisterPage() {
  const { push } = useHistory();
  const { t } = useTranslation();

  const [toast, setToast] = useState({
    showToast: false,
    toastType: undefined,
    toastMessage: undefined,
  });

  useEffect(() => {
    setDocumentTitle('Kobo 360 -  Customer', 'Register');
  }, [push]);

  return (
    <AuthPageStyle id='authPage'>
      <RegisterPageStyle id='registerPage'>
        <main className='padding-top--50 padding-bottom--100'>
          <PageTitle>{t('common.dashboardTitle')}</PageTitle>
          <RegisterForm {...{ push, setToast }} />
          <div className='alternateAuth'>
            <Link to='/'>{t('common.alreadyHaveAnAccount')}</Link>
          </div>
        </main>
        <Toast {...{ ...toast, setToast }} />
        <PageFooter />
      </RegisterPageStyle>
    </AuthPageStyle>
  );
}

export default RegisterPage;
