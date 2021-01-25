import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { setItemInLocalStorage } from './browser';
import { baseurl, notAllowedSubDomain } from './fx';
import { environment } from './environment';
// import { Apptoken } from '../APIs/Read';
let userDataFromToken = {};
const sub = window.location.hostname.split('.')[0];

const setAuthToken = token => {
  if (token) {
    // 1. Apply to every request
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    // 1. Delete the Auth Header
    delete axios.defaults.headers.common['Authorization'];
  }
};

const setInterceptor = (axios, customerId) => {
  //add interceptor
  axios.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      //check the response status
      if (error.response && error.response.status === 401) {
        //clear the local storage
        logOut(customerId);
      }
      // Do something with response error
      return Promise.reject(error);
    },
  );
};

const logOut = customerId => {
  // 1. Remove specific customer token from localStorage
  localStorage.removeItem(`user-${customerId}`);

  // 2. Remove the Auth Header
  setAuthToken(false);

  // 3. Set the current user to an empty object
  window.location.href = '/';
};

const authUserAsIs = loginFormResponse => {
  const token = loginFormResponse.data.token;
  const { multiTenant } = environment(sub);
  let customerId;
  if (!notAllowedSubDomain().includes(sub)) {
    if (multiTenant) {
      customerId = 'app';
    } else {
      customerId = getCustomerIdFromToken(token);
    }
  } else {
    customerId = getCustomerIdFromToken(token);
  }
  // console.log({customerId})
  // 1. Set item in local storage
  setItemInLocalStorage(`user-${customerId}`, JSON.stringify(loginFormResponse.data));

  // 2. Set token to Auth Header
  setAuthToken(token);
};

// get identifier from token => rrenaame
const getCustomerIdFromToken = token => {
  let { customerId, accountName } = jwt_decode(token);
  //?? If "account name" is available, use it.
  if (accountName && accountName.length > 0) {
    customerId = accountName;
  }

  return customerId;
};

const getUserDetails = customerId => {
  const authToken = JSON.parse(localStorage[`user-${customerId}`]).token;
  const userDetailsFromLocalStorage = JSON.parse(localStorage[`user-${customerId}`]).user;

  const res = baseurl.post('/user/decodeToken', { token: authToken });

  res
    .then(data => {
      userDataFromToken = { ...userDataFromToken, ...data.data.data };
    })
    .catch(err => {
      console.log({ err });
    });

  return { ...userDetailsFromLocalStorage, ...userDataFromToken, token: authToken };
};

const getUserInfo = customerId => {
  const authToken = JSON.parse(localStorage[`user-${customerId}`]).token;

  return baseurl.get(`/user/${customerId}`, {
    // headers: { Authorization: `Bearer ${authToken}`, Apptoken },
  });
};

export { setAuthToken, logOut, getCustomerIdFromToken, getUserDetails, authUserAsIs, setInterceptor, getUserInfo };
