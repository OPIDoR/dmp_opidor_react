import { TemplateContext } from "../components/context/TemplateContext";
import contextProcess from "./contextProcess";

const useTemplate = () =>
    contextProcess(TemplateContext);

export default useTemplate;