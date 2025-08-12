import React from "react";
import { useNavigate } from "react-router-dom";

const SupplierDashboard = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const goToSupplier = () => {
    navigate("/supplier"); // ✅ Navigate to Supplier page
  };

  return (
    <div style={{ background: 'white', minHeight: '100vh', padding: '2rem' }}>
      <h2>Welcome Supplier, {user?.name || "Supplier"}</h2>
      <p>Submit supply reports, view inventory needs, etc.</p>

      <button onClick={goToSupplier} style={{
        marginTop: '10px',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}>
        Go to Supplier Page
      </button>

      <button onClick={handleLogout} style={{
        marginTop: '20px',
        padding: '10px 20px',
        backgroundColor: '#ff4d4d',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}>
        Logout
      </button>
    </div>
  );
};

export default SupplierDashboard;
