import styled from 'styled-components';

const InvoiceStyle = styled.section`
  .invoiceBlocksSidePane {
    background-color: white;
    box-shadow: 0px 0px 6px #00000029;
    padding: 20px;
    border-radius: 10px;
    /* position: fixed; */
    right: 48.26px;
    height: 100%;
    width: 364px;
  }
  grid-template-columns: 1fr 364px;
  column-gap: 20px;

  .blocks {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .blocksBlock {
    gap: 20px;
  }

  .blocksBlock,
  .blocksBlock > div {
    grid-template-columns: 1fr 1fr;
  }

  .blockInfoSidePane {
    background-color: white;
    box-shadow: 0px 0px 6px #00000029;
    padding: 30px 11px 11px;
    position: fixed;
    right: 48.26px;
    bottom: 20px;
    top: 120px;
    width: 364px;
    overflow: scroll;
  }

  .block,
  .liveTracking {
    border-radius: 4px;
    border: 1px solid #d4e5f9;
    background-color: white;
    padding: 20px 40px;
  }

  .blockHeader,
  .blockInfo > li {
    justify-content: space-between;
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

  .blockUpdateBtn {
    color: #29489b;
    font-size: 19px;
    background-color: transparent;
    display: flex;
    align-items: center;
  }

  .blockUpdateBtn > .blockActionIcon {
    margin-right: 6px;
  }

  .blockInfoTitle {
    font-size: 13px;
    color: #999999;
  }

  .blockInfoSubtitle {
    font-size: 14px;
    font-family: var(--font-bold);
  }

  .blockInfoTitle,
  .blockInfoSubtitle {
    /* text-transform: capitalize; */
  }

  /* remove this */
  .liveTracking {
    height: 324px;
  }

  .tripStatusBlock {
    border-top: 2px solid #00000029;
    border-bottom: 2px solid #00000029;
  }

  .tripStatusBlock,
  .waybillsBlock {
    margin-top: 30px;
    padding: 20px 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .tripStatusInfoBlock {
      flex: 2;
      margin-left: 15px;
    }

    .tripStatusIcon,
    .waybillsIcon {
      width: 17px;
      height: 17px;
      border-radius: 50%;
      background-color: #f9ac19;
    }

    .tripStatusIcon {
      margin-right: 15px;
    }

    .tripStatusLabel,
    .waybillsLabel {
      color: #999999;
      font-size: 14px;
      margin-bottom: 5px;
    }

    .tripStatus {
      color: #000000;
      font-size: 18px;
      font-family: var(--font-bold);
    }

    .tripStatus::first-letter {
      text-transform: uppercase;
    }

    .tripStatusDate {
      color: #3c3c3c;
      font-size: 14px;
    }
  }

  .waybillsBlock {
    justify-content: unset;
    margin-top: 0;

    .waybillsIcon {
      width: 35px;
      height: 35px;
      background-color: #d7f0e5;
    }
  }

  .logIssues {
    .waybillsIcon {
      background-color: #feeed1;
    }
  }
  .waybillsLabel {
    font-family: var(--font-bold);
    font-size: 18px !important;
  }

  .waybillsLabel::first-letter {
    text-transform: uppercase;
  }
`;

export default InvoiceStyle;
