import axios from 'axios';
import { logOut } from './auth';

// 1. Function to get UUID
const uuid = (seed = 100) =>
  Math.random()
    .toString(36)
    .substring(2, 2 + seed);

// 2. Function to sort array of object by their string property
// Pass in the 1. array, 2. prop to sort with, 3. order
function sortArrayofObjectsByStringProp(array, prop, order = 'asc') {
  let sorted = array.sort((a, b) => (a[prop].toUpperCase() > b[prop].toUpperCase() && 1) || -1 || 0);

  return order === 'asc' ? sorted : sorted.reverse();
}

// 2. Function to sort array of object by their string prop
function sortArrayofObjectsByNumberProp(array, prop, order = 'asc') {
  let sorted = array.sort((a, b) => (a[prop] > b[prop] && 1) || -1 || 0);

  return order === 'asc' ? sorted : sorted.reverse();
}

// 3. Axios baseURL
// You can add the token headers here.
const baseurl = axios.create({
  baseURL: `${process.env.REACT_APP_ENDPOINT}`,
});

const insuranceUrl = axios.create({
  baseURL: `${process.env.REACT_APP_INSURANCE_URL}`,
});

// 3. Axios baseURL
// You can add the token headers here.
const dataUrl = axios.create({
  baseURL: `${process.env.REACT_APP_DATA_URL}`,
});

// 4. Remove duplicate items from an array
const dedupe = array => {
  return [...new Set(array)];
};

// 5. Acts as "optional chaining" => https://bit.ly/2QlTg1d
// :) This is fragile and only works for specific use cases...
// asin when you need to access a deeply nested object.
// Unit test is currently passing.
// Confused? Use the link above or call Mr Adebiyi: 07063821111
function getObjectProp(path = [], object = {}) {
  const propValue = path.reduce((prev, next) => {
    if (prev && prev[next]) {
      return prev[next];
    } else {
      return undefined;
    }
  }, object);

  return propValue;
}

// 6. returns a random integer between the specified values.
// The value is no lower than min(or the next integer greater
// than min if min isn't an integer), and is less than
// (but not equal to) max.
function getRandomInteger(min = 100, max = 5000) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// 7. Format price
function formatPrice(price) {
  // return parseInt(price.toLocaleString());
  return price.toLocaleString();
}

// 8. Returns a styled dash
function getDash(count = 1) {
  return '—'.repeat(count);
}

// 9. Remove last letter in a word
function chopOffLastLetter(word) {
  return word.slice(0, word.length - 1);
}

// 10. Returns true/false if an array is empty
function isArrayEmpty(array) {
  return array && array.length === 0;
}

// 11. Capitalize first letter of each word in a string
function capitalizeFirstLetter(string) {
  // if (string.split(' ').length > 1) {
  //   const newString = string.split(' ').map(str => {

  //     return str.replace(str[0], str[0].toUpperCase());
  //   });

  //   return newString.join(' ');
  // }
  return string ? string.replace(/(^\w|\s\w)(\S*)/g, (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase()) : '';
}

// 12. Sets the Global nav bar details
function setGlobalNavBarDetails(details, fx) {
  fx(details);
}

// 13.
function calcTimeToReadInSeconds(text) {
  if (!text) return 0;

  const averageReadingTime = 200;
  const textLength = text.length;
  const timeInMinutes = textLength / averageReadingTime;
  let timeInSeconds;

  if (timeInMinutes < 1) {
    timeInSeconds = Math.round(timeInMinutes * 60);
  } else {
    timeInSeconds = timeInMinutes;
  }

  return timeInSeconds * 300;
}

// 14.Returns if a value is an object
function isObject(value) {
  return value && typeof value === 'object' && value.constructor === Object;
}

// 15. Confirms if object is empty or not
function isObjectEmpty(obj) {
  return Object.entries(obj).length === 0 && obj.constructor === Object;
}

// 16. Merge object into array without mutating it
function mergeObjectIntoArray(originalArray, newObject, newObjectOptionalProps = null) {
  if (newObjectOptionalProps) {
    return [
      ...originalArray,
      {
        ...newObject,
        ...newObjectOptionalProps,
      },
    ];
  }
  return [...originalArray, newObject];
}

// Filter array
function removeObjectFromArray(originalArray, staleObjectId) {
  return originalArray.filter(item => item.id !== staleObjectId);
}

// 18. Log to console
function log(key, what) {
  console.group(key);
  console.log(key, what);
  console.groupEnd();
}

// 08/01/2019 -> newly added recipient contains an address <string>
// and addresses <[]>. If the addresses exist, use the address
// property of the first address. Else, use the address <string>
function switchRecipientAddress(addresses = []) {
  // Do we have at least an address in the address array?
  // If yes, use the first one... if no, do nothing
  if (!isArrayEmpty(addresses)) {
    return addresses[0].address;
  }

  return undefined;
}

// 16.
function getCountry(address_components) {
  for (let i = 0; i < address_components.length; i += 1) {
    let addressObj = address_components[i];
    for (let j = 0; j < addressObj.types.length; j += 1) {
      if (addressObj.types[j] === 'country') {
        return {
          country: addressObj.long_name,
          code: addressObj.short_name,
        };
      }
    }
  }
}

// 17. convert file size to KB, MB, ...
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// 18. Get query params from url
function getParams(url) {
  var params = {};
  var parser = document.createElement('a');
  parser.href = url;
  var query = parser.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    params[pair[0]] = decodeURIComponent(pair[1]);
  }
  return params;
}

