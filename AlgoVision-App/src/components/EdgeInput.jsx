import React from "react";

function EdgeInput({ value, onChange }) {
  return (
    <div style={{ padding: "1rem" }}>
      <label style={{ display: "block", marginBottom: "0.5rem" }}>
        Enter Edges (one per line, format: A B):
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        cols={30}
        placeholder="Example:\nA B\nB C\nC D"
        style={{
          width: "80%",
          height: "80%",
          fontFamily: "monospace",
          borderRadius: "8px",
          padding: "0.5rem",
        }}
      />
    </div>
  );
}

export default EdgeInput;
