import styled from 'styled-components';

const CardStyle = styled.ul`
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  grid-gap: 23px;

  .tile {
    border-radius: 10px;
  }

  .tileIconBlock {
    --dimension: 43px;
    width: var(--dimension);
    height: var(--dimension);
    background-repeat: no-repeat;
    background-position: center;
    color: inherit;
  }

  .tileInfoBlock {
    margin-left: 16.78px;
  }

  .tileLabel {
    color: var(--black);
    text-transform: capitalize;
  }

  .tileFrequency {
    font-family: var(--font-bold);
    margin-top: 7px;
  }
`;

export default CardStyle;
