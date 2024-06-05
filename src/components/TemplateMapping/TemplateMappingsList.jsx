import React, { useState, useEffect } from 'react';
import TableList from '../TemplateMappingComponents/TableList';
import useSectionsMapping from '../../hooks/useSectionsMapping.js';
import { format } from 'date-fns';

function TemplateMappingsList() {
  const { getMappings } = useSectionsMapping();

  const handleRowClick = (id) => {
    window.location.href = `/super_admin/template_mappings/${id}/edit`;
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'type_mapping', label: 'Type Mapping' },
    { key: 'source_id', label: 'Source ID' },
    { key: 'target_id', label: 'Target ID' },
    { key: 'created_at', label: 'Created At', type: 'date' },
    { key: 'updated_at', label: 'Updated At', type: 'date' }
  ];

  return (
    <TableList
      dataCatcher={getMappings}
      columns={columns}
      defaultSortKey="id"
      onRowClick={handleRowClick}
    />
  );
}

export default TemplateMappingsList;
