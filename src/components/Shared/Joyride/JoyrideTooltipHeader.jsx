import React from "react";

const headerStyle = {
  color: 'var(--white)',
  display: 'flex',
  justifyContent: 'space-between',
  padding: '10px 0 20px 0',
  boxSizing: 'border-box',
  verticalAlign: 'middle',
  borderRadius: '10px 10px 0 0',
  alignItems: 'center',
};

function JoyrideTooltipHeader(props) {
  const {
    className,
    style,
    children,
    index,
    size,
  } = props;

  return (
    <div
      style={{ ...headerStyle, ...style }}
      className={className}
    >
      <div id="joyride-tooltip-header-title">
        {children}
      </div>
      <div>
        {(Number.parseInt(index, 10) + 1)} sur {size}
      </div>
    </div>
  );
};

export default JoyrideTooltipHeader;
