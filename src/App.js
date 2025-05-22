import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"; // Import the new Home component
import Signup from "./pages/signup";
import Login from "./pages/login";
import PathPage from "./pages/PathPage";
import Academic from "./pages/Academic";
import MyRequests from "./pages/MyRequests";
import MyGroups from "./pages/MyGroups";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Home route */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/path" element={<PathPage />} />
        <Route path="/academic" element={<Academic />} />
        <Route path="/my-groups" element={<MyGroups />} />
        <Route path="/my-requests" element={<MyRequests groupId="b2f3e7b9-9c1c-4b7a-8d5a-6e2b2e7c8f1a" />} />
        <Route path="*" element={<Home />} /> {/* Changed default to Home */}
      </Routes>
    </Router>
  );
}

export default App;
