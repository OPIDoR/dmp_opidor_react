import { useContext, useEffect, useState } from "react";
import BuilderForm from "../Builder/BuilderForm";
import { GlobalContext } from "../context/Global";
import { checkRequiredForm } from "../../utils/GeneratorUtils";
import { getSchema } from "../../services/DmpServiceApi";
import CustumSpinner from "../Shared/CustumSpinner";
import CustumButton from "../Styled/CustumButton";

function Form({ schemaId }) {
  const { form } = useContext(GlobalContext);
  const [standardTemplate, setstandardTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getSchema(schemaId, "token")
      .then((el) => {
        setstandardTemplate(el);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [schemaId]);

  /**
   * It checks if the form is filled in correctly.
   * @param e - the event object
   */
  const handleSaveForm = (e) => {
    e.preventDefault();
    const checkForm = checkRequiredForm(standardTemplate, form);
    console.log(form);
    // if (checkForm) {
    //   toast.error("Veuiller remplire le champs " + getLabelName(checkForm, standardTemplate));
    // } else {
    //   console.log(form);
    // }
  };
  return (
    <>
      {loading && <CustumSpinner></CustumSpinner>}
      {!loading && error && <p>error</p>}
      {!loading && !error && standardTemplate && (
        <div style={{ margin: "15px" }}>
          <div className="row"></div>
          <div className="m-4">
            <BuilderForm shemaObject={standardTemplate} level={1} schemaId={schemaId}></BuilderForm>
          </div>
          <CustumButton handleNextStep={handleSaveForm} title="Enregistrer" position="center"></CustumButton>
        </div>
      )}
    </>
  );
}

export default Form;
