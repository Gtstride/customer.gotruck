import PropTypes from 'prop-types';
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Switch, useLocation, useRouteMatch } from 'react-router-dom';
import GlobalTopNav from '../../components/GlobalTopNav';
import ContentLoader from '../../components/Loaders/ContentLoader';
import Page from '../Page';

const Trip = lazy(() => import('../../components/Trips/Trip'));
const Trips = lazy(() => import('../../components/Trips/Trips'));

function TripsPage({ page, businessProfile }) {
  const { path } = useRouteMatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [tripsQueryParams, setTripsQueryParams] = useState({
    currentPageIndex: 1,
    filters: {
      status: 'all',
      source: 'all',
      destination: 'all',
    },
  });
  const { businessName } = businessProfile;

  useEffect(() => {
    // We are expecting the url with queryParams to be like ?page=1&status=pending&source=lagos&destination=lagos
    const currentPageIndex = searchParams.get('page');
    const status = searchParams.get('status'); // This is what we're filtering by.
    const source = searchParams.get('source'); // This is what we're filtering by.
    const destination = searchParams.get('destination'); // This is what we're filtering by.

    setTripsQueryParams({
      currentPageIndex: parseInt(currentPageIndex, 10) || 1,
      filters: {
        status: status || 'all',
        source: source || 'all',
        destination: destination || 'all',
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
              <Trips {...{ page, businessName, tripsQueryParams, setTripsQueryParams }} />
            </Route>
            <Route path={`/:customerId/${page}/:tripId`}>
              <Trip />
            </Route>
          </Switch>
        </Page>
      </Suspense>
    </>
  );
}

TripsPage.propTypes = {
  page: PropTypes.string.isRequired,
};

export default TripsPage;
