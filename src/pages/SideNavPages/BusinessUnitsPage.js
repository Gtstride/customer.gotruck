import PropTypes from 'prop-types';
import React, { lazy, Suspense } from 'react';
import { Route, useRouteMatch, Switch } from 'react-router-dom';
import GlobalTopNav from '../../components/GlobalTopNav';
import Page from '../Page';
import ContentLoader from '../../components/Loaders/ContentLoader';

const BusinessUnit = lazy(() => import('../../components/BusinessUnits/BusinessUnit'));
const BusinessUnits = lazy(() => import('../../components/BusinessUnits/BusinessUnits'));

function BusinessUnitsPage({ page, businessProfile }) {
  const { path } = useRouteMatch();

  return (
    <>
      <div className='globalNavBlock'>
        <GlobalTopNav customerImg={businessProfile.customerImg} />
      </div>
      <Suspense fallback={<ContentLoader />}>
        <Page>
          <Switch>
            <Route exact path={`${path}`}>
              <BusinessUnits />
            </Route>
            <Route path={`/:customerId/${page}/:businessUnitId`}>
              <BusinessUnit />
            </Route>
          </Switch>
        </Page>
      </Suspense>
    </>
  );
}

BusinessUnitsPage.propTypes = {
  page: PropTypes.string.isRequired,
};

export default BusinessUnitsPage;
