import { QuestionIconsContext } from "../components/context/QuestionIconsContext";
import contextProcess from "./contextProcess";

const useQuestionIcons = () => 
    contextProcess(QuestionIconsContext);

export default useQuestionIcons;