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
  const [widthPx, setWidthPx] = useState(0);
  const [heightPx, setHeightPx] = useState(0);

  useEffect(() => {
    // parse edges from text (robust to extra spaces/tabs, ignore blank lines / comments)
    const parsed = edgesText
      .split(/\r?\n/) // split into lines (handles CRLF + LF)
      .map((line) => line.trim()) // trim each line
      .filter((line) => line && !line.startsWith("#")) // skip empty / commented lines
      .map((line) => {
        // split on any whitespace (one or more spaces/tabs), returns only non-empty tokens
        const parts = line.split(/\s+/); // or: const parts = line.match(/\S+/g) || [];

        // require at least 2 tokens (u and v)
        if (parts.length < 2) return null;

        const u = parts[0];
        const v = parts[1];

        // parse weight if provided, otherwise default to 1
        const wToken = parts[2];
        const wNum = wToken !== undefined ? parseInt(wToken, 10) : 1;
        const weight = Number.isFinite(wNum) ? wNum : 1;

        return [u, v, weight];
      })
      .filter(Boolean); // remove nulls from invalid lines

    // stringify for stable comparison
    const prev = JSON.stringify(edges);
    const next = JSON.stringify(parsed);

    if (prev !== next) {
      setEdges(parsed);
      setStep(0); // reset step only if edges truly changed
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
          algorithm={algorithm}
        />
        <label
          style={{
            display: "block",
            color: "white",
            fontSize: "20px",
            fontWeight: "bold",
            padding: "1rem",
          }}
        >
          Choose Algorithm:
        </label>
        <DfsBut
          backgroundColor={algorithm === 1 ? "#e81a43ff" : "#2d5fdeff"}
          onClick={() => {
            setAlgorithm(1);
          }}
          label=" DFS "
        />
        <BfsBut
          backgroundColor={algorithm === 2 ? "#e81a43ff" : "#2d5fdeff"}
          onClick={() => {
            setAlgorithm(2);
          }}
          label=" BFS "
        />
        <DijkBut
          backgroundColor={algorithm === 3 ? "#e81a43ff" : "#2d5fdeff"}
          onClick={() => {
            setAlgorithm(3);
          }}
          label=" Dijkstra's "
        />
      </div>

      {/* Right half */}
      <div style={{ width: "80%" }}>
        <Board
          setWidthPx={setWidthPx}
          widthPx={widthPx}
          setHeightPx={setHeightPx}
          heightPx={heightPx}
        >
          <Graph
            edges={edges}
            step={step}
            setStep={setStep}
            chooseSourceMode={chooseSorceMode}
            setChooseSourceMode={setChooseSourceMode}
            algorithm={algorithm}
            setAlgorithm={setAlgorithm}
            widthPx={widthPx}
            heightPx={heightPx}
          />
        </Board>
      </div>
    </div>
  );
}

export default App;
