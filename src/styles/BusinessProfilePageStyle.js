import styled from 'styled-components';

const BusinessProfilePageStyle = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  margin: 0 auto;
  gap: 40px;

  .text-blue {
    color: var(--blue);
  }
  .middleContent {
    display: grid;
    gap: 40px;
    row-gap: 40px;

    .generalInfoBlock,
    .userInfoBlock {
      background-color: white;
      padding: 17px;
      border-radius: 4px;
      border: 1px solid #d4e5f9;

      > header,
      > .generalInfoContent > * {
        display: flex;
        justify-content: space-between;
      }

      > header {
        .title {
          text-transform: capitalize;
          font-size: 19px;
          font-family: var(--font-bold);
        }
      }

      .editButton {
        font-size: 13px;
        display: flex;
        align-items: center;

        .icon {
          margin-right: 5px;
          line-height: 1;
        }

        span:last-child {
          font-family: var(--font-bold);
        }
      }

      .generalInfoContent {
        margin-top: 10px;

        > div {
          padding: 10px 0;

          p {
            color: #999;
          }

          * {
            text-transform: capitalize;
            font-size: 13px;
          }
        }
        .emailAddressBlock {
          p {
            text-transform: initial;
          }
        }
      }
    }

    .blockError {
      background-color: white;
      border-radius: 4px;
      border: 1px solid #d4e5f9;
      margin-top: 40px;
      min-height: 200px;
      display: grid;
      place-items: center;

      .spinner {
        margin: 0;
      }
    }

    .businessProfileBlock {
      .block {
        margin-bottom: 20px;
        border-radius: 4px;
        background-color: var(--white);
        border: 1px solid #d4e5f9;
        padding: 20px;

        .blockHeader {
          margin-bottom: 30px;
          .blockTitle {
            font-size: 16px;
            text-transform: capitalize;
          }
        }

        .content {
          > div {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            border-bottom: 1px solid rgba(40, 42, 60, 0.1);
            margin-bottom: 1.5em;
            padding-bottom: 1.5em;

            > p {
              font-size: 1.5em;
              flex: 1;
              word-break: break-all;
            }

            > p:nth-child(2) {
              margin: 0 10px;
            }

            > div:last-child {
              border-bottom: 0;
            }
          }
        }
      }
    }
  }

  .rightContent {
    display: grid;
    align-content: start;
    justify-content: start;
    row-gap: 20px;

    > div:first-child {
      flex: unset;
    }

    .card {
      margin-right: 0;
      margin-bottom: 20px;
    }

    div:first-child .card:first-of-type {
      background-color: #c4e5f4;

      .cardIconBlock {
        background-color: #009bd5;
        background-image: var(--truck-cargo);
      }
    }

    div:last-child .card:first-of-type {
      background-color: #c5f1c9;

      > .cardIconBlock {
        background-color: #08d500;
        background-image: var(--common-file-text-edit);
      }
    }
  }

  /* .userInfoBlock {
    .generalInfoContent {
      display: grid;
      grid-template-columns: 1fr 1fr;

      > div {
        display: flex;
        flex-direction: column;

        &:nth-child(even) {
          align-items: flex-end;
        }

        > p:last-child {
          font-size: 16px;
          color: black;
          margin-top: 5px;
          font-family: var(--font-bold);
        }
      }
    }
  } */
`;

export default BusinessProfilePageStyle;
