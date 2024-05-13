import useSectionsMapping from "../../hooks/useSectionsMapping";
import CustomButton from "../Styled/CustomButton";

function MappingButton({ path }) {
  // --- STATE ---
  const { mapping, editorRef } = useSectionsMapping();

  const handleInsert = () => {
    console.log(editorRef);
    console.log(editorRef.current);
    const editor = editorRef.current;
    if (editor && editor.editor) {
      editor.editor.insertContent(path);
    }
    console.log("JSON PATH:", path)
  };

  // --- RENDER ---
  return (
    <>
      {mapping &&
        <CustomButton
          title="→"
          handleClick={handleInsert}
          buttonColor="white"
        />
      }
    </>
  )
}

export default MappingButton;