// -> Returns all general endpoints
function getGeneralEndpoints({ customerId = null }) {
  return {
    READ: {
      analytics: `analytics/customer/${customerId}`,
    },
  };
}

export default getGeneralEndpoints;
