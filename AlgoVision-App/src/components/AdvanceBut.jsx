import React from "react";

function AdvanceBut({ onClick, label = "Advance" }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 20px",
        fontSize: "16px",
        backgroundColor: "#2d5fdeff",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        margin: "10px",
        width: "90%",
      }}
    >
      {label}
    </button>
  );
}
export default AdvanceBut;
