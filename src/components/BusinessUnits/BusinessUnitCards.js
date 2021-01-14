import React from 'react';
import BusinessUnitCardsStyle from '../../styles/BusinessUnitCardsStyle';
import { uuid } from '../../_utils/fx';
import EmptyTable from '../EmptyData/EmptyTable';
import ContentLoader from '../Loaders/ContentLoader';
import PageContent from '../PageContent';
import Error from '../Shared/Error';
import BusinessUnitCard from './BusinessUnitCard';

export function BusinessUnitCards({ error, isLoading, setModal, businessUnits, t }) {
  // #region Returns
  if (isLoading) {
    return <ContentLoader />;
  }

  if (error) {
    return <Error {...{ error }} />;
  }
  if (businessUnits.length < 1) {
    return (
      <PageContent>
        <EmptyTable errorTitle='' errorSubtitle={`${t('emptyData.noAvailableBizUnits')}`} />
      </PageContent>
    );
  }

  return (
    <div className='pageContent'>
      <BusinessUnitCardsStyle>
        {businessUnits.map(({ name, id }) => (
          <BusinessUnitCard {...{ setModal, name, businessUnitId: id }} key={uuid()} />
        ))}
      </BusinessUnitCardsStyle>
    </div>
  );
  // #endregion
}

export default BusinessUnitCards;
