import styled from 'styled-components';

const InvoicesTableStyle = styled.div`
  [data-table-heading*='note'] {
    width: 10%;
  }
  .waybill-image {
    border-radius: 3px;
    width: 18px;
    margin: 0 6px;
  }

  [data-table-heading*='trips'] {
    width: 5%;
  }
`;

export default InvoicesTableStyle;
