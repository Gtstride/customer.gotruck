import styled from 'styled-components';

const AllocatedTransportersStyle = styled.div`
  background-color: var(--white);
  border-radius: 4px;
  border: 1px solid #d4e5f9;
  padding: 20px;
  margin-bottom: 20px;

  .emptyBlock {
    padding: 30px;
    display: flex;
    justify-content: center;
    align-content: center;
  }

  .emptyBlockMessage {
    font-size: 16px;
    font-weight: bold;
    text-transform: capitalize;
  }
  .heading {
    display: flex;
    justify-content: space-between;
  }

  .title {
    font-size: 16px;
    text-transform: capitalize;
    font-family: var(--font-bold);
  }

  .downloadBtn {
    display: flex;
    align-items: center;

    .buttonText {
      margin-left: 8px;
      font-size: 16px;
      color: #29489b;
    }
  }

  .head {
    display: grid;
    grid-template-columns: 2fr 2fr 1fr auto;
    align-items: center;
    gap: 10px;
    font-size: 1.4em;
    margin-top: 1em;
  }

  .transporters {
    display: grid;
    row-gap: 20px;
    margin-top: 25px;

    .row {
      overflow: hidden;
    }

    .row.active {
      overflow: unset;
    }

    .rowHeader {
      display: grid;
      grid-template-columns: 2fr 1fr auto 2fr auto;
      align-items: center;
      gap: 10px;
    }

    .bulkRow {
      display: grid;
      grid-template-columns: 1fr 2fr auto auto;
      align-items: center;
      gap: 10px;
      font-size: 1.4em;
      .partnerName {
        font-size: 0.9em;
      }
      .view {
        cursor: pointer;
      }
    }

    .bulkRow:nth-child(2n + 1) {
      background-color: #f6f7f9;
      padding: 0.8em;
    }

    .name,
    .trucksCount,
    .assignTruckAction {
      font-size: 15px;
      padding: 0;
    }

    .name {
      color: #999999;
    }

    .trucksCount {
      color: #38b37f;
    }

    .assignTruckAction {
      color: #6f84bc;
    }

    .accordionTruck {
      padding: 0;
      svg {
        transition: 0.2s;
      }
      &.active {
        svg {
          transform: rotate(180deg);
        }
      }
    }

    .rowDetails {
      max-height: 0;
      .rowDetail {
        margin-top: 15px;
        display: grid;
        gap: 10px;
        grid-template-columns: 1fr 1fr 50px 1fr;
        color: black;
        align-items: center;

        * {
          color: inherit;
          font-family: inherit;
        }

        .asset,
        .mobile {
          font-size: 13px;
          margin-top: 8px;
        }

        .setAct,
        .delete {
          padding: 0;
        }

        .setAct {
          background: #23a4d7;
          color: white;
          font-size: 12px;
          padding: 7px 5px;
          text-transform: uppercase;
        }
      }

      .acceptedRow {
        margin-top: 15px;
        display: grid;
        gap: 10px;
        grid-template-columns: 1fr 1fr 1fr;
        color: black;
        align-items: center;

        * {
          color: inherit;
          font-family: inherit;
        }

        .asset,
        .mobile {
          font-size: 13px;
          margin-top: 8px;
        }

        .setAct,
        .delete {
          padding: 0;
        }

        .setAct {
          background: #36b37e;
          color: white;
          font-size: 12px;
          padding: 7px 5px;
          text-transform: uppercase;
        }
      }
    }

    .row.active .rowDetails {
      max-height: 100%;
    }
  }
`;

export default AllocatedTransportersStyle;
