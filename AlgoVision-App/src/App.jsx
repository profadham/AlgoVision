import React, { useState, useRef } from "react";
import Board from "./components/Board";
import Node from "./components/Node";
import EdgeInput from "./components/EdgeInput";
import Graph from "./components/Graph";
import Edge from "./components/Edge";

function App() {
  const [edgesText, setEdgesText] = useState("");

  // convert input into edge list
  const edges = edgesText
    .split("\n")
    .map((line) => line.trim().split(" "))
    .filter((parts) => parts.length >= 2)
    .map(([u, v, w]) => [u, v, w ? parseInt(w, 10) : 1]);

  const nodeARef = useRef(null);
  const nodeBRef = useRef(null);

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
          <Graph edges={edges} />
        </Board>
      </div>
    </div>
  );
}

export default App;
