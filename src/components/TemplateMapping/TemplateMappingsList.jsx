import React, { useState, useEffect } from 'react';
import '../../i18n.js';
import useSectionsMapping from '../../hooks/useSectionsMapping.js';
import { capitalizeFirstLetter } from '../../utils/utils.js';

function TemplateMappingsListLayout() {
  const [mappings, setMappings] = useState([]);

  const { getMappings } = useSectionsMapping();

  useEffect(() => {
    getMappings()
      .then(response => {
        setMappings(response.data.mappings);
      })
      .catch(error => {
        console.error('There was an error fetching the mappings:', error);
      });
  }, []);

  const handleRowClick = (id) => {
    window.location.href = `/super_admin/template_mappings/${id}/edit`;
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Mapping Type</th>
            <th scope="col">Source ID</th>
            <th scope="col">Target ID</th>
            <th scope="col">Created At</th>
            <th scope="col">Updated At</th>
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

export default TemplateMappingsListLayout;
