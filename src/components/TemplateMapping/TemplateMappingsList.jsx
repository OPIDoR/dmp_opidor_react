import React, { useEffect, useState } from 'react';
import TableList from '../Shared/TableList.jsx';
import useSectionsMapping from '../../hooks/useSectionsMapping.js';
import { t } from 'i18next';
import useTemplate from '../../hooks/useTemplate.js';

function TemplateMappingsList() {
  const { getMappings, duplicateMapping, deleteMapping } = useSectionsMapping();
  const { getSectionsData } = useTemplate();
  const [sections, setSections] = useState([]);

  useEffect(() => {
    getSectionsData().then(response => {
      const sectionsMap = response.data.reduce((acc, section) => {
        acc[section.id] = section.title;
        return acc;
      }, {});
      setSections(sectionsMap);
    });
  }, []);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name'},
    { key: 'type_mapping', label: 'Type' },
    { key: 'source_id', label: 'Source', formatter: (id) => sections[id] || id },
    { key: 'target_id', label: 'Target', formatter: (id) => sections[id] || id },
    { key: 'created_at', label: 'Created At', type: 'date' },
    { key: 'updated_at', label: 'Updated At', type: 'date' }
  ];

  const actions = [
    { label: t('Duplicate'), action: (id) => duplicateMapping(id) },
    { label: t('Edit'), action: (id) => window.location.href = `/super_admin/template_mappings/${id}/edit` },
    { label: t('Delete'), action: (id) => deleteMapping(id) }
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
        actions={actions}
        defaultSortKey="created_at"
      />
    </>
  );
}

export default TemplateMappingsList;
