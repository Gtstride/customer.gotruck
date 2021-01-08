import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { logOut } from '../_utils/auth';
import { baseurl, insuranceUrl, lang } from '../_utils/fx';

export const Apptoken = process.env.REACT_APP_APPTOKEN;

function useFetch(endpoint, token) {
  const { customerId } = useParams();
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  if (endpoint) {
    if (endpoint.includes('?')) {
      endpoint = `${endpoint}&language=${lang}`;
    } else {
      endpoint = `${endpoint}?language=${lang}`;
    }
  }

  const reFetch = () => {
    setIsLoading(true);
    (async () => {
      try {
        if (endpoint) {
          const {
            data: { data },
          } = await baseurl.get(endpoint, {
            headers: { Authorization: `Bearer ${token}`, Apptoken },
          });
          setResponse(data);
        }
      } catch ({ response }) {
        if (response) {
          if (response.status === 401) {
            logOut(customerId);
          } else if (response) {
            setError(response);
          }
        } else {
          setError('SOMETHING WENT WRONG');
        }
      }
      setIsLoading(false);
    })();
  };
  useEffect(() => {
    reFetch();
    // eslint-disable-next-line
  }, [endpoint, token, customerId]);

  return { response, error, isLoading, reFetch };
}

function getBusinessProfile(customerId, token) {
  const endpoint = `/customer/${customerId}/profile?language=${lang}`;
  return baseurl.get(endpoint, {
    headers: { Authorization: `Bearer ${token}`, Apptoken },
  });
}

