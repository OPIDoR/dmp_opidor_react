import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';

import Global from '../context/Global.jsx';
import WritePlan from './WritePlan.jsx'
import Joyride from './Joyride/Joyride.jsx';
import '../../i18n.js';

const toastOptions = {
  duration: 5000,
};

function WritePlanLayout({
  planId,
  templateId,
  locale = 'en_GB',
  userId,
  currentOrgId,
  currentOrgName,
  readonly,
}) {

  const steps = [
    {
      title: 'Découvrez les fonctionnalités de rédaction',
      content: (
        <>
          Je suis capable du meilleur et du pire. Mais dans le pire, c'est moi le meilleur.
          <img src="https://picsum.photos/300/200" alt="Image" />
        </>
      ),
      placement: 'center',
      target: 'body',
    },
    {
      title: 'Découvrez ou sont les commentaires',
      content: 'Ce n\'est pas parce qu\'ils sont nombreux à avoir tort qu\'ils ont forcément raison.',
      placementBeacon: 'top',
      target: '.research-outputs-tabs',
    },
  ];

  const [run, setRunState] = useState(false);

  const setRun = (event) => {
    event.preventDefault();

    setRunState(true);
  }

  return(
    <Global>
      <Joyride tourName="write_plan" steps={steps} locale={locale} run={run} setRunState={setRunState} />
      <button onClick={setRun}>Run</button>
      <WritePlan
        planId={planId}
        templateId={templateId}
        locale={locale}
        userId={userId}
        currentOrgId={currentOrgId}
        currentOrgName={currentOrgName}
        readonly={readonly}
        className="research-outputs-tabs"
      />
      <Toaster position="top-center" toastOptions={toastOptions} reverseOrder={false} />
    </Global>
  )
}

export default WritePlanLayout
