import React from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../Nav/Nav";
import "./inventory.css";
import sasankaInventory from "../../assets/sasankaInventory.png"; // <-- import image

const Inventory = () => {
  const navigate = useNavigate();

  return (
    <div className="inventory-container">
      <Nav />
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
    </div>
  );
};

export default Inventory;
