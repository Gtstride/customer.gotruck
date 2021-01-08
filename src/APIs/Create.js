import { baseurl, insuranceUrl, lang } from '../_utils/fx';

const Apptoken = process.env.REACT_APP_APPTOKEN;

// -> Authentication (Logging in)
function logUserIn(params) {
  const endpoint = '/user/auth';
  return baseurl.post(endpoint, { ...params });
}

// -> Authentication (Register)
function registerUser(params) {
  const endpoint = '/user/register';
  return baseurl.post(endpoint, { ...params });
}

// -> Authentication (Forgot password)
function forgotPassword(params) {
  const endpoint = 'user/password/reset';
  return baseurl.post(endpoint, { ...params });
}

// -> Authentication (Forgot password: Verify code)
function verifyForgotPassword({ params, token }) {
  const endpoint = '/user/password/verify';
  return baseurl.post(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

// -> Authentication (Reset password)
function resetPassword({ params, token }) {
  const endpoint = '/user/password/change';
  return baseurl.post(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

// -> Recipients
function createRecipient({ params, token }) {
  const endpoint = `/user/registerRecipient?language=${lang}`;
  return baseurl.post(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}
// -> Recipients
export function rateTransporter({ params, token }) {
  const endpoint = `/rating/add?language=${lang}`;
  return baseurl.post(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}
// -> Create Policy Request
function createPolicyRequest({ params, customerId, token }) {
  const endpoint = `/insurance/customer/${customerId}/request`;
  return insuranceUrl.post(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
}

// -> Trip Recipient/Dropoff
function createTripRecipient(tripId, params, token) {
  const endpoint = `trip/${tripId}/addDropOff?language=${lang}`;
  return baseurl.put(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

// -> Routes
function createRoute({ params, token }) {
  const endpoint = `route/setRatePrice?language=${lang}`;
  return baseurl.post(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

// -> Pickup
function createPickup(params) {
  const endpoint = `customer/${params.customerId}/addLocation?language=${lang}`;
  return baseurl.post(
    endpoint,
    { ...params.params },
    {
      headers: { Authorization: `Bearer ${params.token}`, Apptoken },
    },
  );
}

// -> Business Units
function createBusinessUnit({ params, endpointParams: { customerId, token } }) {
  const endpoint = `customer/${customerId}/addSection?language=${lang}`;
  return baseurl.post(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

// -> Bulk Routes
function createBulkRoutes(params, token) {
  const endpoint = `route/addBulkRoute?language=${lang}`;
  return baseurl.post(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

// -> Logo
function createLogo(params, customerId, token) {
  const endpoint = `customer/${customerId}/uploadLogo?language=${lang}`;
  return baseurl.post(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

function createUserLogo(params, userId, token) {
  const endpoint = `user/${userId}/detail?language=${lang}`;
  return baseurl.post(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

// -> Logo
function SetRoutePrice(params, token) {
  const endpoint = `/route/setRoutePrice?language=${lang}`;
  return baseurl.post(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

// -> Add user
function createUser({ params, customerId, token }) {
  const endpoint = `/customer/${customerId}/addUser?language=${lang}`;
  return baseurl.post(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

function createMessage(params, token) {
  const endpoint = `/message/createZendeskTicket?language=${lang}`;
  return baseurl.post(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

// -> Add user
function createBusinessUnitDepartment({ params, businessUnitId, token }) {
  const endpoint = `/customer/section/${businessUnitId}/addDepartment?language=${lang}`;
  return baseurl.post(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}
// -> Add addBusinessUnitResource
function addBusinessUnitResource({ params, departmentId, token }) {
  const endpoint = `/customer/department/${departmentId}/addResource?language=${lang}`;
  return baseurl.post(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

function createOrder(params, token) {
  const endpoint = `/request?language=${lang}`;
  return baseurl.post(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

function addTransporterAPI({ partnerId, customerId, token }) {
  const endpoint = `/partner/${partnerId}/addCustomer?language=${lang}`;
  return baseurl.post(
    endpoint,
    { customer_id: customerId },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

function createTruckRequest({ params, token }) {
  const endpoint = `/request/truck?language=${lang}`;
  return baseurl.post(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

function addToPool({ params, token }) {
  const endpoint = `/truck/addToPool?language=${lang}`;
  return baseurl.post(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

function addToRequestPool({ params, token }) {
  const endpoint = `/truck/addToRequestPool?language=${lang}`;
  return baseurl.post(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

function createDriver({ params, token }) {
  const endpoint = `/user/register?language=${lang}`;
  return baseurl.post(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

function createTruck({ params, token }) {
  const endpoint = `/truck?language=${lang}`;
  return baseurl.post(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

function registerTransporter({ params, token }) {
  const endpoint = `/user/register?language=${lang}`;
  return baseurl.post(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

export {
  logUserIn,
  registerUser,
  createRecipient,
  createTripRecipient,
  createRoute,
  createBusinessUnit,
  createBulkRoutes,
  createPolicyRequest,
  createLogo,
  createPickup,
  SetRoutePrice,
  createUser,
  createMessage,
  createBusinessUnitDepartment,
  addBusinessUnitResource,
  createOrder,
  forgotPassword,
  verifyForgotPassword,
  resetPassword,
  addTransporterAPI,
  createTruckRequest,
  addToPool,
  addToRequestPool,
  createUserLogo,
  createDriver,
  createTruck,
  registerTransporter,
};
