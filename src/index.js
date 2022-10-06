import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import ParseInt from "./pages/ParseInt";
import Matrix from "./pages/Matrix";
import TreeNew from "./pages/TreeNew";

import { BrowserRouter, Routes, Route } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<App />} />
        <Route path="/parseint" exact element={<ParseInt />} />
        <Route path="/matrix" exact element={<Matrix />} />
        <Route path="/newtree" exact element={<TreeNew />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
