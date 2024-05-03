import { QuestionStateContext } from "../components/context/QuestionStateContext";
import contextProcess from "./contextProcess";

const useQuestionState = () => 
    contextProcess(QuestionStateContext);

export default useQuestionState;