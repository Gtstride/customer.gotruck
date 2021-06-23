import styled from 'styled-components';

const LoginPageStyle = styled.div`
  height: 100%;

  > main {
    margin: 200px auto;
  }
  div > img {
    display: flex;
    margin: 0 auto;
  }

   div img {
    max-width: 100%;
    height: auto;
    // border-radius: 7rem;
  }

  .logoBlock {
    width: 200px;
    height: 100px;
    display: inline-block;
    background-position: 50% 25%;
    background-repeat: no-repeat;
    background-size: contain;
    margin-left: 50%;
    transform: translateX(-50%);
  }

  .forgotPasswordBlock {
    text-align: right;

    a {
      font-size: 14px;
      color: var(--blue);
      font-weight: 200;
    }
  }

  .togglePasswordVisibilitySVGIcon {
    fill: var(--blue);
  }
`;

export default LoginPageStyle;
