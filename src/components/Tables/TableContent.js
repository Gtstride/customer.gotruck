import React from 'react';
import InvoicesTable from '../Invoices/InvoicesTable';
import InvoiceTable from '../Invoices/InvoiceTable';
import OrdersTable from '../Orders/OrdersTable';
import PickupLocationsTable from '../PickupLocations/PickupLocationsTable';
import RecipientsTable from '../Recipients/RecipientsTable';
import CSVUploadStatusTable from '../Routes/CSVUploadStatusTable';
import RoutesTable from '../Routes/RoutesTable';
import SupportTable from '../Support/SupportTable';
import AllTransportersTable from '../Transporters/AllTransportersTable';
import TransportersTable from '../Transporters/TransportersTable';
import TripsTable from '../Trips/TripsTable';
import TruckPoolsTable from '../TruckPools/TruckPoolsTable';
import TruckRequestsTable from '../TruckRequests/TruckRequestsTable';
import UsersTable from '../Users/UsersTable';
import DriversTable from '../Drivers/DriversTable';
import TrucksTable from '../Trucks/TrucksTable';
import InsuranceTable from '../Insurance/InsuranceTable';
import PolicyTable from '../Policy/PolicyTable';
import PolicyRequestTable from '../PolicyRequest/PolicyRequestTable';

function TableContent({
  tableData,
  tableFor,
  page,
  onRateChange,
  showSidePane = false,
  setModal,
  showWaybill,
  onRowClick,
  customerId,
  partnerId,
  statusParams,
  customerId2,
  onClone,
  onEdit,
  addTransporterAsync,
  user,
}) {
  // #region Render
  if (tableFor === 'trips') {
    return (
      <tbody id='tableContent'>
        <TripsTable trips={tableData} {...{ page, customerId }} />
      </tbody>
    );
  }

  if (tableFor === 'orders') {
    return (
      <tbody id='tableContent'>
        <OrdersTable orders={tableData} {...{ page, customerId }} />
      </tbody>
    );
  }

  if (tableFor === 'routes') {
    return (
      <tbody id='tableContent'>
        <RoutesTable
          {...{
            routes: tableData,
            setModal,
          }}
        />
      </tbody>
    );
  }

  if (tableFor === 'incomingTrucks') {
    return (
      <tbody id='tableContent'>
        <TruckPoolsTable truckPools={tableData} {...{ page, customerId }} />
      </tbody>
    );
  }

  if (tableFor === 'truckRequest') {
    return (
      <tbody id='tableContent'>
        <TruckRequestsTable truckRequests={tableData} {...{ page, customerId2, statusParams, onClone, onEdit }} />
      </tbody>
    );
  }

  if (tableFor === 'transporters') {
    return (
      <tbody id='tableContent'>
        <TransportersTable
          {...{ page, customerId, partnerId, transporters: tableData, setModal, onRateChange, user }}
        />
      </tbody>
    );
  }

  if (tableFor === 'drivers') {
    return (
      <tbody id='tableContent'>
        <DriversTable {...{ page, customerId, drivers: tableData }} />
      </tbody>
    );
  }

  if (tableFor === 'trucks') {
    return (
      <tbody id='tableContent'>
        <TrucksTable {...{ page, customerId, partnerId, trucks: tableData }} />
      </tbody>
    );
  }

  if (tableFor === 'addTransporter') {
    return (
      <tbody id='tableContent'>
        <AllTransportersTable {...{ addTransporterAsync, page, customerId, transporters: tableData, setModal }} />
      </tbody>
    );
  }

  if (tableFor === 'invoices') {
    return (
      <tbody id='tableContent'>
        <InvoicesTable invoices={tableData} {...{ page, customerId, showWaybill }} />
      </tbody>
    );
  }

  if (tableFor === 'invoice') {
    return (
      <tbody id='tableContent'>
        <InvoiceTable {...{ invoice: tableData, page, customerId, showWaybill }} />
      </tbody>
    );
  }

  if (tableFor === 'pickupLocations') {
    return (
      <tbody id='tableContent'>
        <PickupLocationsTable {...{ pickupLocations: tableData, setModal, customerId }} />
      </tbody>
    );
  }
  if (tableFor.toLowerCase() === 'recipients') {
    return (
      <tbody id='tableContent'>
        <RecipientsTable {...{ recipients: tableData, showSidePane, setModal }} />
      </tbody>
    );
  }
  if (tableFor.toLowerCase() === 'insurance') {
    return (
      <tbody id='tableContent'>
        <InsuranceTable {...{ recipients: tableData, showSidePane, setModal }} />
      </tbody>
    );
  }
  if (tableFor.toLowerCase() === 'policy') {
    return (
      <tbody id='tableContent'>
        <PolicyTable {...{ recipients: tableData, showSidePane, setModal, onRowClick }} />
      </tbody>
    );
  }
  if (tableFor.toLowerCase() === 'policyrequest') {
    return (
      <tbody id='tableContent'>
        <PolicyRequestTable {...{ recipients: tableData, showSidePane, setModal }} />
      </tbody>
    );
  }
  if (tableFor === 'users') {
    return (
      <tbody id='tableContent'>
        <UsersTable {...{ users: tableData, showSidePane, setModal }} />
      </tbody>
    );
  }
  if (tableFor.toLowerCase() === 'policy') {
    return (
      <tbody id='tableContent'>
        <PolicyTable {...{ recipients: tableData, showSidePane, setModal }} />
      </tbody>
    );
  }
  if (tableFor.toLowerCase() === 'policyrequest') {
    console.log('policy request', tableData);
    return (
      <tbody id='tableContent'>
        <PolicyRequestTable {...{ recipients: tableData, showSidePane, setModal }} />
      </tbody>
    );
  }
  if (tableFor === 'users') {
    return (
      <tbody id='tableContent'>
        <UsersTable {...{ users: tableData, showSidePane, setModal }} />
      </tbody>
    );
  }
  if (tableFor === 'users') {
    return (
      <tbody id='tableContent'>
        <UsersTable {...{ users: tableData, showSidePane, setModal }} />
      </tbody>
    );
  }
  if (tableFor === 'csvUploadStatus') {
    return (
      <tbody id='tableContent'>
        <CSVUploadStatusTable csvs={tableData} {...{ page, customerId }} />
      </tbody>
    );
  }

  if (tableFor === 'messages') {
    return (
      <tbody id='tableContent'>
        <SupportTable messages={tableData} />
      </tbody>
    );
  }

  return <h1>Error loading data</h1>;
  
}

export default TableContent;
