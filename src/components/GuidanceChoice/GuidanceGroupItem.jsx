import React from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";

import * as guidanceChoiceStyles from "../assets/css/guidance_choice.module.css";
import { MdCheckBox, MdOutlineCheckBoxOutlineBlank } from "react-icons/md";

function GuidanceGroupItem({ 
  guidance_group_id,
  guidance_group_name,
  guidance_group_description = null,
  org,
  index,
  isLimitReached,
  isSelected, onSelect
}) {
  return (
    <React.Fragment key={`guidance-fragment-${index}`}>
      <div key={`guidance-group-${index}-parent`}>
        <div
          style={{ display: 'flex', alignItems: 'center', }}
          key={`guidance-group-${index}-section`}
          id={`guidance-group-${index}-section`}
        >
          <div
            style={{ marginRight: '10px' }}
            className={guidanceChoiceStyles.checkboxes}
            key={`guidance-group-${index}-container`}
          >
            {
              isLimitReached && !isSelected ? (
                <MdOutlineCheckBoxOutlineBlank
                  fill="grey"
                  size={18}
                  key={`icon-${index}-checkbox-outline-blank-disabled`}
                  style={{ cursor: 'not-allowed' }}
                />
              ) : !isSelected ? (
                <MdOutlineCheckBoxOutlineBlank
                  style={{ cursor: 'pointer' }}
                  size={18}
                  key={`icon-${index}-checkbox-outline-blank`}
                  onClick={() => onSelect(org.id, guidance_group_id, true)}
                />
              ) : (
                <MdCheckBox
                  style={{ cursor: 'pointer' }}
                  size={18}
                  key={`icon-${index}-checkbox`}
                  onClick={() => onSelect(org.id, guidance_group_id, false)}
                />
              )
            }
          </div>
          {guidance_group_description && <ReactTooltip
            id={`guidance-group-${index}-tooltip`}
            key={`guidance-group-${index}-tooltip`}
            style={{ width: '100%' }}
            place="bottom"
            effect="solid"
            variant="info"
          >
            <div dangerouslySetInnerHTML={{ __html: guidance_group_description }}></div>
          </ReactTooltip>}
          <label
            data-tooltip-id={`guidance-group-${index}-tooltip`}
            className={`form-check-label ${guidanceChoiceStyles.guidance_group_title}`}
            style={{ cursor: isLimitReached && !isSelected ? 'not-allowed' : 'pointer' }}
            onClick={() => isLimitReached && !isSelected ? null : onSelect(org.id, guidance_group_id, !isSelected)}
          >
            {guidance_group_name}
          </label>
        </div>
      </div>
    </React.Fragment>)
}

export default GuidanceGroupItem;
