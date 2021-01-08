import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useFetch } from '../../APIs/Read';
import { useUserState } from '../../contexts/UserContext';
import StyledCustomerRoutes from '../../styles/StyledCustomerRoutes';
import TableStyle from '../../styles/TableStyle';
import { getDash, uuid } from '../../_utils/fx';
import EmptyTable from '../EmptyData/EmptyTable';
import ContentLoader from '../Loaders/ContentLoader';
import Error from '../Shared/Error';
import { CustomerRoutesColumns } from '../Tables/TableColumns';
import TableHeader from '../Tables/TableHeader';

function CustomerRoutes({
  params,
  page,
  truckRequestsQueryParams,
  setTruckRequestsQueryParams,
  statusParams,
  type,
  truckRequestId,
  truckPool,
  partnerId,
}) {
  const { t } = useTranslation();
  const { url } = useRouteMatch();
  const { push } = useHistory();
  const { customerId: customerId2, token } = useUserState();
  const [defaultEndpoint, setDefaultEndpoint] = useState(
    `/route?customerId=${customerId2}&partnerId=${params.carriage.id}&limit=10`,
  );
  const { response, error, isLoading } = useFetch(defaultEndpoint, token);
  const { response: res } = useFetch(`/partner/${params.carriage.id}`, token);
  const [routes, setRoutes] = useState([]);
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    limit: 30,
    total: undefined,
    totalPages: undefined,
  });

  useEffect(() => {
    if (response) {
      const { routes, ...paginationData } = response;
      const approvedRoutes = routes.filter(route => route.status === 'Approved');
      setRoutes(approvedRoutes);
      setPaginationData(paginationData);
    }
  }, [response]);

  useEffect(() => {
    setDefaultEndpoint(
      `/route?customerId=${customerId2}&partnerId=${params.carriage.id}&limit=10&page=${truckRequestsQueryParams.currentPageIndex}`,
    );
  }, [customerId2, params.carriage.id, partnerId, push, statusParams, truckRequestsQueryParams.currentPageIndex, url]);

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

  if (isLoading) {
    return <ContentLoader />;
  }

  if (error) {
    return <Error {...{ error }} />;
  }

  if (routes.length < 1) {
    return <EmptyTable {...{ errorTitle: 'Empty routes', errorSubtitle: 'No routes available' }} />;
  }

  return (
    <StyledCustomerRoutes>
      <header>
        <h1 className='title'>select customer route</h1>
      </header>
      <TableStyle>
        <div className='tableWrap'>
          <table>
            <TableHeader {...{ headers: ['routeId', 'pickupAddress', 'destination', 'price', 'assetClass'] }} />
            <tbody>
              {routes.map(route => (
                <tr
                  key={uuid()}
                  onClick={() =>
                    push(`${url}`, {
                      step: 'cargo_detail',
                      type,
                      truckRequestId,
                      truckPool,
                      params: {
                        ...params,
                        deliveryStation: {
                          _id: route.deliveryStation._id,
                          address: route.deliveryStation.address,
                          country: route.destinationCountry,
                          state: route.destination,
                          lat: route.deliveryStation.location.coordinates[0],
                          long: route.deliveryStation.location.coordinates[1],
                        },
                        pickupStation: {
                          _id: route.pickupStation._id,
                          address: route.pickupStation.address,
                          country: route.sourceCountry,
                          state: route.source,
                          lat: route.pickupStation.location.coordinates[0],
                          long: route.pickupStation.location.coordinates[1],
                        },
                        route: route._id,
                        currency: route.currency,
                        price: route.price,
                        partnerPayout: route.payout,
                        carriageOwnerName: params.carriage.name,
                        carriageOwnerPhone: params.carriage.phone,
                        carriageOwnerId: params.carriage.id,
                        kopayFinance: (res && res.partner && res.partner.kopay_finance === 1 && true) || false,
                      },
                    })
                  }
                >
                  <CustomerRoutesColumns.RouteID {...{ id: route.routeCode }} />
                  <CustomerRoutesColumns.Pickup {...{ pickupAddress: route.source }} />
                  <CustomerRoutesColumns.Destination {...{ destinationAddress: route.destination }} />
                  <CustomerRoutesColumns.Price {...{ price: route.price }} />
                  <CustomerRoutesColumns.Asset
                    {...{
                      asset:
                        (route.assetClass &&
                          `${route.assetClass.size} ${route.assetClass.unit} ${route.assetClass.name}`) ||
                        `${getDash()}`,
                    }}
                  />
                </tr>
              ))}
            </tbody>
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
      </TableStyle>
    </StyledCustomerRoutes>
  );
}

export default CustomerRoutes;
