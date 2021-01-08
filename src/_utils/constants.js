const tableType = {
    trips: 'trips',
    routes: 'routes',
    orders: 'orders',
    pendingOrders: 'pendingOrders',
    acceptedOrders: 'acceptedOrders',
    invoices: 'invoices',
    pickupLocations: 'pickupLocations',
    recipients: 'recipients',
    users: 'users',
    messages: 'messages',
    businessUnit: 'business Unit',
    department: 'departments',
    drivers: 'drivers',
    trucks: 'trucks',
  };
  
  const crudEnums = {
    CREATE: 'create',
    UPDATE: 'update',
    DELETE: 'delete',
    READ: 'read',
  };
  
  const toastEnums = {
    SUCCESS: 'success',
    FAILURE: 'failure',
  };
  
  const tableRowsCount = 30;
  
  const cardTypes = {
    TRIP: 'trip',
    REQUEST: 'request',
    TRANSPORTER: 'transporter',
  };
  
  const generalSettings = {
    LOGISTICS: 'logistics',
    COMMUNICATION: 'communication',
    SALES: 'sales',
    FINANCE: 'finance',
    ADMIN: 'admin',
  };
  export const departments = ['admin', 'finance', 'communication', 'logistics', 'sales'];
  
  export { tableType, crudEnums, toastEnums, tableRowsCount, cardTypes, generalSettings };
  