import useSectionsMode from "../../hooks/useSectionsMode";
import CustomButton from "../Styled/CustomButton";

function MappingButton({path}) {
  // --- STATE ---
  const { mapping } = useSectionsMode();

  // --- RENDER ---
  return (
    <>
      {mapping &&
        <CustomButton
          title="→"
          handleClick={() => console.log("JSON PATH:", path)}
          buttonColor="white"
        />
      }
    </>
  )
}

export default MappingButton;