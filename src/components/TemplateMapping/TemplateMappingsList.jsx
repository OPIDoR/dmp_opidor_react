import React from 'react';
import TableList from '../Shared/TableList.jsx';
import useSectionsMapping from '../../hooks/useSectionsMapping.js';
import { t } from 'i18next';

function TemplateMappingsList() {
  const { getMappings } = useSectionsMapping();

  const handleRowClick = (id) => {
    window.location.href = `/super_admin/template_mappings/${id}/edit`;
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'type_mapping', label: 'Mapping Type' },
    { key: 'source_id', label: 'Source ID' },
    { key: 'target_id', label: 'Target ID' },
    { key: 'created_at', label: 'Created At', type: 'date' },
    { key: 'updated_at', label: 'Updated At', type: 'date' }
  ];

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <h1>
            {t('Template Mappings')}
            <a href="/super_admin/template_mappings/new"
              className="btn btn-primary pull-right">{t('New Mapping')}</a>
          </h1>                                                                                                                                                    
        </div>
      </div>
      <TableList
        dataCatcher={getMappings}
        columns={columns}
        defaultSortKey="id"
        onRowClick={handleRowClick}
      />
    </>
  );
}

export default TemplateMappingsList;
