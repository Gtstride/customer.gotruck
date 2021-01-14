// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// reportWebVitals();

import React from 'react';
import 'react-dates/initialize';
import { init } from '@sentry/browser';
import 'react-dates/lib/css/_datepicker.css';
import ReactDOM from 'react-dom';
import Routes from './Routes';
import './i18n';
import './styles/css/index.css'
import 'react-toastify/dist/ReactToastify.css';
import { initGTM } from './_utils/gtm';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
if (process.env.NODE_ENV === 'production') {
  init({
    dsn: "https://7a62105b6bae434ea91a5423fcc35940@o504700.ingest.sentry.io/5591951",
  });
}

initGTM();

ReactDOM.render(
  <Router>
    <Routes />
    <ToastContainer />
  </Router>,
  document.getElementById('root'),
);

