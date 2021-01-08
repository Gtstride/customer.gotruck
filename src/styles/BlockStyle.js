import styled from 'styled-components';

const BlockStyle = styled.div`
  .blockHeader,
  .blockInfo > li {
    justify-content: space-between;
    align-items: center;
  }

  .blockHeader {
    margin-bottom: 30px;
  }

  .blockInfo > li:not(:last-of-type) {
    margin-bottom: 21px;
  }

  .blockTitle {
    font-size: 16px;
    text-transform: capitalize;
    font-weight: 600;
  }

  .emptyBlockMessage {
    font-size: 16px;
    font-weight: bold;
    text-transform: capitalize;
  }

  .blockActionBlock {
    display: flex;
  }

  .blockUpdateBtn {
    color: #29489b;
    font-size: 19px;
    background-color: transparent;
    display: flex;
    margin-right: 0;
    padding-right: 0;
    align-items: center;
  }

  .blockUpdateBtn > .blockActionIcon {
    margin-right: 6px;
  }

  .blockInfoTitle {
    font-size: 13px;
    color: #999999;
    flex: 2;
  }

  div.blockInfoSubtitle {
    font-size: 14px;
    flex: 3;
    text-align: right;
    margin-bottom: 10px !important;
    img {
      height: 70px;
    }
  }
  .blockInfoSubtitle,
  .remaining {
    font-size: 14px;
    font-family: var(--font-bold);
    flex: 3;
    text-align: right;
    line-height: 22px;
  }
  .remaining {
    color: #ff5151;
  }

  .blockInfoTitle,
  .blockInfoSubtitle {
    /* text-transform: capitalize; */
  }

  /* -------- continue here  */
  .tripInfoContent {
    display: grid;
    grid-template-columns: 1fr 300px;
    column-gap: 20px;
  }

  .tripBlocks {
    display: grid;
    column-gap: 20px;

    > div {
      display: grid;
      row-gap: 20px;
    }
  }

  .tripBlocksSidePane {
    /* background-color: white;
    box-shadow: 0px 0px 6px #00000029;
    padding: 10px;
    border-radius: 10px;
    right: 48.26px;
    height: 72vh; */

    > div:first-child {
      .card {
        margin-right: 0;
      }
    }
  }

  .block {
    margin-bottom: 20px;
    background-color: var(--white);
    border-radius: 4px;
    border: 1px solid #d4e5f9;
  }

  .block,
  .liveTracking {
    padding: 20px;
  }

  .recipientBlock {
    padding-bottom: 15px;
    &:not(:first-child) {
      border-top: 1px solid #dfd7d7;
      padding-top: 25px;
      padding-bottom: 15px;
    }

    :last-child {
      padding-bottom: 0;
    }

    .waybillActions {
      display: grid;
      grid-template-columns: 0.8fr 1fr;
      justify-content: space-around;
      margin-top: 1em;
      gap: 10px;

      .track {
        background-color: #d4daeb;
        color: #29489b;
      }

      .history {
        background-color: #d7f0e5;
        color: #36b37e;
      }

      button {
        padding: 10px;
        font-size: 1.2em;
        letter-spacing: 1.5px;
        cursor: pointer;
        border-radius: 4px;
        text-transform: uppercase;
      }

      .truncate {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .blockEmptyContentBlock {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 50px 0;

    .createAction {
      margin-top: 30px;
    }
  }

  [data-color='red'] {
    color: red;
  }

  .waybillNo {
    width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export default BlockStyle;
