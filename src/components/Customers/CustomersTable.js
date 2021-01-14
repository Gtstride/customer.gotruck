import React from 'react';
import { uuid } from '../../_utils/fx';
import { CustomersColumns } from '../Tables/TableColumns';

function CustomersTable({ customers, page, partnerId, showWaybill }) {
  return customers.map(({ id, business_name, admin, notrips, country, reg_date }, index) => {
    const url = `/${partnerId}/${page}/${id}`;
    const businessNameValue = { name: business_name, url };
    const phone = { url, mobile: admin ? admin.mobile : 'N/A' };
    const countryValue = { url, country };
    const dateValue = { url, reg_date };
    const idValue = { url, id };

    return (
      <tr key={uuid()}>
        <CustomersColumns.IdColumn {...idValue} />
        <CustomersColumns.BusinessNameColumn {...businessNameValue} />
        <CustomersColumns.CountryColumn {...countryValue} />
        <CustomersColumns.PhoneColumn {...phone} />
        <CustomersColumns.DateColumn {...dateValue} />
      </tr>
    );
  });
}

export default CustomersTable;
