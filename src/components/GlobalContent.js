import React, { lazy, Suspense, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useFetch } from '../APIs/Read';
import { useBusinessUnitsDispatch } from '../contexts/BusinessUnitsContext';
import { useUserDispatch, useUserState } from '../contexts/UserContext';
import LearnMorePage from '../pages/LearnMorePage';
import OrdersPage from '../pages/SideNavPages/OrdersPage';
import TruckPoolsPage from '../pages/SideNavPages/TruckPoolsPage';
import TruckRequestsPage from '../pages/SideNavPages/TruckRequestsPage';
import ContentStyle from '../styles/ContentStyle';
import { getUserDetails } from '../_utils/auth';
import { setDocumentTitle } from '../_utils/browser';
import VerifyEmailBanner from './General/VerifyEmailBanner';
import ContentLoader from './Loaders/ContentLoader';
import PrivateRoute from './PrivateRoute';
// code splitting
const BusinessProfilePage = lazy(() => import('../pages/SideNavPages/BusinessProfilePage'));
const UserProfilePage = lazy(() => import('../pages/SideNavPages/UserProfilePage'));
const TransportersPage = lazy(() => import('../pages/SideNavPages/TransportersPage'));
const WaybillTrackerPage = lazy(() => import('../pages/SideNavPages/WaybillTrackerPage'));
const BusinessUnitsPage = lazy(() => import('../pages/SideNavPages/BusinessUnitsPage'));
const GeneralSettingsPage = lazy(() => import('../pages/SideNavPages/GeneralSettings'));
const InvoicesPage = lazy(() => import('../pages/SideNavPages/InvoicesPage'));
const TripsPage = lazy(() => import('../pages/SideNavPages/TripsPage'));
const DriversPage = lazy(() => import('../pages/SideNavPages/DriversPage'));
const TrucksPage = lazy(() => import('../pages/SideNavPages/TrucksPage'));

// const OrdersPage = lazy(() => import('../pages/SideNavPages/OrdersPage'));
const PickupLocationsPage = lazy(() => import('../pages/SideNavPages/PickupLocationsPage'));
const RecipientsPage = lazy(() => import('../pages/SideNavPages/RecipientsPage'));
const UsersPage = lazy(() => import('../pages/SideNavPages/UsersPage'));
// const RoutesPage = lazy(() => import('../pages/SideNavPages/RoutesPage'));
const TransporterRoutePage = lazy(() => import('../pages/SideNavPages/TransporterRoutePage'));
const SupportPage = lazy(() => import('../pages/SideNavPages/SupportPage'));
const Battlefield = lazy(() => import('./Battlefield'));
const Dashboard = lazy(() => import('./Dashboard/Dashboard'));
const InsurancePage = lazy(() => import('../pages/SideNavPages/InsurancePage'));
const PolicyPage = lazy(() => import('../pages/SideNavPages/PolicyPage'));
const PolicyRequestPage = lazy(() => import('../pages/SideNavPages/PolicyRequestPage'));

