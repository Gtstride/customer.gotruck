import PropTypes from 'prop-types';
import React from 'react';
import { Route, useRouteMatch } from 'react-router-dom';
import GlobalTopNav from '../../components/GlobalTopNav';
import Recipients from '../../components/Recipients/Recipients';
import Page from '../Page';

function RecipientsPage({ page, businessProfile }) {
  const { path } = useRouteMatch();
  return (
    <>
      <div className='globalNavBlock'>
        <GlobalTopNav title='recipients' customerImg={businessProfile.customerImg} />
      </div>
      <Page>
        <Route exact path={`${path}`}>
          <Recipients {...{ page }} />
        </Route>
      </Page>
    </>
  );
}

RecipientsPage.propTypes = {
  page: PropTypes.string.isRequired,
};

export default RecipientsPage;
