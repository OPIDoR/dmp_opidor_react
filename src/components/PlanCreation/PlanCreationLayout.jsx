import React, { StrictMode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Global from '../context/Global.jsx';
import PlanCreation from './PlanCreation.jsx';
import '../../i18n';

const queryClient = new QueryClient();

function PlanCreationLayout({ locale }) {
  return (
    <StrictMode>
      <Global>
        <QueryClientProvider client={queryClient}>
          <PlanCreation
            locale={locale}
          />
        </QueryClientProvider>
      </Global>
    </StrictMode>
  );
}

export default PlanCreationLayout;
