import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import '../../i18n.js';
import GlossaryPage from './GlossaryPage.jsx';

const queryClient = new QueryClient();

export default function GlossaryLayout({ locale = 'fr-FR' }) {
  return (
    <QueryClientProvider client={queryClient}>
      <GlossaryPage locale={locale} />
    </QueryClientProvider>
  )
}
