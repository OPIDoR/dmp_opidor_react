import useSectionsMapping from "../../hooks/useSectionsMapping";
import CustomButton from "../Styled/CustomButton";

function MappingButton({ path, label }) {
  // --- STATE ---
  const { mapping, handleInsert, editorRef } = useSectionsMapping();

  // --- RENDER ---
  return (
    <>
    {console.log(editorRef)}
      {mapping && 
        editorRef && editorRef.current
        ?
        <CustomButton
          title="Add to mapping →"
          handleClick={() => handleInsert({ path, label })}
          buttonColor="white"
        />
        :
        <p>(Please open a target template question)</p>
      }
    </>
  )
}

export default MappingButton;