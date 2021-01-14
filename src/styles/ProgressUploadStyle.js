import styled from 'styled-components';

const ProgressUploadStyle = styled.div`
  .uploadProgressBlock {
    display: grid;
    grid-template-columns: auto 1fr auto;
    column-gap: 20px;
  }

  .top {
    margin-bottom: 10px;
  }

  p {
    font-size: 12px;
  }

  .fileSize {
    color: #999999;
    margin-left: 15px;
  }

  .cancelUploadIconBlock {
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }

  .middle {
    position: relative;
  }

  .progressBar {
    width: 100%;
    height: 6px;
    background-color: #f6f6f6;
    border-radius: 5px;
    position: absolute;
  }

  .progressLine {
    position: absolute;
    background-color: #36b37e;
    /* width: 65%; */
    height: 6px;
    border-radius: 5px;
    transition: 0.2s;
    transition-delay: 5s;
    left: 0em;
  }

  .bottom {
    margin-top: 30px;
  }
`;

export default ProgressUploadStyle;
