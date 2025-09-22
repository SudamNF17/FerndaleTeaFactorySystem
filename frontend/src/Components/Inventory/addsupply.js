import React from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../Nav/Nav";
import "./addsupply.css";   
import sasankaInventory from "../../assets/sasankaInventory.png"; // adjust path to your image

const AddSupply = () => {
  const navigate = useNavigate();

  return (
    <div className="supply-container">
      <Nav />
      <h2>Supply Inventory</h2>

      {/* Image with buttons */}
      <div className="supply-image-wrapper">
        <img
          src={sasankaInventory}
          alt="Supply Inventory"
          className="supply-image"
        />

        <div className="supply-buttons">
          <button
            className="supply-btn"
            onClick={() => navigate("/inventory/add-supply/raw-materials")}
          >
            Add Raw Material
          </button>

          <button
            className="supply-btn secondary"
            onClick={() =>
              navigate("/inventory/add-supply/fresh-tea-leaves")
            }
          >
            Add Fresh Tea Leaves
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSupply;
