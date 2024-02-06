import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import '../../i18n.js';
import NewsPage from './NewsPage.jsx';

const queryClient = new QueryClient();

export default function NewsPageLayout({ locale = 'fr-FR', size = 3 }) {
  return (
    <QueryClientProvider client={queryClient}>
      <NewsPage locale={locale} size={size} />
    </QueryClientProvider>
  )
}
