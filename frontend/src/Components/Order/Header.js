import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header
      style={{
        backgroundColor: "#4CAF50",
        color: "white",
        padding: "15px 25px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "3px solid #388E3C"
      }}
    >
      {/* ✅ Left: Logo / Title */}
      <h1
        style={{ margin: 0, fontSize: "26px", fontWeight: "bold", cursor: "pointer" }}
        onClick={() => navigate("/cart")}
      >
        TeaCart
      </h1>

      {/* ✅ Right: Navigation */}
      <nav>
        <button
          onClick={() => navigate("/cart")}
          style={{
            backgroundColor: "#2E7D32",
            border: "none",
            color: "white",
            padding: "8px 16px",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Home
        </button>
      </nav>
    </header>
  );
}
