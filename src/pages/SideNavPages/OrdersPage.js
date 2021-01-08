import PropTypes from 'prop-types';
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import GlobalTopNav from '../../components/GlobalTopNav';
import ContentLoader from '../../components/Loaders/ContentLoader';
import Page from '../Page';

const CreateOrder = lazy(() => import("../../components/Orders/OrdersTable") )
// const Order = lazy(() => import('../../components/Orders/Order'));
// const Orders = lazy(() => import('../../components/Orders/Orders'));

function OrdersPage({ page, businessProfile }) {
  // const {path} = useRouteMatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  // eslint-disable-next-line no-unused-vars
  const [ordersQueryParams, setOrderQueryParams] = useState({
    currentPageIndex: 1,
    filters: {
      status: 'all',
    },
  });

  useEffect(() => {
    // We are expecting two things here: <page> and <status> asin ?page=1&status=pending
    const currentPageIndex = searchParams.get('page');
    const status = searchParams.get('status'); // This is what we're filtering by.

    setOrderQueryParams({
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
        <GlobalTopNav />
      </div>
      <Suspense fallback={<ContentLoader />}>
        <Page>
          <Switch>
            {/* <Route exact path={`${path}`}>
              <Orders {...{page, ordersQueryParams, setOrderQueryParams}} />
            </Route> */}
            <Route exact path={`/:customerId/${page}/create_order`}>
              <CreateOrder {...{ page, businessProfile }} />
            </Route>
            {/* <Route exact path={`/:customerId/${page}/:orderId`}>
              <Order />
            </Route> */}
          </Switch>
        </Page>
      </Suspense>
    </>
  );
}

OrdersPage.propTypes = {
  page: PropTypes.string.isRequired,
};

export default OrdersPage;
