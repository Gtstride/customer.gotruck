import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Switch, useLocation, useRouteMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import GlobalTopNav from '../../components/GlobalTopNav';
import ContentLoader from '../../components/Loaders/ContentLoader';
import Page from '../Page';

const WaybillTracker = lazy(() => import('../../components/WaybillTracker/WaybillTracker'));

function WaybillTrackerPage({ page, businessProfile }) {
  const { path } = useRouteMatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [waybillTrackerParams, setWaybillTrackerQueryParams] = useState({
    currentPageIndex: 1,
  });
  const { t } = useTranslation();

  useEffect(() => {
    const currentPageIndex = searchParams.get('page');

    setWaybillTrackerQueryParams({
      currentPageIndex: parseInt(currentPageIndex, 10) || 1,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className='globalNavBlock'>
        <GlobalTopNav title={t('waybillTracker.waybillTracker')} customerImg={businessProfile.customerImg} />
      </div>
      <Suspense fallback={<ContentLoader />}>
        <Page>
          <Switch>
            <Route exact path={`${path}`}>
              <WaybillTracker {...{ page, waybillTrackerParams, setWaybillTrackerQueryParams }} />
            </Route>
          </Switch>
        </Page>
      </Suspense>
    </>
  );
}

export default WaybillTrackerPage;
