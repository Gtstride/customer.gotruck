function getPickupLocationsEndpoints({ customerId }) {
  return {
    READ: {
      pickupLocations: `/customer/locations?customer_id=${customerId}`,
    },
  };
}

export default getPickupLocationsEndpoints;
