import useSectionsMapping from "../../hooks/useSectionsMapping";
import CustomButton from "../Styled/CustomButton";

function MappingButton({ path }) {
  // --- STATE ---
  const { mapping, editorRef, handleInsert } = useSectionsMapping();

  // --- RENDER ---
  return (
    <>
      {mapping &&
        <CustomButton
          title="Add to mapping →"
          handleClick={() => handleInsert(path)}
          buttonColor="white"
        />
      }
    </>
  )
}

export default MappingButton;