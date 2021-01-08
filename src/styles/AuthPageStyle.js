import styled from 'styled-components';

const AuthPageStyle = styled.div`
  min-height: 100vh;
  height: 100vh;
  width: 100%;

  > [id*='Page'] {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
  }

  .formContentBlock {
    padding: 30px 42px;
  }

  .pageTitle {
    text-align: center;
    font-weight: 300;
    color: var(--orange);
    text-transform: uppercase;
    font-family: 'Avenir-bold';
    display: block;
    font-size: 20px;
  }

  .alternateAuth {
    text-align: center;

    a {
      font-size: 14px;
      color: var(--blue);
      font-weight: 200;
    }
  }

  .pageFooter {
    background-color: var(--blue);
    display: flex;
    justify-content: space-between;
    padding: 20px 50px;
    position: fixed;
    bottom: 0;
    width: 100%;
  }

  .pageFooter a,
  .pageFooter p {
    color: var(--white);
    margin: 0 20px;
    font-size: 14px;
    font-weight: 200;
  }

  @media screen and (max-width: 520px) {
    .pageFooter {
      flex-direction: column;
      align-items: center;
    }

    .linksBlock {
      margin-bottom: 20px;
    }

    form {
      width: 100% !important;
    }

    main {
      padding-left: 20px;
      padding-right: 20px;
      margin: 0 !important;
    }
  }
`;

export default AuthPageStyle;
