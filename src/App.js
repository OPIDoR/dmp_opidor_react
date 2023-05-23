import "./App.css";
import Redaction from "./components/WritePlan/WritePlan";
import Form from "./components/Forms/Form";
import PlanCreation from "./components/PlanCreation/PlanCreation";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WritePlanLayout from "./components/WritePlan/WritePlanLayout";
import GeneralInfoLayout from "./components/GeneralInfo/GeneralInfoLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/redaction" element={<WritePlanLayout />} />
        <Route exact path="/form" element={<Form schemaId={"a"} />} />
        <Route exact path="/plan" element={<PlanCreation />} />
        <Route exact path="/" element={<GeneralInfoLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
