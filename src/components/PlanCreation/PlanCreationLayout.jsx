import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import Global from '../context/Global;
import PlanCreation from './PlanCreation;
import '../../i18n';

const queryClient = new QueryClient();

function PlanCreationLayout({ locale, currentOrgId, currentOrgName }) {
  return (
    <Global>
      <QueryClientProvider client={queryClient}>
        <PlanCreation
          locale={locale}
          currentOrgId={currentOrgId}
          currentOrgName={currentOrgName}
        />
      </QueryClientProvider>
    </Global>
  );
}

export default PlanCreationLayout;
