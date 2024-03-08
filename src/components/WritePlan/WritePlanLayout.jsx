import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';

import Global from '../context/Global.jsx';
import WritePlan from './WritePlan.jsx'
import '../../i18n.js';

import Joyride from './Joyride/Joyride.jsx';
import { writePlanSteps } from '../Shared/Tours';

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
  const [run, setRunState] = useState(false);

  const setRun = (event) => {
    event.preventDefault();

    setRunState(true);
  };

  return(
    <Global>
      <Joyride tourName="write_plan" steps={writePlanSteps} locale={locale} run={run} setRunState={setRunState}>
      </Joyride>
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

export default WritePlanLayout;
