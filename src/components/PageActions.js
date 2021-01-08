import React from 'react';
import { useTranslation } from 'react-i18next';
import { CSVLink } from 'react-csv/lib';
import AddSVGIcon from '../assets/icons/add.svg';
import ResetSVGIcon from '../assets/icons/button-refresh-arrows.svg';
import DownloadSVGIcon from '../assets/icons/download-bottom.svg';
import FilterSVGIcon from '../assets/icons/filter.svg';
import GraphStatsSVGIcon from '../assets/icons/graph-stats.svg';
import SearchSVGIcon from '../assets/icons/search.svg';
import UploadSVGIcon from '../assets/icons/upload-top.svg';
import PageActionStyle from '../styles/PageActionsStyle';
import { chopOffLastLetter } from '../_utils/fx';
import Filter from './General/Filter';
import TripsFilter from './Trips/TripsFilter';

function PageActions({
  modal,
  setModal,
  actions = {},
  isOutlier = false,
  ownerComponent,
  push = undefined,
  customerId = undefined,
  page = undefined,
  genCsvData,
  businessName,
  onSearch,
  searchTerm,
  createOrder = null,
  createTruckRequest,
  showSearch,
  show,
  showFilter,
  showFilterInput,
  getFilteredData,
  filterItems = 'all',
  filterStates,
  setFilterType,
  resetFilters = undefined,
  ordersQueryParams,
  setOrderQueryParams,
  tripsQueryParams,
  setTripsQueryParams,
  showFiltersDropdown,
  role,
}) {
  function isActionsEmpty() {
    return Object.keys(actions).length === 0;
  }
  const { t } = useTranslation();
  return (
    <PageActionStyle>
      <div className={`pageActions ${(isActionsEmpty() && 'noActions') || ''}`.trim()}>
        {!isActionsEmpty() && (
          <div
            className={`leftActions ${(isOutlier && 'outlier') || ''}`.trim()}
            data-grid-col={Object.keys(actions).length}
          >
            {/* Filter button */}
            {actions.filter && (
              <button onClick={showFilter}>
                <span className='actionIcon filter'>
                  <img src={FilterSVGIcon} alt='filter' />
                </span>
                {t('actions.filter')}
              </button>
            )}
            {/* Reset button */}
            {actions.reset && (
              <button onClick={() => resetFilters()}>
                <span className='actionIcon filter'>
                  <img src={ResetSVGIcon} alt='reset' />
                </span>
                {t('actions.reset')}
              </button>
            )}
            {/* Download button */}
            {actions.download && (
              <CSVLink filename={`${businessName}Trips.csv`} data={genCsvData()}>
                <button style={{ marginTop: '.3em', fontSize: '1.5em', color: 'gray' }}>
                  <span className='actionIcon filter'>
                    <img src={DownloadSVGIcon} alt='download' />
                  </span>
                  {t('actions.download')}
                </button>
              </CSVLink>
            )}
            {/* Upload route button */}
            {actions.uploadRoute && (
              <button onClick={() => setModal({ showModal: true, modalType: 'uploadRoute', modalItemId: undefined })}>
                <span className='actionIcon filter'>
                  <img src={UploadSVGIcon} alt='upload' />
                </span>
                {t('actions.uploadRoute')}
              </button>
            )}
            {/* CSV Upload status button */}
            {actions.csvUploadStatus && (
              <button onClick={() => push(`/${customerId}/${page}/csv_upload_status`)}>
                <span className='actionIcon filter'>
                  <img src={GraphStatsSVGIcon} alt='upload' />
                </span>
                {t('actions.csvStatus')}
              </button>
            )}
            {/* Download CSV button */}
            {actions.downloadcsv && (
              <CSVLink filename={`${businessName}RouteList.csv`} data={genCsvData()}>
                <button style={{ marginTop: '.3em', fontSize: '.9em', color: 'gray' }}>
                  <span className='actionIcon filter'>
                    <img src={DownloadSVGIcon} alt='download' />
                  </span>
                  {t('actions.downloadCSV')}
                </button>
              </CSVLink>
            )}
          </div>
        )}
        {/* Create and Search input */}
        <div className='rightActions' data-display='flex'>
          {/* Create button */}
          {(ownerComponent === 'orders' && ownerComponent && (
            <button type='button' className='createAction' data-align='center-both' onClick={() => createOrder()}>
              <span className='actionIcon add' data-align='center-both'>
                <img src={AddSVGIcon} alt='upload' />
              </span>
              {t(`buttons.create${chopOffLastLetter(ownerComponent)}`)}
            </button>
          )) ||
            (ownerComponent === 'truckRequests' && ownerComponent && role && role.toLowerCase() === 'customer' && (
              <button
                type='button'
                className='createAction'
                data-align='center-both'
                onClick={() => createTruckRequest()}
              >
                <span className='actionIcon add' data-align='center-both'>
                  <img src={AddSVGIcon} alt='upload' />
                </span>
                {t(`buttons.create${chopOffLastLetter(ownerComponent)}`)}
              </button>
            )) ||
            (ownerComponent !== 'trips' && ownerComponent !== 'truckRequests' && ownerComponent !== 'incomingTrucks' && (
              <button
                type='button'
                className='createAction'
                data-align='center-both'
                onClick={() => setModal({ ...modal, showModal: true, modalType: 'create' })}
              >
                <span className='actionIcon add' data-align='center-both'>
                  <img src={AddSVGIcon} alt='upload' />
                </span>
                {t(
                  `buttons.${
                    ((ownerComponent === 'recipients' || ownerComponent === 'transporters') && 'add') || 'create'
                  }${chopOffLastLetter(ownerComponent)}`,
                )}
              </button>
            ))}

          {showSearch && (
            <div className='searchBlock'>
              <img src={SearchSVGIcon} alt='search icon' />
              <form id='searchTripsForm'>
                <label htmlFor='searchTripsField'></label>
                <input
                  type='search'
                  name='searchTerm'
                  value={searchTerm}
                  id='searchTripsField'
                  placeholder={t('common.search')}
                  onChange={onSearch}
                />
              </form>
            </div>
          )}
        </div>
      </div>
      {show && ownerComponent === 'orders' && (
        <Filter
          {...{
            filterItems,
            getFilteredData,
            showFilterInput,
            setFilterType,
            ordersQueryParams,
            setOrderQueryParams,
            showFiltersDropdown,
          }}
        />
      )}
      {show && ownerComponent === 'trips' && (
        <TripsFilter
          {...{
            filterStates,
            filterItems,
            getFilteredData,
            showFilterInput,
            tripsQueryParams,
            setTripsQueryParams,
            showFiltersDropdown,
          }}
        />
      )}
    </PageActionStyle>
  );
}

export default PageActions;
