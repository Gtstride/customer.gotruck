import React from 'react';
import { formatPrice, uuid } from '../../_utils/fx';
import { invoiceColumns } from '../Tables/TableColumns';

function InvoiceTable({ invoice, showWaybill }) {
  return invoice.map(
    ({ tripReadId, currency, destination, waybillImage, amount, deliveryNote, description, goodType }) => {
      const tripIdValue = { tripReadId };
      const amountValue = {
        amount: `${currency || ''} ${formatPrice(amount)}`,
      };

      const typeOfGood = { goodType };
      const descriptionText = { description };
      const deliveryText = { deliveryNote };
      const deliverPoint = { destination };
      const imgUrl = { waybillImage, showWaybill };

      return (
        <tr key={uuid()}>
          <invoiceColumns.TripIdColumn {...tripIdValue} />
          <invoiceColumns.TransactionDescriptionColumn {...descriptionText} />
          <invoiceColumns.DeliveryNoteColumn {...deliveryText} />
          <invoiceColumns.CargoTypeColumn {...typeOfGood} />
          <invoiceColumns.DeliveryPointColumn {...deliverPoint} />
          <invoiceColumns.AmountColumn {...amountValue} />
          <invoiceColumns.WaybillsColumn {...imgUrl} />
        </tr>
      );
    },
  );
}

export default InvoiceTable;
