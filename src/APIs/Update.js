import { baseurl, insuranceUrl, lang } from '../_utils/fx';

const Apptoken = process.env.REACT_APP_APPTOKEN;

// -> Business proflie
function updateBusinessProfilePassword({ endpoint, endpointParams: { params, token } }) {
  if (endpoint) {
    if (endpoint.includes('?')) {
      endpoint = `${endpoint}&language=${lang}`;
    } else {
      endpoint = `${endpoint}?language=${lang}`;
    }
  }
  return baseurl.put(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

// -> Deactivate policy
function togglePolicy({ id, token }) {
  const endpoint = `insurance/policy/${id}/toggle`;
  return insuranceUrl.put(endpoint, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
// -> Deactivate policy
function setDefaultPolicy({ customer, id, token }) {
  const endpoint = `/insurance/customer/${customer}/policy/${id}/default`;
  return insuranceUrl.put(endpoint, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// Trip Recipient/Dropoff
function updateTripRecipient({ tripId, dropOffId, params, token }) {
  const endpoint = `/trip/${tripId}/updateDropOff/${dropOffId}?language=${lang}`;
  return baseurl.put(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

// -> Route
function updateRoute({ params, token, routeId }) {
  const endpoint = `route/user/${routeId}?language=${lang}`;
  return baseurl.put(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

function updateTruckRequest({ params, token, truckRequestId }) {
  const endpoint = `request/${truckRequestId}/truck?language=${lang}`;
  return baseurl.put(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

function updateRecipient({ params, endpointParams: { token, customerId, recipientId } }) {
  const endpoint = `/customer/${customerId}/recipient/${recipientId}?language=${lang}`;
  return baseurl.put(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

export function updateRecipientAddress({ params, endpointParams: { token, customerId, recipientId } }) {
  const endpoint = `/customer/${customerId}/recipient/${recipientId}/updateAddress?language=${lang}`;
  return baseurl.put(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

function updateUser({ params, endpointParams }) {
  const endpoint = `user/${endpointParams.userId}/detail?language=${lang}`;
  return baseurl.post(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${endpointParams.token}` },
    },
  );
}

function updateOrderPrice({ price, token, orderId }) {
  const endpoint = `/request/${orderId}/price?language=${lang}`;
  return baseurl.put(
    endpoint,
    { price },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

function updateLocation({ params, endpointParams: { token, customerId, locationId } }) {
  const endpoint = `customer/${customerId}/location/${locationId}?language=${lang}`;
  return baseurl.put(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

function updateBusinessUnitName({ params, endpointParams: { token, customerId, businessUnitId } }) {
  const endpoint = `/customer/${customerId}/section/${businessUnitId}?language=${lang}`;
  return baseurl.put(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

// -> Add user
function updateBusinessUnitDepartment({ params, businessUnitId, token, departmentId }) {
  const endpoint = `/customer/${businessUnitId}/department/${departmentId}?language=${lang}`;
  return baseurl.put(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

function cancelOrder({ orderLongId, token }) {
  const endpoint = `/request/${orderLongId}/cancel?language=${lang}`;
  return baseurl.put(endpoint, null, {
    headers: { Authorization: `Bearer ${token}`, Apptoken },
  });
}

function updateCustomerProfile({ endpoint, endpointParams: { params, token } }) {
  if (endpoint) {
    if (endpoint.includes('?')) {
      endpoint = `${endpoint}&language=${lang}`;
    } else {
      endpoint = `${endpoint}?language=${lang}`;
    }
  }
  return baseurl.put(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

function updateUserProfile({ endpoint, endpointParams: { params, token } }) {
  if (endpoint) {
    if (endpoint.includes('?')) {
      endpoint = `${endpoint}&language=${lang}`;
    } else {
      endpoint = `${endpoint}?language=${lang}`;
    }
  }
  return baseurl.post(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

function assignTransporter({ endpoint, endpointParams: { params, token } }) {
  if (endpoint) {
    if (endpoint.includes('?')) {
      endpoint = `${endpoint}&language=${lang}`;
    } else {
      endpoint = `${endpoint}?language=${lang}`;
    }
  }
  return baseurl.put(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

function confirmTsAllocation({ endpoint, endpointParams: { params, token } }) {
  if (endpoint) {
    if (endpoint.includes('?')) {
      endpoint = `${endpoint}&language=${lang}`;
    } else {
      endpoint = `${endpoint}?language=${lang}`;
    }
  }
  return baseurl.put(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

function adjustAllocation({ endpoint, endpointParams: { params, token } }) {
  if (endpoint) {
    if (endpoint.includes('?')) {
      endpoint = `${endpoint}&language=${lang}`;
    } else {
      endpoint = `${endpoint}?language=${lang}`;
    }
  }
  return baseurl.put(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

function removeAllocationDriver({ endpoint, token }) {
  if (endpoint) {
    if (endpoint.includes('?')) {
      endpoint = `${endpoint}&language=${lang}`;
    } else {
      endpoint = `${endpoint}?language=${lang}`;
    }
  }
  return baseurl.put(endpoint, null, {
    headers: { Authorization: `Bearer ${token}`, Apptoken },
  });
}

function setTRInPosition({ endpoint, params, token }) {
  if (endpoint) {
    if (endpoint.includes('?')) {
      endpoint = `${endpoint}&language=${lang}`;
    } else {
      endpoint = `${endpoint}?language=${lang}`;
    }
  }
  return baseurl.put(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

function loadTruck({ endpoint, params, token }) {
  if (endpoint) {
    if (endpoint.includes('?')) {
      endpoint = `${endpoint}&language=${lang}`;
    } else {
      endpoint = `${endpoint}?language=${lang}`;
    }
  }
  return baseurl.put(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

function updateWaybillTrackerStatus({ endpoint, params, token }) {
  if (endpoint) {
    if (endpoint.includes('?')) {
      endpoint = `${endpoint}&language=${lang}`;
    } else {
      endpoint = `${endpoint}?language=${lang}`;
    }
  }
  return baseurl.post(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

function assignDriverToTruckForm({ endpoint, params, token }) {
  if (endpoint) {
    if (endpoint.includes('?')) {
      endpoint = `${endpoint}&language=${lang}`;
    } else {
      endpoint = `${endpoint}?language=${lang}`;
    }
  }
  return baseurl.put(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}
function approveTransporterRoute({ endpoint, token, params }) {
  if (endpoint) {
    if (endpoint.includes('?')) {
      endpoint = `${endpoint}&language=${lang}`;
    } else {
      endpoint = `${endpoint}?language=${lang}`;
    }
  }
  return baseurl.put(
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

function enableDriver({ endpoint, data, token }) {
  if (endpoint) {
    if (endpoint.includes('?')) {
      endpoint = `${endpoint}&language=${lang}`;
    } else {
      endpoint = `${endpoint}?language=${lang}`;
    }
  }
  return baseurl.put(
    endpoint,
    { ...data },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

function updateWithEndpointDataToken({ method, endpoint, params, token }) {
  if (endpoint) {
    if (endpoint.includes('?')) {
      endpoint = `${endpoint}&language=${lang}`;
    } else {
      endpoint = `${endpoint}?language=${lang}`;
    }
  }
  return baseurl[method](
    endpoint,
    { ...params },
    {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    },
  );
}

function updateGeneralSettings({ params, token, customerId }) {
  const endpoint = `/configuration/customer/${customerId}/notification`;
  return baseurl.put(endpoint, params, {
    headers: { Authorization: `Bearer ${token}`, Apptoken },
  });
}

/**
 * update Business unit settings
 * @param {*} param
 */
function updateBusinessUnitSettings({ params, token, customerId, businessUnitId }) {
  const endpoint = `/configuration/customer/${customerId}/notification/businessUnit/${businessUnitId}`;
  return baseurl.put(endpoint, params, {
    headers: { Authorization: `Bearer ${token}`, Apptoken },
  });
}

export {
  updateBusinessProfilePassword,
  updateTripRecipient,
  updateRoute,
  updateRecipient,
  updateOrderPrice,
  updateUser,
  updateLocation,
  updateBusinessUnitName,
  updateBusinessUnitDepartment,
  cancelOrder,
  updateCustomerProfile,
  updateTruckRequest,
  updateUserProfile,
  assignTransporter,
  confirmTsAllocation,
  adjustAllocation,
  removeAllocationDriver,
  setTRInPosition,
  loadTruck,
  updateWaybillTrackerStatus,
  assignDriverToTruckForm,
  enableDriver,
  approveTransporterRoute,
  updateWithEndpointDataToken,
  togglePolicy,
  setDefaultPolicy,
  updateGeneralSettings,
  updateBusinessUnitSettings,
};
