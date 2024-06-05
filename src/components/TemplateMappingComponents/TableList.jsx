import React, { useEffect, useState } from 'react';
import { capitalizeFirstLetter } from '../../utils/utils.js';

const TableList = ({ columns, defaultSortKey, onRowClick, dataCatcher }) => {
  const [data, setData] = useState([]);

  const [sortConfig, setSortConfig] = useState({
    key: defaultSortKey,
    direction: 'ascending',
    icon: 'fas fa-sort-up'
  });

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

  const formatValue = (value, type) => {
    if (type === 'date') {
      return new Date(value).toLocaleDateString();
    }
    return capitalizeFirstLetter(value.toString());
  };

  return (
    <div className="table-responsive">
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
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id} onClick={() => onRowClick(item.id)} style={{ cursor: 'pointer' }}>
              {columns.map(column => (
                <td key={`${item.id}-${column.key}`}>{formatValue(item[column.key], column.type)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableList;
