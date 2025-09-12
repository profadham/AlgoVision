import React, { useState, useRef, useEffect, use } from "react";
import Board from "./components/Board";
import Node from "./components/Node";
import EdgeInput from "./components/EdgeInput";
import Graph from "./components/Graph";
import Edge from "./components/Edge";
import AdvanceBut from "./components/AdvanceBut";
import ResetButton from "./components/ResetButton";
import ChooseSourceBut from "./components/ChooseSourceBut";
import DfsBut from "./components/DfsBut";
import BfsBut from "./components/BfsBut";
import DijkBut from "./components/DijkBut";

function App() {
  const [edgesText, setEdgesText] = useState("");
  const [edges, setEdges] = useState([]); // ✅ edges state
  const [step, setStep] = useState(0);
  const [chooseSorceMode, setChooseSourceMode] = useState(false);
  const [algorithm, setAlgorithm] = useState(1); //1-dfs,2-bfs,3-dijkstra

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

  // useffect(() => {
  //   console.log("algorithm changed:", algorithm);
  // }, [algorithm]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Left half */}
      <div style={{ width: "30%", background: "#184ae2ff" }}>
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
        <DfsBut
          backgroundColor={algorithm === 1 ? "#e81a43ff" : "#2d5fdeff"}
          onClick={() => {
            alert("DFS clicked");
            setAlgorithm(1);
          }}
          label=" DFS "
        />
        <BfsBut
          backgroundColor={algorithm === 2 ? "#e81a43ff" : "#2d5fdeff"}
          onClick={() => {
            alert("BFS clicked");
            setAlgorithm(2);
          }}
          label=" BFS "
        />
        <DijkBut
          backgroundColor={algorithm === 3 ? "#e81a43ff" : "#2d5fdeff"}
          onClick={() => {
            alert("Dijkstra's clicked");
            setAlgorithm(3);
          }}
          label=" Dijkstra's "
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
            algorithm={algorithm}
            setAlgorithm={setAlgorithm}
          />
        </Board>
      </div>
    </div>
  );
}

export default App;
