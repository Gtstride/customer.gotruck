import styled from 'styled-components';

const FilterStyle = styled.div`
  input[type='checkbox'] {
    display: none;
    width: initial;
    height: initial;
    font-size: initial;
    font-weight: initial;
    font-size: initial;
    font-family: initial;
    background-color: initial;
    border-radius: initial;
    padding: initial;
  }

  .filter__block {
    position: absolute;
    width: 250px;
    left: 0;
    top: 41px;
    background: white;
    box-shadow: 0 0 0 1px rgba(136, 152, 170, 0.1), 0 15px 35px 0 rgba(49, 49, 93, 0.1),
      0 5px 15px 0 rgba(0, 0, 0, 0.13);
    border-radius: 4px;
  }

  .filterItemDropdown__block,
  .collapsible-content {
    box-shadow: inset 0 -1px #e3e8ee;
  }

  .filter__title {
    text-transform: capitalize;
    font-size: 14px;
    color: #282a3c;
    font-family: var(--font-bold);
  }

  label[for*='dropdown'] {
    min-height: 30px;
    display: flex;
    align-items: center;
    padding-left: 24px;
    padding-right: 10px;
    margin: 5px 0;
  }

  .toggle-date:checked + .date-label + .collapsible-content,
  .toggle-date__range:checked + .date__range-label + .collapsible-content,
  .toggle-status:checked + .status-label + .collapsible-content,
  .toggle-location:checked + .location-label + .collapsible-content,
  .toggle-trip__source:checked + .trip-Source__label + .collapsible-content,
  .toggle-trip__destination:checked + .trip-destination__label + .collapsible-content {
    max-height: 300px;
  }

  .collapsible-content {
    max-height: 0px;
    overflow: hidden;
    transition: max-height 0.3s cubic-bezier(0.64, 0.57, 0.67, 1.53);
  }

  /* other styles */

  .filterForm__container {
    background: #f5f7fb;
    display: flex;
  }

  .selectContainer {
    display: flex;
    margin: 5px 0;
    padding: 0 5px 0 30px;
    width: 100%;
    position: relative;
  }

  .select-arrow {
    display: none;
    color: rgb(51, 51, 51);
    right: 0px;
    top: 50%;
    width: 30px;
    position: absolute;
    display: block;
    z-index: 10;
    margin: 0px;
    pointer-events: none;
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
  }

  #status,
  select {
    width: 100%;
    border: none;
    font-size: 14px;
    text-transform: capitalize;
    font-size: 13px;
    color: #282a3c;
    font-family: var(--font-bold);
    -moz-appearance: none;
    -webkit-appearance: none;
    background: transparent;
    padding: 5px;
    border: 2px solid #ddd;
    border-radius: 5px;
  }

  #dateFrom,
  #dateTo {
    font-size: 13px;
    font-family: var(--font-bold);
    border: 2px solid #ddd;
    font-family: var(--font-bold);
    border-radius: 5px;
  }

  .dateFrom,
  .dateTo {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    justify-items: center;

    > h2 {
      text-transform: capitalize;
      font-size: 14px;
      color: #282a3c;
      font-family: var(--font-bold);
      font-style: italic;
    }
  }

  .dateRangeContainer {
    padding: 0 5px 0 30px;
    width: 100%;
    display: grid;
    gap: 10px;
    margin: 5px 0;
  }
`;

export default FilterStyle;
