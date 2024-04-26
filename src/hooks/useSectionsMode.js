import { useContext } from "react"
import { SectionsModeContext } from "../components/context/SectionsModeContext"

const useSectionsMode = () => {
    const context = useContext(SectionsModeContext);

    if (!context)
        throw new Error('useSectionsMode must be used within SectionsModeProvider');

    return context;
}

export default useSectionsMode;