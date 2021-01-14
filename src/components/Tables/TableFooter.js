import React from 'react';

function TableFooter({ currentPage, totalPage, nextPage, prevPage, t }) {
  return (
    <div id='tableFooter'>
      {currentPage > 1 && (
        <i className='material-icons pointer' onClick={prevPage}>
          chevron_left
        </i>
      )}
      &nbsp;
      <div className='currentPage'>{currentPage}</div>
      &nbsp; {t('pagination.of')} &nbsp;
      <div className='totalPages'>{totalPage}</div>
      {currentPage < totalPage && (
        <i className='material-icons pointer' onClick={nextPage}>
          chevron_right
        </i>
      )}
    </div>
  );
}

export default TableFooter;
