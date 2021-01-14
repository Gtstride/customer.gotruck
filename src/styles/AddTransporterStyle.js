import styled from 'styled-components';

const AddTransporterStyle = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;

  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  background: #e3e9f0;
  overflow: auto;

  .pageTitle h1 {
    color: var(--blue);
    font-size: 20px;
  }

  thead {
    position: sticky;
    top: 134px !important;
    background-color: white;
  }

  .pageHeader {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-content: center;
    max-width: 95%;
    margin: 0 auto;
    padding-bottom: 30px;
    align-items: center;

    #addTransporterSearchForm {
      grid-column: 2;

      .formFieldWrap {
        margin: 0;
      }
    }

    .cancelBlock {
      display: flex;
      justify-content: flex-end;

      .cancelButton {
        display: flex;
        align-items: center;
        padding: 2px 15px;

        .buttonText {
          color: red;
          font-size: 18px;
          font-family: var(--font-bold);
          margin-left: 10px;
        }
      }
    }
  }

  .pageContent {
    max-width: 95%;
    margin: 0 auto;
    padding-bottom: 30px;
  }

  .add-trans {
    padding: 0.8em 1em;
    background-color: var(--green);
    box-shadow: 0px 1px 1px #00000029;
    font-size: 14px;
    font-weight: 400;
    border: none;
    color: var(--white);
    border-radius: var(--button-border-radius);
    text-transform: uppercase;
  }
`;

export default AddTransporterStyle;
