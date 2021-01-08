import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useHistory, useParams, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import { useFetch } from '../../APIs/Read';
import { useGlobalNavDispatch } from '../../contexts/GlobalNavContext';
import { useUserState } from '../../contexts/UserContext';
import TableStyle from '../../styles/TableStyle';
import { isArrayEmpty, setGlobalNavBarDetails } from '../../_utils/fx';
import { truckRequestHeaders } from '../../_utils/tableheaders';
import EmptyTable from '../EmptyData/EmptyTable';
import ContentLoader from '../Loaders/ContentLoader';
import PageActions from '../PageActions';
import PageContent from '../PageContent';
import Error from '../Shared/Error';
import TableContent from '../Tables/TableContent';
import TableHeader from '../Tables/TableHeader';
import InnerPageBackButton from '../Shared/InnerPageBackButton';

const TruckRequestsStyle = styled.div`
  .card {
    .cardIconBlock {
      background-image: var(--common-file-text-edit);
    }
  }

  .TotalTruckRequestColumn,
  .StatusColumn {
    .tableItem {
      display: flex;
      align-items: center;
      flex: 1;
    }
  }
`;

function Table({
  promises: {
    truckRequestPromises: { truckRequests, truckRequestsFetchError, truckRequestsFetchIsLoading },
  },
  tableParams: { tableFor, headers, onClone, onEdit },
  statusParams,
  pageParams: { page, customerId2 },
  paginationData,
  setTruckRequestsQueryParams,
  t,
}) {
  function paginateToNextPage() {
    setTruckRequestsQueryParams({
      currentPageIndex: paginationData.currentPage + 1,
      filters: {
        status: statusParams,
      },
    });
  }
  function paginateToPrevPage() {
    setTruckRequestsQueryParams({
      currentPageIndex: paginationData.currentPage - 1,
      filters: {
        status: statusParams,
      },
    });
  }

  if (truckRequestsFetchIsLoading) {
    return <ContentLoader />;
  }

  if (isArrayEmpty(truckRequests)) {
    return (
      <main>
        <EmptyTable errorTitle='' errorSubtitle={`${t('emptyData.noAvailableData')}`} />
      </main>
    );
  }

  if (truckRequestsFetchError) {
    return <Error {...{ error: truckRequestsFetchError }} />;
  }

  return (
    <>
      <div className='table-wrap'>
        <table id='table' data-table-for={'truckrequest'}>
          <TableHeader
            {...{
              headers,
            }}
          />
          <TableContent
            {...{
              tableData: truckRequests,
              tableFor,
              statusParams,
              page,
              customerId2,
              onClone,
              onEdit,
            }}
          />
        </table>
        {paginationData.totalPages > 1 && (
          <div id='tableFooter'>
            <div title='prev page'>
              {paginationData.currentPage > 1 && (
                <i className='material-icons pointer' onClick={paginateToPrevPage}>
                  chevron_left
                </i>
              )}
            </div>
            <div className='currentPage'>{paginationData.currentPage}</div>
            &nbsp; {t('pagination.of')} &nbsp;
            <div className='totalPages'>{paginationData.totalPages}</div>
            <div title='next page'>
              {paginationData.currentPage < paginationData.totalPages && (
                <i className='material-icons pointer' onClick={paginateToNextPage}>
                  chevron_right
                </i>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function TruckRequests({
  tabs: { tab1, tab2, tab3 },
  tabs,
  page,
  truckRequestsQueryParams,
  setTruckRequestsQueryParams,
  statusParams,
}) {
  const { url } = useRouteMatch();
  const { replace, push, goBack } = useHistory();

  const setGlobalNavDetails = useGlobalNavDispatch();
  const { customerId, businessId, token, userType: role } = useUserState();

  const { t } = useTranslation();
  const { customerId: customerId2 } = useParams();
  const [defaultEndpoint, setDefaultEndpoint] = useState(
    statusParams === 'bulk_requests'
      ? `/request/bulktruck?customerId=${customerId}&accessType=bulk`
      : `/request/truck?customerId=${customerId}${
          (businessId !== 0 && businessId !== undefined && `&businessId=${businessId}`) || ''
        }&accessType=${(statusParams === 'open_requests' && 'open') || 'dt'}`,
  );
  const [truckRequests, setTruckRequests] = useState();
  const {
    response: truckRequestsFetchRes,
    error: truckRequestsFetchError,
    isLoading: truckRequestsFetchIsLoading,
  } = useFetch(defaultEndpoint, token);

  const [tableHeaders, setTableHeaders] = useState([]);
  const [paginationData, setPaginationData] = useState({
    currentPageIndex: 1,
    limit: 30,
    total: undefined,
    totalPages: undefined,
  });

  useEffect(() => {
    setGlobalNavBarDetails({ navTitle: <>{t('truckRequests.title')}</>, itemId: undefined }, setGlobalNavDetails);
  }, [setGlobalNavDetails, t]);

  useEffect(() => {
    let newURL;
    const pageWhat = truckRequestsQueryParams.currentPageIndex;

    if (statusParams === tab1.urlString) {
      setDefaultEndpoint(
        `/request/truck?customerId=${customerId}${
          (businessId !== 0 && businessId !== undefined && `&businessId=${businessId}`) || ''
        }&accessType=open&page=${pageWhat}`,
      );
      newURL = `${url}?status=${statusParams}&page=${pageWhat}`;
    } else if (statusParams === tab2.urlString) {
      setDefaultEndpoint(
        `/request/truck?customerId=${customerId}${
          (businessId !== 0 && businessId !== undefined && `&businessId=${businessId}`) || ''
        }&accessType=dt&page=${pageWhat}`,
      );
      newURL = `${url}?status=${statusParams}&page=${pageWhat}`;
    } else if (statusParams === tab3.urlString) {
      setDefaultEndpoint(
        `/request/bulktruck?customerId=${customerId}${
          (businessId !== 0 && businessId !== undefined && `&businessId=${businessId}`) || ''
        }&page=${pageWhat}`,
      );
      newURL = `${url}?status=${statusParams}&page=${pageWhat}`;
    }
    replace(newURL);
  }, [
    businessId,
    customerId,
    defaultEndpoint,
    paginationData.currentPageIndex,
    push,
    setTruckRequestsQueryParams,
    statusParams,
    tab1.urlString,
    tab2.urlString,
    tab3.urlString,
    truckRequestsQueryParams,
    url,
    replace,
  ]);

  useEffect(() => {
    if (truckRequestsFetchRes) {
      if (truckRequestsFetchRes.truckrequests) {
        if (statusParams === tab1.urlString) {
          setTableHeaders(truckRequestHeaders.openRequestsHeaders);
        } else {
          setTableHeaders(truckRequestHeaders.assignedRequestsHeaders);
        }
        setTruckRequests(truckRequestsFetchRes.truckrequests);
        const { truckrequests, ...paginationData } = truckRequestsFetchRes;
        setPaginationData(paginationData);
      } else {
        setTableHeaders(truckRequestHeaders.bulkRequestsHeaders);
        setTruckRequests(truckRequestsFetchRes.bulktruckrequests);
        const { bulktruckrequests, ...paginationData } = truckRequestsFetchRes;
        setPaginationData(paginationData);
      }
    }
  }, [defaultEndpoint, statusParams, tab1.urlString, tab2.urlString, tab3.urlString, truckRequestsFetchRes]);

  useEffect(() => {
    if (!statusParams) {
      replace(`${url}?status=${tab1.urlString}`);
    }

    // eslint-disable-next-lines
  }, [replace, statusParams, tab1.urlString, url]);

  function createTruckRequest() {
    push(`/${customerId2}/${page}/create_truck_request`);
  }

  const onClone = data => {
    console.log('clone truck clicked');
    push(`/${customerId2}/${page}/${data._id}/clone_truck_request`, data);
  };

  // const onEdit = data => {
  //   push(`/${customerId2}/${page}/edit_truck_request`, data);
  // };

  return (
    <TruckRequestsStyle>
      <PageContent>
        <header className='pageHeader'>
          {/*<div className='p-1-7'>*/}
          <InnerPageBackButton
            action={() => {
              goBack();
            }}
          />
          {/*</div>*/}
          <PageActions
            {...{
              ownerComponent: 'truckRequests',
              createTruckRequest,
              role,
            }}
          />
        </header>
        <section className='pageContent'>
          <div className='tabsContainer'>
            {Object.entries(tabs).map(([key, { urlString, defaultString }]) => {
              return (
                <NavLink
                  key={key}
                  to={`${url}?status=${urlString}&page=1`}
                  className={`tab ${key} ${urlString}`}
                  onClick={() =>
                    setTruckRequestsQueryParams({
                      currentPageIndex: 1,
                      filters: {
                        status: statusParams,
                      },
                    })
                  }
                  activeClassName={`${(statusParams === urlString && 'active') || ''}`}
                >
                  {t(`truckRequests.${defaultString}`)}
                </NavLink>
              );
            })}
          </div>
          <TableStyle>
            <Table
              {...{
                promises: {
                  truckRequestPromises: {
                    truckRequests,
                    truckRequestsFetchError,
                    truckRequestsFetchIsLoading,
                  },
                },
                tableParams: {
                  tableFor: 'truckRequest',
                  headers: tableHeaders,
                  onClone,
                  // onEdit,
                },
                statusParams,
                pageParams: {
                  page,
                  customerId2,
                },
                paginationData,
                setTruckRequestsQueryParams,
                t,
              }}
            />
          </TableStyle>
        </section>
      </PageContent>
    </TruckRequestsStyle>
  );
}

export default TruckRequests;
