import styled from 'styled-components';
const RecipientSidePaneStyle = styled.div`
  padding: 80px 20px 20px;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #d4e5f9;

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;

    h3 {
      font-size: 18px;
    }
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

  .tripStatusBlock {
    border-top: 2px solid rgba(40, 42, 60, 0.1);
    border-bottom: 2px solid rgba(40, 42, 60, 0.1);
  }

  .recipientInfoBlock {
    display: flex;
    margin: 30px 0;

    .recipientInfoIcon {
      margin-right: 20px;
      flex-shrink: 0;
    }

    .recipientInfoContentBlock {
      .recipientInfoHeading {
        font-size: 14px;
        color: #999999;
        margin-bottom: 5px;
      }

      .recipientInfoSubheading {
        color: #000000;
        font-size: 18px;
      }
    }
  }

  .addressesBlock {
    .recipientInfoContentBlock {
      margin-bottom: 20px;
    }
  }

  button.cancel {
    background-color: transparent;
    position: absolute;
    box-shadow: unset;
    padding: unset;
    top: 0;
    right: 0;
    transform: translate(-37px, 35px);
    width: 20px;
    height: 20px;
    background: #707070;
    border-radius: 50%;

    img {
      display: block;
    }
  }
`;

export default RecipientSidePaneStyle;
