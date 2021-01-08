import styled from 'styled-components';

const StyledCustomerRoutes = styled.div`
  background-color: transparent;
  h1.title {
    font-size: 25px;
    margin-bottom: 20px;
    text-transform: capitalize;
  }

  .RouteID .tableItem {
    p {
      color: var(--blue);
    }
  }

  .tableWrap {
    max-height: 800px;
    overflow: auto;
  }
`;

export default StyledCustomerRoutes;
