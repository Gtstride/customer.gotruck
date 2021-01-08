import React from 'react';
import { CSVStatusColumns } from '../Tables/TableColumns';
import { uuid } from '../../_utils/fx';

function CSVUploadStatusTable({ csvs }) {
  function getFileName(url) {
    return url.substr(url.lastIndexOf('/') + 1);
  }

  return csvs.map(({ url, total, noSuccess, noError, status }) => {
    const fileNameColumnValues = { fileName: getFileName(url), url };
    const totalRouteColumnValues = { total };
    const successfulColumnValues = { noSuccess };
    const errorColumnValues = { noError };
    const statusColumnValues = { status };

    return (
      <tr key={uuid()} className='noClick'>
        <CSVStatusColumns.FileNameColumn {...fileNameColumnValues} />
        <CSVStatusColumns.TotalRouteColumn {...totalRouteColumnValues} />
        <CSVStatusColumns.SuccessfulColumn {...successfulColumnValues} />
        <CSVStatusColumns.ErrorColumn {...errorColumnValues} />
        <CSVStatusColumns.StatusColumn {...statusColumnValues} />
      </tr>
    );
  });

  // return csvs.map() => {
  //   return <h1>ddj</h1>
  // }
}

export default CSVUploadStatusTable;

// const fileNameColumnValues = { fileName: getFileName(url) };
//     // const totalRouteColumnValues = { total };
//     // const successfulColumnValues = { noSuccess };
//     // const errorColumnValues = { noError };
//     // const statusColumnValues = { status };

//     return (
//       <tr key={uuid()}>
//         <CSVStatusColumns.FileNameColumn {...fileNameColumnValues} />
//         {/* <TotalRouteColumn {...totalRouteColumnValues} />
//         <SuccessfulColumn {...successfulColumnValues} />
//         <ErrorColumn {...errorColumnValues} />
//       <StatusColumn {...statusColumnValues} /> */}
//       </tr>
//     );
