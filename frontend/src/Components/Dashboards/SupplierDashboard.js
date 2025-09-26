import React from "react";
import { useNavigate } from "react-router-dom";
import suppler from "../../assets/suppler.jpg"; // import image

const SupplierDashboard = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const goToSupplier = () => {
    navigate("/supplier");
  };

  return (
    <div
      style={{
        backgroundImage: `url(${suppler})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "black",
        position: "relative",
        textAlign: "center"
      }}
    >
      {/* Logout button at top-right */}
      <button
        onClick={handleLogout}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "10px 20px",
          backgroundColor: "#ff4d4d",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
      >
        Logout
      </button>

      <h1 style={{ marginBottom: "50px" }}>Welcome Supplier, {user?.name || "Supplier"}</h1>

      <button
        onClick={goToSupplier}
        style={{
          padding: "30px 60px", // bigger button
          fontSize: "22px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
          animation: "pulse 2s infinite",
          transition: "transform 0.3s"
        }}
        onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
      >
        Go to Supplier Page
      </button>

      {/* CSS Animation */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
};

export default SupplierDashboard;
