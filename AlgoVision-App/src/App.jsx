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
    document.title = "AlgoVision";

    // safe PUBLIC_URL detection (works in CRA and in other setups)
    const publicUrl =
      typeof process !== "undefined" &&
      process &&
      process.env &&
      process.env.PUBLIC_URL
        ? process.env.PUBLIC_URL
        : "";

    // prefer a cache-busted URL while developing
    const faviconPath = `${publicUrl}/favicon.ico?v=${Date.now()}`;

    const setFavicon = (url) => {
      let link = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = url;
    };

    // Try the candidate and fallback to a plain relative path if needed.
    // (Don't await fetch here unless you want to verify the file exists.)
    setFavicon(faviconPath);

    // optional: cleanup - not necessary
    // return () => { /* no cleanup needed */ };
  }, []);

  // <-- Replace this with your repo URL -->
  const repoUrl = "https://github.com/profadham/AlgoVision";

  useEffect(() => {
    // parse edges from text (robust to extra spaces/tabs, ignore blank lines / comments)
    const parsed = edgesText
      .split(/\r?\n/) // split into lines (handles CRLF + LF)
      .map((line) => line.trim()) // trim each line
      .filter((line) => line && !line.startsWith("#")) // skip empty / commented lines
      .map((line) => {
        // split on any whitespace (one or more spaces/tabs), returns only non-empty tokens
        const parts = line.split(/\s+/);

        if (parts.length < 2) return null;

        const u = parts[0];
        const v = parts[1];

        const wToken = parts[2];
        const wNum = wToken !== undefined ? parseInt(wToken, 10) : 1;
        const weight = Number.isFinite(wNum) ? wNum : 1;

        return [u, v, weight];
      })
      .filter(Boolean);

    const prev = JSON.stringify(edges);
    const next = JSON.stringify(parsed);

    if (prev !== next) {
      setEdges(parsed);
      setStep(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edgesText]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Left half */}
      {/* <div style={{ width: "30%", background: "#184ae2ff", paddingBottom: 24 }}> */}
        <div style={{ width: "30%", background: "#ffffffff", paddingBottom: 24 }}>
        <EdgeInput value={edgesText} onChange={setEdgesText} />
        <label
          style={{
            display: "block",
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
            padding: "8px 16px",
          }}
        >
          Press (Advance) to Advance Algorithm Step by Step:
        </label>
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
            padding: "8px 16px",
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
        {/* Separator + GitHub button (line = 100% of parent) */}
        <div
          style={{
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch", // allow the separator to fill the parent width
          }}
        >
          {/* separator line at full width of this parent */}
          <div
            style={{
              width: "95%",
              height: "1px",
              background: "rgba(255, 255, 255, 1)",
              height: "4px",
              borderRadius: 1,
            }}
            aria-hidden="true"
          />
        </div>
        {/* GitHub button: use exactly same sizing/margins as other buttons */}
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open project on GitHub"
          role="button"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            textDecoration: "none",

            /* === MATCH other button styles === */
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#2d5fdeff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            margin: "10px",
            width: "90%",
            boxSizing: "border-box",
            boxShadow: "0 4px 8px rgba(0,0,0,0.12)",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 16 16"
            aria-hidden="true"
            style={{ flex: "0 0 20px" }}
          >
            <path
              fill="white"
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
      0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52
      0-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95
      0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.68 7.68 0 0 1 8 4.8c.68.003 1.36.092 2
      .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65
      3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
            />
          </svg>

          <span style={{ fontWeight: 700 }}>View on GitHub</span>
        </a>
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
