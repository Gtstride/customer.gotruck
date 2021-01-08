import styled from 'styled-components';

const TripStyle = styled.div`
  display: grid;
  grid-template-columns: repeat(14, 1fr);
  gap: 20px;

  /* timeline */
  > button + div {
    grid-column: 2/-1;
  }

  > div:nth-child(3) {
    grid-column: span 10;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
  }

  > div:last-child {
    grid-column: span 4;
    background-color: var(--white);
    padding: 10px;
    border-radius: 10px;
    height: fit-content;
    border-radius: 4px;
    border: 1px solid #d4e5f9;
  }
`;

export default TripStyle;
