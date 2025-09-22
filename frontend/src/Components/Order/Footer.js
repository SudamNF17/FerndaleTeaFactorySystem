import React from "react";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#333",
        color: "white",
        textAlign: "center",
        padding: "15px",
        marginTop: "30px",
        borderTop: "3px solid #222"
      }}
    >
      <p style={{ margin: 0 }}>
        &copy; {new Date().getFullYear()} TeaCart. All rights reserved.
      </p>
    </footer>
  );
}
