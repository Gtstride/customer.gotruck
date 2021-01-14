import React from 'react';
import PickupLocations from '../../components/PickupLocations/PickupLocations';
import GlobalTopNav from '../../components/GlobalTopNav';
import Page from '../Page';
import { Route, useRouteMatch } from 'react-router-dom';
import PropTypes from 'prop-types';

function PickupLocationsPage({ page, businessProfile }) {
  const { path } = useRouteMatch();

  return (
    <>
      <div className='globalNavBlock'>
        <GlobalTopNav title='pickup location' customerImg={businessProfile.customerImg} />
      </div>
      <Page>
        <Route exact path={`${path}`}>
          <PickupLocations {...{ page }} />
        </Route>
      </Page>
    </>
  );
}

PickupLocationsPage.propTypes = {
  page: PropTypes.string.isRequired,
};

export default PickupLocationsPage;
