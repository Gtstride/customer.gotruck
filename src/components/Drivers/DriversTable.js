/* eslint-disable react/jsx-pascal-case */
import React from 'react';
import { DriversColumns } from '../Tables/TableColumns';
import { uuid, getDash } from '../../_utils/fx';
import { format } from 'path';
import { useParams } from 'react-router-dom';


function DriversTable({ drivers, page }) {
    const {customerId} = useParams();

    return drivers.map(
        ({
          id,
          status,
          first_name,
          last_name,
          partner,
          createdDate,
          assignedTruck,
          rate,
        }, index) => {
          const url = `/${customerId}/${page}/${id}`;
          const driverId = { id, date: `${(createdDate && format(new Date(createdDate), 'd MMMM, yyyy'))|| getDash()}`, url };
          const driverNameValue = { name: `${first_name} ${last_name}`, url };
          // const partnerValue = { url, partner: partner.business_name };
          const assignedTruckValue = {url, assignedTruck};
          const rateValue = { url, rate: rate || 0 };
        
        
    
          return (
            <tr key={uuid()}>
              <DriversColumns.DriverIdColumn {...driverId} />
              <DriversColumns.DriverNameColumn {...driverNameValue} />
              {/* <DriversColumns.partnerColumn {...partnerValue} /> */}
              <DriversColumns.assignedTruckColumn {...assignedTruckValue} />
              <DriversColumns.RateColumn {...rateValue} />
            </tr>
          );
        }
      );
}

export default DriversTable;