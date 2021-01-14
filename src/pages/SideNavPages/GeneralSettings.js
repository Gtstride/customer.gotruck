import React, { useEffect } from 'react';
import GeneralSettings from '../../components/GeneralSettings/GeneralSettings';
import { useGlobalNavDispatch } from '../../contexts/GlobalNavContext';
import { setGlobalNavBarDetails } from '../../_utils/fx';
import Page from '../Page';
import GlobalTopNav from '../../components/GlobalTopNav';
import { useTranslation } from 'react-i18next';

function GeneralSettingsPage({ page, businessProfile }) {
  const setGlobalNavDetails = useGlobalNavDispatch();
  
  const { t } = useTranslation();
  
  useEffect(() => {
    setGlobalNavBarDetails({  navTitle: <>{t('navTitle.generalSettings')}</>, itemId: undefined }, setGlobalNavDetails);
  }, [setGlobalNavDetails, t]);

  return (
    <>
      <div className='globalNavBlock'>
        <GlobalTopNav customerImg={businessProfile.customerImg} />
      </div>
      <Page>
        <GeneralSettings {...{ page, businessName: businessProfile.businessName }} />
      </Page>
    </>
  );
}

export default GeneralSettingsPage;
