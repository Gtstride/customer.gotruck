import styled from 'styled-components';

const CreateNewRouteFormStyle = styled.div`
  #createNewRouteForm {
    position: relative;

    .formContentBlock {
      padding: 40px 20px;

      .message {
        border: 2px dotted var(--green);
        padding: 1.5em;
        margin-top: 4em;
        border-radius: 5px;

        p {
          font-size: 1.5em;
          color: var(--green);
        }
      }

      .error {
        border: 2px dotted var(--red);
        padding: 1.5em;
        margin-top: 4em;
        border-radius: 5px;

        p {
          font-size: 1.5em;
          color: var(--red);
        }
      }
    }

    .formHeader {
      border-bottom: 1px solid #00000029;
      margin-bottom: 20px;
    }

    .formTitle {
      text-transform: initial;
    }

    button.cancel {
      background-color: transparent;
      position: absolute;
      box-shadow: unset;
      padding: unset;
      top: 0;
      right: 0;
      transform: translate(-20px, 43px);
      width: 20px;
      height: 20px;
      background: #707070;
      border-radius: 50%;
    }

    .dropZone {
      border: 2px dashed #bbb9b9;
      background-color: #f6f6f6;
      border-radius: 5px;
      padding: 50px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .dropZoneIcon {
      padding: 19px;
      border: 2px solid #36b37e;
      border-radius: 10px;
    }

    .csvLoader {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .preview {
      display: flex;
      justify-content: center;
      margin-top: 2.5em;

      img {
        max-width: 100px;
        height: auto;
      }
    }

    .dropZoneTitle {
      color: #999999;
      font-size: 16px;
      font-weight: 100;
      margin-top: 20px;
    }

    .uploadProgressBlock {
      border-top: 1px solid #00000029;
      margin-top: 20px;
      padding-top: 20px;
    }

    .downloadCSVBtn {
      background-color: white;
      font-size: 14px;
      padding-left: 0;
      text-decoration: underline;
    }

    .moreAddressButton {
      display: flex;
      color: var(--blue);
      align-items: center;
      margin-left: auto;
      padding: 10px;
      transition: background-color 0.2s;

      &:hover {
        background-color: #f7f7f7;
        border-radius: 7px;
      }

      .actionIcon {
        border-radius: 50%;
        width: 20px;
        height: 20px;
        margin-right: 9px;
      }
    }

    #truckReqFormContent {
      background: RGBA(41, 72, 155, 0.05);
      padding: 19px;
      border-radius: 5px;

      [for='truckQty'] {
        text-align: center;
      }
    }

    #truckRequestDetail {
      display: grid;
      align-items: center;
      grid-template-columns: auto 1fr auto;
      margin-bottom: 20px;

      .img {
        width: 36px;
        height: 36px;
        background-color: #cee9e1;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .truckRequestDetail {
        margin-left: 20px;

        .title {
          font-size: 12px;
          color: #999999;
        }

        .truckType {
          color: black;
          font-size: 18px;
          margin-top: 5px;
        }
      }

      .truckQty {
        background-color: #cee9e1;
        color: #36b37e;
        font-weight: var(--font-bold);
        padding: 5px;
        border-radius: 5px;
      }
    }
  }
`;

export default CreateNewRouteFormStyle;
