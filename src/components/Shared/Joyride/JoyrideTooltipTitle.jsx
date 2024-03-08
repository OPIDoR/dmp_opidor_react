import React from "react";

const titleStyle = {
  color: 'var(--white)',
  fontSize: '20px',
  fontWeight: 700,
  fontFamily:  '"Helvetica Neue", sans-serif',
};

function JoyrideTooltipTitle({
  className,
  style,
  children,
}) {
  return (
    <div
      style={{ ...titleStyle, ...style }}
      className={className}
    >
      {children}
    </div>
  );
}

export default JoyrideTooltipTitle;
