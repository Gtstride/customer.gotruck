import { lang } from '../../_utils/fx';

function getUsersEndpoints({ customerId }) {
  return {
    READ: {
      users: `/customer/${customerId}/users?language=${lang}`,
    },
  };
}

export default getUsersEndpoints;
