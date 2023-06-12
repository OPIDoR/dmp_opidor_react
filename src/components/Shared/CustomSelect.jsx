import React, { useEffect, useRef } from "react";
import Select, { createFilter } from "react-select";
import { VariableSizeList as List } from "react-window";

function MenuList({ options, children, maxHeight, getValue }) {
  const listRef = useRef({});
  const rowHeights = useRef({});
  const [value] = getValue();
  const height = 50;
  const initialOffset = options.indexOf(value) * height;

  function getRowHeight(index) {
    return rowHeights.current[index] || 82;
  }

  function setRowHeight(index, size) {
    listRef.current.resetAfterIndex(0);
    rowHeights.current = { ...rowHeights.current, [index]: size };
  }

  function Row({data, index, style}) {
    const rowRef = useRef();
    // const isEven = index % 2 === 0;
    
    useEffect(() => {
      if (rowRef.current) {
        setRowHeight(index, rowRef.current.clientHeight);
      }
      // eslint-disable-next-line
    }, [rowRef]);
  
    return(
      <div
        ref={rowRef}
        style={{...style, height: 'auto'}}>
          {data[index]}
        </div>
    )
  };

  return (
    <List
      ref={listRef}
      height={maxHeight}
      itemCount={children.length}
      itemSize={getRowHeight}
      initialScrollOffset={initialOffset}
    >
      {({ index, style }) => <Row data={children} index={index} style={style}/>}
    </List>
  );

}


function CustomSelect({propName = null, options, selectedOption = null, onChange, defaultValue}) {
  return(
    <Select
      menuPortalTarget={document.body}
      styles={{
        menuPortal: (base) => ({ ...base, zIndex: 9999, color: "grey" }),
        singleValue: (base) => ({ ...base, color: "var(--primary)" }),
        control: (base) => ({ ...base, borderRadius: "8px", borderWidth: "1px", borderColor: "var(--primary)" }),
      }}
      filterOption={createFilter({ ignoreAccents: false })} // this makes all the difference!
      components={{ MenuList }}
      name={propName}
      options={options}
      onChange={onChange}
      value={selectedOption}
      // defaultValue={defaultValue} 
    />
  );
}

export default CustomSelect;
