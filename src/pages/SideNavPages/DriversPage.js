import React from 'react';
import GlobalTopNav from '../../components/GlobalTopNav';
import Drivers from '../../components/Drivers/Drivers';
import Page from '../Page';
import PropTypes from 'prop-types';
import {Route, useRouteMatch } from 'react-router-dom';
import DriverProfile from '../../components/Drivers/DriverProfile';

function DriversPage({page, businessProfile }) {
  const { path } = useRouteMatch();


  return (
    <>
      <div className='globalNavBlock'>
        <GlobalTopNav customerImg={businessProfile.customerImg} />
      </div>
      <Page>
        <Route exact path={`${path}`}>
          <Drivers {...{page, partnerId: businessProfile.partnerId, admin: businessProfile.admin}} />
        </Route>
        <Route path={`/:customerId/${page}/:driverId`}>
          <DriverProfile {...{page, partnerId: businessProfile.partnerId}} />
        </Route>
      </Page>
    </>
  );
}

DriversPage.propTypes = {
  page: PropTypes.string.isRequired,
};

export default DriversPage;
