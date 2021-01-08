import React, { useEffect, useState, Suspense, lazy } from 'react';
import { Route, Switch, useLocation, useRouteMatch } from 'react-router-dom';
import GlobalTopNav from '../../components/GlobalTopNav';
import TruckRequests from '../../components/TruckRequests/TruckRequests';
import Page from '../Page';
import ContentLoader from '../../components/Loaders/ContentLoader';
import TruckRequest from '../../components/TruckRequests/TruckRequest';
import LoadTrucks from '../../components/TruckRequests/LoadTrucks';

// const CreateTruckRequest = lazy(() => import('../../components/TruckRequests/CreateTruckRequest'));
const CreateTruckRequest = lazy(() => import('../../components/TruckRequests/TruckRequests'));


const tabs = {
  tab1: {
    urlString: 'open_requests',
    defaultString: 'marketPlace',
  },
  tab2: {
    urlString: 'assigned_requests',
    defaultString: 'assignedRequests',
  },
  tab3: {
    urlString: 'bulk_requests',
    defaultString: 'bulkAlloc',
  },
};

function TruckRequestsPage({ page, businessProfile }) {
  const { path } = useRouteMatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [truckRequestsQueryParams, setTruckRequestsQueryParams] = useState({
    currentPageIndex: parseInt(searchParams.get('page'), 10) || 1,
    filters: {},
  });

  useEffect(() => {
    const currentPageIndex = searchParams.get('page');
    const status = searchParams.get('status'); // This is what we're filtering by.

    setTruckRequestsQueryParams({
      currentPageIndex: parseInt(currentPageIndex, 10) || 1,
      filters: {
        status,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className='globalNavBlock'>
        <GlobalTopNav customerImg={businessProfile.customerImg} />
      </div>
      <Suspense fallback={<ContentLoader />}>
        <Page>
          <Switch>
            <Route exact path={`${path}`}>
              <TruckRequests
                {...{
                  tabs,
                  page,
                  truckRequestsQueryParams,
                  setTruckRequestsQueryParams,
                  statusParams: searchParams.get('status'),
                }}
              />
            </Route>
            <Route exact path={`/:customerId/${page}/create_truck_request`}>
              <CreateTruckRequest {...{ page, businessProfile, location }} />
            </Route>
            <Route exact path={`${path}/:truckRequestId/clone_truck_request`}>
              <TruckRequest />
            </Route>
            <Route exact path={`/:customerId/${page}/edit_truck_request`}>
              <CreateTruckRequest {...{ page, businessProfile, location }} />
            </Route>
            <Route exact path={`${path}/load_trucks`}>
              <LoadTrucks
                {...{
                  page,
                  truckRequestsQueryParams,
                  setTruckRequestsQueryParams,
                  statusParams: searchParams.get('status'),
                  partnerId: businessProfile.partnerId,
                }}
              />
            </Route>
            <Route exact path={`${path}/:truckRequestId`}>
              <TruckRequest />
            </Route>
          </Switch>
        </Page>
      </Suspense>
    </>
  );
}

export default TruckRequestsPage;
