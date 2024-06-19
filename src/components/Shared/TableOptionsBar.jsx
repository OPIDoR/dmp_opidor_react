import React from 'react';
import { t } from 'i18next';

function TableOptionsBar({ filter, setFilter, startIndex, endIndex, totalItems, currentPage, setCurrentPage, totalPages }) {
  return <div>
    <div className='form-group pull-left'>
      <div className='input-group'>
        <span className="input-group-addon" id="search-addon">
          <span className="fas fa-magnifying-glass" aria-hidden="true"></span>
        </span>
        <input
          type="text"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder={`${t('Filter')}...`}
          name="search"
          id="search" />
      </div>
    </div>
    <div className='pull-right'>
      <span>{`${startIndex + 1}-${endIndex} ${t('of')} ${totalItems} ${t('elements')}`} </span>
      <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className='btn btn-primary'><i className='fas fa-arrow-left' /></button>
      &nbsp;
      <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className='btn btn-primary'><i className='fas fa-arrow-right' /></button>
    </div>
  </div>;
}

export default TableOptionsBar;