import styled from 'styled-components';

const EmptyTableContentStyle = styled.div`
  min-height: 685px;
  color: #282a3c;
  flex-direction: column;

  .errorImgBlock {
    width: 500px;
  }

  .errorContent {
    display: flex;
    flex-direction: column;
    text-align: center;

    .errorTitle {
      font-size: 24px;
      margin-bottom: 9px;
    }

    .errorSubtitle {
      font-size: 16px;
      color: #707070;
      font-family: var(--font-bold);
    }
  }
`;

export default EmptyTableContentStyle;
