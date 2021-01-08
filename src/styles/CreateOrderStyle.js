import styled from 'styled-components';

const CreateOrderStyle = styled.section`
  display: grid;
  grid-template-columns: auto 10fr 1fr;
  gap: 50px;

  button {
    padding: 0;
  }

  .buttonText {
    margin-left: 10px;
    font-size: 16px;
  }

  button,
  .buttonIcon {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #cancelBlock {
    .cancel {
      min-width: 155px;
      height: 35px;
      background-color: var(--red);
     box-shadow: var(--form-box-shadow);
      border-radius: 50px;
      color: var(--white);
      padding: 0px 18px;
    }

    .buttonIcon {
      background-color: #c65e5e;
      border-radius: 50%;
      width: 20px;
      height: 20px;
    }
  }

  #formsBlock {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* padding: 40px 0; */
  }

  #navButtonsBlock {
    display: flex;
    justify-content: space-between;
    min-width: 500px;
    padding: inherit;
    margin-top: 30px;

    button.previous {
      .buttonIcon {
        transform: rotate(180deg);
      }
    }

    button.next {
      flex-direction: row-reverse;

      .buttonText {
        margin-left: 0;
        margin-right: 10px;
      }
    }
  }
`;

export default CreateOrderStyle;
