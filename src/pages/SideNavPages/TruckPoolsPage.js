import React, { useEffect, useState } from 'react';
import { Route, Switch, useLocation, useRouteMatch } from 'react-router-dom';
import GlobalTopNav from '../../components/GlobalTopNav';
import TruckPools from '../../components/TruckPools/TruckPools';
import IncomingTruck from '../../components/TruckPools/IncomingTruck';
import Page from '../Page';

function TruckPoolsPage({ page, businessProfile }) {
  const { path } = useRouteMatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [truckPoolsQueryParams, setTruckPoolsQueryParams] = useState({
    currentPageIndex: parseInt(searchParams.get('page'), 10) || 1,
    filters: {},
  });

  useEffect(() => {
    setTruckPoolsQueryParams({
      currentPageIndex: parseInt(searchParams.get('page'), 10) || 1,
      filters: {},
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className='globalNavBlock'>
        <GlobalTopNav customerImg={businessProfile.customerImg} />
      </div>
      <Page>
        <Switch>
          <Route exact path={`${path}`}>
            <TruckPools
              {...{
                page,
                truckPoolsQueryParams,
                setTruckPoolsQueryParams,
              }}
            />
          </Route>
          <Route exact path={`/:customerId/${page}/:incomingTruckId`}>
            <IncomingTruck />
          </Route>
        </Switch>
      </Page>
    </>
  );
}

export default TruckPoolsPage;
