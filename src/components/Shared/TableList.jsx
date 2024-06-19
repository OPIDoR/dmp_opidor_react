import React, { useEffect, useState } from 'react';
import { capitalizeFirstLetter } from '../../utils/utils.js';
import { t } from 'i18next';
import TableOptionsBar from './TableOptionsBar.jsx';

function TableList ({ columns, actions, defaultSortKey, onRowClick, dataCatcher, itemsPerPage = 10 }) {
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
    if (stringValue.length <= 30) return stringValue;

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
      <TableOptionsBar 
        filter={filter}
        setFilter={setFilter}
        startIndex={startIndex}
        endIndex={endIndex}
        totalItems={totalItems}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
      <table className="table table-hover">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} onClick={() => requestSort(column.key)}>
                {capitalizeFirstLetter(t(column.label))}
                <i className={column.key === sortConfig.key ? sortConfig.icon : 'fas fa-sort'} aria-hidden="true" style={{ float: "right", fontSize: "1.2em", cursor: "pointer" }}>
                  <span className="screen-reader-text">
                    {`${column.label} ` + (column.key === sortConfig.key && sortConfig.direction === 'ascending' ? 'sorted ascending' : 'sorted descending')}
                  </span>
                </i>
              </th>
            ))}
            <th>{t('Actions')}</th>
          </tr>
        </thead>
        <tbody>
          {currentData.length === 0 && (
            <tr>
              <td colSpan={columns.length + 1} className='text-center'>
                <i className='fas fa-exclamation-circle' /> <strong>{t('No data found')}</strong>
              </td>
            </tr>
          )}
          {currentData.map(item => (
            <tr key={item.id} onClick={() => onRowClick && onRowClick(item.id)} style={{ cursor: onRowClick ? 'pointer' : 'initial' }}>
              {columns.map(column => (
                <td key={`${item.id}-${column.key}`}>{formatValue(item[column.key], column.type, column.formatter, item.id, column.key)}</td>
              ))}
              <td>
                <div className="dropdown">
                  <button className="btn btn-link dropdown-toggle" type="button" id={`action-${item.id}`} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {t('Actions')}<span className="caret"></span>
                  </button>
                  <ul className="dropdown-menu" aria-labelledby={`action-${item.id}`}>
                    {actions.map(action => (
                      <li key={action.label}><a onClick={() => action.action(item.id)} style={{ cursor: 'pointer' }}>{t(action.label)}</a></li>
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