import styled from 'styled-components';
import logo from '../assets/icons/logo.svg';
import home from '../assets/icons/home2.svg';
import dashboard from '../assets/icons/dashboard.svg';
import battlefield from '../assets/icons/battlefield.svg';
import trips from '../assets/icons/trips.svg';
import orders from '../assets/icons/orders.svg';
import routes from '../assets/icons/routes.svg';
import truckPool from '../assets/icons/truckPool.svg';
import truckRequest from '../assets/icons/truckRequest.svg';
import invoices from '../assets/icons/invoices.svg';
import policy from '../assets/icons/invoices.svg';
import addPolicy from '../assets/icons/truckRequest.svg';
import support from '../assets/icons/support.svg';
import businessProfile from '../assets/icons/businessProfile.svg';
import businessUnit from '../assets/icons/businessUnit.svg';
import generalSettings from '../assets/icons/generalSettings.svg';
import pickupLocation from '../assets/icons/pickupLocation.svg';
import recipient from '../assets/icons/recipient.svg';
import logout from '../assets/icons/logout.svg';
import transporter from '../assets/icons/transporter.svg';
import taxiDriver from '../assets/icons/taxi-driver.svg';
import incident from '../assets/icons/incident.svg';
import notificationLink from '../assets/icons/notification-link.svg';

