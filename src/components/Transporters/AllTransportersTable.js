import React from 'react';
import { uuid } from '../../_utils/fx';
import { AllTransportersTable } from '../Tables/TableColumns';

function TransportersTable({ transporters, addTransporterAsync }) {
  return transporters.map(({ business_name, id, country, location, average_rating }) => {
    const transporterValue = { business_name, id };
    const countryValue = { country };
    const locationValue = { location };
    const actionValue = { transporterId: id, addTransporterAsync };
    const ratingValue = { value: Math.round(average_rating) || 0 };
    // const trucksValue = { trucksCount: no_trucks, url };
    // const driversValue = { driversCount: location, url };

    return (
      <tr key={uuid()} className='noClick'>
        <AllTransportersTable.TransporterColumn {...transporterValue} />
        <AllTransportersTable.CountryColumn {...countryValue} />
        <AllTransportersTable.LocationColumn {...locationValue} />
        <AllTransportersTable.RatingsColumn {...ratingValue} />
        <AllTransportersTable.ActionsColumn {...actionValue} />
      </tr>
    );
  });
}

export default TransportersTable;
