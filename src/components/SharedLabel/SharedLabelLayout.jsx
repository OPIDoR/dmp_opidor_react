import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import '../../i18n.js';

export default function SharedLabelLayout({ planId, clients }) {
  const { t } = useTranslation();
  const [clientsData, setClientsData] = useState(clients);

  useEffect(() => {
    const handleRefresh = (e) => {
      setClientsData(e.detail.message.clients);
    };

    window.addEventListener('trigger-refresh-shared-label', handleRefresh);

    return () => {
      window.removeEventListener('trigger-refresh-shared-label', handleRefresh);
    };
  }, []);

  return (
    <span>
      {clientsData?.length > 0 && (
        <a href={`/plans/${planId}/share`}>
          <button className="btn btn-primary">{
            t('Plan shared with {{names}}', {
              // names: clientsData.map(({ name }) => name).join(', ')
              names: clientsData.find(({ name }) => name.toLowerCase() === 'anr')?.name
            })
          }</button>
        </a>
      )}
    </span>
  );
}

