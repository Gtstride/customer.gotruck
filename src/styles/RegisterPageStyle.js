import styled from 'styled-components';

const RegisterStyle = styled.div`
  background-color: inherit;

  @media screen and (max-width: 520px) {
  }

  > main {
    margin: 0 auto;
  }

  .formFieldWrap {
    display: flex;
    align-items: center;
  }

  .formFieldIconWrap {
    position: unset;
    padding: 0 13px;
  }

  .countryDialingCode {
    font-size: 16px;
    color: #000000;
    opacity: 0.3;
  }

  .separator {
    width: 2px;
    height: 21px;
    background-color: #000000;
    opacity: 0.3;
  }

  [data-formfieldhasicon='true'] {
    padding-left: 60px;
  }

  .formFieldSplit {
    grid-template-columns: repeat(2, 1fr);
  }

  .businessCountry.formFieldBlock {
    .popup {
      width: 400px !important;
    }

    .popupItemWrap {
      padding: 8px 15px !important;
    }

    .countryName {
      flex: 1;
    }
  }
`;

export default RegisterStyle;
