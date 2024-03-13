import React, { useState, useEffect } from 'react';
import ReactJoyride, { STATUS, EVENTS } from 'react-joyride';
import { useTranslation } from 'react-i18next';
import JoyrideTooltip from './JoyrideTooltip.jsx';
import { guidedTour } from '../../../services/index.js';
import { useTour } from './JoyrideContext.jsx';

function Joyride({ locale = 'fr_FR', tourName, children, steps }) {
  const { t, i18n } = useTranslation();

  const { isOpen, setIsOpen } = useTour();

  const localeSteps = {
    skip: t('Ignore the guided tour'),
    back: t('Previous'),
    next: t('Next'),
    close: t('Close'),
    last: t('Finish'),
  };

  steps = steps.map((step) => ({ ...step, locale: localeSteps }))

  const [guidedTourSteps, setGuidedTourSteps] = useState({
    stepIndex: 0,
    steps,
  });

  const [ended, setEnded] = useState(false);

  useEffect(() => {
    i18n.changeLanguage(locale.substring(0, 2));
    guidedTour.getTour(tourName)
      .then(({ data }) => {
        setGuidedTourSteps((prevState) => ({ ...prevState, run: isOpen || !data?.tour?.ended }));
        setIsOpen(isOpen || !data?.tour?.ended);
        setEnded(data?.tour?.ended);
      });
  }, [isOpen]);

  const handleJoyrideCallback = (data) => {
    const { status, index, type } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setGuidedTourSteps((prevState) => ({ ...prevState, run: false }));
      setIsOpen && setIsOpen(false);
      // TODO dont make query when ended is true in database (run button)
      !ended && guidedTour.endTour(tourName).then(({ data }) => setEnded(data?.tour?.ended));
    }

    if (type === EVENTS.TOOLTIP_CLOSE) {
      setGuidedTourSteps((prevState) => ({ ...prevState, stepIndex: index + 1 }));
    }
  };

  const joyrideTooltip = (props) => {
    const {
      tooltipProps,
      backProps,
      continuous,
      index,
      primaryProps,
      skipProps,
      step,
      size,
    } = props;

    return (
      <JoyrideTooltip {...tooltipProps }>
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
  };

  return (
    <>
      {isOpen && (
        <ReactJoyride
          callback={handleJoyrideCallback}
          continuous
          hideCloseButton
          run={guidedTourSteps.run}
          scrollToFirstStep
          showProgress
          showSkipButton
          steps={guidedTourSteps.steps}
          styles={{
            options: {
              zIndex: 10000,
              arrowColor: 'var(--rust)',
            },
          }}
          tooltipComponent={joyrideTooltip}
        />
      )}
      {children}
    </>
  );
}

export default Joyride;
