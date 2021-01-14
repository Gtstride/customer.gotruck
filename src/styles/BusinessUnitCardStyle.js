import styled from 'styled-components';

const BusinessUnitCardStyle = styled.div`
  border-radius: 4px;
  border: 1px solid #d4e5f9;
  background-color: white;
  height: 150px;
  display: grid;
  grid-template-rows: 50px 1fr;

  .cardHeader {
    display: flex;
    justify-content: space-between;
    background-color: #e9ecf5;
    padding: 15px;

    .businessUnitTitle {
      margin-bottom: 5px;
      font-family: var(--font-bold);
      font-size: 16px;
    }

    .businessUnitTitle {
      text-transform: capitalize;
    }
  }

  .cardLink {
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      background-color: #f5f7fb;
    }
  }

  .cardMain {
    padding: 15px;

    h2 {
      font-size: 18px;
      color: var(--blue);
    }
  }
`;

export default BusinessUnitCardStyle;
