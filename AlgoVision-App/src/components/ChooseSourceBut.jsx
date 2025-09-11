import React from "react";

function ChooseSourceBut({
  onClick,
  label = "Choose Source",
  chooseSourceMode = false,
  setChooseSourceMode,
}) {
  return (
    <>
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
          width: chooseSourceMode ? "95%" : "90%",
        }}
      >
        {label}
      </button>
      <label
        style={{
          color: "black",
          fontSize: "14px",
          opacity: chooseSourceMode ? 1 : 0,
        }}
      >
        You are now in choosing sources mode!! Press Button again to disable
        mode!!
      </label>
    </>
  );
}

export default ChooseSourceBut;
