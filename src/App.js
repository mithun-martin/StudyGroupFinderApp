import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/path" element={<PathPage />} />
        <Route path="/academic" element={<Academic />} />
        <Route path="/my-groups" element={<MyGroups />} />
        <Route path="*" element={<Signup />} /> {/* Default to signup */}
        <Route path="/my-requests" element={<MyRequests groupId="123" />} />
      </Routes>
    </Router>
  );
}

export default App;
