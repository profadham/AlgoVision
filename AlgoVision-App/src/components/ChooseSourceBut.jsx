import React from "react";

function ChooseSourceBut({
  onClick,
  label = "Choose Source",
  chooseSourceMode = false,
  setChooseSourceMode,
  algorithm,
}) {
  return (
    <>
      <button
        onClick={onClick}
        disabled={algorithm === 1}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: chooseSourceMode ? "red" : "#2d5fdeff",
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
      <label
        style={{
          display: "block",
          // marginBottom: "0.1rem",
          color: "white",
          fontSize: "16px",
          fontWeight: "bold",
          padding: "8px 16px",
          opacity: chooseSourceMode ? 1 : 0,
        }}
      >
        You are now in choosing sources mode!!
      </label>
      <label
        style={{
          display: "block",
          marginBottom: "0.1rem",
          color: "white",
          fontSize: "16px",
          fontWeight: "bold",
          padding: "8px 16px",
          opacity: chooseSourceMode ? 1 : 0,
        }}
      >
        Press Button again to disable mode!!
      </label>
    </>
  );
}

export default ChooseSourceBut;
