import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Global from '../context/Global.jsx';
import PlanCreation from './PlanCreation.jsx';
import '../../i18n';
import { clearLocalStorage } from '../../utils/utils';

const queryClient = new QueryClient();

function PlanCreationLayout({ locale }) {
  useEffect(() => {
    window.addEventListener('beforeunload', () => clearLocalStorage());
  }, []);

  return (
    <Global>
      <QueryClientProvider client={queryClient}>
        <PlanCreation
          locale={locale}
        />
      </QueryClientProvider>
    </Global>
  );
}

export default PlanCreationLayout;
