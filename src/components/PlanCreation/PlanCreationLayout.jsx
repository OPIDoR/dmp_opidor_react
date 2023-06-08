import React from 'react';

import Global from '../context/Global.jsx';
import PlanCreation from './PlanCreation.jsx';
import '../../i18n';

function PlanCreationLayout({locale, currentOrgId, currentOrgName}) {
  return (
    <Global>
      <PlanCreation 
        locale={locale}
        currentOrgId={currentOrgId} 
        currentOrgName={currentOrgName}  />
    </Global>
  );
}

export default PlanCreationLayout;
