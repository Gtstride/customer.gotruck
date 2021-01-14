import { lang } from '../../_utils/fx';

// -> Returns all endpoints related to BusinessProfile
function getBusinessProfileEndpoints({ customerId = null, businessUnitId = null }) {
  return {
    READ: {
      businessProfile: `/customer/${customerId}/profile?language=${lang}`,
    },
    UPDATE: {
      businessProfile: `customer/${customerId}`,
      businessProfilePassword: `user/${customerId}/changePassword`,
    },
  };
}

export default getBusinessProfileEndpoints;
