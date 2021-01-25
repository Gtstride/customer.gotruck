import styled, { css } from 'styled-components';

const FormStyle = styled.div`
  padding: 40px 0;

  ${props =>
    props.position === 'sticky' &&
    css`
      position: sticky;
      top: 0;
      background-color: #e3e9f0;
      padding-bottom: 20px;
    `}

  #loginForm,
  #registerForm,
  #authForm {
    width: 500px;
  }

  .formContentBlock {
    background-color: white;
    border-radius: 4px;
    border: 1px solid #d4e5f9;
  }

  .formHeader {
    padding-bottom: 20px;
  }

  .formTitle {
    font-size: 16px;
    font-family: var(--font-bold);
    text-transform: capitalize;
  }

  .formContent {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .formFieldBlock div[data-isinvalid] {
    transition: 0.2s;
    border-color: var(--warning-color);
  }

  .formFieldHeader {
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    align-items: center;
  }

  .errorMessageBlock {
    display: flex;
  }

  .errorMessageBlock > * {
    animation: slideIn 0.2s linear 0s 1;
    animation-direction: normal;
    animation-fill-mode: both;
  }

  @keyframes slideIn {
    from {
      /* opacity: 0; */
      transform: translateY(20px);
    }

    to {
      /* opacity: 1; */
      transform: translateY(0);
    }
  }

  .errorMessageBlock .errorMessage {
    line-height: 14px;
    color: var(--warning-color);
    margin-left: 9px;
    font-size: 12px;
  }

  label {
    font-size: 14px;
    color: var(--form-label-color);
  }

  label::first-letter {
    text-transform: uppercase;
  }

  .formFieldWrap {
    margin: 16px 0;
    border: var(--form-field-border);
    margin-top: 10px;
    border-radius: 5px;
    position: relative;
    height: 40px;
    display: flex;
    transition: 0.2s;
    background-color: white;

    &:focus-within {
      border-color: var(--form-field-focus-border-color) !important;
    }
  }

  .formFieldWrap.note {
    height: 100px;
  }

  input,
  select,
  textarea {
    width: 100%;
    height: 100%;
    font-size: 1.5rem;
    font-weight: 200;
    font-size: 16px;
    font-family: 'Avenir';
    background-color: transparent;
    border-radius: inherit;
    padding: 8px 15px;
  }

  textarea {
    resize: none;
  }

  .selectContainer {
    position: relative;
    width: 100%;
  }

  select {
    -moz-appearance: none;
    -webkit-appearance: none;
  }

  .select-arrow {
    color: rgb(51, 51, 51);
    right: 0px;
    top: 50%;
    width: 30px;
    position: absolute;
    display: block;
    z-index: 10;
    margin: 0px;
    pointer-events: none;
    transform: translateY(-50%);
  }

  .formFieldIconWrap {
    cursor: pointer;
    display: flex;
    align-items: center;
    margin: 0 10px;
  }

  .cta {
    margin: 35px 0 30px;
    margin-bottom: 0;
    text-align: center;
    display: flex;
    justify-content: center;

    button {
      padding: 13px 50px;
      background-color: var(--green);
      box-shadow: 0px 1px 1px #00000029;
      font-size: 16px;
      font-weight: 400;
      border: none;
      color: var(--white);
      border-radius: var(--button-border-radius);
      cursor: pointer;
    }

    input {
      display: none;
    }
  }

  /* /Remove */
  input[type='radio'] {
    width: unset;
    margin-right: 8.83px;
  }

  .radioFieldBlock {
    margin-top: 10px;
  }

  .radioFieldBlock:first-of-type {
    margin-bottom: 18.94px;
  }

  .formErrorBlock {
    background-color: var(--flagged-trips-card-bg);
    display: flex;
    position: relative;
    z-index: 2;
    border-radius: 10px;
    padding: 13px;
    align-items: flex-start;
    margin: 2rem 0 1rem;
    .formErrorIconBlock {
      margin-right: 10px;
      flex-shrink: 0;

      svg {
        width: 33px !important;
        height: 33px !important;
      }
    }

    .formErrorMessage {
      font-size: 16px;
      line-height: 1.3;
    }
  }

  .popup {
    height: auto;
    width: 100%;
    overflow: auto;
    top: 41px;
    position: absolute;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1), 0 15px 35px rgba(0, 0, 0, 0.1), 0 50px 100px rgba(50, 50, 93, 0.1);
    background-color: white;
    border-radius: 5px;
    z-index: 2;
    animation: fadeIn 0.2s ease-in-out 0s 1;
    animation-direction: normal;
    animation-fill-mode: none;
    animation-direction: normal;
    animation-fill-mode: both;
    opacity: 0;

    .popupItemWrap {
      padding: 3px !important;
    }

    .popupItemWrap.loading {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100px;
    }

    .popupText {
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  #createNewTripRoute {
    button.next {
      margin-left: auto;
    }
  }

  /* react select */
  .formFieldWrap > div:first-child:not(.formFieldIconWrap) {
    width: 100%;
    font-size: 16px;
  }

  /* Counter on Edit Truck REquest */
  .truckRequest {
    margin-top: 10px;

    .formFieldHeader {
      justify-content: center;
    }

    .counter {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 5px;

      .truckQtyCount {
        font-size: 20px;
        margin: 0 12px;
      }
    }
  }
`;

export default FormStyle;
