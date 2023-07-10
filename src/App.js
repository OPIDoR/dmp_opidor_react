import "./App.css";
import Redaction from "./components/WritePlan/WritePlan";
import Form from "./components/Forms/Form";
import PlanCreation from "./components/PlanCreation/PlanCreation";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WritePlanLayout from "./components/WritePlan/WritePlanLayout";
import GeneralInfo from "./components/GeneralInfo/GeneralInfo";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/redaction" element={<WritePlanLayout readonly={false} />} />
        <Route exact path="/form" element={<Form schemaId={"c"} readonly={false} />} />
        <Route exact path="/plan" element={<PlanCreation />} />
        <Route exact path="/" element={<GeneralInfo readonly={true} />} />
      </Routes>
    </Router>
  );
}

export default App;
