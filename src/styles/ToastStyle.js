import styled from 'styled-components';

const ToastStyle = styled.div`
  width: 500px;
  // height: 71px;
  display: flex;
  border-radius: 4px;
  border: 1px solid #d4e5f9;
  background-color: white;
  position: fixed;
  bottom: 0;
  left: 50%;
  opacity: 0;
  pointer-events: none;
  transform: translateX(-50%) translateY(-20px);
  transition: all 0.2s ease-in-out;
  z-index: 999999999999;

  &#show {
    opacity: 1;
    pointer-events: initial;
    transform: translateX(-50%) translateY(-80px);
  }

  > * {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .toastIconBlock,
  .toastActionBlock {
    padding: 20px 25px;
  }

  .toastIconBlock {
    border-top-left-radius: inherit;
    border-bottom-left-radius: inherit;
  }

  [data-toast-type='success'] {
    background-color: #36b37e;
  }

  [data-toast-type='failure'] {
    background-color: #ff5151;
  }

  .toastMessageBlock {
    flex: 1;
    margin: 0 15px;

    .toastMessage {
      font-size: 18px;
      line-height: 1.5;
      padding: 0.5rem;
    }

    .toastMessage:first-letter {
      text-transform: uppercase;
    }
  }

  .toastActionBlock {
    cursor: pointer;
    transition: 0.2s ease-in-out;

    &:hover {
      background-color: #eee;
    }
  }

  .material-icons {
    color: white;
  }
`;

export default ToastStyle;
