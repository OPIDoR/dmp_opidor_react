import { SectionsModeContext } from "../components/context/SectionsModeContext"
import contextProcess from "./contextProcess";

const useSectionsMode = () =>
    contextProcess(SectionsModeContext);

export default useSectionsMode;