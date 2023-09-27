import React, { forwardRef, useState } from "react";
import ReactDOM from "react-dom";
import { IoClose } from "react-icons/io5";
import { TbMinimize, TbMaximize } from "react-icons/tb";

const headerStyle = {
  color: 'var(--white)',
  display: 'flex',
  justifyContent: 'space-between',
  height: '60px',
  padding: '10px',
  boxSizing: 'border-box',
  verticalAlign: 'middle',
  borderRadius: '10px 10px 0 0',
  alignItems: 'center',
};

const InnerModalHeader = forwardRef((props, ref) => {
  const {
    closeButton = false,
    expandButton = false,
    className,
    style,
    children,
    onClose,
  } = props;

  const [isExpanded, setIsExpanded] = useState(false);
  const parentRef = ReactDOM.findDOMNode(ref?.current) || null;

  const expand = (value) => {
    if (!parentRef) { return; }

    if (value) {
      setIsExpanded(true);
      return parentRef.style.width = 'calc(100% - 30px)';
    }

    setIsExpanded(false);
    return parentRef.style.width = '540px';
  };

  return (
    <div
      ref={ref}
      style={{ ...headerStyle, ...style }}
      className={className}
    >
      <div>{children}</div>
      <div>
        {expandButton && isExpanded && (
          <TbMinimize
            size={24}
            style={{ margin: '0 5px 0 5px', cursor: 'pointer' }}
            onClick={() => expand(false)}
          />
        )}
        {expandButton && !isExpanded && (
          <TbMaximize
            size={24}
            style={{ margin: '0 5px 0 5px', cursor: 'pointer' }}
            onClick={() => expand(true)}
          />
        )}
        {closeButton && (
          <IoClose
            size={24}
            style={{ margin: '8px 5px 0 5px', cursor: 'pointer' }}
            onClick={() => onClose()}
          />
        )}
      </div>
    </div>
  )
});

export default InnerModalHeader;
