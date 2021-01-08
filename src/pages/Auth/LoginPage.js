import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoginForm from '../../components/Forms/Auth/LoginForm';
import PageFooter from '../../components/PageFooter';
import PageTitle from '../../components/PageTitle';
import AuthPageStyle from '../../styles/AuthPageStyle';
import LoginPageStyle from '../../styles/LoginPageStyle';
import { setDocumentTitle } from '../../_utils/browser';
// import logo from '../../assets/images/kobo-logo.png';
import logo from '../../assets/images/gotruck-logo.png';
import { capitalizeFirstLetter, baseurl, notAllowedSubDomain } from '../../_utils/fx';
import NotFound from '../../components/NotFound';

function LoginPage() {
  // #region Routing
  const { push } = useHistory();
  // #endregion
  const [show, setShow] = useState(false);
  const { t } = useTranslation();
  const [image, setImage] = useState('');
  const [blacklisted, setBlacklisted] = useState(0);
  const [customerId, setCustomerId] = useState(0);
  const [subDomain, setSubDomain] = useState('Kobo 360 - Customer');

  // const [notAvailable, setNotAvailable] = useState(false);

  const sub = window.location.hostname.split('.')[0];
  useEffect(() => {
    setDocumentTitle(subDomain, 'Sign In');
  }, [subDomain]);
  useEffect(() => {
    (async () => {
      //  if(process.env.REACT_APP_ENVIRONMENT !== 'staging') {
      if (!notAllowedSubDomain().includes(sub)) {
        // push(`/${}`);
        try {
          const res = await baseurl.get(`customer/account/${sub}`);

          if (res.data.data) {
            if (res.data.data.customer.image) {
              setImage(res.data.data.customer.image);
            }
            setCustomerId(res.data.data.customer.id);
            setSubDomain(res.data.data.customer.business_name || 'Kobo 360 - Customer');
            setBlacklisted(res.data.data.customer.blacklisted);
            setShow(true);
          } else {
            // window.open(`//${process.env.REACT_APP_DOMAIN}`, '_self');
            setBlacklisted(res.data.data.customer.blacklisted);
          }
        } catch (error) {
          setBlacklisted(1);
        }
      }
      //  }
    })();
  }, [sub]);

  // if (notAvailable) {
  //   return <p>Yes</p>;
  // }

  if (blacklisted === 1) {
    return <NotFound />;
  }

  // #region Returns
  return (
    <AuthPageStyle id='authPage'>
      <LoginPageStyle id='loginPage loginPageStyle'>
        <main>
          <div style={{ marginBottom: '1.5em' }}>
            {image ? (
              <div className='logoBlock' style={{ backgroundImage: `url(${image})` }}></div>
            ) : (
              <img src={logo} alt='logo' width={170} height={80} />
            )}
          </div>
          {show ? (
            <PageTitle>
              {capitalizeFirstLetter(subDomain)}
              <div style={{ marginBottom: '.5em' }} />
            </PageTitle>
          ) : (
            // <PageTitle>{t('common.dashboardTitle')}</PageTitle>
            <PageTitle>{t('dashboardTitle')}</PageTitle>

          )}
          <LoginForm {...{ push, customerId }} />
          {!show && (
            <div className='alternateAuth'>
              {/* <Link to='/register'>{t('common.dontHaveAnAccount')}</Link> */}
              <Link to='/register'>{t('dontHaveAnAccount')}</Link>

            </div>
          )}
        </main>
        <PageFooter />
      </LoginPageStyle>
    </AuthPageStyle>
  );
  // #endregion
}

export default LoginPage;
