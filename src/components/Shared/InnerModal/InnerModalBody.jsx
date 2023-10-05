import React from "react";

const bodyStyle = {
  color: '#000',
  padding: '10px',
  marginTop: '4px',
  width: '100%',
  minHeight: '250px',
  marginRight: '20px',
  boxSizing: 'border-box',
  alignItems: 'center',
};

function InnerModalBody({
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
  )
}

export default InnerModalBody;
