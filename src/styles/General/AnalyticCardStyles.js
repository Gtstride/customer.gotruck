import styled, { css } from 'styled-components';

const AnalyticsCardStyle = styled.div`
  /* specific to all cards -> Can we import a CardStyle in here?*/
  --card-border-radius: 10px;
  --card-title-font-size: 14px;
  min-width: 210px;
  padding: 20px;
  border-radius: var(--card-border-radius);
  display: flex;
  
  /* using props */
  /* For cards with a Yellow background */
  ${props =>
    props.color === 'yellow' &&
    css`
      background-color: var(--light-yellow);

      > .cardIconBlock {
        background-color: var(--dark-yellow);
      }
    `}

  ${props =>
    props.color === 'green' &&
    css`
      background-color: var(--light-green);

      > .cardIconBlock {
        background-color: var(--dark-green);
      }
    `}

    ${props =>
      props.color === 'purple' &&
      css`
        background-color: var(--light-purple);

        > .cardIconBlock {
          background-color: var(--dark-purple);
        }
      `}
    ${props =>
      props.color === 'blue' &&
      css`
        background-color: var(--light-blue);

        > .cardIconBlock {
          background-color: var(--dark-blue);
        }
      `}

    ${props =>
      props.color === 'lemon' &&
      css`
        background-color: var(--light-lemon);

        > .cardIconBlock {
          background-color: var(--dark-lemon);
        }
      `}
      
      /* Card Icons */
      ${props =>
        // @ts-ignore
        props.icon === 'truck-cargo' &&
        css`
          > .cardIconBlock {
            background-image: var(--truck-cargo);
          }
        `}
      
      ${props =>
        // @ts-ignore
        props.icon === 'common-file-text-edit' &&
        css`
          > .cardIconBlock {
            background-image: var(--common-file-text-edit);
          }
        `}

      ${props =>
        // @ts-ignore
        props.icon === 'business-deal-handshake-circle' &&
        css`
          > .cardIconBlock {
            background-image: var(--business-deal-handshake-circle);
          }
        `}
      
      ${props =>
        // @ts-ignore
        props.icon === 'truck-white' &&
        css`
          > .cardIconBlock {
            background-image: var(--truck-white);
          }
        `}
      
      /* General/Other Styles */
      .cardIconBlock {
        --dimension: 43px;
        width: var(--dimension);
        height: var(--dimension);
        background-repeat: no-repeat;
        background-position: center;
        color: inherit;
        border-radius: calc(var(--card-border-radius) / 2);
      }
      
      .cardInfoBlock {
        font-family: var(--font-bold);
        color: var(--black);
        
        .cardTitle {
          font-size: var(--card-title-font-size);
          text-transform: capitalize;
        }
        
        .cardTotal {
          font-size: calc(var(--card-title-font-size) + 2px);
          margin-top: 7px;
          font-family: var(--font-bold);
  }
}
`;

export { AnalyticsCardStyle };
