import PropTypes from 'prop-types';
import React from 'react';
import { Route, useRouteMatch } from 'react-router-dom';
import GlobalTopNav from '../../components/GlobalTopNav';
import Users from '../../components/Users/Users';
import Page from '../Page';

function UsersPage({ page, businessProfile }) {
  const { path } = useRouteMatch();
  return (
    <>
      <div className='globalNavBlock'>
        <GlobalTopNav title='users' customerImg={businessProfile.customerImg} />
      </div>
      <Page>
        <Route exact path={`${path}`}>
          <Users {...{ page }} />
        </Route>
      </Page>
    </>
  );
}

UsersPage.propTypes = {
  page: PropTypes.string.isRequired,
};

export default UsersPage;
