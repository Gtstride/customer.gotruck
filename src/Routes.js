import React, { Suspense } from 'react';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { Redirect, Route, Switch } from 'react-router-dom';
import ContentLoader from './components/Loaders/ContentLoader';
import { BusinessUnitsProvider } from './contexts/BusinessUnitsContext';
import { UserProvider } from './contexts/UserContext';
import MainApp from './MainApp';
import AuthorizePage from './pages/Auth/AuthorizePage';
import ConfirmPage from './pages/Auth/ConfirmPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';
import VerifyForgotPasswordCodePage from './pages/Auth/VerifyForgotPasswordCodePage';
function Routes() {
  return (
    <Switch>
      <Suspense fallback={<ContentLoader />}>
        <Route path='/' exact>
          <LoginPage />
        </Route>
        <Route path='/login'>
          <Redirect to='/' />
        </Route>
        <Route path='/register'>
          <RegisterPage />
        </Route>
        <Route path='/forgot-password'>
          <ForgotPasswordPage />
        </Route>
        <Route path='/verify-forgot-password-otp'>
          <VerifyForgotPasswordCodePage />
        </Route>
        <Route path='/reset-password'>
          <ResetPasswordPage />
        </Route>
        <Route path='/authorize'>
          <AuthorizePage />
        </Route>
        <Route path='/confirm'>
          <ConfirmPage />
        </Route>
        <UserProvider>
          <BusinessUnitsProvider>
            <Route path='/:customerId/:page'>
              <MainApp />
            </Route>
          </BusinessUnitsProvider>
        </UserProvider>
      </Suspense>
      <Route>
        <h1>Not Found.</h1>
      </Route>
    </Switch>
  );
}

export default Routes;
