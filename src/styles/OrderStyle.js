import styled from 'styled-components';

const OrderStyle = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 30px;
  height: 100%;
  position: relative;
  padding-top: 60px;

  > button {
    position: absolute;
    top: 0;
    left: 0;
  }

  .blocks {
    gap: 30px;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
`;

export default OrderStyle;
