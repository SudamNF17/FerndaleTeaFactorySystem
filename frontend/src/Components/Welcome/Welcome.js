import React from "react";
import { useNavigate } from "react-router-dom";
import "./welcome.css"; 
import logo from '../../assets/tea-logo.png'; 


function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="welcome-left">
        <img src={logo} alt="Ferndale Tea Logo" className="logo-image" />

      </div>

      <div className="welcome-right">
        <h1>
          Welcome to <br />
          <span>Ferndale Tea Factory System 🍃</span>
        </h1>
        <p>
          Manage supplies, monitor production, track inventory, and more — all
          in one platform.
        </p>

        <div className="button-group">
          <button className="btn btn-primary" onClick={() => navigate("/login")}>
            Sign In
          </button>
          <button className="btn btn-outline" onClick={() => navigate("/register")}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
