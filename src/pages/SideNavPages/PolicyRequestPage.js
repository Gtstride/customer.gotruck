import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, useRouteMatch } from 'react-router-dom';
import GlobalTopNav from '../../components/GlobalTopNav';
import PolicyRequest from '../../components/PolicyRequest/PolicyRequest';
import Page from '../Page';

function AddPolicyPage({ page, businessProfile }) {
  const { path } = useRouteMatch();
  const { t } = useTranslation();
  return (
    <>
      <div className='globalNavBlock'>
        <GlobalTopNav title={t('navTitle.addPolicy')} customerImg={businessProfile.customerImg} />
      </div>
      <Page>
        <Route exact path={`${path}`}>
          <PolicyRequest {...{ page }} />
        </Route>
      </Page>
    </>
  );
}

AddPolicyPage.propTypes = {
  page: PropTypes.string,
};

export default AddPolicyPage;
