import useSectionsMapping from "../../hooks/useSectionsMapping";
import CustomButton from "../Styled/CustomButton";

function MappingButton({ path, label }) {
  // --- STATE ---
  const { mapping, handleInsert } = useSectionsMapping();

  // --- RENDER ---
  return (
    <>
      {mapping &&
        <CustomButton
          title="Add to mapping →"
          handleClick={() => handleInsert({ path, label })}
          buttonColor="white"
        />
      }
    </>
  )
}

export default MappingButton;