const SideNavStyle = styled.section`
  --logo-height: 25px;
  --left-space: 20px;
  top: 0;
  height: 100vh;
  display: flex;
  overflow: hidden;
  user-select: none;
  flex-direction: column;
  min-width: var(--sidenav-min-width);
  background-color: var(--blue);
  left: 0;
  z-index: 3;
  width: var(--sidenav-min-width);
  position: fixed;

  .logo {
    display: flex;
    flex-direction: column;
    padding: 20px 0;
    padding-left: var(--left-space);
    color: var(--side-bar-white-color);
  }

  .logo > * {
    color: inherit;
    font-weight: 200;
    text-transform: uppercase;
  }

  .logo > .customerId {
    font-size: 15px;
    opacity: 0.5;
    margin-top: 3px;
  }

  .logo > .site {
    width: 65px;
    height: var(--logo-height);
    background-repeat: no-repeat;
    background-image: url(${logo});
    display: inline-block;
  }

  .logo > .title {
    font-size: 20px;
    font-weight: 500;
    text-decoration: none;
    line-height: calc(var(--logo-height) - 5px);
    padding-left: 4px;
  }

  .nav-border {
    width: 100%;
    height: 1px;
    background-color: #4864b0;
  }

  .nav-sidenav {
    flex: 1;
    padding: 10px 0 45px;
    overflow-y: auto;
  }

  .nav-sidenav h1.navItem {
    font-size: 15px;
    color: var(--side-bar-white-color);
    line-height: 36px;
    font-weight: 200;
    transition: 0.2s ease-in;
  }

  .nav-sidenav h1.navItem:not([data-role='navItemsTitle']):hover {
    color: var(--yellow);
  }

  .nav-sidenav a.item-link,
  .pref-block > h1.pref-item > span {
    background-repeat: no-repeat;
    background-size: 16px 16px;
    color: inherit;
    text-decoration: none;
    padding-left: 50px;
    display: block;
    background-position: var(--left-space) 9px;
  }

  .nav-sidenav a.item-link::first-letter {
    text-transform: uppercase;
  }

  .nav-sidenav a.item-link-selected {
    color: var(--yellow);
  }

  .navItems:not(:first-of-type) {
    margin: 20px 0px 0px;
  }

  .navItem:first-child:not([data-item='dashboard']) {
    padding-left: var(--left-space);
    color: #6c81ba !important;
  }

  [data-role='navItemsTitle'] {
    font-family: Avenir-bold;
    color: #fafafa !important;
    font-size: 13px !important;
    text-transform: uppercase;
  }

  #sidenav div.pref-block [data-pref-for='account'] {
    display: flex;
    padding: 10px 0;
    border-top: 1px solid rgba(120, 134, 156, 0.08);
  }

  #sidenav div.pref-block [data-pref-for='account'] .user-info {
    line-height: 1.5;
  }

  #sidenav div.pref-block [data-pref-for='account'] > img {
    --dimension: 28px;
    width: var(--dimension);
    height: var(--dimension);
    border: 1px solid slategrey;
    border-radius: 50%;
    margin-right: 5px;
  }

  h1[data-item='home'] > a.item-link {
    background-image: url(${home});
  }

  h1[data-item='dashboard'] > a.item-link {
    background-image: url(${dashboard});
  }

  h1[data-item='battlefield'] > a.item-link {
    background-image: url(${battlefield});
  }

  h1[data-item='trips'] > a.item-link {
    background-image: url(${trips});
  }

  h1[data-item='orders'] > a.item-link {
    background-image: url(${orders});
  }

  h1[data-item='routes'] > a.item-link {
    background-image: url(${routes});
  }

  h1[data-item='incomingTrucks'] > a.item-link {
    background-image: url(${truckPool});
  }

  h1[data-item='truckRequest'] > a.item-link {
    background-image: url(${truckRequest});
  }

  h1[data-item='invoices'] > a.item-link {
    background-image: url(${invoices});
  }

  h1[data-item='insurance'] > a.item-link {
    background-image: url(${invoices});
  }

  h1[data-item='waybillTracker'] > a.item-link {
    background-image: url(${invoices});
  }

  h1[data-item='support'] > a.item-link {
    background-image: url(${support});
  }

  h1[data-item='businessProfile'] > a.item-link {
    background-image: url(${businessProfile});
  }

  h1[data-item='businessUnit'] > a.item-link {
    background-image: url(${businessUnit});
  }

  h1[data-item='generalSettings'] > a.item-link {
    background-image: url(${generalSettings});
  }
   
  h1[data-item='incidentManagement'] > a.item-link {
    background-image: url(${incident});
  }
    
  h1[data-item='notifications'] > a.item-link {
    background-image: url(${notificationLink});
  }

  h1[data-item='drivers'] > a.item-link {
    background-image: url(${taxiDriver});
  }

  h1[data-item='trucks'] > a.item-link {
    background-image: url(${businessUnit});
  }

  h1[data-item='manageUsers'] > a.item-link {
    background-image: url(${recipient});
  }

  h1[data-item='policy'] > a.item-link {
    background-image: url(${policy});
  }

  h1[data-item='addPolicy'] > a.item-link {
    background-image: url(${addPolicy});
  }

  h1[data-item='pickupLocation'] > a.item-link {
    background-image: url(${pickupLocation});
  }

  h1[data-item='recipient'] > a.item-link {
    background-image: url(${recipient});
  }

  h1[data-item='logout'] > a.item-link {
    background-image: url(${logout});
  }

  h1[data-item='transporters'] > a.item-link {
    background-image: url(${transporter});
  }

  .languageSwitcherBlock {
    padding: 14px;

    .popupTriggerBtn {
      color: white;
      text-transform: uppercase;
      border: 1px solid #adb7d0;
      padding: 10px;
      width: 70%;
      border-radius: 2px;
    }

    .languageSwitcherLabel {
      font-size: 12px;
      margin-right: 8px;
      /* font-family: var(--font-bold); */
    }

    .popupBlock {
      position: absolute;
      background-color: white;
      box-shadow: 0px 2px 8px #00000022;
      left: 15px;
      width: 186px;
      bottom: 64px;
      text-align: center;
      visibility: hidden;

      transform: rotate3d(1, 1, 0, 15deg);
      transform-origin: 0 100%;
      opacity: 0;
      will-change: transform, opacity;
      transition-property: transform, opacity, -webkit-transform;
      transition-duration: 0.25s;

      &.active {
        transform: none;
        opacity: 1;
        pointer-events: auto;
        visibility: visible;
      }

      li {
        &:hover,
        #selected {
          background-color: #f4f2f0;
        }
        > * {
          padding: 10px;
          cursor: pointer;
          border-radius: 5px;
          color: #000;
          display: block;
          font-size: 14px;
          height: 50px;
          display: flex;
          align-items: center;
        }
      }
    }
  }

  .learnMoreBlock {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    a {
      display: flex;
      padding: 14px;
      background: #6b89d9;
      align-items: center;
      flex: 1;
    }

    .icon {
      width: 24px;
      height: 24px;
      display: inline-block;
      margin-right: 8px;

      svg {
        fill: white;
      }
    }

    .text {
      font-size: 15px;
      color: white;
    }
  }
`;

export default SideNavStyle;
