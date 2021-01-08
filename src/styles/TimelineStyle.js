import styled from 'styled-components';

const TimelineStyle = styled.div`
  .container {
    margin: 0 0 40px;
  }

  .timeline {
    display: grid;
  }

  .timelineStatusBlock {
    flex: 1;
    list-style-type: none;
    padding-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }

  .timelineStatusBlock::after {
    content: '';
    width: 2px;
    height: 58%;
    position: absolute;
    bottom: 0;
    transform: translateY(40px) translateX(3px);
    z-index: -1;
    background-color: black;
  }

  .timelineStatusBlock::before {
    content: '';
    width: 6px;
    height: 6px;
    background-color: red;
    position: absolute;
    border-radius: 50%;
    bottom: ${props => (props.isContainer ? '7px' : '3px')};
    transform: translateY(100%) translateX(3px);
  }

  .timelineStatusBlock.passed::before {
    background-color: var(--green);
  }

  .status {
    font-size: 16px;
    color: var(--blue);
    margin-bottom: 5px;
  }

  .date,
  .time {
    font-size: 12px;
    color: var(--black);
  }

  .date {
    margin-bottom: 5px;
  }

  .status:first-letter,
  .date:first-letter {
    text-transform: capitalize;
  }

  [class*='prog-line'] {
    width: 100%;
    height: 2px;
  }

  .prog-lines {
    margin-top: 30px;
    display: grid;
    grid-template-columns: repeat(10, 1fr);
  }

  .prog-line {
    background-color: #707070;
    grid-row: 1/-1;
    grid-column: 2/-2;
  }

  .prog-line-fill {
    background-color: var(--green);
    grid-row: 1/-1;
  }

  .statusFlag.passed {
    background: var(--green);
    border: unset;
  }

  .not-flagged {
    width: 8px;
    height: 6px;
    border: 2px solid white;
    border-left-color: transparent;
    border-bottom-color: transparent;
    transform: rotate(130deg);
    margin-bottom: 4px;
  }

  .statusFlag {
    border: 2px solid red;
    background-color: white;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    position: absolute;
    bottom: 0;
    transform: translateY(40px) translateX(3px);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .flagged {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    border: 2px solid red;
  }
`;

export default TimelineStyle;
