import React from "react";

import JoyrideTooltipHeader from "./JoyrideTooltipHeader";
import JoyrideTooltipTitle from "./JoyrideTooltipTitle";
import JoyrideTooltipBody from "./JoyrideTooltipBody";
import JoyrideTooltipFooter from "./JoyrideTooltipFooter";
import JoyrideTooltipSpacer from "./JoyrideTooltipSpacer";
import JoyrideTooltipButton from "./JoyrideTooltipButton";

const tooltipStyles = {
  background: 'var(--rust)',
  borderRadius: '10px',
  color: 'var(--white)',
  width: '650px',
  padding: '20px',
  boxSizing: 'border-box',
};

function JoyrideTooltip(props) {
  const {
    className,
    style,
    children,
    ariaLabelledby,
    ariaDescribedby,
    ariaLabel,
    tooltipProps,
  } = props;

  return (
    <div
      {...tooltipProps}
      style={{ ...tooltipStyles, ...style }}
      className={className}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
    >
      {children}
    </div>
  );
};

export default Object.assign(JoyrideTooltip, {
  Header: JoyrideTooltipHeader,
  Title: JoyrideTooltipTitle,
  Body: JoyrideTooltipBody,
  Footer: JoyrideTooltipFooter,
  Spacer: JoyrideTooltipSpacer,
  Button: JoyrideTooltipButton,
});