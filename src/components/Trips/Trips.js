import { format } from 'date-fns';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams, useRouteMatch } from 'react-router-dom';
import { useFetch } from '../../APIs/Read';
import { useGlobalNavDispatch } from '../../contexts/GlobalNavContext';
import { useUserState } from '../../contexts/UserContext';
import { tableType } from '../../_utils/constants';
import { setGlobalNavBarDetails } from '../../_utils/fx';
import { tripsHeaders } from '../../_utils/tableheaders';
import Card from '../General/Card';
import ContentLoader from '../Loaders/ContentLoader';
import PageActions from '../PageActions';
import PageContent from '../PageContent';
import NewTable from '../Tables/NewTable';

function Trips({ page, businessName, tripsQueryParams: { currentPageIndex, filters }, setTripsQueryParams }) {
  // #region React Router
  const { customerId } = useParams();
  const { url } = useRouteMatch();
  const { push } = useHistory();
  const location = useLocation();
  // #endregion

  //#region  Contexts
  const setGlobalNavDetails = useGlobalNavDispatch();
  const { customerId: customerId2, token, businessId, country } = useUserState();
  // #endregion
  const { t } = useTranslation();
  // #region States
  const [trips, setTrips] = useState([]);
  const [totalTrips, setTotalTrips] = useState([]);
  const [, setTotalPage] = useState();
  const [analytics, setAnalytics] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [limit] = useState(30);
  const [actions] = useState({ filter: true, reset: true, download: true });
  const { response, isLoading } = useFetch(`analytics/customer/${customerId2}`, token);
  const { response: statesResponse } = useFetch(`/route/getStateCode/${country}`, token);
  const [show, setShow] = useState(false);
  const [filterStates, setFilterStates] = useState([]);
  const [defaultEndpoint, setDefaultEndpoint] = useState('');
  const [pageLocation, setPageLocation] = useState(null);

  // #region Effects
  useEffect(() => {
    if (!pageLocation) {
      if (location.state && location.state['fromTransporter']) {
        setPageLocation(location);
      }
    }
  }, [location, pageLocation]);

  useEffect(() => {
    const isFilteredPage = filters.status || filters.source || filters.destination ? true : false;
    let newURL;
    const isCustomer = `?customerId=${customerId2}`;
    let isPartner = (pageLocation && pageLocation.search) || null;
    const locationSearch = isPartner || isCustomer;

    const filterState = {
      filteringDefault:
        filters.status === 'all' && filters.source === 'all' && filters.destination === 'all' ? true : false,
      filteringForStatusOnly:
        filters.status !== 'all' && filters.source === 'all' && filters.destination === 'all' ? true : false,
      filteringForSourceOnly:
        filters.source !== 'all' && filters.status === 'all' && filters.destination === 'all' ? true : false,
      filteringForDestinationOnly:
        filters.destination !== 'all' && filters.status === 'all' && filters.source === 'all' ? true : false,
      filteringForStatusandSourceOnly:
        filters.status !== 'all' && filters.source !== 'all' && filters.destination === 'all' ? true : false,
      filteringForStatusandDestinationOnly:
        filters.status !== 'all' && filters.destination !== 'all' && filters.source === 'all' ? true : false,
      filteringForSourceandDestinationOnly:
        filters.source !== 'all' && filters.destination !== 'all' && filters.status === 'all' ? true : false,
      filteringForAll:
        filters.source !== 'all' && filters.destination !== 'all' && filters.status !== 'all' ? true : false,
    };

    if (isFilteredPage) {
      if (filterState.filteringDefault) {
        if (currentPageIndex >= 1 && searchTerm === '') {
          if (currentPageIndex !== 1) {
            newURL = `${url}?page=${currentPageIndex}`;
          }
          setDefaultEndpoint(
            `/trip${locationSearch}${(businessId !== 0 && businessId !== undefined && `&businessId=${businessId}`) ||
              ''}&limit=30&page=${currentPageIndex}`,
          );
        } else {
          if (!searchTerm) {
            setDefaultEndpoint(
              `/trip${locationSearch}${(businessId !== 0 && businessId !== undefined && `&businessId=${businessId}`) ||
                ''}&limit=30`,
            );
          }
        }
      } else {
        newURL = `${url}?page=${currentPageIndex}${(filters.status !== 'all' && `&status=${filters.status}`) ||
          ''}${(filters.source !== 'all' && `&source=${filters.source}`) || ''}${(filters.destination !== 'all' &&
          `&destination=${filters.destination}`) ||
          ''}`;

        if (filterState.filteringForStatusOnly) {
          setDefaultEndpoint(
            `/trip${locationSearch}${(businessId !== 0 && businessId !== undefined && `&businessId=${businessId}`) ||
              ''}&status=${filters.status}&limit=${30}&page=${currentPageIndex}`,
          );
        } else if (filterState.filteringForSourceOnly) {
          setDefaultEndpoint(
            `/trip${locationSearch}${(businessId !== 0 && businessId !== undefined && `&businessId=${businessId}`) ||
              ''}&sourceState=${filters.source}&limit=${30}&page=${currentPageIndex}`,
          );
        } else if (filterState.filteringForDestinationOnly) {
          setDefaultEndpoint(
            `/trip${locationSearch}${(businessId !== 0 && businessId !== undefined && `&businessId=${businessId}`) ||
              ''}&destinationState=${filters.destination}&limit=${30}&page=${currentPageIndex}`,
          );
        } else if (filterState.filteringForStatusandSourceOnly) {
          setDefaultEndpoint(
            `/trip${locationSearch}${(businessId !== 0 && businessId !== undefined && `&businessId=${businessId}`) ||
              ''}&status=${filters.status}&sourceState=${filters.source}&limit=${30}&page=${currentPageIndex}`,
          );
        } else if (filterState.filteringForStatusandDestinationOnly) {
          setDefaultEndpoint(
            `/trip${locationSearch}${(businessId !== 0 && businessId !== undefined && `&businessId=${businessId}`) ||
              ''}&status=${filters.status}&destinationState=${
              filters.destination
            }&limit=${30}&page=${currentPageIndex}`,
          );
        } else if (filterState.filteringForSourceandDestinationOnly) {
          setDefaultEndpoint(
            `/trip${locationSearch}${(businessId !== 0 && businessId !== undefined && `&businessId=${businessId}`) ||
              ''}&sourceState=${filters.source}&destinationState=${
              filters.destination
            }&limit=${30}&page=${currentPageIndex}`,
          );
        } else if (filterState.filteringForAll) {
          setDefaultEndpoint(
            `/trip${locationSearch}${(businessId !== 0 && businessId !== undefined && `&businessId=${businessId}`) ||
              ''}&status=${filters.status}&sourceState=${filters.source}&destinationState=${
              filters.destination
            }${(businessId !== 0 && businessId !== undefined && `&businessId=${businessId}`) ||
              ''}&limit=${30}&page=${currentPageIndex}`,
          );
        } else {
          // default
          push(url);
          setDefaultEndpoint(
            `/trip${locationSearch}${(businessId !== 0 && businessId !== undefined && `&businessId=${businessId}`) ||
              ''}&limit=30`,
          );
        }
      }
    }
    push(newURL);
    // }
  }, [
    pageLocation,
    businessId,
    currentPageIndex,
    customerId2,
    filters.destination,
    filters.source,
    filters.status,
    push,
    searchTerm,
    url,
  ]);

  useEffect(() => {
    if (statesResponse) {
      setFilterStates(statesResponse.states.map(({ state }) => state));
    }
  }, [statesResponse]);

  useEffect(() => {
    setGlobalNavBarDetails({ navTitle: <>{t('trips.trips')}</>, itemId: undefined }, setGlobalNavDetails);
  }, [setGlobalNavDetails, t]);

  useEffect(() => {
    if (!isLoading) {
      setAnalytics(response.overview);
    }
  }, [isLoading, response]);
  // #endregion

  useEffect(() => {
    if (searchTerm !== '') {
      setDefaultEndpoint(
        `trip/search?limit=${limit}&searchTerm=${searchTerm}&customerId=${customerId2}${(businessId !== 0 &&
          `&businessId=${businessId}`) ||
          ''}`,
      );
    }
  }, [businessId, customerId2, limit, searchTerm]);

  // #region Functions
  function onSearch(e) {
    setSearchTerm(e.target.value);
  }

  function genCsvData() {
    const csvData = [
      [
        'Trip ID',
        'Sales Order Number',
        'Business Unit',
        'Waybills',
        'Truck Reg Number',
        'Customer',
        'Recipient',
        'Stage',
        'Origin Depot',
        'Destination Depot',
        'Commodity',
        'Accepted (Time)',
        'Positioned (Time)',
        'In-premise (Time)',
        'Loaded (Time)',
        'Dey go (Time)',
        'Don reach (Time)',
        'Delivered (Time)',
        'Latest Time',
        'Last Known Location',
        'Arrival at Destination',
      ],
    ];
    if (trips.length > 0) {
      for (let i = 0; i < trips.length; i++) {
        let arr = [];
        let tripHistory = {};
        for (let j = 0; j < trips[i].statusHistory.length; j++) {
          tripHistory = {
            ...tripHistory,
            [trips[i].statusHistory[j].status]: trips[i].statusHistory[j].date,
          };
        }
        arr.push(trips[i].tripId || '-');
        arr.push(trips[i].salesOrder || '-');
        arr.push(trips[i].businessUnit || '-');
        arr.push(trips[i].waybillNumber || '-');
        arr.push(trips[i].regNumber || '-');
        arr.push(trips[i].customerName || '-');
        if (trips[i].dropOff && trips[i].dropOff.length > 0) {
          for (let j = 0; j < trips[i].dropOff.length; j++) {
            arr.push(`${trips[i].dropOff[j].recipient.name || ''} - ${trips[i].dropOff[j].recipient.mobile || ''}`);
          }
        } else {
          if (trips[i].recipient) {
            arr.push(`${trips[i].recipient.name || ''} - ${trips[i].recipient.mobile || ''}`);
          }
        }
        arr.push(`${trips[i].status || ''} - ${trips[i].transportStatus || ''}`);
        arr.push(trips[i].pickupStation.address || '-');
        arr.push(trips[i].deliveryStation.address || '-');
        arr.push(trips[i].goodCategory || '-');
        arr.push(trips[i].startDate ? format(new Date(trips[i].startDate), 'dd-MM-yyyy, hh:mm a') : '-');
        arr.push(tripHistory.Positioned ? format(new Date(tripHistory.Positioned), 'dd-MM-yyyy, hh:mm a') : '-');
        arr.push(tripHistory['In-premise'] ? format(new Date(tripHistory['In-premise']), 'dd-MM-yyyy, hh:mm a') : '-');
        arr.push(tripHistory['Loaded'] ? format(new Date(tripHistory['Loaded']), 'dd-MM-yyyy, hh:mm a') : '-');
        arr.push(
          tripHistory['Transporting'] &&
            typeof tripHistory === 'string' &&
            tripHistory['Transporting'].toLowerCase() !== 'null'
            ? format(new Date(tripHistory['Transporting']), 'dd-MM-yyyy, hh:mm a')
            : '-',
        );
        arr.push(
          tripHistory['At-destination'] ? format(new Date(tripHistory['At-destination']), 'dd-MM-yyyy, hh:mm a') : '-',
        );
        arr.push(
          tripHistory['Delivered'] && typeof tripHistory === 'string' && tripHistory['Delivered']
            ? format(new Date(tripHistory['Delivered']), 'dd-MM-yyyy, hh:mm a')
            : '-',
        );
        arr.push('');
        arr.push(
          trips[i].lastLocation ||
            trips[i].lastLocationDetail.address ||
            `[${trips[i].lastLocation.coordinates[0]}, ${trips[i].lastLocation.coordinates[1]}]` ||
            '',
        );
        arr.push(trips[i].deliveredDate ? format(new Date(trips[i].deliveredDate), 'dd-MM-yyyy, hh:mm a') : '');
        csvData.push(arr);
      }
    }
    return csvData;
  }

  function showFilter() {
    if (show) {
      setShow(!show);
    } else {
      setShow(!show);
    }
  }

  function resetFilters() {
    setTripsQueryParams({
      currentPageIndex: 1,
      filters: {
        status: 'all',
        source: 'all',
        destination: 'all',
      },
    });
  }

  // #endregion

  if (isLoading) {
    return <ContentLoader />;
  }

  // #region Renders

  return (
    <PageContent>
      <header className='pageHeader'>
        <Card
          {...{
            type: 'activeTrip',
            label: <>{t('trips.activeTrip')}</>,
            value: 'trips',
            customerId,
            token,
            filter: 'active',
            total: analytics ? analytics.trip.active.total : undefined,
          }}
        />
        <Card
          {...{
            type: 'flaggedTrip',
            label: <>{t('trips.flaggedTrip')}</>,
            value: 'trips',
            customerId,
            token,
            filter: 'flagged',
            total: analytics ? analytics.flagged : undefined,
          }}
        />
        <PageActions
          {...{
            show,
            showFilter,
            resetFilters,
            actions,
            onSearch,
            searchTerm,
            genCsvData,
            businessName,
            showSearch: true,
            ownerComponent: 'trips',
            filterStates,
            tripsQueryParams: { filters },
            setTripsQueryParams,
            showFiltersDropdown: setShow,
          }}
        />
      </header>
      <section className='pageContent'>
        <NewTable
          {...{
            headers: tripsHeaders,
            tableFor: tableType.trips,
            page,
            endpoint: defaultEndpoint,
            pageQueryParams: { currentPageIndex, filters },
            setTableItems: setTrips,
            setTableItemsTotal: setTotalTrips,
            setTotalPage,
            customerId,
            totalTrips,
            token,
            businessId,
            setQueryParams: setTripsQueryParams,
            t,
          }}
        />
      </section>
    </PageContent>
  );
  // #endregion
}

Trips.propTypes = {
  page: PropTypes.string.isRequired,
  businessName: PropTypes.string.isRequired,
};

export default Trips;
