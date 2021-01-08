import { format } from 'date-fns';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { uuid, getDash } from '../../_utils/fx';
import { TruckRequestsColumns } from '../Tables/TableColumns';

function TruckRequestsTable({ truckRequests, statusParams, page, customerId2, onEdit, onClone }) {
  const { t } = useTranslation();

  if (truckRequests === undefined) {
    return null;
  }
  return truckRequests.map(request => {
    const {
      _id,
      status,
      asset,
      accessType,
      requestType,
      businessUnit,
      pickupStation: { address: pickupAddress },
      expiryDate,
      requestedQuantity,
      acceptedQuantity,
      partner,
      allocation,
      assignedAllocation,
    } = request;
    let url;
    if (statusParams === 'bulk_requests') {
      url = `/${customerId2}/${page}/${_id}?type=bulk`;
    } else {
      url = `/${customerId2}/${page}/${_id}?type=${statusParams}`;
      // url = `/${customerId2}/${page}/${_id}`;
    }
    const statusValue = { url, status, ...request };
    const truckTypeValue = {
      url,
      assetClass: `${(asset && `${asset.size} ${asset.unit} ${asset.name}`) || getDash()}`,
      requestType,
    };
    const requestTypeValue = { url, requestType };
    const customerValue = { url, businessUnit };
    const requestValue = {
      url,
      requestedQuantity: requestedQuantity || acceptedQuantity || 0,
      unallocatedQuantity: isNaN(requestedQuantity - acceptedQuantity)
        ? acceptedQuantity
        : requestedQuantity - acceptedQuantity,
      requestUnit: requestType ? (requestType.toLowerCase() === 'bulk' && 'Mtons') || 'trucks' : '',
    };
    const allocationValue = { allocation, url };
    const pickupAddressValue = { url, pickupAddress };
    const expiryDateValue = {
      url,
      expiryDate: format(new Date(expiryDate), 'd MMMM, yyyy'),
      time: format(new Date(expiryDate), 'hh:mm aaa'),
    };
    const partnerValue = { partnerName: partner && partner.name, url };
    const allocationStatus = {
      status: allocation === assignedAllocation ? `${t('truckRequests.full')}` : `${t('truckRequests.partial')}`,
      statusClass: allocation === assignedAllocation ? 'full' : 'partial',
    };
    console.log('status param', statusParams);
    //market place table row
    if (statusParams === 'open_requests') {
      return (
        <tr key={uuid()} className='noClick'>
          <TruckRequestsColumns.TruckTypeColumn {...truckTypeValue} />
          <TruckRequestsColumns.CustomerColumn {...customerValue} />
          <TruckRequestsColumns.RequestTypeColumn {...requestTypeValue} />
          <TruckRequestsColumns.TotalTruckRequestColumn {...requestValue} />
          <TruckRequestsColumns.PickupAddressColumn {...pickupAddressValue} />
          <TruckRequestsColumns.ExpiryDateTimeColumn {...expiryDateValue} />
          {status && <TruckRequestsColumns.StatusColumn {...statusValue} />}
          <TruckRequestsColumns.ActionColumn onEdit={onEdit} onClone={onClone} {...statusValue} />
        </tr>
      );
    }

    //assigned request row

    if (statusParams === 'assigned_requests') {
      return (
        <tr key={uuid()} className='noClick'>
          <TruckRequestsColumns.TruckTypeColumn {...truckTypeValue} />
          <TruckRequestsColumns.CustomerColumn {...customerValue} />
          <TruckRequestsColumns.RequestTypeColumn {...requestTypeValue} />
          <TruckRequestsColumns.PickupAddressColumn {...pickupAddressValue} />
          {accessType && accessType.toLowerCase() === 'dt' && (
            <TruckRequestsColumns.TransporterColumn {...partnerValue} />
          )}
          <TruckRequestsColumns.TotalTruckRequestColumn {...requestValue} />
          <TruckRequestsColumns.ExpiryDateTimeColumn {...expiryDateValue} />
          {status && <TruckRequestsColumns.StatusColumn {...statusValue} />}
          <TruckRequestsColumns.ActionColumn onEdit={onEdit} onClone={onClone} {...statusValue} />
        </tr>
      );
    }

    return (
      <tr key={uuid()} className='noClick'>
        <TruckRequestsColumns.CustomerColumn {...customerValue} />
        <TruckRequestsColumns.RequestTypeColumn {...requestTypeValue} />
        <TruckRequestsColumns.PickupAddressColumn {...pickupAddressValue} />
        <TruckRequestsColumns.TotalTruckRequestColumn {...allocationValue} />
        <TruckRequestsColumns.AllocationStatusColumn {...allocationStatus} />
        <TruckRequestsColumns.ExpiryDateTimeColumn {...expiryDateValue} />
        {status && <TruckRequestsColumns.StatusColumn {...statusValue} />}
        <TruckRequestsColumns.ActionColumn onEdit={onEdit} onClone={onClone} {...statusValue} />
      </tr>
    );
  });
}

export default TruckRequestsTable;
