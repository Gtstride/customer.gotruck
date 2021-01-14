import React from 'react';
import { uuid } from '../../_utils/fx';
import { AllTransportersTable } from '../Tables/TableColumns';

function AddCustomersTable({ customers, addCustomerAsync }) {
  return customers.map(({ business_name, id, country, location,overall_rating }) => {
    const transporterValue = { business_name, id };
    const countryValue = { country };
    const locationValue = { location };
    const actionValue = { customerId: id, addCustomerAsync };
    const ratingValue = { value: Math.round(overall_rating) || 0 };
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

export default AddCustomersTable;
