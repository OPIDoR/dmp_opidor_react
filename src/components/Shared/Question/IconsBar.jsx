import React from "react";
import { useTranslation } from "react-i18next";
import { TfiAngleDown, TfiAngleUp } from "react-icons/tfi";
import { BsGear } from "react-icons/bs";
import { TbBulbFilled } from "react-icons/tb";
import { IoShuffleOutline } from "react-icons/io5";
import { CommentSVG } from "../../Styled/svg";
import { IconComponent } from "./IconComponent";



export function IconsBar({ isQuestionOpened, questionsWithGuidance, questionId, fragmentId, answerId, formSelectors, scriptsData, handleIconClick, handleQuestionCollapse }) {
  // --- STATE ---
  const {
    fillRunsIconColor, 
    fillCommentIconColor, 
    fillGuidanceIconColor, 
    fillFormSelectorIconColor,
  } = useQuestionIcons();

  const { t } = useTranslation();

  // --- RENDER ---
  return (
    <>
      {isQuestionOpened() &&
        <>
          {questionsWithGuidance.length > 0 && questionsWithGuidance.includes(question.id) && (
            <IconComponent
              tooltipId="guidanceTip"
              icon={<TbBulbFilled size={32} fill={fillGuidanceIconColor} />}
              onClick={(e) => handleIconClick(e, "guidance")}
              tooltipContent={t("Guidance")} />
          )}
          {fragmentId && answerId && (
            <IconComponent
              tooltipId="commentTip"
              icon={<CommentSVG size={32} fill={fillCommentIconColor} />}
              onClick={(e) => {
                handleQuestionCollapse(true);
                handleIconClick(e, "comment");
              }}
              tooltipContent={t("Comments")} />
          )}
          {formSelectors[fragmentId] && (
            <IconComponent
              tooltipId="form-changer-show-button"
              icon={<IoShuffleOutline size={32} fill={fillFormSelectorIconColor} />}
              onClick={(e) => handleIconClick(e, "formSelector")}
              tooltipContent={t('List of customized forms')} />
          )}
          {scriptsData.scripts.length > 0 && (
            <IconComponent
              tooltipId="scriptTip"
              icon={<BsGear size={32} fill={fillRunsIconColor} />}
              onClick={(e) => handleIconClick(e, "runs")}
              tooltipContent={t("Tools")} />
          )}
        </>}
      <IconComponent
        icon={isQuestionOpened() ? <TfiAngleUp size={32} /> : <TfiAngleDown size={32} />} />
    </>
  );
}
