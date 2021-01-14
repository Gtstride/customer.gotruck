// import React from 'react';
// import TableStyle from '../../styles/TableStyle';
// import { isArrayEmpty } from '../../_utils/fx';
// import EmptyTable from '../EmptyData/EmptyTable';
// import TableContent from './TableContent';
// import TableFooter from './TableFooter';
// import TableHeader from './TableHeader';
// import ContentLoader from '../Loaders/ContentLoader';

// function Table({
//   headers,
//   tableData,
//   tableFor,
//   page = undefined,
//   setModal = null,
//   showWaybill,
//   currentPage,
//   totalPage,
//   nextPage,
//   prevPage,
//   customerId,
//   loading,
//   t,
// }) {
//   if (loading) {
//     return <ContentLoader />;
//   }
//   if (isArrayEmpty(tableData)) {
//     return (
//       <main>
//         <EmptyTable errorTitle='' errorSubtitle={`${t('emptyData.noAvailableData')}`} />
//       </main>
//     );
//   }

//   return (
//     <main>
//       <TableStyle>
//         <div className='table-wrap'>
//           <table id='table' data-table-for={tableFor}>
//             <TableHeader {...{ headers }} />
//             <TableContent
//               {...{
//                 tableData,
//                 tableFor,
//                 page,
//                 setModal,
//                 showWaybill,
//                 customerId,
//               }}
//             />
//           </table>
//           {tableFor !== 'csvUploadStatus' &&
//             tableFor !== 'messages' &&
//             tableFor !== 'invoice' &&
//             tableData.length > 1 && <TableFooter {...{ currentPage, totalPage, nextPage, prevPage, t }} />}
//         </div>
//       </TableStyle>
//     </main>
//   );
// }

// export default Table;
