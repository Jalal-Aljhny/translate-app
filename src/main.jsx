import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { TranslateProvider } from "./services/context/TranslateContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TranslateProvider>
      <App />
    </TranslateProvider>
  </React.StrictMode>
);
