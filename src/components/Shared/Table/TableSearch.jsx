import React from "react";

function TableSearch({ onSearch, searchTerm, onchange }) {
  return (
    <div className="tableSearch">
      <img
        src={require("../../../assets/icons/search.svg")}
        alt="search icon"
      />
      <form className="searchForm" onSubmit={(e) => e.preventDefault()}>
        <input
          type="search"
          name="searchTerm"
          id="searchForm"
          placeholder="Search "
          value={searchTerm}
          onChange={(e) => onSearch && onSearch(e)}
          autoComplete="off"
        />
      </form>
    </div>
  );
}

export default TableSearch;
