import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Global from "./components/context/Global";
import { Toaster } from "react-hot-toast";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Global>
    <App />
    <Toaster position="top-center" reverseOrder={false} />
  </Global>
);
