import React from 'react';

import { FaInfoCircle } from 'react-icons/fa';
import uniqueId from 'lodash.uniqueid';

function Tooltip({ tooltipId }) {
  const id = uniqueId('tooltip_info_icon_');

  return <FaInfoCircle
    id={id}
    data-testid={id}
    size={12}
    data-tooltip-id={tooltipId}
    style={{ marginLeft: '4px', verticalAlign: 'middle' }}
  />
}

export default Tooltip;
