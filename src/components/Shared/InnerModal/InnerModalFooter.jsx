import React from "react";

const footerStyle = {
  color: 'var(--white)',
  display: 'flex',
  justifyContent: 'space-between',
  padding: '10px',
  boxSizing: 'border-box',
  verticalAlign: 'middle',
  borderRadius: '0 0 10px 10px',
  alignItems: 'center',
};

function InnerModalFooter({
  closeButton = false,
  expandButton = false,
  className,
  style,
  children,
}) {
  return (
    <div
      style={{ ...footerStyle, ...style }}
      className={className}
    >
      {children}
    </div>
  )
}

export default InnerModalFooter;
