import styled from 'styled-components';

const ProfileDetailsStyle = styled.div`
  display: grid;
  row-gap: 20px;
  justify-content: end;
  grid-template-rows: 250px repeat(2, max-content);

  /* -> Profile Image Block */
  .profileImageBlock {
    min-width: 250px;
    height: 250px;
    border-radius: 15px;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    border: 1px solid #d4e5f9;

    > .profileImagePlaceholderBlock {
      border-radius: 50%;
      padding: 0px;
      border: 4px solid #e7e7ed;
      width: 180px;
      height: 180px;
      cursor: pointer;
      position: relative;
      transition: 0.2s ease-in-out;

      img {
        background-size: contain !important;
        background-position: 50% 50% !important;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        place-content: center;
      }

      input {
        display: none;
      }

      &::after {
        content: '';
        width: 32px;
        height: 32px;
        position: absolute;
        right: 0;
        bottom: 0;
        border-radius: 50%;
        transform: translateX(-16px);
        background-color: #36b37e;
        background-image: var(--add);
        background-repeat: no-repeat;
        background-position: center;
        background-size: 19px;
      }

      &:hover {
        background-color: #f0f0f0;
      }
    }
  }

  /* -> Profile Id Block */
  .profileIdBlock {
    > .label {
      color: #999999;
      font-size: 14px;
      margin-bottom: 5px;
    }

    > .profileId {
      font-size: 18px;
      text-transform: uppercase;
    }
  }

  /* Profile CTA Block */
  .profileCtaBlock {
    > div {
      display: grid;
      grid-template-columns: 200px 20px;
      > button {
        color: #29489b;
        font-size: 16px;
        text-align: left;
        background-color: transparent;
        display: flex;
        align-items: center;
        margin: unset;
        padding: unset;
        margin-bottom: 19px;

        > .icon {
          display: block;
          width: 30px;
          height: 30px;
          background-repeat: no-repeat;
          background-position: center;
          background-image: var(--notes-paper-text);
        }

        > .actionText:first-letter {
          text-transform: uppercase;
        }
      }
      > img {
        position: relative;
        left: 3em;
        cursor: pointer;
        width: 18px;
      }
    }

    .changePasswordButton {
      padding: 13px 50px;
      background-color: var(--green);
      font-size: 16px;
      font-weight: 400;
      border: none;
      color: var(--white);
      border-radius: var(--button-border-radius);
      cursor: pointer;
      margin-bottom: 0;
      display: flex;
      width: 100%;
      justify-content: center;
    }
  }

  .removeTransporterButton {
    display: flex;
    padding: 0;
    align-items: center;

    .buttonText {
      color: #657bb7;
      font-size: 18px;
      margin-left: 15px;
    }
  }

  /* -> Shared styles */
  .changePasswordButton {
    box-shadow: 0px 1px 1px #00000029;
  }

  .cta.routes {
    position: relative;

    .icon {
      background: #f5f7fb;
    }
  }

  .count {
    background: red;
    padding: 3px 9px;
    border-radius: 16px;
    position: absolute;
    right: 0;
    color: white;
  }
`;

export { ProfileDetailsStyle };
