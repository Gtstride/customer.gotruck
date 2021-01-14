import styled from 'styled-components';

const UsersTableStyle = styled.div`
  [data-table-for*='users'] {
    thead tr {
      th:first-child {
        width: 20%;
      }
      th:nth-child(2) {
        width: 20%;
      }
      th:nth-child(3) {
        width: 15%;
      }
      th:nth-child(4) {
        width: 20%;
      }
      th:nth-child(5) {
        width: 20%;
      }
      th:last-child {
        width: 5%;
      }
    }

    #tableContent {
      .tableItem {
        .user-image {
          --dimension: 34px;
          width: var(--dimension);
          height: var(--dimension);
          border-radius: 50%;
          margin-right: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
          background-color: #cee9e1;
          text-transform: uppercase;
          overflow: hidden;
          max-width: 100%;

          img {
            height: 34px;
          }
        }

        p {
          width: 60%;
        }

        button {
          font-size: inherit;
          font-family: inherit;
          line-height: inherit;
          width: inherit;
          text-align: left;
          height: 100%;
          padding: 16px;

          span {
            background-color: var(--green);
            margin-left: 10px;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            color: var(--white);
          }
        }
      }
    }
  }
`;

export default UsersTableStyle;
