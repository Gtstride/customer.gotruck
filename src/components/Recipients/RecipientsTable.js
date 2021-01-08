import React from 'react';
import { uuid, switchRecipientAddress } from '../../_utils/fx';
import { recipientsColumns } from '../Tables/TableColumns';
import { format } from 'date-fns';

function RecipientsTable({ recipients, setModal }) {
  return recipients.map(({ address, addresses = [], full_name, created, mobile, id }) => {
    let addressValue = { address, recipientId: id, setModal, totalAddress: addresses.length };
    // ?? Check the function switchRecipientAddress to learn more
    const newRecipientAddress = switchRecipientAddress(addresses);
    if (newRecipientAddress !== undefined) {
      addressValue = { ...addressValue, address: newRecipientAddress };
    }

    const nameValue = { name: full_name, recipientId: id, setModal };
    const dateCreatedValue = {
      dateCreated: format(new Date(created), 'd MMMM, yyyy'),
      recipientId: id,
      setModal,
    };
    const phoneValue = { phone: mobile, recipientId: id, setModal };

    return (
      <tr key={uuid()} className='noClick'>
        <recipientsColumns.NameColumn {...nameValue} />
        <recipientsColumns.PhoneColumn {...phoneValue} />
        <recipientsColumns.DateAddedColumn {...dateCreatedValue} />
        <recipientsColumns.AddressColumn {...addressValue} />
        <recipientsColumns.ActionsColumn {...{ recipientId: id, setModal }} />
      </tr>
    );
  });
}

export default RecipientsTable;
