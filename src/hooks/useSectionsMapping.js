import { SectionsMappingContext } from "../components/context/SectionsMappingContext"
import contextProcess from "./contextProcess";

const useSectionsMapping = () =>
    contextProcess(SectionsMappingContext);

export default useSectionsMapping;