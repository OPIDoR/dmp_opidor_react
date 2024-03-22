import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import '../../i18n.js';
import HelpPage from './HelpPage.jsx';

const queryClient = new QueryClient();

export default function HelpLayout({ locale = 'fr-FR' }) {
  return (
    <QueryClientProvider client={queryClient}>
      <HelpPage locale={locale} />
    </QueryClientProvider>
  )
}
