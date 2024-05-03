import { SectionsModeContext } from "../components/context/SectionsModeContext"
import contextProcess from "./contextProcess";

export const MODE_WRITING = null;
export const MODE_MAPPING = "mapping";

const useSectionsMode = () =>
    contextProcess(SectionsModeContext);

export default useSectionsMode;