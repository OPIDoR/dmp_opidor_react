import { QuestionModalsContext } from "../components/context/QuestionModalsContext";
import contextProcess from "./contextProcess";

const useQuestionModals = () => 
    contextProcess(QuestionModalsContext);

export default useQuestionModals;