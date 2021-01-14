import React, { useEffect, useState } from 'react';
import { useFetch } from '../../APIs/Read';
import TableStyle from '../../styles/TableStyle';
import { tableType } from '../../_utils/constants';
import { isArrayEmpty } from '../../_utils/fx';
import EmptyTable from '../EmptyData/EmptyTable';
import ContentLoader from '../Loaders/ContentLoader';
import Error from '../Shared/Error';
import TableContent from './TableContent';
import TableHeader from './TableHeader';

function NewTable({
  headers,
  tableFor,
  page = undefined,
  setModal = null,
  endpoint,
  setTableItemsTotal,
  setTableItems,
  token,
  setTotalPage,
  pageQueryParams: { currentPageIndex, filters },
  setQueryParams,
  customerId,
  updatedTableData,
  t,
}) {
  // #region States
  const [tableData, setTableData] = useState([]);
  const [paginationData, setPaginationData] = useState({
    totalPages: undefined,
  });
  // #endregion

  // #region Custom Hooks
  const { response, error, isLoading } = useFetch(endpoint, token);
  // #endregion

  // #region Effects
  useEffect(() => {
    if (response) {
      if (tableFor === tableType.routes) {
        if (isArrayEmpty(updatedTableData)) {
          const { routes, ...paginationData } = response;
          setTableData(routes);
          setPaginationData({ ...paginationData });
          setTableItems(routes);
          setTotalPage(response.totalPages);
        } else {
          const { routes, ...paginationData } = response;
          setTableData(updatedTableData);
          setPaginationData({ ...paginationData });
          setTableItems(updatedTableData);
          setTotalPage(response.totalPages);
        }
      } else if (tableFor === tableType.orders) {
        setTableData(response.requests);
        const { requests, ...paginationData } = response;
        setPaginationData({ ...paginationData });
      } else if (tableFor === tableType.invoices) {
        setTableData(response.invoices);
      } else if (tableFor === tableType.trips) {
        setTableData(response.trips);
        setTableItems(response.trips);
        setTotalPage(response.totalPages);
        const { requests, ...paginationData } = response;
        setPaginationData({ ...paginationData });
      }
      setTableItemsTotal(response.total);
    }
  }, [
    error,
    isLoading,
    response,
    setTableItems,
    setTableItemsTotal,
    setTotalPage,
    tableFor,
    tableData,
    updatedTableData,
  ]);
  // #endregion

  // #region Functions

  function paginateToNextPage() {
    if (page === 'orders') {
      setQueryParams({
        currentPageIndex: currentPageIndex + 1,
        filters: {
          status: filters.status,
        },
      });
    } else if (page === 'trips') {
      setQueryParams({
        filters,
        currentPageIndex: currentPageIndex + 1,
      });
    } else if (page === 'routes') {
      setQueryParams({
        currentPageIndex: currentPageIndex + 1,
      });
    }
  }

  function paginateToPrevPage() {
    if (page === 'orders') {
      setQueryParams({
        currentPageIndex: currentPageIndex - 1,
        filters: {
          status: filters.status,
        },
      });
    } else if (page === 'trips') {
      setQueryParams({
        filters,
        currentPageIndex: currentPageIndex - 1,
      });
    } else if (page === 'routes') {
      setQueryParams({
        currentPageIndex: currentPageIndex - 1,
      });
    }
  }
  // #endregion

  // #region Returns
  if (isLoading) {
    return <ContentLoader />;
  }

  if (isArrayEmpty(tableData)) {
    if (tableFor === tableType.routes) {
      return (
        <main>
          <EmptyTable errorTitle='' errorSubtitle={`${t('emptyData.noAvailableData')}`} />
        </main>
      );
    }
    return (
      <main>
        <EmptyTable errorTitle='' errorSubtitle={`${t('emptyData.noAvailableTrips')}`} />
      </main>
    );
  }

  if (error) {
    return <Error {...{ error }} />;
  }

  return (
    <main>
      <TableStyle>
        <div className='table-wrap'>
          <table id='table' data-table-for={tableFor}>
            <TableHeader
              {...{
                headers,
              }}
            />
            <TableContent
              {...{
                tableData,
                tableFor,
                page,
                setModal,
                customerId,
              }}
            />
          </table>
          {tableData.length > 1 && paginationData.totalPages > 1 && (
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
              <div className='totalPages'>{paginationData.totalPages}</div>
              <div>
                {currentPageIndex < paginationData.totalPages && (
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
  // #endregion
}

export default NewTable;
