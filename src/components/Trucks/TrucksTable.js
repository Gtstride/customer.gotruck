import React from 'react';
import { uuid } from '../../_utils/fx';
import { TrucksColumns } from '../Tables/TableColumns';

function TrucksTable({ trucks, page, customerId, partnerId }) {
  return trucks.map(
    ({
      _id,
      active,
      regNumber,
      ownerBusinessName,
      ownerId,
      asset: {size, type, unit},
      model,
      currentDriver
    }, index) => {
      const url = `/${customerId}/${page}/${_id}`;
      const regNumberValue = { regNumber, url };
      // const partnerValue = { ownerBusinessName, ownerId, url };
      const truckTypeValue = { url, truckType: `${size} ${unit} ${type}`};
      const assignedDriver = {currentDriver, url};
      const modelValue = {url, model};
      const truckStatus = { url, active };
    
      return (
        <tr key={uuid()}>
          <TrucksColumns.RegNoColumn {...regNumberValue} />
          {/* <TrucksColumns.ActivePartnerColumn {...partnerValue} /> */}
          <TrucksColumns.ModelColumn {...modelValue} />
          <TrucksColumns.TruckTypeColumn {...truckTypeValue} />
          <TrucksColumns.AssignedDriverColumn {...assignedDriver} />
          <TrucksColumns.StatusColumn {...truckStatus} />
        </tr>
      );
    }
  );
}

export default TrucksTable;
