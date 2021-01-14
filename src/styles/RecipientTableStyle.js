import styled from 'styled-components';

const RecipientTableStyle = styled.div`
  [data-table-for*='recipients'] {
    thead tr {
      th:first-child {
        width: 20%;
      }
      th:nth-child(2) {
        width: 15%;
      }
      th:nth-child(3) {
        width: 15%;
      }
      th:last-child {
        width: 10%;
      }
    }

    #tableContent {
      .tableItem {
        padding: 0;

        p {
          width: 100%;
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

    /* Important: use this for when new rows are added */
    /* tbody tr:first-child {
      animation: showAddedRow 2s ease-in;
    }

    @keyframes showAddedRow {
      from {
        background-color: #f4f2f0;
      }

      to {
        background-color: transparent;
      }
    } */
  }
`;

export default RecipientTableStyle;
