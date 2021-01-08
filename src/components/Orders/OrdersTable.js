import { format } from 'date-fns';
import React from 'react';
import { formatPrice, uuid } from '../../_utils/fx';
import { ordersColumns } from '../Tables/TableColumns';

function OrdersTable({ orders, page, customerId }) {
  return orders.map(
    (
      {
        _id,
        requestId,
        date,
        pickupStation,
        deliveryStation,
        source,
        destination,
        amount,
        currency,
        asset,
        status,
        dropOff,
      },
      i,
    ) => {
      const url = `/${customerId}/${page}/${_id}`;
      const orderIdorDateColumn = {
        requestId,
        requestDate: format(new Date(date), 'd MMMM, yyyy'),
        url,
      };
      const routeValue = {
        pickupStation: pickupStation.address,
        deliveryStation: deliveryStation.address,
        source,
        destination,
        isRouteCoLoaded: dropOff && dropOff.length > 1, // If there is a dropOff and has a length > 1
        url,
      };
      const amountValue = { amount: `${currency} ${formatPrice(amount)}`, url };
      const truckValue = {
        truckType: `${asset ? (asset.size ? asset.size : '') : ''} ${asset ? (asset.unit ? asset.unit : '') : ''} ${
          asset ? (asset.type ? asset.type : '') : ''
        }`,
        url,
      };
      const statusValue = { status, url };
      const recipientValue = { recipientCount: (dropOff && dropOff.length) || 0, url }; // if there is a dropOff and it is emptyString, default to 1 or use the dropOff length

      return (
        <tr key={uuid()}>
          <ordersColumns.OrderIdorDateColumn {...orderIdorDateColumn} />
          <ordersColumns.RouteColumn {...routeValue} />
          <ordersColumns.AmountColumn {...amountValue} />
          <ordersColumns.TruckColumn {...truckValue} />
          <ordersColumns.StatusColumn {...statusValue} />
          <ordersColumns.RecipientColumn {...recipientValue} />
        </tr>
      );
    },
  );
}

export default OrdersTable;
