import PropTypes from 'prop-types';

import React from 'react';

import { Route, useRouteMatch } from 'react-router-dom';

import GlobalTopNav from '../../components/GlobalTopNav';

import PolicyPage from '../../components/Policy/Policy';

import Page from '../Page';

import { useTranslation} from 'react-i18next';


function InsurancePage({ page, businessProfile }) {

  const { path } = useRouteMatch();

  const { t} = useTranslation();

  let match = useRouteMatch('/:customerId/policies/:policyId');

  const title = match && match.isExact ? t('navTitle.addPolicy') : t('navTitle.policies');
  console.log('title', t('navTitle.addPolicy'));

  return (

    <>

      <div className='globalNavBlock'>

      <GlobalTopNav title={`${title}`} customerImg={businessProfile.customerImg} />

      </div>

      <Page>

        <Route exact path={`${path}`}>

          <PolicyPage {...{ page }} />

        </Route>

      </Page>

    </>

  );

}


InsurancePage.propTypes = {

  page: PropTypes.string.isRequired,

};


export default InsurancePage;
