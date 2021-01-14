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

function TableWithoutBizId({
  headers,
  updatedTableData,
  tableFor,
  setTableItem,
  setTableItemsTotal,
  endpoint,
  token,
  setModal = null,
  page = undefined,
  t,
}) {
  // #region States
  const [tableData, setTableData] = useState([]);
  const [tableDataEndpoint] = useState(endpoint);
  // #endregion

  // #region Custom Hooks
  const { response, error, isLoading } = useFetch(tableDataEndpoint, token);
  // #endregion

  // #region Effects
  useEffect(() => {
    if (response) {
      if (tableFor === tableType.invoices) {
        setTableData(response.invoices);
        setTableItemsTotal(response.total);
      } else if (tableFor === tableType.pickupLocations) {
        if (isArrayEmpty(updatedTableData)) {
          setTableData(response.locations);
          setTableItemsTotal(response.locations.length);
          setTableItem(response.locations);
        } else {
          setTableData(updatedTableData);
          setTableItemsTotal(updatedTableData.length);
        }
      } else if (tableFor === tableType.recipients) {
        if (isArrayEmpty(updatedTableData)) {
          setTableItemsTotal(response.recipients.length);
          setTableData(response.recipients);
          setTableItem(response.recipients);
        } else {
          setTableData(updatedTableData);
          setTableItemsTotal(updatedTableData.length);
        }
      } else if (tableFor === tableType.users) {
        if (isArrayEmpty(updatedTableData)) {
          setTableItemsTotal(response.users.length);
          setTableData(response.users);
          setTableItem(response.users);
        } else {
          setTableData(updatedTableData);
          setTableItemsTotal(updatedTableData.length);
        }
      }
    }
  }, [response, setTableItem, setTableItemsTotal, tableFor, updatedTableData, updatedTableData.length]);

  // #endregion

  if (isLoading) {
    return <ContentLoader />;
  }

  if (isArrayEmpty(tableData)) {
    return (
      <main>
        <EmptyTable errorTitle='' errorSubtitle={`${t('emptyData.noAvailableData')}`} />
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
              }}
            />
          </table>
          {/* {tableFor !== 'pickupLocations' && tableFor !== 'users' && tableFor !== 'recipients' && <TableFooter />} */}
        </div>
      </TableStyle>
    </main>
  );
}

export default TableWithoutBizId;
