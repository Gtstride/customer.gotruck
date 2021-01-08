import styled, { css } from 'styled-components';

const MainAppStyle = styled.div`
  ${props =>
    props.dir === 'rtl' &&
    css`
      #sidenav {
        margin-left: calc(100% - var(--sidenav-min-width));
      }

      #content {
        padding-left: 0;
        padding-right: var(--sidenav-min-width);
      }

      .logo {
        padding-left: 0;
        padding-right: var(--left-space);
      }

      .languageSwitcherBlock .languageSwitcherLabel,
      .profileAvatarBlock .profileAvatar {
        margin-right: 0;
        margin-left: 10px;
      }

      .nav-sidenav a.item-link,
      .pref-block > h1.pref-item > span {
        background-repeat: no-repeat;
        background-size: 16px 16px;
        color: inherit;
        text-decoration: none;
        padding-left: 0;
        padding-right: 50px;
        display: block;
        background-position: calc(100% - var(--left-space)) 9px;
      }

      .nav-sidenav a.item-link-selected {
        color: var(--yellow);
      }

      .navItem:first-child:not([data-item='dashboard']) {
        padding-right: var(--left-space);
        padding-left: 0;
      }

      .card {
        margin-right: 0;
        margin-left: 20px;
        /* flex-direction: row-reverse;
        justify-content: flex-end; */

        .cardIconBlock {
          margin-left: 10px;
        }
      }

      .cardIconBlock {
        margin-left: 10px;
      }

      thead th {
        text-align: right;
      }

      .tableItem .tableItemLeft {
        margin-left: 15px;
        margin-right: 0;
      }

      .actionIcon.add,
      .actionIcon.cancel {
        margin-left: 9px;
        margin-right: 0;
      }

      .leftActions .actionIcon {
        margin: 2px 0 0 5px;
      }

      [data-table-for*='truckrequest'] .TotalTruckRequestColumn .requestUnit {
        margin-right: 5px;
        margin-left: 0;
      }

      .removeTransporterButton .buttonText {
        margin-left: 0;
        margin-right: 15px;
      }

      .searchBlock {
        margin-left: 0;
        margin-right: 30px;
        padding-right: 17px;
        padding-left: 0;
      }

      [data-table-for*='recipients'] #tableContent .tableItem button {
        text-align: right !important;
      }

      [data-table-for*='recipients'] #tableContent .tableItem span {
        margin-left: 0;
        margin-right: 10px;
      }

      .profileCtaBlock {
        .actionText {
          text-align: right;
        }
      }

      .middleContent .generalInfoBlock .editButton {
        padding-left: 0;

        .icon {
          margin-right: 0;
          margin-left: 5px;
        }
      }

      .blockInfoSubtitle {
        text-align: left;
      }

      .block {
        padding: 17px !important;
      }

      img[alt='go back'] {
        transform: rotateX(0deg) rotateY(180deg);
      }

      .tripStatusBlock .tripWaybillIcon img {
        margin-right: 0 !important;
        margin-left: 20px;
      }

      .orderActionBlock .buttonIcon,
      .orderEditActionBlock .buttonIcon {
        margin-right: 0 !important;
        margin-left: 10px;
      }

      .orderStatusBlock .halo,
      .truckRequestStatusBlock .halo {
        margin-right: 0 !important;
        margin-left: 10px;
      }

      .tripWaybillBlock .tripWaybillIcon {
        margin-right: 0 !important;
        margin-left: 20px;
      }

      .tripActionsBlock button {
        text-align: right !important;
      }

      .filter__block {
        right: 0;
        top: 41px;
      }

      #createNewTripRoute .routeBlock input[type*='radio'],
      #navButtonsBlock button.next .buttonText,
      #createNewTripRoute .isContainerTripBlock .isContainerTrip {
        margin-right: 0 !important;
        margin-left: 10px !important;
      }

      #createNewTripRoute .isContainerTripBlock input[type='radio'],
      #createNewTripRoute.isContainerEmptyBlock input[type='radio'] {
        margin-left: 10px !important;
      }

      .countryPopupItemWrap > p,
      .popupItemWrap > p {
        margin-left: 0;
        margin-right: 12px;
      }

      .buttonText {
        margin-left: 0;
        margin-right: 10px;
      }

      #createNewTripRoute button.next {
        margin-left: 0 !important;
        margin-right: auto !important;
      }

      .recipientOrderDetailBlock .blockTitle {
        margin-right: 0 !important;
        margin-left: auto !important;
      }

      .recipientOrderDetailBlock .blockLabel {
        margin-right: 0 !important;
        margin-left: 20px !important;
      }

      .errorMessageBlock .errorMessage {
        margin-left: 0 !important;
        margin-right: 9px !important;
      }

      .middleContent .userInfoBlock button.editButton {
        padding-left: 0 !important;
      }

      .select-arrow {
        right: unset !important;
        left: 24px !important;
      }

      .TotalTruckRequestColumn .tableItem {
        flex-wrap: wrap;

        .total,
        .unallocated {
          margin: 5px 5px 0 0 !important;
        }
      }

      #navButtonsBlock {
        .next .buttonIcon {
          transform: rotate(180deg);
        }
        .previous .buttonIcon {
          transform: rotate(360deg) !important;
        }
      }

      #tableFooter {
        div:first-child {
          transform: rotate(180deg);
        }
        div:last-child {
          transform: rotate(180deg);
        }
      }

      #createNewTripRoute .select-wrap .truckInfo .truckType {
        margin-right: 16px;
        margin-left: 0;
      }

      .prevArrow {
        transform: rotate(180deg) !important;
      }

      .nextArrow {
        transform: none !important;
      }

      .businessAccountInfo {
        div.infoPart::before {
          right: -12px !important;
          left: unset !important;
        }
      }
    `}
`;

export default MainAppStyle;
