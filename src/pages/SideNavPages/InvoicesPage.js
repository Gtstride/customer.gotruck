import React from 'react';
import Invoices from '../../components/Invoices/Invoices';
import Invoice from '../../components/Invoices/Invoice';
import GlobalTopNav from '../../components/GlobalTopNav';
import Page from '../Page';
import PropTypes from 'prop-types';
import { Route, useRouteMatch } from 'react-router-dom';

function InvoicesPage({ page, businessProfile }) {
  const { path } = useRouteMatch();

  return (
    <>
      <div className='globalNavBlock'>
        <GlobalTopNav customerImg={businessProfile.customerImg} />
      </div>
      <Page>
        <Route exact path={`${path}`}>
          <Invoices {...{ page }} />
        </Route>
        <Route path={`/:customerId/${page}/:invoiceId`}>
          <Invoice />
        </Route>
      </Page>
    </>
  );
}

InvoicesPage.propTypes = {
  page: PropTypes.string.isRequired,
};

export default InvoicesPage;
