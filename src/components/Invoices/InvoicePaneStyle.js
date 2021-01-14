import styled from 'styled-components';

const InvoicePaneStyle = styled.div`
  --blue: #29489b;
  margin-top: 20px;
  padding: 0 15px;

  .tripStatusBlock {
    border-top: 2px solid rgba(40, 42, 60, 0.1);
    border-bottom: 2px solid rgba(40, 42, 60, 0.1);
    padding: 20px 0;
    display: grid;
    align-items: center;
    column-gap: 20px;

    .tripStatusIcon {
      width: 15px;
      height: 15px;
      border-radius: 50%;
      background-color: var(--blue);
    }
    .tripWaybillIcon {
      display: flex;
      align-items: center;

      img {
        margin-right: 20px;
      }
    }

    .tripStatusDate {
      color: #000000;
      font-size: 14px;
      text-transform: capitalize;
    }
  }

  .tripStatusContentBlock {
    .tripStatusHeading {
      font-size: 14px;
      color: #999999;
      margin-bottom: 5px;
    }

    .tripStatusSubheading {
      color: #000000;
      font-size: 18px;
      font-weight: 600;
      color: var(--blue);
    }
  }

  /* ---2--- */

  .tripActionsBlock {
    button {
      padding-right: 0;
      font-size: 18px;
      color: var(--blue);
      text-align: left;
    }
  }
`;

export default InvoicePaneStyle;
