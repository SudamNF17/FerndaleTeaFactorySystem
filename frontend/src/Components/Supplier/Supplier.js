import React from "react";
import { useNavigate } from "react-router-dom";
import "./Supplier.css"; 

function Supplier() {
  const navigate = useNavigate();

  return (
    <div className="supplier-container">
      <h1 className="supplier-title">Supplier Main Dashboard</h1>

      <div className="supplier-buttons">
        <button onClick={() => navigate("/raw")} className="raw-btn">
          Add a Raw Material Supply
        </button>

        <button onClick={() => navigate("/fresh")} className="fresh-btn">
          Add Fresh Tea Leaves Supply
        </button>
      </div>
    </div>
  );
}

export default Supplier;
