import { useContext, useEffect, useState } from "react";
import BuilderForm from "../Builder/BuilderForm";
import { GlobalContext } from "../context/Global";
import { checkRequiredForm } from "../../utils/GeneratorUtils";
import { getFragment, loadNewForm } from "../../services/DmpServiceApi";
import CustomSpinner from "../Shared/CustomSpinner";
import CustomButton from "../Styled/CustomButton";
import CustomError from "../Shared/CustomError";
import { useTranslation } from "react-i18next";

/* This is a functional React component called `Form` that takes in several props (`schemaId`, `sections`, `researchOutputId`, `questionId`, and `planId`). It
uses the `useContext` and `useState` hooks to access and update the global state of the application. */
function Form({ schemaId, researchOutputId, questionId, planId }) {
  const { t } = useTranslation();
  const { form, planData } = useContext(GlobalContext);
  const [standardTemplate, setstandardTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* A React hook that is used to fetch data from an API and update the state of the component. It runs when the component mounts and whenever the value of
`schemaId` changes. It sets the loading state to `true`, calls the `loadNewForm` function with the provided parameters and a token, and then updates
the `standardTemplate` state with the response data. If there is an error, it sets the `error` state to the error message. Finally, it sets the
loading state to `false`. */
  useEffect(() => {
    setLoading(true);
    //TODO : Adapter le comportement d'ouverture d'une question en fonction de la présence ou non d'une clé correspondant à l'identifiant de la question
    if (planData) {
      const answersList = planData?.plan?.research_outputs.filter((el) => el.id === planId);
      if (answersList[0]?.answers) {
        console.log("il existe une clé correspondant à l'identifiant de la question (`question_id`)");
      } else {
        console.log("On fait appel à la route `/madmp_fragments/load_form/...`");
      }
    }
    //loadNewForm(schemaId, researchOutputPlan, researchOutputId, questionId, planId, "token")
    getFragment(schemaId, "token")
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
    //const checkForm = checkRequiredForm(standardTemplate, form);
    console.log(form);
    //SEND form to DB
    //update form with response
  };
  return (
    <>
      {loading && <CustomSpinner></CustomSpinner>}
      {!loading && error && <CustomError></CustomError>}
      {!loading && !error && standardTemplate && (
        <div style={{ margin: "15px" }}>
          <div className="row"></div>
          <div className="m-4">
            <BuilderForm shemaObject={standardTemplate} level={1} schemaId={schemaId}></BuilderForm>
          </div>
          <CustomButton handleClick={handleSaveForm} title={t("Save")} position="center"></CustomButton>
        </div>
      )}
    </>
  );
}

export default Form;
