import React from 'react';
import { Toaster } from 'react-hot-toast';
import { TourProvider } from '@reactour/tour'

import Global from '../context/Global.jsx';
import WritePlan from './WritePlan.jsx'
import '../../i18n.js';

import steps from '../Shared/Tours/WritePlan.jsx';

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
  return(
    <Global>
      {/* <Joyride tourName="write_plan" steps={steps} locale={locale} run={run} setRunState={setRunState} />
      <button onClick={setRun}>Run</button> */}
      <TourProvider
        steps={steps}
        scrollSmooth={true}
        badgeContent={({ currentStep, totalSteps }) => `${currentStep + 1} / ${totalSteps}`}
        onClickClose={(props) => {}}
      >
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
      </TourProvider>
      <Toaster position="top-center" toastOptions={toastOptions} reverseOrder={false} />
    </Global>
  )
}

export default WritePlanLayout
