// src/Components/HRDashboard.js

import React from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../Nav/Nav";
import "./HRDashboard.css"; // Import the CSS file

const HRDashboard = () => {
  const userName = localStorage.getItem("userName");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Welcome HR Manager, {userName}</h2>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      <Nav />
      <br />
    </div>
  );
};

export default HRDashboard;
