import React, { useState, useRef, useEffect } from "react";
import Board from "./components/Board";
import Node from "./components/Node";
import EdgeInput from "./components/EdgeInput";
import Graph from "./components/Graph";
import Edge from "./components/Edge";
import AdvanceBut from "./components/AdvanceBut";
import ResetButton from "./components/ResetButton";
import ChooseSourceBut from "./components/ChooseSourceBut";

function App() {
  const [edgesText, setEdgesText] = useState("");
  const [edges, setEdges] = useState([]); // ✅ edges state
  const [step, setStep] = useState(0);
  const [chooseSorceMode, setChooseSourceMode] = useState(false);

  useEffect(() => {
    // parse edges from text
    const parsed = edgesText
      .split("\n")
      .map((line) => line.trim().split(" "))
      .filter((parts) => parts.length >= 2)
      .map(([u, v, w]) => [u, v, w ? parseInt(w, 10) : 1]);

    // stringify for stable comparison
    const prev = JSON.stringify(edges);
    const next = JSON.stringify(parsed);

    if (prev !== next) {
      setEdges(parsed);
      setStep(0); // ✅ reset step only if edges truly changed
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edgesText]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Left half */}
      <div style={{ width: "30%", background: "#f4f4f4" }}>
        <EdgeInput value={edgesText} onChange={setEdgesText} />
        <AdvanceBut onClick={() => setStep(step + 1)} label="Advance" />
        <ResetButton
          onClick={() => {
            setStep(0);
            setEdgesText("");
          }}
          label="Reset"
        />
        <ChooseSourceBut
          onClick={() => setChooseSourceMode(!chooseSorceMode)}
          chooseSourceMode={chooseSorceMode}
          setChooseSourceMode={setChooseSourceMode}
        />
      </div>

      {/* Right half */}
      <div style={{ width: "80%" }}>
        <Board>
          <Graph
            edges={edges}
            step={step}
            setStep={setStep}
            chooseSourceMode={chooseSorceMode}
            setChooseSourceMode={setChooseSourceMode}
          />
        </Board>
      </div>
    </div>
  );
}

export default App;
