import styled from 'styled-components';

const OrderSidePaneStyle = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  border: 1px solid #d4e5f9;

  .orderStatusBlock,
  .truckRequestStatusBlock {
    margin-top: 40px;
    display: flex;

    .halo {
      width: 10px;
      height: 10px;
      border-radius: 50%;

      margin-right: 10px;
    }

    .halo.accepted,
    .halo.open {
      background-color: var(--green);
    }

    .halo.pending {
      background-color: var(--yellow);
    }

    .halo.cancelled,
    .halo.expired,
    .halo.closed {
      background-color: var(--red);
    }

    .orderStatus {
      p:first-child {
        font-size: 13px;
      }

      .truckHaloStatus {
        display: flex;
        align-items: center;

        > .halo {
          margin-top: 5px;
        }
      }

      p:last-child {
        font-size: 18px;
        margin-top: 5px;
        text-transform: capitalize;
      }
    }
  }

  .truckActions {
    min-width: 210px;
    padding: 21px;
    border-radius: 10px;
    display: -webkit-box;
    /* display: -webkit-flex; */
    display: -ms-flexbox;
    display: flex;
    background-color: var(--active-trips-card-bg);
    align-items: center;
    margin-bottom: 2em;

    > p {
      font-size: 1.5em;
      font-weight: bolder;
    }
  }
  .halo {
    width: 10px;
    height: 10px;
    border-radius: 50%;

    margin-right: 10px;
  }

  .halo.accepted,
  .halo.open,
  .halo.available {
    background-color: var(--green);
  }

  .halo.pending,
  .halo.in-premise {
    background-color: var(--yellow);
  }

  .halo.positioned {
    background-color: #23a4d7;
  }

  .halo.cancelled,
  .halo.expired,
  .halo.closed {
    background-color: var(--red);
  }
  .tripStatus {
    font-size: 1.5em;
    border-top: 1px solid rgba(40, 42, 60, 0.1);
    border-bottom: 1px solid rgba(40, 42, 60, 0.1);
    padding: 20px 10px;
    display: grid;
    grid-template-columns: auto 1fr auto;
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-column-gap: 20px;
    column-gap: 10px;
    margin-bottom: 2em;
  }
  .status {
    > p:first-child {
      margin-bottom: 0.5em;
      font-weight: bolder;
      font-size: 1.2em;
    }
  }
  .setAct {
    padding: 0.7em;
    width: 100%;
    font-size: 1.5em;
    border-radius: 5px;
    color: white;
    text-transform: uppercase;
  }

  .btns {
    margin: 0 1em;
    > button:first-child {
      margin-bottom: 2em;
    }
    > button:nth-child(2) {
      margin-bottom: 2em;
    }
  }
  .truckRequestStatusBlock {
    margin-top: 0;
    margin-bottom: 30px;
  }

  .orderActionBlock {
    margin-top: 40px;

    .cancelOrderButton {
      display: flex;
      align-items: center;
      padding: 0;
    }

    .buttonIcon {
      margin-right: 10px;
    }

    .buttonText {
      color: #ff5151;
      font-size: 18px;
    }
  }

  .orderEditActionBlock {
    margin-top: 20px;

    .editPriceButton {
      display: flex;
      align-items: center;
      padding: 0;
    }

    .buttonIcon {
      margin-right: 10px;
    }

    .buttonText {
      font-size: 18px;
    }
  }

  .editTruckRequestButton,
  .assignToTransporterButton {
    padding: 0;

    .buttonIcon {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 35px;
      height: 35px;
      background: #3db582;
      border-radius: 50%;
      padding: 6px;
    }
  }

  .editTruckRequestButton .buttonIcon {
    background-color: var(--blue);
  }

  .assignToTransporterButton .buttonIcon {
    background-color: var(--green);
  }

  .assignToTransporterButton img {
    width: 15px;
  }
`;

export default OrderSidePaneStyle;
