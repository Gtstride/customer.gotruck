import { format } from 'date-fns';
import React from 'react';
import { uuid, getDash } from '../../_utils/fx';
import { TruckPoolsColumns } from '../Tables/TableColumns';

function TruckPoolsTable({ truckPools, page, customerId }) {
  return truckPools.map(
    ({
      _id,
      createdDate,
      regNumber,
      asset: { size, unit, name },
      carriage,
      driver: { name: driverName, mobile },
      status,
      requestType,
    }) => {
      const url = `/${customerId}/${page}/${_id}`;
      const regNoValue = { url, regNo: regNumber, assetClass: `${size} ${unit} ${name}` };
      const reqTypeValue = { url, requestType };
      const activePartnerValue = { url, partnerName: (carriage && carriage.name) || getDash() };
      const driverValue = { url, driverName, mobile, createdDate: format(new Date(createdDate), 'd MMMM, yyyy') };
      const statusValue = { url, status };

      return (
        <tr key={uuid()} className='noClick'>
          <TruckPoolsColumns.RegNoColumn {...regNoValue} />
          <TruckPoolsColumns.RequestTypeColumn {...reqTypeValue} />
          <TruckPoolsColumns.ActivePartnerColumn {...activePartnerValue} />
          <TruckPoolsColumns.DriverColumn {...driverValue} />
          <TruckPoolsColumns.StatusColumn {...statusValue} />
        </tr>
      );
    },
  );
}

export default TruckPoolsTable;
