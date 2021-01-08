import { format } from 'date-fns';
import React from 'react';
import { formatPrice, uuid } from '../../_utils/fx';
import { tripsColumns } from '../Tables/TableColumns';

function TripsTable({ trips, page, customerId }) {
  return trips.map(
    ({
      tripId,
      _id,
      status,
      date,
      amount,
      currency,
      pickupStation,
      deliveryStation,
      source,
      destination,
      driver,
      recipient,
      asset: { size, unit, type },
      regNumber,
      // waybills,
      dropOff,
      // salesOrder,
      communicationInfo,
    }) => {
      const url = `/${customerId}/${page}/${_id}`;
      const tripIdOrDateValue = { tripId, tripDate: date ? format(new Date(date), 'd MMMM, yyyy') : '-', url };
      // const waybillValue = { waybillCount: (waybills && waybills.length) || 0, url, salesOrder };
      const routeValue = {
        pickupStation: pickupStation.address,
        deliveryStation: deliveryStation.address,
        source,
        destination,
        isRouteCoLoaded: (dropOff && dropOff.length > 1) || false,
        url,
        flagComment: communicationInfo ? (communicationInfo.length > 0 ? communicationInfo[0].comment : '') : '',
        flagReason: communicationInfo ? (communicationInfo.length > 0 ? communicationInfo[0].status : '') : '',
        person: communicationInfo ? (communicationInfo.length > 0 ? communicationInfo[0].person : '') : '',
        date: communicationInfo ? (communicationInfo.length > 0 ? communicationInfo[0].date : '') : '',
      };
      const amountValue = { amount: `${currency} ${formatPrice(amount)}`, url };
      const driverValue = { driverName: driver.name, driverMobileNo: driver.mobile, url };
      const truckValue = { truckId: regNumber, truckType: `${size} ${unit} ${type}`, url };
      let recipientValue;
      if (dropOff && dropOff.length > 0) {
        recipientValue = {
          recipientName: dropOff[0].recipient.name,
          recipientMobileNo: dropOff[0].recipient.mobile,
          url,
        };
      } else {
        recipientValue = {
          recipientName: recipient ? recipient.name : 'N/A',
          recipientMobileNo: recipient ? recipient.mobile : 'N/A',
          url,
        };
      }
      const statusValue = { status, url };

      return (
        <tr key={uuid()}>
          <tripsColumns.TripIdorDateColumn {...tripIdOrDateValue} />
          {/* <tripsColumns.WaybillColumn {...waybillValue} /> */}
          <tripsColumns.RouteColumn {...routeValue} />
          <tripsColumns.AmountColumn {...amountValue} />
          <tripsColumns.DriverColumn {...driverValue} />
          <tripsColumns.TruckColumn {...truckValue} />
          <tripsColumns.RecipientColumn {...recipientValue} />
          <tripsColumns.StatusColumn {...statusValue} />
        </tr>
      );
    },
  );
}

export default TripsTable;
