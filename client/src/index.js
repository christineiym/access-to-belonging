import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import PanelB from "./panelB/_PanelB";
import PanelC from "./panelC/_PanelC";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/access-to-belonging" element={<App />} />
        <Route path="/access-to-belonging/stories" element={<PanelB />} />
        <Route path="/access-to-belonging/routes-and-timing" element={<PanelC />} />
      </Routes>
    </Router>
  </React.StrictMode>
);