function getUsersPolicyRequest(customerId, token) {
  const endpoint = `/insurance/customer/${customerId}/request`;
  return baseurl.get(endpoint, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

function getStates({ country, token }) {
  const endpoint = `/route/getStateCode/${country}?language=${lang}`;
  return baseurl.get(endpoint, {
    headers: { Authorization: `Bearer ${token}`, Apptoken },
  });
}

function getAddress({ value, token }) {
  try {
    const endpoint = `${process.env.REACT_APP_GPS_ENDPOINT}/location/autocomplete?input=${value}`;
    return Axios.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.log({ error });
  }
}

function getLatLong({ placeId, token }) {
  const endpoint = `${process.env.REACT_APP_GPS_ENDPOINT}/location/place?placeId=${placeId}&source=google`;
  return Axios.get(endpoint, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

function getCustomerMessage(customerId2, token) {
  const endpoint = `/message/getCustomerMessages?language=${lang}`;
  return baseurl.post(
    endpoint,
    { userID: parseInt(customerId2, 10), userType: 'customer' },
    { headers: { Authorization: `Bearer ${token}`, Apptoken } },
  );
}

function getBusinessUnitsDepartments({ businessUnitId, token }) {
  const endpoint = `/customer/section/${businessUnitId}/departments?language=${lang}`;
  return baseurl.get(endpoint, {
    headers: { Authorization: `Bearer ${token}`, Apptoken },
  });
}

export function getStatesByCode(code, token) {
  const endpoint = `/route/country/${code}/states?language=${lang}`;
  return baseurl.get(endpoint, {
    headers: { Authorization: `Bearer ${token}`, Apptoken },
  });
}

function authorizeUser(customerId, token) {
  const endpoint = `/user/customer/${customerId}?language=${lang}`;
  return baseurl.get(endpoint, {
    headers: { Authorization: `Bearer ${token}`, Apptoken },
  });
}

function getPolicyRequestByCustomer(customerId, token) {
  const endpoint = `/insurance/customer/${customerId}/request`;
  return insuranceUrl.get(endpoint, {
    headers: { Authorization: `Bearer ${token}` },

  });

}

function getCustomerPolicies(customerId, token) {
  const endpoint = `/insurance/customer/${customerId}/policy`;
  return insuranceUrl.get(endpoint, {
    headers: { Authorization: `Bearer ${token}` },

  });
}
export function getTripInsurance(regNumber, token) {
  const endpoint = `/insurance/search?searchTerm=${regNumber}`;
  return insuranceUrl.get(endpoint, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
// eslint-disable-next-line no-unused-vars
function getOnePolicy(policyId, token) {
  const endpoint = `/insurance/policy/${policyId}`;
  return insuranceUrl.get(endpoint, {
    headers: { Authorization: `Bearer ${token}` },
  });
}


function getBusinessUnitResources({ token }) {
  const endpoint = `/customer/resources?language=${lang}`;
  return baseurl.get(endpoint, {
    headers: { Authorization: `Bearer ${token}`, Apptoken },
  });
}

function getFilteredTableData({ endpoint, token }) {
  if (endpoint) {
    if (endpoint.includes('?')) {
      endpoint = `${endpoint}&language=${lang}`;
    } else {
      endpoint = `${endpoint}?language=${lang}`;
    }
  }
  return baseurl.get(endpoint, {
    headers: { Authorization: `Bearer ${token}`, Apptoken },
  });
}

function getRecipients({ endpoint, token }) {
  if (endpoint) {
    if (endpoint.includes('?')) {
      endpoint = `${endpoint}&language=${lang}`;
    } else {
      endpoint = `${endpoint}?language=${lang}`;
    }
  }
  return baseurl.get(endpoint, {
    headers: { Authorization: `Bearer ${token}`, Apptoken },
  });
}

function getUsers({ endpoint, token }) {
  if (endpoint) {
    if (endpoint.includes('?')) {
      endpoint = `${endpoint}&language=${lang}`;
    } else {
      endpoint = `${endpoint}?language=${lang}`;
    }
  }
  return baseurl.get(endpoint, {
    headers: { Authorization: `Bearer ${token}`, Apptoken },
  });
}

function getPickupLocations({ endpoint, token }) {
  if (endpoint) {
    if (endpoint.includes('?')) {
      endpoint = `${endpoint}&language=${lang}`;
    } else {
      endpoint = `${endpoint}?language=${lang}`;
    }
  }
  return baseurl.get(endpoint, {
    headers: { Authorization: `Bearer ${token}`, Apptoken },
  });
}

function getBusinessUnitDepartments({ endpoint, token }) {
  if (endpoint) {
    if (endpoint.includes('?')) {
      endpoint = `${endpoint}&language=${lang}`;
    } else {
      endpoint = `${endpoint}?language=${lang}`;
    }
  }
  return baseurl.get(endpoint, {
    headers: { Authorization: `Bearer ${token}`, Apptoken },
  });
}

function getRoutes({ endpoint, token }) {
  if (endpoint) {
    if (endpoint.includes('?')) {
      endpoint = `${endpoint}&language=${lang}`;
    } else {
      endpoint = `${endpoint}?language=${lang}`;
    }
  }
  return baseurl.get(endpoint, {
    headers: { Authorization: `Bearer ${token}`, Apptoken },
  });
}

function getTRPool({ endpoint, token }) {
  if (endpoint) {
    if (endpoint.includes('?')) {
      endpoint = `${endpoint}&language=${lang}`;
    } else {
      endpoint = `${endpoint}?language=${lang}`;
    }
  }
  return baseurl.get(endpoint, {
    headers: { Authorization: `Bearer ${token}`, Apptoken },
  });
}

function getBusinessUnitDepartmentUsers({ endpoint, token }) {
  if (endpoint) {
    if (endpoint.includes('?')) {
      endpoint = `${endpoint}&language=${lang}`;
    } else {
      endpoint = `${endpoint}?language=${lang}`;
    }
  }
  return baseurl.get(endpoint, {
    headers: { Authorization: `Bearer ${token}`, Apptoken },
  });
}

function getTruckRequest({ endpoint, token }) {
  if (endpoint) {
    if (endpoint.includes('?')) {
      endpoint = `${endpoint}&language=${lang}`;
    } else {
      endpoint = `${endpoint}?language=${lang}`;
    }
  }
  return baseurl.get(endpoint, {
    headers: { Authorization: `Bearer ${token}`, Apptoken },
  });
}

function getTransporters({ endpoint, token }) {
  if (endpoint) {
    if (endpoint.includes('?')) {
      endpoint = `${endpoint}&language=${lang}`;
    } else {
      endpoint = `${endpoint}?language=${lang}`;
    }
  }
  return baseurl.get(endpoint, {
    headers: { Authorization: `Bearer ${token}`, Apptoken },
  });
}

function searchTransporter({ value, token, customerId }) {
  try {
    const endpoint = `/partner/customer/${customerId}/search?searchTerm=${value}&language=${lang}`;
    return baseurl.get(endpoint, {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    });
  } catch (error) {
    console.log({ error });
  }
}

function searchAllTransporters({ value, token, customerId }) {
  try {
    const endpoint = `/partner/customer/${customerId}/search?new=1&searchTerm=${value}&language=${lang}`;
    return baseurl.get(endpoint, {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    });
  } catch (error) {
    console.log({ error });
  }
}

function getTransporterRoute({ endpoint, token }) {
  if (endpoint) {
    if (endpoint.includes('?')) {
      endpoint = `${endpoint}&language=${lang}`;
    } else {
      endpoint = `${endpoint}?language=${lang}`;
    }
  }
  try {
    return baseurl.get(endpoint, {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    });
  } catch (error) {
    console.log({ error });
  }
}

function searchAllTruckRegNos({ token, searchTerm, transporterId }) {
  try {
    const endpoint = `truck/search?partnerId=${transporterId}&searchTerm=${searchTerm}&language=${lang}`;
    return baseurl.get(endpoint, {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    });
  } catch (error) {
    console.log({ error });
  }
}

function getDrivers({ defaultEndpoint, token }) {
  if (defaultEndpoint) {
    if (defaultEndpoint.includes('?')) {
      defaultEndpoint = `${defaultEndpoint}&language=${lang}`;
    } else {
      defaultEndpoint = `${defaultEndpoint}?language=${lang}`;
    }
  }
  return baseurl.get(defaultEndpoint, {
    headers: { Authorization: `Bearer ${token}`, Apptoken },
  });
}

function getTrip({ endpoint, token }) {
  if (endpoint) {
    if (endpoint.includes('?')) {
      endpoint = `${endpoint}&language=${lang}`;
    } else {
      endpoint = `${endpoint}?language=${lang}`;
    }
  }
  return baseurl.get(endpoint, {
    headers: { Authorization: `Bearer ${token}`, Apptoken },
  });
}
function searchTransporterRoutes({ token, searchTerm, status, transporterId }) {
  try {
    const endpoint = `route/search?partnerId=${transporterId}&status=${status}&searchTerm=${searchTerm}&language=${lang}`;
    return baseurl.get(endpoint, {
      headers: { Authorization: `Bearer ${token}`, Apptoken },
    });
  } catch (error) {
    console.log({ error });
  }
}

export {
  useFetch,
  getBusinessProfile,
  getStates,
  getAddress,
  getLatLong,
  getCustomerMessage,
  getPolicyRequestByCustomer,
  getBusinessUnitsDepartments,
  getBusinessUnitResources,
  authorizeUser,
  getFilteredTableData,
  getRecipients,
  getUsers,
  getPickupLocations,
  getBusinessUnitDepartments,
  getRoutes,
  getBusinessUnitDepartmentUsers,
  getTruckRequest,
  getTransporters,
  searchTransporter,
  searchAllTransporters,
  searchAllTruckRegNos,
  getTRPool,
  getDrivers,
  getTrip,
  getTransporterRoute,
  searchTransporterRoutes,
  getUsersPolicyRequest,
  getCustomerPolicies
};
 
