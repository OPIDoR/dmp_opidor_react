import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import Global from '../context/Global.jsx';
import '../../i18n.js';
import { Toaster } from 'react-hot-toast';
import NewsPage from './NewsPage.jsx';

const toastOptions = {
  duration: 5000,
};

const queryClient = new QueryClient();

export default function NewsPageLayout({ locale = 'fr-FR', size = 3 }) {
  return (
    <Global>
      <QueryClientProvider client={queryClient}>
        <NewsPage locale={locale} size={size} />
      </QueryClientProvider>
      <Toaster position="top-center" toastOptions={toastOptions} reverseOrder={false} />
    </Global>
  )
}
