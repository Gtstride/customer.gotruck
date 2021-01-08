import styled from 'styled-components';

const GlobalNavStyle = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 20px;
  z-index: 99999;
  background-color: var(--white);
  border: 1px solid #d4e5f9;

  .pageTitle {
    font-size: 24px;
    text-transform: uppercase;
  }

  .navTitle {
    font-size: 25px;
    text-transform: uppercase;
    font-family: var(--font-bold);
  }

  .globalNavLeftContent {
    display: flex;
    align-items: center;
  }

  .separator {
    width: 2px;
    background: #a5dcc4;
    margin: 0 20px;
    height: 26.4px;
  }

  .tripDetailsTitle {
    font-size: 14px;
    color: #999;
    margin-bottom: 5px;
  }

  .tripDetailsTitle::first-letter {
    text-transform: uppercase;
  }

  .tripId {
    font-size: 14px;
    color: #000;
    text-transform: uppercase;
  }

  .globalNavRightContent {
    display: flex;
    align-items: center;
  }

  .notificationBlock {
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .profileInfoBlock {
    margin-left: 25px;
    display: flex;
  }

  .profileInfo {
    margin-right: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .profileNameBlock {
    position: relative;

    .popupBlock {
      max-height: 250px;
      overflow: auto;
    }

    button {
      font-size: inherit;
      text-transform: inherit;
      font-family: inherit;
      padding: 0;
    }
  }

  .profileName,
  .languageSwitcherLabel {
    font-size: 14px;
    text-transform: uppercase;
    font-family: var(--font-bold);
  }

  .profileRole {
    color: #36b37e;
    font-size: 12px;
    text-align: right;
    text-transform: capitalize;
  }

  .profileAvatarBlock,
  .languageSwitcherBlock {
    position: relative;
  }

  .popupTriggerBtn {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .popupBlock {
    position: absolute;
    background-color: white;
    box-shadow: 0px 2px 8px #00000022;
    /* width: max-content; */
    left: 1em;
    border-radius: 5px;
    transform: translateX(-30px);
    width: 100px;
    text-align: center;

    li {
      > * {
        padding: 10px;
        cursor: pointer;
        border-radius: 5px;
        color: #000;
        display: block;
        font-size: 14px;
      }

      > div::first-letter {
        text-transform: capitalize;
      }

      > button {
        text-align: center;
      }
      > *:hover {
        background-color: #f4f2f0;
      }
    }
  }
  .popBlock {
    width: 150px !important;
    z-index: 1;
    margin-top: 1.5em;
  }

  .logOutBtn {
    width: 100%;
    background-color: transparent;
    text-align: left;
    cursor: pointer;

    &:hover {
      background-color: #f4f2f0;
    }
  }

  .popupTriggerBtn {
    background-color: transparent;
  }

  .profileAvatar {
    --dimension: 34px;
    background: #213c84;
    border-radius: 50%;
    width: var(--dimension);
    height: var(--dimension);

    img {
      height: 100%;
      border-radius: inherit;
    }
  }

  .profileAvatar,
  .languageSwitcherLabel {
    margin-right: 10px;
  }

  .fmcg,
  .regular {
    background-color: #cfeae2;
    color: #36b37e;
    padding: 3px;
    border-radius: 5px;
    display: inline-block;
  }

  .container {
    background-color: #ccd4e8;
    color: #3653a1;
    padding: 3px;
    border-radius: 5px;
    display: inline-block;
  }

  .bulk {
    background-color: #f6e8ce;
    color: #f9ac19;
    padding: 3px;
    border-radius: 5px;
    display: inline-block;
  }

  .logoBlock {
    width: 100px;
    height: 40px;
    display: inline-block;
    background-position: 50% 25%;
    background-repeat: no-repeat;
    background-size: contain;
    margin: 0px;
    background-color: white;
  }
`;

export default GlobalNavStyle;
