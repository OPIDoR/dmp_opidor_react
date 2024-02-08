import React, { useState, useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import Joyride, { STATUS, EVENTS } from 'react-joyride';

import Global from '../context/Global.jsx';
import WritePlan from './WritePlan.jsx'
import JoyrideTooltip from './Joyride/JoyrideTooltip.jsx';
import '../../i18n.js';
import JoyrideBeacon from './Joyride/JoyrideBeacon.jsx';

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

  const localeSteps = {
    skip: 'Ignorer la visite guidée',
    back: 'Précédent',
    next: 'Suivant',
    close: 'Fermer',
    last: 'Terminer',
  };
  const title = 'Découvrez les fonctionnalités de rédaction';

  const [steps, setSteps] = useState({
    run: true,
    steps: [
      {
        title,
        content: (
          <>
            Je suis capable du meilleur et du pire. Mais dans le pire, c'est moi le meilleur.
            <img src="https://picsum.photos/300/200" alt="Image" />
          </>
        ),
        locale: localeSteps,
        placement: 'center',
        target: 'body',
      },
      {
        title,
        content: 'Ce n\'est pas parce qu\'ils sont nombreux à avoir tort qu\'ils ont forcément raison.',
        locale: localeSteps,
        target: '.research-outputs-tabs',
      },
    ],
  });

  console.log('ATOTOTOTOTOTO')

  const joyrideRef = useRef('joyride-ref');

  const handleClickStart = (event) => {
    event.preventDefault();

    setSteps({
      run: true,
      steps: steps.steps,
    });
  };

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED, EVENTS.TARGET_NOT_FOUND];

    if (finishedStatuses.includes(status)) {
      setSteps({
        run: false,
        steps: steps.steps,
      });
    }
  };

  const joyrideTooltip = (props) => {
    const {
      backProps,
      continuous,
      index,
      primaryProps,
      skipProps,
      step,
      size,
    } = props;

    return (
      <JoyrideTooltip {...props } ref={joyrideRef}>
        <JoyrideTooltip.Header index={index} size={size}>
          <JoyrideTooltip.Title>
            {step?.title && (<>{step.title}</>) }
          </JoyrideTooltip.Title>
        </JoyrideTooltip.Header>

        <JoyrideTooltip.Body>
          {step.content}
        </JoyrideTooltip.Body>

        <JoyrideTooltip.Footer>
          {skipProps && <JoyrideTooltip.Button { ...skipProps } type="link" style={{ width: '90px' }} />}
          <JoyrideTooltip.Spacer />
          <div>
            {backProps && index > 0 && (
              <JoyrideTooltip.Button { ...backProps } style={{ marginRight: '10px' }} />
            )}
            {primaryProps && <JoyrideTooltip.Button { ...primaryProps } title={continuous ? primaryProps.title : skipProps.title} />}
          </div>
        </JoyrideTooltip.Footer>
      </JoyrideTooltip>
    );
  }

  return(
    <Global>
      <Joyride
        callback={handleJoyrideCallback}
        continuous
        hideCloseButton
        run={steps.run}
        scrollToFirstStep
        showProgress
        showSkipButton
        steps={steps.steps}
        styles={{
          options: {
            zIndex: 10000,
            arrowColor: 'var(--rust)',
          },
        }}
        // beaconComponent={(props) => <JoyrideBeacon { ...props } ref={joyrideRef} />}
        // tooltipComponent={joyrideTooltip}
      />
      <button onClick={(e) => handleClickStart(e)}>Visite guidée</button>
      <WritePlan
        planId={planId}
        templateId={templateId}
        locale={locale}
        userId={userId}
        currentOrgId={currentOrgId}
        currentOrgName={currentOrgName}
        readonly={readonly}
      />
      <Toaster position="top-center" toastOptions={toastOptions} reverseOrder={false} />
    </Global>
  )
}

export default WritePlanLayout
