import React from 'react';
import { uuid } from '../../_utils/fx';
import { pickupLocationsColumns } from '../Tables/TableColumns';

function PickupLocationsTable({ pickupLocations, setModal }) {
  return pickupLocations.map(({ address, name, state, contact_name, contact_phone, id }) => {
    const storeColumnValue = { name };
    const addressValue = { address };
    const locationValue = { state };
    const contactPersonValue = { name: contact_name };
    const phoneNumberValue = { phone: contact_phone };

    return (
      <tr key={uuid()} className='noClick'>
        <pickupLocationsColumns.StoreNameColumn {...storeColumnValue} />
        <pickupLocationsColumns.StoreAddresColumn {...addressValue} />
        <pickupLocationsColumns.StoreStateColumn {...locationValue} />
        <pickupLocationsColumns.ContactPersonColumn {...contactPersonValue} />
        <pickupLocationsColumns.PhoneColumn {...phoneNumberValue} />
        <pickupLocationsColumns.ActionsColumn {...{ pickupLocationId: id, setModal }} />
      </tr>
    );
  });
}

export default PickupLocationsTable;
