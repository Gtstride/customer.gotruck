import React from 'react';
import { formatPrice, uuid } from '../../_utils/fx';
import { invoicesColumns } from '../Tables/TableColumns';

function InvoicesTable({ invoices, page, customerId, showWaybill }) {
  return invoices.map(
    (
      { _id, invoiceId, status, currency, attention, note, customerPhone, total, extraChargesTotal, dueDate, trips },
      index,
    ) => {
      const url = `/${customerId}/${page}/${_id}`;
      const invoiceIdValue = { invoiceId, url };
      const invoiceAmountValue = {
        url,
        amount: `${currency ? currency : ''} ${formatPrice(total)}`,
      };
      const invoiceAttentionValue = { url, attention };
      const invoiceNoteValue = { url, note };
      const phoneValue = { url, phone: customerPhone };
      const tripsValue = { url, tripCount: trips.length };
      const invoiceWaybillValue = {
        url,
        showWaybill,
        waybillCount: trips
          .flatMap((x, i) => x.waybillImage)
          .filter(
            w =>
              w.length !== 0 &&
              ((w.tripStatus && w.tripStatus.toLowerCase() === 'at-destination') ||
                (w.tripStatus && w.tripStatus.toLowerCase() === 'delivered')),
          ).length,
        index,
      };

      const invoiceStatusValue = { url, status };
      const dateTrackingValue = {
        url,
        status,
        dueDate,
        // trackingDate: <Moment fromNow>{dueDate}</Moment>
      };

      return (
        <tr key={uuid()}>
          <invoicesColumns.IdColumn {...invoiceIdValue} />
          <invoicesColumns.AmountColumn {...invoiceAmountValue} />
          <invoicesColumns.AttentionColumn {...invoiceAttentionValue} />
          <invoicesColumns.NoteColumn {...invoiceNoteValue} />
          <invoicesColumns.PhoneColumn {...phoneValue} />
          <invoicesColumns.TripColumn {...tripsValue} />
          <invoicesColumns.WaybillColumn {...invoiceWaybillValue} />
          <invoicesColumns.StatusColumn {...invoiceStatusValue} />
          <invoicesColumns.DateTrackingColumn {...dateTrackingValue} />
        </tr>
      );
    },
  );
}

export default InvoicesTable;
