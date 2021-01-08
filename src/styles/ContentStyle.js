import styled from 'styled-components';

const ContentStyle = styled.section`
  display: grid;
  grid-template-rows: auto 1fr;
  row-gap: 28.5px;
  padding-left: var(--sidenav-min-width);
  min-height: 100vh;

  .globalNavBlock {
    position: sticky;
    top: 0;
    background: #f5f7fb;
    z-index: 2;
  }

  #globalTopNav {
    padding: 14px 28px;
    margin: 20px 28px 0px;
    border-radius: 5px;
  }

  #page > .statCards {
    margin-top: 28.5px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 26.76px;
  }

  #greetingCard,
  #statisticsCard,
  #transactionsCard,
  #productCard,
  #userCard,
  #revenueCard {
    background-color: var(--white);
    padding: 23px;
    border-radius: 10px;
  }

  /* Greeting Card */
  #greetingCard .cardTitle {
    color: #475f7b;
    font-size: 18px;
  }

  #greetingCard .cardSubtitle {
    color: #727e8c;
    font-size: 15px;
    margin-top: 7px;
  }

  #greetingCard .cardHighlight {
    color: #29489b;
    font-size: 45px;
    font-family: var(--font-bold);
    margin: 7px 0;
  }

  #greetingCard .cardHighlightInfo {
    color: #727e8c;
    font-size: 15px;
  }

  #greetingCard .cta {
    margin-top: 25.7px;
  }

  #greetingCard .cta button {
    font-size: 12px;
    padding: 12.67px 15px;
    font-weight: 400;
    border: none;
    background-color: var(--green);
    color: var(--white);
    border-radius: var(--button-border-radius);
    box-shadow: 0px 2px 4px #5a8dee66;
  }

  #greetingCard .cardIconBlock {
    width: 141px;
    height: 142px;
    background-color: #dce1f2;
    margin-left: 25px;
  }

  #greetingCard .cardContent {
    display: flex;
    align-items: flex-end;
  }

  #statisticsCard + div {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 18px;
  }

  #revenueCard {
    grid-column: 1/-1;
  }

  #page {
    padding: 0 27px 28px;
    margin-bottom: 5em;

    > .dashboardHeader {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 20px;
      align-items: center;

      .card {
        margin: 0;
      }

      > div {
        flex: 1;
      }
      h1 {
        font-size: 2em;
        color: var(--blue);
      }

      .date {
        margin-left: 20em;
        margin-top: -1em;
        p {
          color: #484848;
          font-size: 1.4em;
          font-weight: bold;
          margin-bottom: 8px;
        }
      }
      .card {
        max-width: unset;
      }
    }
  }

  #pageContent {
    display: grid;
    grid-template-rows: auto 1fr;
    row-gap: 28.5px;
    height: 100%;
  }

  .pageActionsBlock {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 20px;
  }

  .pageActions {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .pageActions.noActions {
    justify-content: flex-end;
  }

  .leftActions {
    display: grid;
    grid-template-columns: repeat(1, 120px);
    grid-auto-rows: 29px;
    border-radius: 2px;
    background-color: #f4f4f4;
    border: 1px solid #d8d8d8;
  }

  .leftActions .actionIcon {
    margin: 2px 5px 0 0;
  }

  .leftActions > button {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #707070;
    font-size: 14px;
  }

  .leftActions > button:nth-child(2) {
    border-left: 1px solid #d8d8d8;
    border-right: 1px solid #d8d8d8;
  }

  .actionIcon.add,
  .actionIcon.cancel {
    background-color: #4d9879;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    margin-right: 9px;
  }

  .actionIcon.cancel {
    background-color: #c65e5e;
  }
`;

export default ContentStyle;
