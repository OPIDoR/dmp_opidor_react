import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import '../../i18n.js';
import StaticPage from './StaticPage.jsx';

const queryClient = new QueryClient();

export default function StaticPagesLayout({ locale = 'fr-FR', page, directusUrl }) {
  return (
    <QueryClientProvider client={queryClient}>
      <StaticPage locale={locale} page={page} directusUrl={directusUrl} />
    </QueryClientProvider>
  )
}
