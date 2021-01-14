import { format } from 'date-fns';
import React from 'react';
import styled from 'styled-components';
import TableStyle from '../../styles/TableStyle';
import { formatPrice, getDash, isArrayEmpty, uuid } from '../../_utils/fx';
import EmptyTable from '../EmptyData/EmptyTable';
import ContentLoader from '../Loaders/ContentLoader';
import Error from '../Shared/Error';

// import { object } from 'prop-types';

const StyledWaybillTrackerTable = styled.main`
  .waybillCount {
    background-color: #d7f0e5;
    color: #45b887;
  }

  .idColumn .tableItem,
  .routeColumn .tableItem {
    flex-direction: column;
    align-items: flex-start;
  }

  .serialNoColumn .tableItem {
    width: 100%;
    display: flex;
  }

  [data-show-arrow='show-pointer'] {
    position: relative;
  }

  [data-show-arrow='show-pointer']::after {
    content: '';
    position: absolute;
    background: #f1f1f1;
    transform: rotate(45deg);
    border: 2px solid #b4b4b4;
    width: 30px;
    height: 30px;
    left: 0%;
    margin-left: 16px;
    transform: rotate(45deg);
    border-bottom: none;
    border-right: none;
    bottom: -15px;
    border-top-left-radius: 6px;
  }

  /* .dro */
  .dropdownTh,
  .dropdownTr {
    background-color: #f1f1f1;

    th {
      padding: 24px 16px;
      text-align: left;
    }

    .tableTitle {
      color: #546dad;
      text-transform: unset;
    }
  }

  .dropdownTh {
    border-top: 2px solid #b4b4b4;
  }

  .dropdown-field__officer .tableItem {
    display: flex;
    flex-direction: column;
    align-items: start;
  }

  .dropdown-checkbox {
    input {
      width: 15px;
      height: 15px;
    }
  }

  tbody tr:not(.dropdownT):hover {
    background-color: initial;
  }
`;

