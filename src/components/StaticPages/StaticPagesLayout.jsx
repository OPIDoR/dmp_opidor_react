import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import '../../i18n.js';
import StaticPage from './StaticPage.jsx';

const queryClient = new QueryClient();

export default function StaticPagesLayout({ locale = 'fr-FR', page }) {
  return (
    <QueryClientProvider client={queryClient}>
      <StaticPage locale={locale} page={page} />
    </QueryClientProvider>
  )
}
