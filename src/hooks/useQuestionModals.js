import { useContext } from "react"
import { QuestionModalsContext } from "../components/context/QuestionModalsContext";

const useQuestionModals = () => {
    const context = useContext(QuestionModalsContext);

    if (!context)
        throw new Error('useSectionsMode must be used within SectionsModeProvider');

    return context;
}

export default useQuestionModals;