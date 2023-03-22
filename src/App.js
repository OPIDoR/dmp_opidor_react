import "./App.css";
import Redaction from "./components/redaction/Redaction";
import Form from "./components/Forms/Form";
import Plan from "./components/plans/Plan";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RedactionLayout from "./components/redaction/RedactionLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<RedactionLayout />} />
        <Route exact path="/form" element={<Form schemaId={"a"} />} />
        <Route exact path="/plan" element={<Plan />} />
      </Routes>
    </Router>
  );
}

export default App;
