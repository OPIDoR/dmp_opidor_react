import React from "react";

const bodyStyle = {
  color: 'var(--dark-blue)',
  padding: '10px',
  borderRadius: '10px',
  boxSizing: 'border-box',
  alignItems: 'center',
  background: 'var(--white)',
  minHeight: '100px',
};

function JoyrideTooltipBody({
  className,
  style,
  children,
}) {
  return (
    <div
      style={{ ...bodyStyle, ...style }}
      className={className}
    >
      {children}
    </div>
  );
}

export default JoyrideTooltipBody;
