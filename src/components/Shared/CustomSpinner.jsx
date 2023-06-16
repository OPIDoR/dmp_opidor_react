import React from 'react';
import { RotatingTriangles } from 'react-loader-spinner';

function CustomSpinner() {
  return (
    <RotatingTriangles
      visible={true}
      height="80"
      width="80"
      colors={['#2c7dad', '#c6503d', '#FFCC00']}
      ariaLabel="rotating-triangels-loading"
      wrapperStyle={{}}
      wrapperClass="rotating-triangels-wrapper"
    />
  );
}

export default CustomSpinner;
