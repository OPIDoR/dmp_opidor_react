import { t } from "i18next";
import useSectionsMapping from "../../hooks/useSectionsMapping";
import CustomButton from "../Styled/CustomButton";

function MappingButton({ path, label }) {
  // --- STATE ---
  const { mapping, handleInsert, editorRef } = useSectionsMapping();

  // --- RENDER ---
  return (
    <>
      {mapping &&
        (editorRef && editorRef.current
          ?
          <CustomButton
            title="Add to mapping →"
            handleClick={() => handleInsert({ path, label })}
            buttonColor="white"
          />
          :
          <p><i className="fas fa-info"/> {t('Open a question in the target template to get started.')}</p>
        )
      }
    </>
  )
}

export default MappingButton;