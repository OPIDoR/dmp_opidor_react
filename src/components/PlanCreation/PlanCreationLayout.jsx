import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import '../../i18n';

import Global from '../context/Global.jsx';
import PlanCreation from './PlanCreation.jsx';
import { SectionsMappingProvider } from '../context/SectionsMappingContext.jsx';

const queryClient = new QueryClient();

function PlanCreationLayout({ locale, currentOrgId, currentOrgName }) {
  return (
    <Global>
      <SectionsMappingProvider>
        <QueryClientProvider client={queryClient}>
          <PlanCreation
            locale={locale}
            currentOrgId={currentOrgId}
            currentOrgName={currentOrgName}
          />
        </QueryClientProvider>
      </SectionsMappingProvider>
    </Global>
  );
}

export default PlanCreationLayout;
