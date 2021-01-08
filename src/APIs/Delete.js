import { baseurl, lang } from '../_utils/fx';

const Apptoken = process.env.REACT_APP_APPTOKEN;

function deleteRecipient({ customerId, recipientId, token }) {
  const endpoint = `/customer/${customerId}/recipient/${recipientId}?language=${lang}`;
  return baseurl.delete(endpoint, {
    headers: { Authorization: `Bearer ${token}`, Apptoken },
  });
}

function deletePickupLocation({ customerId, pickupLocationId, token }) {
  const endpoint = `/customer/${customerId}/location/${pickupLocationId}?language=${lang}`;
  return baseurl.delete(endpoint, {
    headers: { Authorization: `Bearer ${token}`, Apptoken },
  });
}

function deleteBusinessUnitUser({ token, customerId, businessUnitId }) {
  const endpoint = `/customer/${customerId}/section/${businessUnitId}?language=${lang}`;
  return baseurl.delete(endpoint, {
    headers: { Authorization: `Bearer ${token}`, Apptoken },
  });
}

function deleteRoute({ routeId, token }) {
  const endpoint = `/route/${routeId}?language=${lang}`;
  return baseurl.delete(endpoint, {
    headers: { Authorization: `Bearer ${token}`, Apptoken },
  });
}

function deleteTripRecipient({ tripId, dropOffId, token }) {
  const endpoint = `/trip/${tripId}/removeDropOff/${dropOffId}`;

  return baseurl.put(endpoint, null, {
    headers: { Authorization: `Bearer ${token}`, Apptoken },
  });
}

function cancelTruckRequest({ truckRequestId, token }) {
  const endpoint = `/request/${truckRequestId}/cancelTruckRequest?language=${lang}`;

  return baseurl.put(endpoint, null, {
    headers: { Authorization: `Bearer ${token}`, Apptoken },
  });
}
function removeTransporter({ transporterId, customerId, token }) {
  const endpoint = `/partner/${transporterId}/customer/${customerId}?language=${lang}`;

  return baseurl.delete(endpoint, {
    headers: { Authorization: `Bearer ${token}`, Apptoken },
  });
}

export {
  deleteRecipient,
  deletePickupLocation,
  deleteRoute,
  deleteTripRecipient,
  cancelTruckRequest,
  removeTransporter,
  deleteBusinessUnitUser,
};
