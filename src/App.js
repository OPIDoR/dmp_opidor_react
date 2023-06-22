import "./App.css";
import Form from "./components/Forms/Form";
import PlanCreation from "./components/PlanCreation/PlanCreation";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WritePlan from "./components/WritePlan/WritePlan";
import GeneralInfo from "./components/GeneralInfo/GeneralInfo";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/redaction" element={<WritePlan />} />
        <Route exact path="/form" element={<Form schemaId={"a"} />} />
        <Route exact path="/plan" element={<PlanCreation />} />
        <Route exact path="/" element={<GeneralInfo />} />
      </Routes>
    </Router>
  );
}

export default App;
