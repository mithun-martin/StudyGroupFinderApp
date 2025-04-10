import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/signup";
import Login from "./pages/login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Signup />} /> {/* Default to signup */}
      </Routes>
    </Router>
  );
}

export default App;
