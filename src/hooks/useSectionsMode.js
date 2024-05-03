import { SectionsModeContext } from "../components/context/SectionsModeContext"
import contextValidation from "./contextValidation";

export const MODE_WRITING = null;
export const MODE_MAPPING = "mapping";

const useSectionsMode = () =>
    contextValidation(SectionsModeContext);

export default useSectionsMode;