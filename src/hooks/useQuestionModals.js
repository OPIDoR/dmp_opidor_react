import { QuestionModalsContext } from "../components/context/QuestionModalsContext";
import contextValidationProcess from "./contextValidation";

const useQuestionModals = () => 
    contextValidationProcess(QuestionModalsContext);

export default useQuestionModals;