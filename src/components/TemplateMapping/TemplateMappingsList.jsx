import React, { useState, useEffect } from 'react';
import '../../i18n.js';
import useSectionsMapping from '../../hooks/useSectionsMapping.js';

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

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Mapping Type</th>
            <th scope="col">Source ID</th>
            <th scope="col">Target ID</th>
            {/* <th scope="col">Mapping Details</th> */}
            <th scope="col">Created At</th>
            <th scope="col">Updated At</th>
          </tr>
        </thead>
        <tbody>
          {mappings.map(mapping => (
            <tr key={mapping.id}>
              <td>{mapping.id}</td>
              <td>{mapping.type_mapping}</td>
              <td>{mapping.source_id}</td>
              <td>{mapping.target_id}</td>
              {/* <td dangerouslySetInnerHTML={{ __html: mapping.mapping.t || mapping.mapping['1'] }}></td> */}
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
