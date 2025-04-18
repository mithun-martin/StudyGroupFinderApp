import React from "react";
import { useNavigate } from "react-router-dom";
import "./pathpage.css"; // optional styling

const PathPage = () => {
  const navigate = useNavigate();

  const handleChoice = (path) => {
    if (path === "academic") {
      navigate("/academic");
    } else if (path === "hackathon") {
      navigate("/hackathon");
    }
  };

  return (
    <div className="path-container">
      <h2>Choose Your Path</h2>
      <div className="path-buttons">
        <button onClick={() => handleChoice("academic")}>
          📚 Academic Groups
        </button>
        <button onClick={() => handleChoice("hackathon")}>
          🚀 Hackathon Groups
        </button>
      </div>
    </div>
  );
};

export default PathPage;
