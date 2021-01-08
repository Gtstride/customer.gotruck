import styled from 'styled-components';

const PageActionStyle = styled.div`
  flex: 1;
  position: relative;
  input {
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

  .searchBlock {
    margin-left: 30px;
  }

  .searchBlock {
    width: 240px;
    max-width: 270px;
    min-width: 230px;
    height: 36px;
    border-radius: 10px;
    background-color: #e9eaee;
    position: relative;
    display: flex;
    align-items: center;
    padding-left: 17px;
  }

  .searchBlock > form {
    flex: 1;
  }

  .searchBlock input {
    padding: 26px 26px 26px 5px;
  }
`;

export default PageActionStyle;