function WaybillTrackerTable({
  isLoading,
  t,
  waybills,
  tripsWithWaybills,
  fetchError,
  pageQueryParams: { currentPageIndex, paginationData },
  setWaybillTrackerQueryParams,
  checkedWaybills,
  setCheckedWaybills,
  defaultStatus,
}) {
  const [allTripIds, setAllTripIds] = React.useState([]);

  React.useEffect(() => {
    const allTripIds = tripsWithWaybills.map(tripWithWaybill => tripWithWaybill.tripId);
    setAllTripIds(allTripIds);
  }, [tripsWithWaybills]);

  function paginateToPrevPage() {
    setWaybillTrackerQueryParams({
      currentPageIndex: currentPageIndex - 1,
    });
  }

  function paginateToNextPage() {
    setWaybillTrackerQueryParams({
      currentPageIndex: currentPageIndex + 1,
    });
  }

  function getValidWaybillLength(waybill) {
    const x = tripsWithWaybills.find(tripsWithWaybill => {
      return tripsWithWaybill.tripId === waybill.tripId;
    });
    if (x) {
      return x.validWaybills.length;
    }
  }

  function getValidWaybill(id) {
    const { validWaybills, tripId, _tripId } = tripsWithWaybills.find(({ tripId }) => tripId === id);

    const res = validWaybills.map(validWaybill => {
      return [
        validWaybill.waybillStatusHistory.find(history => {
          return history.status === validWaybill.waybillStatus;
        }),
        validWaybill,
        tripId,
        _tripId,
      ];
    });

    return res;
  }

  function populateWaybill(e, waybillToShow) {
    const [waybHist, validWaybill, tripId, _tripId] = waybillToShow;

    const waybillConcat2 = { waybHist, validWaybill, tripId, _tripId };
    if (e.target.checked) {
      setCheckedWaybills([...checkedWaybills, waybillConcat2]);
    } else {
      setCheckedWaybills(checkedWaybills.filter(w => w.validWaybill._id !== validWaybill._id));
    }
  }

  function toggleDropdown(tripId) {
    const tripIdIndex = allTripIds.findIndex(id => id === tripId);
    // We found a trip id
    if (tripIdIndex > -1) {
      const removed = allTripIds.filter(id => id !== tripId);
      setAllTripIds(removed);
    } else {
      setAllTripIds(allTripIds => [...allTripIds, tripId]);
    }
  }

  function checkAll(e) {
    // 1. take all the way bills
    const waybillsToShow = waybills
      .map(waybill => {
        const waybillToShow = getValidWaybillLength(waybill) && getValidWaybill(waybill.tripId);
        if (waybillToShow) {
          const [waybHist, validWaybill, tripId, _tripId] = waybillToShow[0];
          return { waybHist, validWaybill, tripId, _tripId };
        }
        return waybillToShow;
      })
      .filter(w => !!w);

    if (e.target.checked) {
      if (checkedWaybills.length === 0) {
        setCheckedWaybills(waybillsToShow);
      } else {
        const allWaybills = [...checkedWaybills, ...waybillsToShow];

        const uniqueWaybills = Array.from(new Set(allWaybills.map(a => a.tripId))).map(tripId => {
          return allWaybills.find(a => a.tripId === tripId);
        });
        setCheckedWaybills(uniqueWaybills);
      }
    } else {
      setCheckedWaybills([]);
    }
  }

  if (isLoading) {
    return <ContentLoader />;
  }

  if (fetchError) {
    return <Error {...{ error: fetchError }} />;
  }

  if (isArrayEmpty(waybills)) {
    return (
      <main>
        <EmptyTable errorTitle='' errorSubtitle={`${t('emptyData.noAvailableData')}`} />
      </main>
    );
  }

  return (
    <StyledWaybillTrackerTable>
      <TableStyle>
        <div className="table-wrap">
        <table id='table' data-table-for='trips'>
          <thead id='tableHeader'>
            <tr>
              <th style={{ width: '4%' }}>
                {defaultStatus !== 'Received at Customer Office' && (
                  <div className='tableItem' style={{ padding: 0, justifyContent: 'unset', alignItems: 'unset' }}>
                    <label htmlFor='check'>
                      <input
                        type='checkbox'
                        name='check'
                        id='check'
                        style={{ width: 15, height: 15 }}
                        onChange={e => checkAll(e)}
                      />
                    </label>
                  </div>
                )}
              </th>
              <th data-table-heading='id' style={{ width: 'initial' }}>
                <span className='tableTitle'>
                  <>{t('tableHeaders.tripId')}</>
                </span>
              </th>
              <th data-table-heading='serial-no' style={{ width: 'initial' }}>
                <span className='tableTitle'>
                  <>{t('tableHeaders.waybill')}</>
                </span>
              </th>
              <th data-table-heading='route' style={{ width: 'initial' }} colSpan={2}>
                <span className='tableTitle'>
                  <>{t('tableHeaders.route')}</>
                </span>
              </th>
              <th data-table-heading='price' style={{ width: 'initial' }}>
                <span className='tableTitle'>
                  <>{t('tableHeaders.price')}</>(N)
                </span>
              </th>
              <th data-table-heading='driver' style={{ width: 'initial' }}>
                <span className='tableTitle'>
                  <>{t('tableHeaders.driver')}</>
                </span>
              </th>
              <th data-table-heading='truck' style={{ width: 'initial' }}>
                <span className='tableTitle'>
                  <>{t('tableHeaders.truck')}</>
                </span>
              </th>
              <th data-table-heading='status' style={{ width: 'initial' }}>
                <span className='tableTitle'>
                  <>{t('tableHeaders.status')}</>
                </span>
              </th>
            </tr>
          </thead>
          <tbody id='tableContent'>
            {waybills.map((waybill, waybillsIndex) => {
              const waybillToShow = getValidWaybillLength(waybill) && getValidWaybill(waybill.tripId);
              const outerWaybill = waybill;
              const alignRight = (localStorage.getItem('i18nextLng') === 'ar' && true) || false;
              return (
                <React.Fragment key={uuid()}>
                  <tr className='noClick'>
                    <td></td>
                    <td className='idColumn'>
                      <div className='tableItem'>
                        <p className='mg-btm-4 ln-22'>{waybill.tripId}</p>
                        <p className='secColor ln-16'>
                          {waybill.date ? format(new Date(waybill.date), 'd MMMM, yyyy') : '-'}
                        </p>
                      </div>
                    </td>
                    <td
                      className='serialNoColumn'
                      data-show-arrow={
                        (getValidWaybillLength(waybill) &&
                          allTripIds.find(id => id === waybill.tripId) &&
                          'show-pointer') ||
                        ''
                      }
                    >
                      <button
                        className='tableItem'
                        data-id={waybill._id}
                        onClick={() => toggleDropdown(waybill.tripId)}
                      >
                        <p className='waybillCount ln-22'>{getValidWaybillLength(waybill) || 0}</p>
                      </button>
                    </td>
                    <td className='routeColumn' colSpan={2}>
                      <div className='tableItem'>
                        <p className='mg-btm-4 ln-22'>
                          {waybill.pickupStation.address} <mark>to</mark> {waybill.deliveryStation.address}
                        </p>
                        <p className='mg-btm-10 ln-16'>
                          {waybill.source} {getDash()} {waybill.destination}
                        </p>
                      </div>
                    </td>
                    <td className='priceColumn'>
                      <div className='tableItem'>
                        <p className='ln-22'>{`${waybill.currency} ${formatPrice(waybill.amount)}`}</p>
                      </div>
                    </td>
                    <td className='driverColumn'>
                      <div className='tableItem flex'>
                        <div className='tableItemLeft'>
                          <p className='mg-btm-4 ln-22'>{waybill.driver.name}</p>
                          <p className='secColor  ln-16'>{waybill.driver.mobile}</p>
                        </div>
                      </div>
                    </td>
                    <td className='truckColumn'>
                      <div className='tableItem flex'>
                        <div className='tableItemLeft'>
                          <p className='mg-btm-4 ln-22'>{waybill.regNumber}</p>
                          <p className='secColor  ln-16'>{`${waybill.asset.size} ${waybill.asset.unit} ${waybill.asset.type}`}</p>
                        </div>
                      </div>
                    </td>
                    <td className='statusColumn'>
                      <div className='tableItem flex'>
                        <div className='tableItemLeft statusHalo  bg-clr-yellow'>
                          <p></p>
                        </div>
                        <div className='tableItemRight tableItemLastCol ln-16'>
                          <p>{waybill.status}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                  {/* the dropdowns */}
                  {getValidWaybillLength(waybill) && (
                    <>
                      <tr
                        className='dropdownTh dropdownT'
                        style={{ display: `${allTripIds.find(id => id === waybill.tripId) ? 'table-row' : 'none'}` }}
                      >
                        <th></th>
                        <th
                          style={{ textAlign: `${(alignRight && 'right') || 'left'}` }}
                          data-table-heading='dropdown-waybill__no'
                        >
                          <span className='tableTitle'>
                            <>{t('waybillTracker.waybillNo')}</>
                          </span>
                        </th>
                        <th
                          style={{ textAlign: `${(alignRight && 'right') || 'left'}` }}
                          data-table-heading='dropdown-dispatch__date'
                        >
                          <span className='tableTitle'>
                            <>{t('waybillTracker.dispDate')}</>
                          </span>
                        </th>
                        <th
                          style={{ textAlign: `${(alignRight && 'right') || 'left'}` }}
                          data-table-heading='dropdown-tracking__no'
                        >
                          <span className='tableTitle'>
                            <>{t('waybillTracker.trackNo')}</>
                          </span>
                        </th>
                        <th
                          style={{ textAlign: `${(alignRight && 'right') || 'left'}` }}
                          data-table-heading='dropdown-recipient'
                        >
                          <span className='tableTitle'>
                            <>{t('waybillTracker.dropOffRec')}</>
                          </span>
                        </th>
                        <th
                          style={{ textAlign: `${(alignRight && 'right') || 'left'}` }}
                          data-table-heading='dropdown-salesOrder__no'
                        >
                          <span className='tableTitle'>
                            <>{t('waybillTracker.salesOrderNo')}</>
                          </span>
                        </th>
                        <th
                          style={{ textAlign: `${(alignRight && 'right') || 'left'}` }}
                          data-table-heading='dropdown-dummy'
                        >
                          <span className='tableTitle'>
                            <>{t('waybillTracker.fieldOfficer')}</>
                          </span>
                        </th>
                        <th
                          style={{ textAlign: `${(alignRight && 'right') || 'left'}` }}
                          data-table-heading='status'
                          colSpan={2}
                        >
                          <span className='tableTitle'>
                            <>{t('waybillTracker.waybillStat')}</>
                          </span>
                        </th>
                      </tr>
                      {waybillToShow.map((waybill, index) => {
                        return (
                          <tr
                            className='dropdownTr dropdownT'
                            key={uuid()}
                            style={{
                              display: `${allTripIds.find(id => id === outerWaybill.tripId) ? 'table-row' : 'none'}`,
                            }}
                          >
                            {(defaultStatus === 'Received at Customer Office' && <td></td>) || (
                              <td className='dropdown-checkbox'>
                                <div
                                  className='tableItem'
                                  style={{ padding: 0, justifyContent: 'unset', alignItems: 'unset' }}
                                >
                                  <label
                                    htmlFor={`check-${waybillsIndex}-${index}`}
                                    style={{
                                      padding: 5,
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      display: 'flex',
                                      flex: 1,
                                    }}
                                  >
                                    <input
                                      type='checkbox'
                                      name='check'
                                      id={`check-${waybillsIndex}-${index}`}
                                      onChange={e => populateWaybill(e, waybill)}
                                      checked={checkedWaybills.find(w => w.validWaybill._id === waybill[1]._id)}
                                    />
                                  </label>
                                </div>
                              </td>
                            )}
                            <td className='dropdown-waybill__no'>
                              <div className='tableItem'>
                                <p className='mg-btm-4 ln-22'>{waybill[1].waybillNumber}</p>
                              </div>
                            </td>
                            <td className='dropdown-dispatch__date'>
                              <div className='tableItem'>
                                <p className='mg-btm-4 ln-22'>{format(new Date(waybill[0].date), 'd MMMM, yyyy')}</p>
                              </div>
                            </td>
                            <td className='dropdown-tracking__no'>
                              <div className='tableItem'>
                                <p className='mg-btm-4 ln-22'>{waybill[0].trackingCode}</p>
                              </div>
                            </td>
                            <td className='dropdown-recipient'>
                              <div className='tableItem'>
                                <p className='mg-btm-4 ln-22'>{waybill[1].recipient.name}</p>
                              </div>
                            </td>
                            <td className='dropdown-salesOrder__no'>
                              <div className='tableItem'>
                                <p className='mg-btm-4 ln-22'>{waybill[1].salesOrderNo || getDash()}</p>
                              </div>
                            </td>
                            <td className='dropdown-field__officer'>
                              <div className='tableItem'>
                                <p style={{ marginBottom: '10px' }}>{waybill[0].fieldOfficerName || getDash()}</p>
                                <p>{waybill[0].fieldOfficerMobile || getDash()}</p>
                              </div>
                            </td>
                            <td className='dropdown-waybil__status' colSpan={2}>
                              <div className='tableItem'>
                                <p className='mg-btm-4 ln-22' style={{ color: '#36b37e' }}>
                                  {waybill[0].status}
                                </p>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
        {waybills.length > 1 && paginationData.totalPages > 1 && (
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
    </StyledWaybillTrackerTable>
  );
}

export default WaybillTrackerTable;
