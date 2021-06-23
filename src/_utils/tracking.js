import ReactGA from 'react-ga';

export const initGA = (trackingID, options) => {
  // console.log(options)
  ReactGA.initialize(trackingID);
};

export const PageView = () => {
  ReactGA.pageview(window.location.href);
};

export const setProperties = ({ userId, name }) => {
  ReactGA.set({
    appName: 'Admin Dashboard',
    hostname: window.location.hostname,
    location: window.location.href,
    language: localStorage.i18nextLng,
    userId,
    appId: name,
  });
};

// <script async src="https://www.googletagmanager.com/gtag/js?id=UA-122568450-1"></script>
// <script>
//   window.dataLayer = window.dataLayer || [];
//   function gtag(){dataLayer.push(arguments);}
//   gtag('js', new Date());
//   gtag('config', 'UA-122568450-1');
//   gtag('set', {
//       'app': 'Customer Dashboard',
//       'user_id': accountID,
//   });
// </script>
