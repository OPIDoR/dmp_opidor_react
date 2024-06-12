import React from "react";

function ContentHeading({ title, leftChildren, rightChildren}) {
  const stickyStyle = {
    position: "sticky",
    top: "60px", // Replace with navbar height constant
    zIndex: 10,
    backgroundColor: "white",
    // border: "2px solid #C6503D",
    // borderTopWidth: "0",
    borderRadius: "0 0 5px 5px",
  };

  return (
    <div className="row content-heading" style={stickyStyle}>
      <div className="col-md-12">
        <h1 style={{ display: 'flex', justifyContent: 'space-between' }}>
          {leftChildren && (<div>{leftChildren}</div>)}
          <span>{title}</span>
          {rightChildren && (<div>{rightChildren}</div>)}
        </h1>
      </div>
    </div>
  );
}

export default ContentHeading;