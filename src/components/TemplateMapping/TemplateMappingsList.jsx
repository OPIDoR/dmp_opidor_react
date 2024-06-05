import React, { useState, useEffect } from 'react';
import '../../i18n.js';
import useSectionsMapping from '../../hooks/useSectionsMapping.js';
import { capitalizeFirstLetter } from '../../utils/utils.js';

function TemplateMappingsList() {
  const [mappings, setMappings] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: 'id', // Set a default sort key
    direction: 'ascending',
    icon: 'fas fa-sort-up'
  });

  const { getMappings } = useSectionsMapping();

  useEffect(() => {
    getMappings()
     .then(response => {
        const initialMappings = response.data.mappings;
        setMappings(initialMappings);
        sortArray(initialMappings, sortConfig.key, sortConfig.direction);
      })
     .catch(error => {
        console.error('There was an error fetching the mappings:', error);
      });
  }, []);

  const handleRowClick = (id) => {
    window.location.href = `/super_admin/template_mappings/${id}/edit`;
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    let icon = 'fas fa-sort-up';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
      icon = 'fas fa-sort-down';
    } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
      direction = 'ascending'; // Back to no sort state
      icon = 'fas fa-sort-up';
    }
    setSortConfig({ key, direction, icon });
    sortArray(mappings, key, direction);
  };

  const sortArray = (data, key, direction) => {
    if (!data.length) return; //  Checks if data is loaded
    let sortedMappings = [...data];
    if (direction !== '') {
      sortedMappings.sort((a, b) => {
        if (a[key] < b[key]) {
          return direction === 'ascending' ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    setMappings(sortedMappings);
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            {['id', 'type_mapping', 'source_id', 'target_id', 'created_at', 'updated_at'].map((key) => (
              <th key={key} scope="col" onClick={() => requestSort(key)}>
                {capitalizeFirstLetter(key.replace('_', ' '))}
                <i className={key === sortConfig.key ? sortConfig.icon : 'fas fa-sort'} aria-hidden="true" style={{
                  float: "right", 
                  fontSize: "1.2em",
                }}>
                  <span className="screen-reader-text">
                    {`${key.replace('_', ' ')} ` + (key === sortConfig.key && sortConfig.direction === 'ascending' ? 'sorted ascending' : 'sorted descending')}
                  </span>
                </i>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mappings.map(mapping => (
            <tr key={mapping.id} onClick={() => handleRowClick(mapping.id)} style={{ cursor: 'pointer' }}>
              <td>{mapping.id}</td>
              <td>{capitalizeFirstLetter(mapping.type_mapping)}</td>
              <td>{mapping.source_id}</td>
              <td>{mapping.target_id}</td>
              <td>{new Date(mapping.created_at).toLocaleDateString()}</td>
              <td>{new Date(mapping.updated_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TemplateMappingsList;
