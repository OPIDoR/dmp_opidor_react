import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Global from "./components/context/Global";
import { Toaster } from "react-hot-toast";
import "./i18n";
import "react-tooltip/dist/react-tooltip.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Global>
    <App />
    <Toaster position="top-center" reverseOrder={false} />
  </Global>
);
