import * as React from "react";
// import { ReactNode } from 'react';
// import "./Table.scss";
import "../../../styles/css/Table.scss";
import { uuid } from "../../../_utils/fx";
import Button from "../Button/Button";
import TableSearch from "./TableSearch";
import Empty from "../Empty/Empty";

const renderNestedObj = (key, data) => {
  let arr = key.split(".");
  return data[arr[0]][arr[1]];
};

const Body = (props) => {
  return (
    <tbody className="tableBody">
      {props.data.length
        ? props.data.map((d) => {
            return (
              <tr
                className="tableRow"
                onClick={(e) => {
                  props.onRowClick && props.onRowClick(d, e);
                }}
                key={uuid()}
              >
                {props.headings.map((col) => (
                  <td className="tableData" key={uuid()}>
                    <div className="tableItems">
                      <p
                        className="tableItem"
                        onClick={(e) => col.onClick && col.onClick(d, e)}
                      >
                        {col.formatter
                          ? col.formatter(d)
                          : col && col.key && col.key.includes(".")
                          ? renderNestedObj(col.key, d)
                          : d[col.key]}
                      </p>
                    </div>
                  </td>
                ))}
                {props.options ? (
                  <td key={uuid()} className="tableData action-bg">
                    <div className="tableItems">
                      <img
                        onClick={() => props.options && props.options()}
                        src={require("../../../assets/icons/option.svg")}
                        alt=""
                      />
                    </div>
                  </td>
                ) : (
                  ""
                )}
                {props.toggle ? (
                  <td key={uuid()} className="tableData action-bg">
                    <div className="tableItems">
                      <img
                        onClick={() => props.options && props.options()}
                        src={require("../../../assets/icons/option.svg")}
                        alt=""
                      />
                    </div>
                  </td>
                ) : (
                  ""
                )}
              </tr>
            );
          })
        : ""}
    </tbody>
  );
};

function Table(props) {
  return (
    <div className={`tableContainer ${props.className ? props.className : ""}`}>
      {props.topTab ? (
        <div className="tableContainer__helmet-toggle pointer">
          {props.topTab}
        </div>
      ) : (
        ""
      )}
      {props.showHelmet ? (
        <div
          className={`tableContainer__helmet ${
            props.exportLink ||
            props.exportList ||
            props.onFilter ||
            props.onExport ||
            props.title ||
            props.onResetFilter
              ? "justify-space-between"
              : "justify-end"
          }`}
        >
          {props.title ? <h2 className="tableTitle">{props.title}</h2> : ""}
          <div className="filters">
            {props.exportList && (
              <a
                href={props.exportLink}
                rel="noopener noreferrer"
                className="button--outline button--sm  pointer"
              >
                Export List
              </a>
            )}
            {props.onExport && (
              <span
                onClick={props.onExport}
                className="button--outline button--sm  pointer"
              >
                {props.downloadTitle ? props.downloadTitle : "Export List"}
              </span>
            )}

            {props.onFilter ? (
              <>
                <Button
                  type={"button"}
                  className="button--outline button--sm"
                  title="reset filter"
                  onClick={props.onResetFilter}
                />
                <Button
                  type={"button"}
                  className="button--outline button--sm"
                  onClick={props.onFilter}
                  title={`${props.filterTitle ? props.filterTitle : "Filter"}`}
                />
                {props.renderFilter ? props.renderFilter : ""}
              </>
            ) : (
              ""
            )}
          </div>

          {props.onSearch ? (
            <TableSearch
              // onchange={props.onSearchChange}
              searchTerm={props.searchTerm}
              onSearch={props.onSearch}
            />
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}

      {props.loading ? (
        <Empty loading={props.loading} />
      ) : props.data.length ? (
        <table>
          <Header headings={props.headings} />
          <Body
            data={props.data}
            onRowClick={props.onRowClick}
            headings={props.headings}
          />
        </table>
      ) : (
        <Empty description={"No Data at the moment"} />
      )}

      {props.paginated || props.exportList ? (
        <Footer>
          {/*{props.exportList && (*/}
          {/*  <a*/}
          {/*    href={props.exportLink}*/}
          {/*    rel="noopener noreferrer"*/}
          {/*    className="button--outline button--sm  pointer"*/}
          {/*  >*/}
          {/*    Export List*/}
          {/*  </a>*/}
          {/*)}*/}
          {props.paginated && (
            <Pagination
              currentPage={props.currentPage}
              totalPages={props.totalPages}
              onNext={props.onNext}
              onPrev={props.onPrev}
            />
          )}
        </Footer>
      ) : (
        ""
      )}
    </div>
  );
}

const Header = (props) => {
  return (
    <thead className="tableHeading">
      <tr className="tableRow">
        {props.headings.map((heading) => (
          <th className="tableHeader" key={uuid()}>
            <span className="tableTitle">{heading.title}</span>
          </th>
        ))}
        {props.options && (
          <th
            className="tableHeader"
            onClick={() => props.options && props.options()}
            key={uuid()}
          >
            <span className="tableTitle">&nbsp;</span>
          </th>
        )}
      </tr>
    </thead>
  );
};

const Pagination = ({ onPrev, onNext, currentPage, totalPages, className }) => {
  return (
    <div className={`table-footer-new ${className ? className : ""}`}>
      {currentPage && currentPage > 1 && (
        <i
          onClick={() => onPrev && onPrev()}
          className="fas fa-chevron-left pointer pagination-control"
        />
      )}
      &nbsp;
      <span className="table-footer-new__current-page">{currentPage}</span>
      &nbsp; of {totalPages} &nbsp;
      {currentPage !== totalPages && (
        <i
          onClick={() => onNext && onNext()}
          className="fas fa-chevron-right pointer pagination-control"
        />
      )}
    </div>
  );
};

const Footer = ({ children }) => {
  return (
    <div className="tableContainer__footer d-flex align-center justify-end">
      {children}
    </div>
  );
};

Table.Header = Header;
Table.Body = Body;
Table.Pagination = Pagination;

export default Table;
