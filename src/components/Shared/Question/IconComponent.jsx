import React from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import * as styles from "../../assets/css/write_plan.module.css";



export function IconComponent({ tooltipId, icon, onClick, tooltipContent }) {
  return (
    <div>
      <ReactTooltip
        id={tooltipId}
        place="bottom"
        effect="solid"
        variant="info"
        content={tooltipContent} />
      <div
        data-tooltip-id={tooltipId}
        className={styles.panel_icon}
        onClick={onClick}
        style={{ marginLeft: "5px" }}
      >
        {icon}
      </div>
    </div>
  );
}
