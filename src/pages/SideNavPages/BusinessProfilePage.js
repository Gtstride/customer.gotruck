import React from 'react';
import GlobalTopNav from '../../components/GlobalTopNav';
import BusinessProfile from '../../components/BusinessProfile/BusinessProfile';
import Page from '../Page';
import PropTypes from 'prop-types';

function BusinessProfilesPage({ businessProfile }) {
  return (
    <>
      <div className='globalNavBlock'>
        <GlobalTopNav title='business profile' customerImg={businessProfile.customerImg} />
      </div>
      <Page>
        <BusinessProfile />
      </Page>
    </>
  );
}

BusinessProfilesPage.propTypes = {
  page: PropTypes.string.isRequired,
};

export default BusinessProfilesPage;
