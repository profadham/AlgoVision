import React from "react";

function EdgeInput({ value, onChange }) {
  return (
    <div style={{ padding: "1rem" }}>
      <label
        style={{
          display: "block",
          marginBottom: "0.5rem",
          color: "white",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        Enter Edges (one per line, format: A B [weight]):
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={12}
        cols={30}
        placeholder="Example:A B 2
        B C 5
        C D"
        style={{
          width: "90%",
          height: "80%",
          fontFamily: "monospace",
          borderRadius: "8px",
          padding: "0.5rem",
          color: "#4d5feaff",
        }}
      />
    </div>
  );
}

export default EdgeInput;
