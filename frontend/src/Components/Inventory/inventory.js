import React from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../Nav/Nav";
import "./inventory.css";
import sasankaInventory from "../../assets/sasankaInventory.png"; // <-- import image

const Inventory = () => {
  const navigate = useNavigate();

  const userName = localStorage.getItem("userName");



  
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <div className="inventory-container">
      {/* Header */}
      <div className="dashboard-header">
        <h2>Welcome Manager, {userName}</h2>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
      <Nav />
      <div className="scroll-header">
        <h3>Process Management</h3>
        <div className="marquee">
          <div className="marquee-content">
            <span>
              🗃️Manage inventory records. &nbsp;&nbsp;&nbsp;
            </span>
            <span>
              🗃️Manage inventory records. &nbsp;&nbsp;&nbsp;
            </span>
          </div>
        </div>
      </div>
      <h2>Inventory Dashboard</h2>

      <h1>Inventory Dashboard</h1>

      {/* Image */}
      <div style={{ position: "relative", display: "inline-block" }}>
        <img
          src={sasankaInventory}
          alt="Inventory"
          className="inventory-image"
        />

        {/* Buttons on top of the image */}
        <div className="inventory-buttons">
          <button
            className="inventory-btn"
            onClick={() => navigate("/inventory/add-supply")}
          >
            Add Supply
          </button>

          <button
            className="inventory-btn secondary"
            onClick={() => navigate("/inventory/add-product")}
          >
            Add Product
          </button>
        </div>
      </div>

           {/* Footer */}
<footer className="dashboard-footer">
  <div className="footer-left">
    <p>© 2025 <strong>Ferndale Tea Factory</strong></p>
    <p>All rights reserved.</p>
  </div>
  <div className="footer-right">
    <p>🍃 Tea Factory Management System</p>
  </div>
</footer>
    </div>
  );
};

export default Inventory;