// 19. Returns truth if all arraus passed to it is empty
function isArraysEmpty(...args) {
  return args.every(arg => arg.length > 0);
}

export function formatCurrency(amount) {
  if (amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } else {
    return amount;
  }
}

export function formatImage(path, size = 'r500x500') {
  if (path) {
    if (path.includes('r200x200')) {
      let parts = path.split('r200x200');
      return `${parts[0]}${size}${parts[1]}`;
    } else {
      return path;
    }
  }
}

const fileSizeWithLimit = size => {
  let fSExt = ['Bytes', 'KB', 'MB', 'GB'],
    i = 0;
  while (size > 900) {
    size /= 1024;
    i++;
  }
  return Math.round(size * 100) / 100 + ' ' + fSExt[i];
};

// returns true if value is null or undefined
function isVariableNullOrUndefined(variable) {
  const isNull = String(variable) === 'null';
  const isUndefined = String(variable) === 'undefined';
  const isNullOrUndefined = isNull || isUndefined;
  return (isNullOrUndefined && true) || false;
}

function to24Hrs(time) {
  const [mTime, modifier] = time.split(' ');

  let [hours, minutes] = mTime.split(':');

  if (hours === '12') {
    hours = '00';
  }

  if (modifier === 'pm') {
    hours = parseInt(hours, 10) + 12;
  }

  return `${hours}:${minutes}`;
}

function phoneFormatter(number, phone_code = '+234', leading_zero = false, plus = true) {
  number = number.trim();
  number = number.replace('+', '');
  number = number.replace(/[^0-9]/gi, '');
  phone_code = phone_code.replace('+', '');
  let regex = new RegExp(`^(${phone_code})+`, 'i');
  number = number.replace(regex, phone_code);
  regex = new RegExp(`^${phone_code}`, 'i');
  if (regex.test(number)) {
    number = `${number.substr(phone_code.length)}`;
  }
  if (!leading_zero) {
    number = number.replace(/^0+/, '');
  }
  number = `${phone_code}${number}`;
  if (plus) {
    number = `+${number}`;
  }
  return number;
}

function notAllowedSubDomain() {
  return ['localhost', 'dev', 'stage', 'customer', 'web'];
}

function formatNumber({ amount }) {
  const naira = new Intl.NumberFormat('ng', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  });

  return naira.format(amount);
}
export function addCommas(num) {
  if (num) return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  return 0;
}

function getRandomPassword(length = 8) {
  var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var result = '';
  for (var i = 0; i < length; i++) {
    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
}

const lang = (localStorage.i18nextLng && localStorage.i18nextLng.split('-')[0]) || 'en';

const isNotEmptyArray = arr => Array.isArray(arr) && arr.length > 0;

export {
  uuid,
  sortArrayofObjectsByStringProp,
  sortArrayofObjectsByNumberProp,
  baseurl,
  dataUrl,
  insuranceUrl,
  dedupe,
  getObjectProp,
  getRandomInteger,
  formatPrice,
  getDash,
  chopOffLastLetter,
  isArrayEmpty,
  capitalizeFirstLetter,
  setGlobalNavBarDetails,
  calcTimeToReadInSeconds,
  isObject,
  isObjectEmpty,
  mergeObjectIntoArray,
  log,
  switchRecipientAddress,
  removeObjectFromArray,
  getCountry,
  formatBytes,
  getParams,
  isArraysEmpty,
  isVariableNullOrUndefined,
  to24Hrs,
  phoneFormatter,
  fileSizeWithLimit,
  notAllowedSubDomain,
  formatNumber,
  getRandomPassword,
  logOut,
  lang,
  isNotEmptyArray,
};
