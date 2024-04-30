import { useContext } from "react"
import { SectionsModeContext } from "../components/context/SectionsModeContext"

export const MODE_WRITING = null;
export const MODE_MAPPING = "mapping";

const useSectionsMode = () => {
    const context = useContext(SectionsModeContext);

    if (!context)
        throw new Error('useSectionsMode must be used within SectionsModeProvider');

    return context;
}

export default useSectionsMode;