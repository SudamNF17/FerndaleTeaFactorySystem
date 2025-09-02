import React from "react";
import { useNavigate } from "react-router-dom";
<<<<<<< Updated upstream
import "./Supplier.css"; // ✅ make sure this path is correct
=======
>>>>>>> Stashed changes

function Supplier() {
  const navigate = useNavigate();

  return (
<<<<<<< Updated upstream
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
=======
    <div>
      <h1>Supplier Main Page</h1>

      <button onClick={() => navigate("/raw")}>
        Supplying Raw Materials
      </button>

      <button onClick={() => navigate("/fresh")}>
        Supplying Fresh Tea Leaves
      </button>
>>>>>>> Stashed changes
    </div>
  );
}

export default Supplier;
