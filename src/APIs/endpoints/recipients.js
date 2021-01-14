import { lang } from '../../_utils/fx';

function getRecipientEndpoints({ customerId }) {
  return {
    READ: {
      recipients: `/customer/${customerId}/recipients?language=${lang}`,
    },
  };
}

export default getRecipientEndpoints;
