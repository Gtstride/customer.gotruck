import styled from 'styled-components';

const TableStyle = styled.div`
  color: #282a3c;
  border-radius: 10px;
  background-color: var(--white);

  .table-wrap {
    border: 1px solid #d4e5f9;
    border-radius: 5px;
    background-color: #f7fafc;
    font-size: 16px;
  }

  table {
    width: 100%;
    max-width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }

  .tableHeaderRow {
    background-color: #eff5fc;
    box-shadow: #d4e5f9 0px -1px inset;
  }

  a {
    display: block;
    height: 100%;
  }

  p {
    --font-bold: 'Avenir-bold';
    font-family: var(--font-bold) !important;
  }

  thead th {
    padding: 14px 16px;
    text-align: left;
  }

  #tableHeader {
    transition: 0.2s;
    top: 80px;
  }

  .tableTitle {
    color: #282a3c;
    font-family: var(--font-bold);
    font-size: 16px;
  }

  tbody {
    font-size: 14px;
  }

  tbody .secColor {
    color: var(--blue);
  }

  tbody td {
    box-shadow: inset 0 -1px #e3e8ee;
    height: 100%;
  }

  tbody td > *:first-child {
    padding: 16px;
    height: 100%;
    display: flex;
    word-break: break-word;
    align-items: center;
  }

  tbody mark {
    color: var(--blue);
    background-color: transparent;
    font-style: italic;
    font-family: var(--font-bold);
  }

  tbody .smallFont {
    font-size: 12px;
  }

  tbody tr {
    transition: 0.2s ease-out;
    cursor: pointer;
    height: 100%;
  }

  tbody tr:hover {
    background-color: #eff5fc;
  }

  tbody tr.noClick:hover {
    cursor: initial;
  }

  tbody .tableItem.flex {
    display: flex;
    align-items: center;
  }

  .tableTitle {
    text-transform: uppercase;
    font-size: 14px;
  }

  .tableItem .tableItemRight:not(.tableItemLastCol) {
    width: 42px;
    height: 34px;
    border-radius: 16px;
    color: #36b37e;
    font-family: var(--font-bold);
    background-color: #d7f0e5;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .tableItem .tableItemLeft {
    margin-right: 15px;
  }

  .statusHalo {
    --dimension: 9px;
    width: var(--dimension);
    height: var(--dimension);
    background-color: #36b37e;
    border-radius: 50%;
  }

  .statusAvailable {
    --dimension: 9px;
    width: var(--dimension);
    height: var(--dimension);
    background-color: var(--yellow) !important;
    border-radius: 50%;
  }
  .statusRedo {
    --dimension: 9px;
    width: var(--dimension);
    height: var(--dimension);
    background-color: #ff1515;
    border-radius: 50%;
  }

  a {
    color: unset;
    color: var(--blue);
  }

  #tableFooter {
    padding: 20px;
    text-align: right;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 13px;
  }

  .currentPage {
    background-color: var(--white);
    border: 1px solid #00000029;
    padding: 0.2em;
  }

  /* Trips */
  [data-table-for*='trips'] {
    [data-table-heading*='trip'] {
      width: 15%;
    }
    [data-table-heading*='waybill'] {
      width: 13%;
    }
    [data-table-heading*='route'] {
      width: 25%;
    }
    [data-table-heading*='price'] {
      width: 12%;
    }
    [data-table-heading*='driver'] {
      width: 15%;
    }
    [data-table-heading*='truck'] {
      width: 10%;
    }
    [data-table-heading*='recipient'] {
      width: 16%;
    }
    [data-table-heading*='status'] {
      width: 15%;
    }
  }

  .tripsDriverColumn .tableItem,
  .tripsRecipientColumn .tableItem {
    justify-content: space-between;
    flex: 1;
  }

  /* Orders */
  [data-table-for*='orders'] {
    [data-table-heading*='route'] {
      width: 25%;
    }

    .ordersRecipientColumn {
      .tableItemRight {
        color: white;
      }
    }
  }

  /* Routes */
  [data-table-for*='routes'] {
    > thead tr th:first-child {
      width: unset;
    }

    [data-table-heading*='route'] {
      width: 30%;
    }

    [data-table-heading*='actions'] {
      width: 10%;
    }

    #tableContent {
      .RouteColumn .tableItem {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  }

  /* Truck Pool */
  [data-table-for*='truckpool'] {
    .DriverColumn .tableItem {
      flex-direction: column;
      align-items: flex-start;
    }

    .RegNoColumn .tableItem {
      display: flex;
    }

    [data-table-heading*='reg no'] {
      width: 10%;

      + [data-table-heading] {
        width: 10%;
      }
    }
  }

  [data-table-for*='truckrequest'] {
    [data-table-heading*='customer'] {
      + [data-table-heading] {
        width: 10%;
      }
    }

    .TotalTruckRequestColumn {
      .total,
      .totalAll,
      .full,
      .partial,
      .unallocated {
        color: white;
        margin-right: 10px;
        padding: 5px;
        font-family: var(--font-bold);
        border-radius: 3px;
        font-size: 0.8em;
        flex: 1;
        display: flex;
        min-width: 53px;
        justify-content: center;
      }

      .totalAll {
        background-color: #29489b;
      }

      .full,
      .total {
        background-color: #36b37e;

        .requestedQuantity {
          text-transform: uppercase;
        }
      }

      .partial {
        background-color: #f9ac1b;
        text-transform: uppercase;
      }

      .unallocated {
        background-color: #ff5151;
      }

      .requestUnit {
        margin-left: 5px;
      }
    }
  }

  [data-table-for*='incomingtrucks'] .RequestTypeColumn,
  [data-table-for*='truckrequest'] .RequestTypeColumn {
    .requestTypeBlock {
      height: auto;
      padding: 5px;
      background-color: tomato;
      line-height: 1;
      text-transform: uppercase;
      font-family: var(--font-bold);
      border-radius: 3px;
      display: inline-block;
    }

    .fmcg,
    .regular {
      background-color: #cfeae2;
      color: #36b37e;
    }

    .container {
      background-color: #ccd4e8;
      color: #3653a1;
    }

    .bulk {
      background-color: #f6e8ce;
      color: #f9ac19;
    }
  }

  .rowAction {
    display: flex;
    align-items: center;

    .actionBlock {
      margin-right: 1px;
    }

    .actionBlock:first-child {
      margin-left: 0;
    }

    button {
      background-color: transparent;
    }
  }

  [data-table-for*='csvUploadStatus'] {
    [data-table-heading*='file name'] {
      width: 40%;
    }
  }

  .routeTag {
    text-transform: uppercase;
    background: var(--green);
    color: white;
    padding: 4px 5px;
    display: inline-block;
    border-radius: 10px;
    font-size: 10px;
  }

  .removeTransporterButton {
    display: flex;
    padding: 0;
    align-items: center;

    .buttonText {
      color: #657bb7;
      font-size: 18px;
      margin-left: 15px;
    }
  }
`;

export default TableStyle;
