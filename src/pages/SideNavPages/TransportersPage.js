import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Switch, useLocation, useRouteMatch } from 'react-router-dom';
import GlobalTopNav from '../../components/GlobalTopNav';
import ContentLoader from '../../components/Loaders/ContentLoader';
import Page from '../Page';

const Transporters = lazy(() => import('../../components/Transporters/Transporters'));
const Transporter = lazy(() => import('../../components/Transporters/Transporter'));
const AddTransporter = lazy(() => import('../../components/Transporters/AddTransporter'));
const AddTransporterPrompt = lazy(() => import('../../components/Transporters/AddTransporterPrompt'));

function TransportersPage({ page, businessProfile }) {
  const { path } = useRouteMatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [transportersQueryParams, setTransportersQueryParams] = useState({
    currentPageIndex: 1,
  });

  useEffect(() => {
    const currentPageIndex = searchParams.get('page');

    setTransportersQueryParams({
      currentPageIndex: parseInt(currentPageIndex, 10) || 1,
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
              <Transporters {...{ page, transportersQueryParams, setTransportersQueryParams, businessProfile }} />
            </Route>
            <Route exact path={`/:customerId/${page}/add_transporter`}>
              <AddTransporter {...{ page, transportersQueryParams, setTransportersQueryParams }} />
            </Route>
            <Route exact path={`/:customerId/${page}/add_transporter_prompt`}>
              <AddTransporterPrompt {...{ page, businessProfile }} />
            </Route>
            <Route exact path={`/:customerId/${page}/:transporterId`}>
              <Transporter />
            </Route>
          </Switch>
        </Page>
      </Suspense>
    </>
  );
}

export default TransportersPage;
