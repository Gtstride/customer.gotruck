import { capitalizeFirstLetter } from './fx';

// 1. Set the current document title
function setDocumentTitle(customerId, customTitle) {
  // const defaultTitle = 'Kobo 360 - Customer';
  // document.title = `${defaultTitle} - ${customTitle}`;
  document.title = `${customerId} - ${capitalizeFirstLetter(customTitle)}`;
}

// 2. Set item in localStorage
function setItemInLocalStorage(itemName, item) {
  // localStorage.setItem(itemName, JSON.stringify(item));
  localStorage.setItem(itemName, item);
}

// 3. Remove Item from localStorage
function removeItemFromLocalStorage(itemName) {
  localStorage.removeItem(itemName);
}

// 4. Get item from localStorage
function getItemFromLocalStorage(itemName) {
  return JSON.parse(localStorage.getItem(itemName));
}

export { setDocumentTitle, setItemInLocalStorage, removeItemFromLocalStorage, getItemFromLocalStorage };
