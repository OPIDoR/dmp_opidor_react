import React, { useEffect, useState } from 'react';
import TableList from '../Shared/TableList.jsx';
import useSectionsMapping from '../../hooks/useSectionsMapping.js';
import { t } from 'i18next';
import { sectionsContent, templateMapping } from '../../services';
import ContentHeading from '../Shared/ContentHeading.jsx';

function TemplateMappingsList() {
  const { 
    duplicateMapping, 
    deleteMapping,
    ANCHOR_CONTENT
  } = useSectionsMapping();
  const [sections, setSections] = useState([]);

  useEffect(() => {
    sectionsContent.getSectionsData().then(response => {
      console.log("response", response);
      const sectionsMap = response.data.reduce((acc, section) => {
        acc[section.id] = section.title;
        return acc;
      }, {});
      setSections(sectionsMap);
    });
  }, []);

  console.log("tm", templateMapping);

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
    { label: 'Edit', action: (id) => window.location.href = `/super_admin/template_mappings/${id}/edit${ANCHOR_CONTENT}` },
    { label: 'Duplicate', action: (id) => duplicateMapping(id) },
    { label: 'Delete', action: (id) => deleteMapping({id}) }
  ];  

  return (
    <>
      <ContentHeading 
        title={t('Template Mappings')} 
        rightChildren={<a href={`/super_admin/template_mappings/new${ANCHOR_CONTENT}`} className="btn btn-primary pull-right">{t('New Mapping')}</a>} 
      />
      <TableList
        dataCatcher={templateMapping.getMappings}
        columns={columns}
        actions={actions}
        defaultSortKey="created_at"
      />
    </>
  );
}

export default TemplateMappingsList;
