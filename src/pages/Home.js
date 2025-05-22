import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // We'll create this CSS file

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="stars-background"></div>
      
      <nav className="home-nav">
        <div className="logo">StudySync</div>
        <div className="nav-links">
          <button onClick={() => navigate("/login")} className="nav-btn">Login</button>
        </div>
      </nav>
      
      <div className="home-content">
        <h1 className="main-title">
          Collaborative Learning <span className="highlight">Reimagined</span>
        </h1>
        
        <div className="description-box">
          <h2 className="sub-title">Study Groups Made Simple</h2>
          <p className="description">
            Connect with classmates, create subject-specific groups, 
            and collaborate on coursework efficiently. Elevate your 
            academic performance through the power of collaborative learning.
          </p>
          <p className="tagline">
            "Where great minds study together and achieve more!"
          </p>
          
          <div className="cta-buttons">
            <button 
              onClick={() => navigate("/signup")} 
              className="cta-button primary"
            >
              Get Started
            </button>
            <button 
              onClick={() => navigate("/login")} 
              className="cta-button secondary"
            >
              I Already Have an Account
            </button>
          </div>
        </div>
        
        <div className="features">
          <div className="feature">
            <span className="feature-icon">🧠</span>
            <span className="feature-text">Subject-Based Groups</span>
          </div>
          <div className="feature">
            <span className="feature-icon">👥</span>
            <span className="feature-text">Peer Collaboration</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🚀</span>
            <span className="feature-text">Academic Success</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
