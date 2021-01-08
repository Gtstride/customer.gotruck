import React from 'react';
import { formatPrice, uuid } from '../../_utils/fx';
import { routesColumns } from '../Tables/TableColumns';

function RoutesTable({ routes, setModal }) {
  return routes.map(
    ({
      routeCode,
      pickupStation,
      deliveryStation,
      source,
      destination,
      currency,
      price,
      assetClass: { size, unit, type },
      _id,
    }) => {
      const routesCodeValue = { routeCode };
      const routeValue = {
        pickupStation: pickupStation.address,
        deliveryStation: deliveryStation.address,
        source,
        destination,
      };
      const priceValue = { price: `${currency} ${formatPrice(price)}` };
      const truckValue = { truckType: `${size} ${unit} ${type}` };

      return (
        <tr key={uuid()} className='noClick'>
          <routesColumns.RouteCodeColumn {...routesCodeValue} />
          <routesColumns.RouteColumn {...routeValue} />
          <routesColumns.PriceColumn {...priceValue} />
          <routesColumns.TruckColumn {...truckValue} />
          <routesColumns.ActionsColumn {...{ routeId: _id, setModal }} />
        </tr>
      );
    },
  );
}

export default RoutesTable;
