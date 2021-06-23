const ordersHeaders = [
  "orderId",
  "route",
  "price",
  "truckType",
  "status",
  "recipient",
];

const tripsHeaders = [
  "tripId",
  "waybill",
  "route",
  "price",
  "driver",
  "truck",
  "recipient",
  "status",
];

const routesHeaders = ["routeId", "route", "price", "truckType", "actions"];

const pickupLocationHeaders = [
  "storeName",
  "storeAddress",
  "storeState",
  "contactPerson",
  "phoneNumber",
  "",
];

const recipientsHeaders = ["name", "phoneNumber", "date", "address", ""];
const usersHeaders = ["name", "email", "phone", "bizUnit", "date", ""];
const driversHeaders = [
  "driverId",
  "driverName",
  "assignedTruck",
  "driverRating",
];
const trucksHeaders = [
  "regNo",
  "model",
  "truckType",
  "assignedDriver",
  "status",
];
const truckPoolHeaders = [
  "regNo",
  "",
  "activePartner",
  "assignedDriver",
  "status",
];
const insuranceHeaders = ["name", "description", "capValue", "assignedCompany"];
const policyRequestHeaders = [
  "policyNumber",
  "insuranceType",
  "companyKey",
  "country",
  "policyContract",
  "status",
];
const policyHeaders = [
  "policyNum",
  "insuranceType",
  "companyKey",
  "country",
  "status",
  "default",
  "activate",
];
const truckRequestHeaders = {
  openRequestsHeaders: [
    "truckType",
    "bizUnit",
    "",
    "totalRequestedTruck",
    "pickupAddress",
    "expiryDate",
    "status",
    "action",
  ],
  assignedRequestsHeaders: [
    "truckType",
    "bizUnit",
    "",
    "pickupAddress",
    "transporter",
    "totalRequestedTruck",
    "expiryDate",
    "status",
    "action",
  ],
  bulkRequestsHeaders: [
    "bizUnit",
    "",
    "pickupAddress",
    "totalAllocation",
    "allocationStatus",
    "expiryDate",
    "action",
  ],
};
const InvoicesHeaders = [
  "invoiceId",
  "amount",
  "attention",
  "note",
  "phone",
  "trips",
  "waybills",
  "status",
  "dateTracking",
];
const InvoiceHeaders = [
  "tripId",
  "transaction",
  "note",
  "cargoType",
  "deliveryPoint",
  "amount",
  "waybills",
];
const MessageHeaders = [
  "from",
  "subject",
  "date",
  "messageType",
  "read",
  "resolved",
];
const CSVUploadStatusHeaders = [
  "fileName",
  "totalRoute",
  "successful",
  "error",
  "status",
];
const businessUnitDepartmentHeaders = [
  "id",
  "name",
  "email",
  "phone",
  "bizUnit",
  "dateJoined",
  "action",
];
const transporterHeaders = [
  "transporter/id",
  "country",
  "address",
  // 'trucks', 'drivers', 'rating'
  "rating",
  "action",
];

export {
  ordersHeaders,
  tripsHeaders,
  routesHeaders,
  truckPoolHeaders,
  truckRequestHeaders,
  pickupLocationHeaders,
  recipientsHeaders,
  InvoicesHeaders,
  policyHeaders,
  InvoiceHeaders,
  CSVUploadStatusHeaders,
  usersHeaders,
  MessageHeaders,
  businessUnitDepartmentHeaders,
  transporterHeaders,
  driversHeaders,
  trucksHeaders,
  insuranceHeaders,
  policyRequestHeaders,
};
