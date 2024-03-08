import React from "react";

const footerStyle = {
  color: 'var(--white)',
  display: 'flex',
  justifyContent: 'space-between',
  padding: '20px 0 10px 0',
  boxSizing: 'border-box',
  verticalAlign: 'middle',
  borderRadius: '0 0 10px 10px',
  alignItems: 'center',
};

function JoyrideTooltipFooter(props) {
  const {
    className,
    style,
    children,
  } = props;

  return (
    <div
      style={{ ...footerStyle, ...style }}
      className={className}
    >
      {children}
    </div>
  );
};

export default JoyrideTooltipFooter;
