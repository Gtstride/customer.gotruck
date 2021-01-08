import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useFetch } from '../../APIs/Read';
import { useGlobalNavDispatch } from '../../contexts/GlobalNavContext';
import { useUserState } from '../../contexts/UserContext';
import TableStyle from '../../styles/TableStyle';
import { isArrayEmpty, setGlobalNavBarDetails } from '../../_utils/fx';
import { truckPoolHeaders } from '../../_utils/tableheaders';
import EmptyTable from '../EmptyData/EmptyTable';
import Card from '../General/Card';
import ContentLoader from '../Loaders/ContentLoader';
import PageActions from '../PageActions';
import PageContent from '../PageContent';
import Error from '../Shared/Error';
import TableContent from '../Tables/TableContent';
import TableHeader from '../Tables/TableHeader';

function Table({
  promises: {
    truckPoolsPromises: { fleets, truckPoolsFetchError, truckPoolsFetchIsLoading },
  },
  tableParams: { tableFor, headers },
  pageQueryParams: {
    currentPageIndex,
    paginationData: { totalPages },
    filters,
    setTruckPoolsQueryParams,
  },
  setDefaultEndpoint,
  customerId,
  page,
  t,
}) {
  function paginateToNextPage() {
    setTruckPoolsQueryParams({
      currentPageIndex: currentPageIndex + 1,
      filters: {},
    });

    setDefaultEndpoint(`/truck/truckRequestPool?page=${currentPageIndex + 1}`);
  }

  function paginateToPrevPage() {
    setTruckPoolsQueryParams({
      currentPageIndex: currentPageIndex - 1,
      filters: {},
    });
    setDefaultEndpoint(`/truck/truckRequestPool?page=${currentPageIndex - 1}`);
  }

  if (truckPoolsFetchIsLoading) {
    return <ContentLoader />;
  }

  if (isArrayEmpty(fleets)) {
    return (
      <main>
        <EmptyTable errorTitle='' errorSubtitle={`${t('emptyData.noAvailableData')}`} />
      </main>
    );
  }

  if (truckPoolsFetchError) {
    return <Error {...{ error: truckPoolsFetchError }} />;
  }

  return (
    <main>
      <TableStyle>
        <div className='table-wrap'>
          <table id='table' data-table-for={tableFor.toLowerCase()}>
            <TableHeader
              {...{
                headers,
              }}
            />
            <TableContent
              {...{
                tableData: fleets,
                tableFor,
                customerId,
                page,
              }}
            />
          </table>
          {fleets.length > 1 && totalPages > 1 && (
            <div id='tableFooter'>
              <div>
                {currentPageIndex > 1 && (
                  <i className='material-icons pointer' onClick={paginateToPrevPage}>
                    chevron_left
                  </i>
                )}
              </div>
              <div className='currentPage'>{currentPageIndex}</div>
              &nbsp; {t('pagination.of')} &nbsp;
              <div className='totalPages'>{totalPages}</div>
              {totalPages}
              <div>
                {currentPageIndex < totalPages && (
                  <i className='material-icons pointer' onClick={paginateToNextPage}>
                    chevron_right
                  </i>
                )}
              </div>
            </div>
          )}
        </div>
      </TableStyle>
    </main>
  );
}

function TruckPools({ page, truckPoolsQueryParams: { currentPageIndex, filters }, setTruckPoolsQueryParams }) {
  // #region React Router
  const { url } = useRouteMatch();
  const { push } = useHistory();
  // #endregion
  const { t } = useTranslation();

  //#region  Contexts
  const setGlobalNavDetails = useGlobalNavDispatch();
  const { token, customerId: customerId2, businessId, businessUnit } = useUserState();
  const { customerId } = useParams();
  const [paginationData, setPaginationData] = useState({
    totalPages: null,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const isNotAdmin = businessUnit !== 'admin';
  const appendBusinessUnit = isNotAdmin ? `&businessId=${businessId}` : '';
  const endPoint = isNotAdmin
    ? `/truck/truckRequestPool?page=${currentPageIndex}&customerId=${customerId2}${appendBusinessUnit}`
    : `/truck/truckRequestPool?page=${currentPageIndex}&customerId=${customerId2}`;
  const [defaultEndpoint, setDefaultEndpoint] = useState(endPoint);
  // #endregion

  //#region  State
  const [fleets, setFleets] = useState([]);
  const { response: truckPoolsFetchRes, error: truckPoolsFetchError, isLoading: truckPoolsFetchIsLoading } = useFetch(
    defaultEndpoint,
    token,
  );
  // #endregion

  useEffect(() => {
    setGlobalNavBarDetails({ navTitle: <>{t('incomingTrucks.title')}</>, itemId: undefined }, setGlobalNavDetails);
  }, [setGlobalNavDetails, t]);

  useEffect(() => {
    if (truckPoolsFetchRes) {
      setFleets(truckPoolsFetchRes.truckrequestpool);
      setPaginationData({ totalPages: truckPoolsFetchRes.totalPages });
      let newURL;

      if (paginationData.totalPages) {
        if (currentPageIndex > paginationData.totalPages) {
          setDefaultEndpoint(`/truck/truckRequestPool?customerId=${customerId2}${appendBusinessUnit}`);
        }
      }

      if (currentPageIndex > paginationData.totalPages || currentPageIndex === 1) {
        newURL = url;
      } else {
        newURL = `${url}?page=${currentPageIndex}&customerId=${customerId2}${appendBusinessUnit}`;
      }

      push(newURL);
    }
    // eslint-disable-next-line
  }, [currentPageIndex, customerId2, paginationData.totalPages, push, truckPoolsFetchRes, url]);

  function onSearch(e) {
    setSearchTerm(e.target.value);
  }

  useEffect(() => {
    if (searchTerm !== '') {
      setDefaultEndpoint(
        `truck/truckRequestPool/search?searchTerm=${searchTerm}&customerId=${customerId2}${appendBusinessUnit}`,
      );
    } else {
      setDefaultEndpoint(
        `/truck/truckRequestPool?page=${currentPageIndex}&customerId=${customerId2}${appendBusinessUnit}`,
      );
    }
    // eslint-disable-next-line
  }, [currentPageIndex, customerId2, searchTerm]);

  return (
    <PageContent>
      <header className='pageHeader'>
        <Card
          {...{
            page,
            type: 'purple',
            label: <>{t('incomingTrucks.title')}</>,
            total: (truckPoolsFetchRes && truckPoolsFetchRes.total) || undefined,
          }}
        />
        <PageActions
          {...{
            actions: [],
            showSearch: true,
            ownerComponent: 'incomingTrucks',
            onSearch,
            searchTerm,
          }}
        />
      </header>
      <section className='pageContent'>
        <Table
          {...{
            promises: {
              truckPoolsPromises: {
                fleets,
                truckPoolsFetchError,
                truckPoolsFetchIsLoading,
              },
            },
            tableParams: { tableFor: 'incomingTrucks', headers: truckPoolHeaders },
            pageQueryParams: { paginationData, currentPageIndex, filters, setTruckPoolsQueryParams },
            setDefaultEndpoint,
            customerId,
            page,
            t,
          }}
        />
      </section>
    </PageContent>
  );
}

export default TruckPools;
