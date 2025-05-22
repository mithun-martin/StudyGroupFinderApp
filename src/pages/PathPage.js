import React from "react";
import { useNavigate } from "react-router-dom";
import "./pathpage.css"; // optional styling

const PathPage = () => {
  const navigate = useNavigate();

  return (
    <div className="path-container">
      <h2>Study Groups</h2>
      <div className="path-buttons">
        <button onClick={() => navigate("/academic")}>
          📚 View All Study Groups
        </button>
        <button onClick={() => navigate("/my-groups")}>
          👥 My Study Groups
        </button>
      </div>
    </div>
  );
};

export default PathPage;

