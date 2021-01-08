import styled from 'styled-components';

const OrderDetailStyle = styled.div`
  * {
    /* outline: 1px solid rebeccapurple; */
  }
  display: grid;
  /* grid-template-columns: repeat(4, 1fr); */
  gap: 40px;
  width: 100%;
  > div:first-child {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 40px;
  }

  .block {
    margin-bottom: 0;
  }

  > div:first-child,
  > div:nth-child(2) {
    /* grid-column: span 2; */
  }

  .recipientOrderDetailBlock {
    grid-column: 1/-1;
    border-radius: 4px;
    border: 1px solid #d4e5f9;
    background-color: var(--white);

    .recipientOrderDetailContent {
      padding: 20px 40px;
    }

    .blockHeading {
      display: flex;
      align-items: center;
      margin-bottom: 40px;
    }

    .blockTitle {
      font-size: 16px;
      text-transform: capitalize;
      margin-right: auto;
    }

    .blockLabel {
      font-size: 14px;
      margin-right: 20px;
    }

    .blockCounter {
      font-size: 14px;
      background-color: var(--red) !important;
      width: 42px;
      height: 34px;
      border-radius: 16px;
      font-family: var(--font-bold);
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
    }

    .recipientOrderBlock {
      .orderBlock {
        border-radius: 5px;
        border: 2px dashed #e7e5e3;
        padding: 20px 15px;
        position: relative;

        &:not(:last-child) {
          margin-bottom: 20px;
        }

        &::after {
          position: absolute;
          content: attr(data-order-num);
          color: var(--blue);
          font-size: 14px;
          top: 0;
          position: absolute;
          transform: translateY(-9px);
          background-color: white;
        }

        > div:first-child {
          padding: 0;
        }
      }
    }
  }

  .isMultipleRecipientBlock {
    display: flex;
    align-items: center;
    margin-bottom: 40px;

    .isMultipleRecipient {
      margin-right: 40px;
      font-size: 14px;
    }

    input[type='radio'] {
      margin-left: 8px;
    }

    .noBlock {
      margin-left: 15px;
    }
  }

  .recipientDetailsBlock {
    display: grid;
    grid-template-columns: repeat(2, 0.6fr) repeat(2, 0.5fr);
    gap: 20px;
  }

  .createNewOrderButton {
    margin: 20px 38px 20px auto;
    color: var(--blue);
    display: flex;
    justify-content: flex-end;
    cursor: pointer;
  }

  .removeNewOrderButton {
    position: absolute;
    margin: 0;
    top: 0;
    right: 0px;
    transform: translate(-20px, -10px);
  }

  .theDashedBorder::before {
    content: 'Drop-off Information';
    position: absolute;
    top: 0;
    left: 0;
    color: var(--blue);
    font-size: 15px;
    margin-top: -9px;
    margin-left: 15px;
    background: white;
  }
`;

export default OrderDetailStyle;
