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
    open: t('Resume guided tour'),
    last: t('Finish'),
  };

  steps = steps.map((step) => ({ ...step, locale: localeSteps }))

  const [guidedTourSteps, setGuidedTourSteps] = useState({
    steps,
    run: false,
  });

  const [ended, setEnded] = useState(false);

  useEffect(() => {
    i18n.changeLanguage(locale.substring(0, 2));
    const elements = steps.map(({ target }) => target);
    handleRenderedChildren(elements);
  }, [isOpen]);

  const handleRenderedChildren = (childrenTags) => {
    const allChildrenRendered = childrenTags.every((tag) => document.querySelector(tag) !== null);

    if (!allChildrenRendered) {
      return setTimeout(() => handleRenderedChildren(childrenTags), 100);
    }

    return guidedTour.getTour(tourName)
      .then(({ data }) => {
        setGuidedTourSteps((prevState) => ({ ...prevState, run: isOpen || !data?.tour?.ended }));
        setIsOpen(isOpen || !data?.tour?.ended);
        setEnded(data?.tour?.ended);
      });
  };

  const handleJoyrideCallback = (data) => {
    const { status, type } = data;

    const NAVBAR_HEIGHT = document.querySelector('.main-nav').getBoundingClientRect().height || 60;

    const currentStep = steps[data.index];

    if (![STATUS.FINISHED, STATUS.SKIPPED].includes(status) && ['step:before', 'step:after'].includes(data.type) && currentStep.scroll) {
      setTimeout(() => {
        const target = document.querySelector(data.step?.target);
        if (target) {
          const rect = target.getBoundingClientRect();
          const scrollTop = window.scrollY + rect.top - NAVBAR_HEIGHT - 20;

          window.scrollTo({
            top: scrollTop,
            behavior: 'smooth',
          });
        }
      }, 100);
    }

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setGuidedTourSteps((prevState) => ({ ...prevState, run: false }));
      setIsOpen && setIsOpen(false);
      // TODO dont make query when ended is true in database (run button)
      !ended && guidedTour.endTour(tourName).then(({ data }) => setEnded(data?.tour?.ended));
    }

    if (type === EVENTS.TOOLTIP_CLOSE) {
      setGuidedTourSteps((prevState) => ({ ...prevState, run: false }));
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
            {backProps && (index > 0 && index < (steps.length - 1)) && (
              <JoyrideTooltip.Button { ...backProps } style={{ marginRight: '10px' }} />
            )}
            {index === (steps.length - 1) ? (
              <JoyrideTooltip.Button { ...primaryProps } title={t('Finish')} />
            ) : primaryProps && <JoyrideTooltip.Button { ...primaryProps } title={continuous ? t('Next') : skipProps.title} />}
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
          scrollToFirstStep
          showProgress
          showSkipButton
          run={guidedTourSteps.run}
          steps={guidedTourSteps.steps}
          disableScrollParentFix={true}
          disableScrolling={true}
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
