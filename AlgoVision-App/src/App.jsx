import React, { useState } from "react";
import Board from "./components/Board";
import Node from "./components/Node";
import EdgeInput from "./components/EdgeInput";

function App() {
  const [edgesText, setEdgesText] = useState("");

  // convert input into edge list
  const edges = edgesText
    .split("\n")
    .map((line) => line.trim().split(" "))
    .filter((pair) => pair.length === 2);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Left half */}
      <div style={{ width: "30%", background: "#f4f4f4" }}>
        <EdgeInput value={edgesText} onChange={setEdgesText} />
        <pre style={{ padding: "1rem", background: "#eee" }}>
          Parsed edges: {JSON.stringify(edges)}
        </pre>
      </div>

      {/* Right half */}
      <div style={{ width: "80%" }}>
        <Board>
          <svg width="100%" height="100%" style={{ background: "#f4f4f4" }}>
            <Node id="A" colour="blue" init_x={100} init_y={100} />
            <Node id="B" colour="green" init_x={300} init_y={200} />
          </svg>
        </Board>
      </div>
    </div>
  );
}

export default App;
