import React, { useState, useMemo, useEffect, use } from "react";
import Node from "./Node";
import Edge from "./Edge";

function Graph({
  edges = [],
  width = "100%",
  height = "100%",
  step = 0,
  setStep,
  chooseSourceMode = false,
  setChooseSourceMode,
}) {
  //main controls
  const [sources, setSources] = useState(new Set());

  // Build adjacency list
  const adjacency = useMemo(() => {
    const adj = {};
    edges.forEach(([u, v, w]) => {
      if (!adj[u]) adj[u] = [];
      if (!adj[v]) adj[v] = [];
      adj[u].push({ node: v, weight: w });
      adj[v].push({ node: u, weight: w });
    });
    return adj;
  }, [edges]);

  // Collect unique node ids
  const nodes = useMemo(() => {
    const s = new Set();
    edges.forEach(([u, v]) => {
      s.add(String(u));
      s.add(String(v));
    });
    return Array.from(s);
  }, [edges]);

  // positions: { id: { x, y } }
  const [positions, setPositions] = useState({});

  useEffect(() => {
    console.log("Graph step changed:", step);
  }, [step]);

  // Initialize or add missing nodes whenever nodes change
  useEffect(() => {
    // If there are no nodes yet, nothing to do
    if (!nodes || nodes.length === 0) return;

    setPositions((prev) => {
      const next = { ...prev };
      let changed = false;
      nodes.forEach((id, idx) => {
        if (!next[id]) {
          next[id] = {
            x: (100 + idx * 100) % 1000,
            y: (100 + idx * 100) % 600,
          };
          changed = true;
        }
      });

      // Remove stale nodes that no longer exist (optional)
      Object.keys(next).forEach((k) => {
        if (!nodes.includes(k)) {
          delete next[k];
          changed = true;
        }
      });

      return changed ? next : prev;
    });
  }, [nodes, width, height]);

  // Called by Node: onPositionChange(id, x, y)
  const updatePosition = (id, x, y) => {
    setPositions((prev) => ({ ...prev, [id]: { x, y } }));
  };

  //dfs controls
  const [visited, setVisited] = useState(new Set());
  const [dfsOrder, setDfsOrder] = useState([]);
  const [dfsOrderId, setDfsOrderId] = useState([]);

  useEffect(() => {
    // If step is 0 we want to reset visited / order
    setVisited(new Set());
    setDfsOrder([]);
    console.log("DFS reset (step 0)");

    // local structures (do NOT mutate React state directly)
    const localVisited = new Set();
    const localOrder = [];
    console.log("eh");
    // recursive DFS using localVisited and localOrder
    const dfs = (node) => {
      if (localVisited.has(node)) return;
      localVisited.add(node);
      localOrder.push(node);

      const neighbors = adjacency[node] || [];
      for (const { node: neighbor } of neighbors) {
        if (!localVisited.has(neighbor)) dfs(neighbor);
      }
    };

    // Run DFS for each component (deterministic order from nodes array)
    for (const node of nodes) {
      console.log("Starting DFS at node:", node);
      if (!localVisited.has(node)) dfs(node);
    }

    // commit local results to React state (one update)
    setVisited(localVisited);
    setDfsOrder(localOrder);
    setDfsOrderId(localOrder.map((n) => String(n)));
    // Log the result (log localOrder — this is reliable)
    console.log("DFS computed order:", dfsOrderId);
  }, [adjacency, nodes]);

  const [visitedNodes, setVisitedNodes] = useState({});

  //bfs controls
  const [bfsDist, setBfsDist] = useState({});

  //step effect
  useEffect(() => {
    if (step > dfsOrder.length) setStep(0);
    for (let i = 0; i < dfsOrder.length; i++) {
      if (i == step - 1) {
        setVisitedNodes((prev) => ({ [dfsOrder[i]]: true }));
        break;
      }
    }
  }, [step]);

  return (
    <svg width={width} height={height}>
      {/* Render edges — skip if positions missing (but we log once) */}
      {edges.map(([u, v, w], i) => {
        const from = positions[u];
        const to = positions[v];
        if (!from || !to) {
          // still useful to warn (but not crash)
          console.warn(`Skipping edge ${u}-${v}, missing positions`);
          return null;
        }
        return <Edge key={i} from={from} to={to} weight={w} />;
      })}

      {/* Render nodes. Use a safe fallback position to avoid runtime errors */}
      {nodes.map((id) => {
        const pos = positions[id] ?? { x: width / 2, y: height / 2 }; // fallback
        return (
          <Node
            key={id}
            id={id}
            colour="blue"
            x={pos.x}
            y={pos.y}
            onPositionChange={updatePosition}
            isVisited={!!visitedNodes[id]}
            chooseSourceMode={chooseSourceMode}
            setChooseSourceMode={setChooseSourceMode}
            onClick={() => {
              console.log("Node nowwww clicked:", id);
              if (chooseSourceMode) {
                setSources((prev) => {
                  const next = new Set(prev);
                  if (next.has(id)) next.delete(id);
                  else next.add(id);
                  return next;
                });
                console.log("Sources now:", sources);
              }
            }}
          />
        );
      })}
    </svg>
  );
}

export default Graph;
