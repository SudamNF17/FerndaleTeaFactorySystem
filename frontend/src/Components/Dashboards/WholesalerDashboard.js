import React from "react";
import { useNavigate } from "react-router-dom";

const WholesalerDashboard = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();         // Clear login/session data
    navigate("/login");           // Redirect to login page
  };

  return (
    <div style={{ background: 'white', minHeight: '100vh', padding: '2rem' }}>
      <h2>Welcome, {user?.name || "Wholesaler"}</h2>
      {/* Add more dashboard content here */}

      <button
        onClick={handleLogout}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#ff4d4d',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default WholesalerDashboard;
