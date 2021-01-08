import styled from 'styled-components';

const NewCardStyle = styled.div`
  --purple: #ccd4e8;
  --light-green: #cee9e1;
  --light-yellow: #f6e8ce;
  --dark-purple: #29489b;
  --dark-green: #36b37e;
  --dark-yellow: #f9ac19;

  .card {
    border-radius: 10px;
    min-width: 210px;
    padding: 21px;
    border-radius: 10px;
    display: flex;
    cursor: pointer;

    /* Card Coloring */
    &.purple {
      background-color: var(--purple);
      .cardIconBlock {
        background-color: var(--dark-purple);
        background-image: var(--taxi-driver);
      }
    }

    &.light-green {
      background-color: var(--light-green);
      .cardIconBlock {
        background-color: var(--dark-green);
      }
    }

    &.light-yellow {
      background-color: var(--light-yellow);
      .cardIconBlock {
        background-color: var(--dark-yellow);
      }
    }
  }

  .tripPrice {
    margin-right: 0;
  }

  .cardIconBlock {
    --dimension: 43px;
    width: var(--dimension);
    height: var(--dimension);
    background-repeat: no-repeat;
    background-position: center;
    color: inherit;
  }

  .cardInfoBlock {
    margin-left: 16.78px;
  }

  .cardLabel {
    color: var(--black);
    text-transform: capitalize;
  }

  .cardFrequency {
    font-family: var(--font-bold);
    margin-top: 7px;
  }
`;

export default NewCardStyle;
