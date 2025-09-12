import React from "react";

function BfsBut({ onClick, label = " BFS ", backgroundColor = "#2d5fdeff" }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 20px",
        fontSize: "16px",
        backgroundColor: backgroundColor,
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
export default BfsBut;
