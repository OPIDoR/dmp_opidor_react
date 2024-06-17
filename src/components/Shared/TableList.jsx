import React, { useEffect, useState } from 'react';
import { capitalizeFirstLetter } from '../../utils/utils.js';
import { t } from 'i18next';

const TableList = ({ columns, actions, defaultSortKey, onRowClick, dataCatcher, itemsPerPage = 10 }) => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('');
  const [expanded, setExpanded] = useState({});
  const [sortConfig, setSortConfig] = useState({
    key: defaultSortKey,
    direction: 'ascending',
    icon: 'fas fa-sort-up'
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dataCatcher()
      .then(response => {
        const initialMappings = response.data.mappings;
        setData(initialMappings);
        sortArray(initialMappings, sortConfig.key, sortConfig.direction);
      })
      .catch(error => {
        console.error('There was an error fetching the mappings:', error);
      });
  }, []);

  const requestSort = (key) => {
    let direction = 'ascending';
    let icon = 'fas fa-sort-up';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
      icon = 'fas fa-sort-down';
    }
    setSortConfig({ key, direction, icon });
    sortArray(data, key, direction);
  };

  const sortArray = (data, key, direction) => {
    if (!data.length) return;
    let sortedData = [...data];
    sortedData.sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setData(sortedData);
  };

  const toggleExpand = (id, key) => {
    const currentKey = `${id}-${key}`;
    setExpanded(prev => ({
      ...prev,
      [currentKey]: !prev[currentKey]
    }));
  };

  const formatValue = (value, type, formatter, id, key) => {
    if (formatter) return formatter(value);
    if (type === 'date') {
      return new Date(value).toLocaleDateString();
    }

    const stringValue = capitalizeFirstLetter(value.toString());
    if (stringValue.length <= 40) return stringValue;

    const isExpanded = expanded[`${id}-${key}`];
    const collapseData = !isExpanded
      ? {
        text: `${stringValue.substring(0, 30)}...`,
        buttonClass: 'fas fa-sort-down',
      }
      : {
        text: stringValue,
        buttonClass: 'fas fa-sort-up',
      };

    return (
      <>
        <span onClick={() => toggleExpand(id, key)} style={{ cursor: 'pointer' }}>
          {collapseData.text}<i className={collapseData.buttonClass} aria-hidden="true" style={{ cursor: "pointer", display: "inline" }}></i>
        </span>
      </>
    );
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data.length);
  const totalItems = data.length;

  const filteredData = data.filter(item => {
    return columns.some(column => formatValue(item[column.key], column.type, column.formatter, item.id, column.key).toString().toLowerCase().includes(filter.toLowerCase()));
  });

  const currentData = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="table-responsive">
      <div>
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
              id="search"
            />
          </div>
        </div>
        <div className='pull-right'>
          <span>{`${startIndex + 1}-${endIndex} ${t('of')} ${totalItems} elements`} </span>
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className='btn btn-primary'><i className='fas fa-arrow-left'/></button>
          &nbsp;
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className='btn btn-primary'><i className='fas fa-arrow-right'/></button>
        </div>
      </div>
      <table className="table table-hover">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} onClick={() => requestSort(column.key)}>
                {capitalizeFirstLetter(column.label)}
                <i className={column.key === sortConfig.key ? sortConfig.icon : 'fas fa-sort'} aria-hidden="true" style={{ float: "right", fontSize: "1.2em", cursor: "pointer" }}>
                  <span className="screen-reader-text">
                    {`${column.label} ` + (column.key === sortConfig.key && sortConfig.direction === 'ascending' ? 'sorted ascending' : 'sorted descending')}
                  </span>
                </i>
              </th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map(item => (
            <tr key={item.id} onClick={() => onRowClick && onRowClick(item.id)} style={{ cursor: onRowClick ? 'pointer' : 'initial' }}>
              {columns.map(column => (
                <td key={`${item.id}-${column.key}`}>{formatValue(item[column.key], column.type, column.formatter, item.id, column.key)}</td>
              ))}
              <td>
                <div className="dropdown">
                  <button className="btn btn-link dropdown-toggle" type="button" id={`action-${item.id}`} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Actions<span className="caret"></span>
                  </button>
                  <ul className="dropdown-menu" aria-labelledby={`action-${item.id}`}>
                    {actions.map(action => (
                      <li key={action.label}><a onClick={() => action.action(item.id)} style={{ cursor: 'pointer' }}>{action.label}</a></li>
                    ))}
                  </ul>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableList;
