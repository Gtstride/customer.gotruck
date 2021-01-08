import styled from 'styled-components';

const LoaderStyle = styled.div`
  height: calc(100vh - 310px);
  display: flex;
  align-items: center;
  justify-content: center;

  .spinner {
    position: relative;
    animation: rotate-all 1s linear infinite;
  }

  .right-side,
  .left-side {
    width: 50%;
    height: 100%;
    position: absolute;
    top: 0;
    overflow: hidden;
  }

  .left-side {
    left: 0;
  }

  .right-side {
    right: 0;
  }

  .bar {
    width: 100%;
    height: 100%;
    border-radius: 200px 0 0 200px;
    border-style: solid;
    position: relative;
  }

  .right-side .bar {
    border-radius: 0 200px 200px 0;
    border-left: none;
    transform-origin: left center;
    animation: rotate-right 0.75s linear infinite alternate;
  }

  .left-side .bar {
    border-right: none;
    transform-origin: right center;
    animation: rotate-left 0.75s linear infinite alternate;
  }

  @keyframes rotate-left {
    to {
      transform: rotate(30deg);
    }
    from {
      transform: rotate(175deg);
    }
  }
  @keyframes rotate-right {
    from {
      transform: rotate(-175deg);
    }
    to {
      transform: rotate(-30deg);
    }
  }
  @keyframes rotate-all {
    from {
      transform: rotate(-360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
`;

export default LoaderStyle;
