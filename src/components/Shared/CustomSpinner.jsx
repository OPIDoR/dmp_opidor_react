import React from 'react';
import { RotatingTriangles } from 'react-loader-spinner';
import { useTranslation } from "react-i18next";

import styles from '../assets/css/overlay.module.css';

function CustomSpinner() {
  const { t } = useTranslation();
  return (
    <div className={styles.overlay}>
      <RotatingTriangles
        visible={true}
        height="80"
        width="80"
        colors={['#2c7dad', '#c6503d', '#FFCC00']}
        ariaLabel="rotating-triangels-loading"
        wrapperStyle={{}}
        wrapperClass="rotating-triangels-wrapper"
      />
      {t('Loading...')}
    </div>
  );
}

export default CustomSpinner;
