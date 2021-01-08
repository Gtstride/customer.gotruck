import React from 'react';
import { uuid } from '../../_utils/fx';
import { TransportersColumns } from '../Tables/TableColumns';

function TransportersTable({ transporters, page, customerId, partnerId, setModal, onRateChange, user }) {
  return transporters.map(trans => {
    const { business_name, id, country, location, average_rating } = trans;
    const url = `/${customerId}/${page}/${id}`;
    const transporterValue = { business_name, id, url };
    const countryValue = { country, url };
    const locationValue = { location, url };
    const actionValue = { transporterId: id, setModal, partnerId };
    const ratingValue = { value: Math.round(average_rating) || 0 };
    // const driversValue = { driversCount: location, url };

    return (
      <tr key={uuid()} className='noClick'>
        <TransportersColumns.TransporterColumn {...transporterValue} />
        <TransportersColumns.CountryColumn {...countryValue} />
        <TransportersColumns.LocationColumn {...locationValue} />
        <TransportersColumns.RatingsColumn {...ratingValue} onRateChange={onRateChange} />
        <TransportersColumns.ActionsColumn {...actionValue} user={user} />
      </tr>
    );
  });
}

export default TransportersTable;
