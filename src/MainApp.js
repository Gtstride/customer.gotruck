import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBusinessProfile, useFetch } from './APIs/Read';
import TickerBanner from './components/General/TickerBanner';
import GlobalContent from './components/GlobalContent';
import GlobalSideNav from './components/GlobalSideNav';
import MainAppLoader from './components/Loaders/MainAppLoader';
import { GlobalNavProvider } from './contexts/GlobalNavContext';
import { useUserDispatch, useUserState } from './contexts/UserContext';
import MainAppStyle from './styles/MainAppStyle';
import { getUserDetails, setInterceptor } from './_utils/auth';
import { baseurl, insuranceUrl, notAllowedSubDomain } from './_utils/fx';
import ErrorBoundary from './_utils/Errorboundary';
import { environment } from "./_utils/environment"
import { initGA, PageView, setProperties } from './_utils/tracking';
import { toast } from 'react-toastify';

function MainApp(props) {
  // #region Contexts
  const sub = window.location.hostname.split('.')[0];

  let { customerId } = useParams();

  const { multiTenant } = environment(sub);
  if (!notAllowedSubDomain().includes(sub)) {
    if (multiTenant) {
      customerId = 'app';
    }
  }

  // Test for multi tenant here. If true, identifier
  const userDetails = useUserState();
  const setUserDetails = useUserDispatch();
  let token, user;

  if (localStorage.getItem(`user-${customerId}`)) {
    token = JSON.parse(localStorage.getItem(`user-${customerId}`)).token;
    user = JSON.parse(localStorage.getItem(`user-${customerId}`));
  }
  // #endregion
  // const [businessProfile, setBusinessProfile] = React.useState(null);
   const [businessProfile, setBusinessProfile] = React.useState({
     businessName : "Go-Truck"
   });
  const [show, setShow] = useState(false);
  const [verified, setVerified] = useState(0);
  const [routes, setRoutes] = useState([]);
  const [index, setIndex] = useState(0);
  const { response, isLoading } = useFetch(`analytics/topRoutes?country=${user ? user.user.country : ''}`, token);

  useEffect(() => {
    localStorage.removeItem('customerForgotPasswordCredentials');
  }, []);

  useEffect(() => {
    // let userDetails;
    // if (getUserDetails(customerId)) {
    //   userDetails = { ...userDetails, ...getUserDetails(customerId) };
    //   setUserDetails(userDetails);
    //   if (response) {
    //     setRoutes(response.route);
    //   }
    //   setVerified(userDetails.email_verified);
    // }

    // (async () => {
    //   try {
    //     const {
    //       data: { data: customer },
    //     } = await getBusinessProfile(
    //       user.details ? user.details.customerId : userDetails.customerId ? userDetails.customerId : customerId,
    //       userDetails.token,
    //     );
    //     setBusinessProfile({
    //       businessName: customer.customer.business_name,
    //       customerId: customer.customer.id,
    //       customerImg: customer.customer.image,
    //       partnerId: customer.customer.partner_id,
    //       admin: customer.customer.admin,
    //     });
    //   } catch (error) {
    //     // console.log({ error });
    //   }
    // })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId, setUserDetails, response]);

  // async function sendVerification() {
  //   const details = {
  //     mobile: userDetails.mobile,
  //     user_type: userDetails.userType,
  //     tag: 'email',
  //     email: userDetails.email,

  //     token: userDetails.token,
  //   };

  //   setShow(!show);

  //   try {
  //     const res = await baseurl.post('user/otp/init', details);
  //     if (res) {
  //       setShow(!show);
  //       toast.success('A verification link has been sent to your email.');
  //     }
  //   } catch ({ response }) {
  //     setShow(!show);
  //     if (response) {
  //       const { message } = response.data;
  //       toast.error(message);
  //     }
  //   }
  // }

  // async function resendVerification() {
  //   const details = {
  //     mobile: userDetails.mobile,
  //     user_type: userDetails.userType,
  //     tag: 'email',
  //     email: userDetails.email,

  //     token: userDetails.token,
  //   };

  //   try {
  //     const res = await baseurl.post('user/otp/init', details);
  //     if (res) {
  //       toast.success('A verification mail has been re-sent to your email.');
  //     }
  //   } catch ({ response }) {
  //     if (response) {
  //       const { message } = response.data;
  //       toast.error(message);
  //     }
  //   }
  // }

  // setInterval(() => {
  //   setIndex(0);
  // }, 300000);

  // // if (!userDetails || !businessProfile) {
  // //   return <MainAppLoader />;
  // // }

  // const options = {
  //   debug: process.env.NODE_ENV === 'development' ? true : false,
  //   titleCase: false,
  //   gaOptions: {
  //     name: businessProfile.businessName,
  //     // userId: userDetails.accountId,
  //   },
  // };
  // initGA('UA-122568450-1', options);
  // setInterceptor(insuranceUrl, customerId);
  // PageView();
  // // setProperties({ userId: userDetails.accountId, name: businessProfile.businessName });

  return (
      <div >
        <MainAppStyle dir={localStorage.i18nextLng === 'ar' ? 'rtl' : 'auto'}>
         {/* <GlobalSideNav {...{ businessName: businessProfile.businessName, customerId: businessProfile.customerId }} /> */}
        <ErrorBoundary>
          <GlobalNavProvider>
            <GlobalContent
              {...{
                businessProfile,
                isUserVerified: true,
                show,
                fxParams: {  },
              }}
            />
            <div className='tickerWrap'>
              <TickerBanner {...{ isLoading, routes, index }} />
            </div>
          </GlobalNavProvider>
        </ErrorBoundary>
      </MainAppStyle>
    </div>
  );
}

export default MainApp;
