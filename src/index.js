import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // ✅ this brings in App.js with your routing setup

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