function GlobalContent({ businessProfile, isUserVerified, show, fxParams: { sendVerification, resendVerification } }) {
  const { page } = useParams();
  const { customerId } = useParams();
  // #region Contexts
  const setUserDetails = useUserDispatch();
  const setBusinessUnitsDetails = useBusinessUnitsDispatch();
  const { customerId: customerId2, token } = useUserState();
  // #endregion
  const { response } = useFetch(`/customer/${customerId2}/sections`, token);

  useEffect(() => {
    if (response) {
      setBusinessUnitsDetails(response.sections);
    }
  }, [response, setBusinessUnitsDetails]);

  useEffect(() => {
    const userDetails = getUserDetails(customerId);
    setUserDetails(userDetails);
  }, [customerId, setUserDetails]);

  useEffect(() => {
    setDocumentTitle(businessProfile.businessName, page);
  }, [businessProfile.businessName, page]);

  return (
    <>
      {isUserVerified === 0 && (
        <VerifyEmailBanner
          {...{
            show,
            fxParams: {
              sendVerification,
              resendVerification,
            },
          }}
        />
      )}

      <ContentStyle id='content'>
        <Suspense fallback={<ContentLoader />}>
          <PrivateRoute exact path='/:customerId/dashboard'>
            <Dashboard {...{ businessProfile }} />
          </PrivateRoute>
          <PrivateRoute path='/:customerId/battlefield'>
            <Battlefield />
          </PrivateRoute>
          <PrivateRoute path='/:customerId/trips'>
            <TripsPage {...{ page, businessProfile }} />
          </PrivateRoute>
          <PrivateRoute path='/:customerId/orders'>
            <OrdersPage {...{ page, businessProfile }} />
          </PrivateRoute>
          <PrivateRoute path='/:customerId/routes'>
            <TransporterRoutePage {...{ page, businessProfile }} />
          </PrivateRoute>
          <PrivateRoute path='/:customerId/incoming_trucks'>
            <TruckPoolsPage {...{ page, businessProfile }} />
          </PrivateRoute>
          <PrivateRoute path='/:customerId/truck_requests'>
            <TruckRequestsPage {...{ page, businessProfile }} />
          </PrivateRoute>
          <PrivateRoute path='/:customerId/transporters'>
            <TransportersPage {...{ page, businessProfile }} />
          </PrivateRoute>
          <PrivateRoute path='/:customerId/drivers'>
            <DriversPage {...{ page, businessProfile }} />
          </PrivateRoute>
          <PrivateRoute path='/:customerId/trucks'>
            <TrucksPage {...{ page, businessProfile }} />
          </PrivateRoute>
          <PrivateRoute path='/:customerId/waybill_tracker'>
            <WaybillTrackerPage {...{ page, businessProfile }} />
          </PrivateRoute>
          <PrivateRoute path='/:customerId/invoices'>
            <InvoicesPage {...{ page, businessProfile }} />
          </PrivateRoute>
          <PrivateRoute path='/:customerId/support'>
            <SupportPage {...{ page, businessProfile }} />
          </PrivateRoute>
          <PrivateRoute path='/:customerId/business_profile'>
            <BusinessProfilePage {...{ page, businessProfile }} />
          </PrivateRoute>
          <PrivateRoute path='/:customerId/user_profile'>
            <UserProfilePage {...{ page, businessProfile }} />
          </PrivateRoute>
          <PrivateRoute path='/:customerId/business_units'>
            <BusinessUnitsPage {...{ page, businessProfile }} />
          </PrivateRoute>
           <PrivateRoute path='/:customerId/general_settings'>
            <GeneralSettingsPage {...{ page, businessProfile }} />
          </PrivateRoute>
          <PrivateRoute path='/:customerId/pickup_locations'>
            <PickupLocationsPage {...{ page, businessProfile }} />
          </PrivateRoute>
          <PrivateRoute path='/:customerId/recipients'>
            <RecipientsPage {...{ page, businessProfile }} />
          </PrivateRoute>
          <PrivateRoute path='/:customerId/manage_users'>
            <UsersPage {...{ page, businessProfile }} />
          </PrivateRoute>
          <PrivateRoute path='/:customerId/learn-more'>
            <LearnMorePage {...{ businessProfile }} />
          </PrivateRoute>
          <PrivateRoute path='/:customerId/insurance'>
            <InsurancePage {...{ page, businessProfile }} />
          </PrivateRoute>
          <PrivateRoute path='/:customerId/policies'>
            <PolicyPage {...{ page, businessProfile }} />
          </PrivateRoute>
          <PrivateRoute path='/:customerId/add_policy'>
            <PolicyRequestPage {...{ page, businessProfile }} />
          </PrivateRoute>
        </Suspense>
      </ContentStyle>
    </>
  );
}

export default GlobalContent;
