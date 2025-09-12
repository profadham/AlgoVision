import React, { useState, useMemo, useEffect, use } from "react";
import Node from "./Node";
import Edge from "./Edge";
import { MinPriorityQueue } from "@datastructures-js/priority-queue";

function Graph({
  edges = [],
  width = "100%",
  height = "100%",
  step = 0,
  setStep,
  chooseSourceMode = false,
  setChooseSourceMode,
  algorithm = 1, //1-dfs,2-bfs,3-dijkstra
  setAlgorithm,
}) {
  //main controls
  const [sources, setSources] = useState(new Set());
  const [sourceNodes, setSourceNodes] = useState({});
  // const [algorithm, setAlgorithm] = useState(1); //1-dfs,2-bfs,3-dijkstra

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

    // local structures (do NOT mutate React state directly)
    const localVisited = new Set();
    const localOrder = [];
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
      if (!localVisited.has(node)) dfs(node);
    }

    // commit local results to React state (one update)
    setVisited(localVisited);
    setDfsOrder(localOrder);
    setDfsOrderId(localOrder.map((n) => String(n)));
    // Log the result (log localOrder — this is reliable)
  }, [adjacency, nodes]);

  const [visitedNodes, setVisitedNodes] = useState({});

  //bfs controls
  const [bfsDist, setBfsDist] = useState({});
  const [bfsOrder, setBfsOrder] = useState([]);
  const [bfsOrderId, setBfsOrderId] = useState([]);

  useEffect(() => {
    setBfsDist({});
    setBfsOrder([]);
    setBfsOrderId([]);
    const queue = [];

    const localDist = {};
    const localOrder = [];
    // Initialize queue with all source nodes
    for (const id of Object.keys(sourceNodes)) {
      if (sourceNodes[id]) {
        queue.push(id);
        localDist[id] = 0;
        localOrder.push(id);
      }
    }
    // Perform BFS
    while (queue.length > 0) {
      const node = queue.shift();
      const neighbors = adjacency[node] || [];
      for (const { node: neighbor } of neighbors) {
        if (localDist[neighbor] === undefined) {
          localDist[neighbor] = localDist[node] + 1;
          localOrder.push(neighbor);
          queue.push(neighbor);
        }
      }
    }
    setBfsDist(localDist);
    setBfsOrder(localOrder);
    setBfsOrderId(localOrder.map((n) => String(n)));
  }, [adjacency, nodes, sourceNodes]);

  //dijkstra controls
  const [dijkDist, setDijkDist] = useState({});
  const [dijkOrder, setDijkOrder] = useState([]);
  const [dijkOrderId, setDijkOrderId] = useState([]);

  useEffect(() => {
    setDijkDist({});
    setDijkOrder([]);
    setDijkOrderId([]);
    const pq = new MinPriorityQueue((x) => x.dist);
    const localDist = {};
    const localOrder = [];
    // Initialize pq with all source nodes
    for (const id of Object.keys(sourceNodes)) {
      if (sourceNodes[id]) {
        pq.enqueue({ id, dist: 0 });
        localDist[id] = 0;
        localOrder.push(id);
      }
    }
    // Perform Dijkstra
    while (!pq.isEmpty()) {
      const { id: node } = pq.dequeue();
      const neighbors = adjacency[node] || [];
      for (const { node: neighbor, weight } of neighbors) {
        const newDist = localDist[node] + (weight || 1);
        if (
          localDist[neighbor] === undefined ||
          newDist < localDist[neighbor]
        ) {
          localDist[neighbor] = newDist;
          localOrder.push(neighbor);
          pq.enqueue({ id: neighbor, dist: newDist });
        }
      }
    }
    setDijkDist(localDist);
    setDijkOrder(localOrder);
    setDijkOrderId(localOrder.map((n) => String(n)));
  }, [adjacency, nodes, sourceNodes]);

  //step effect
  useEffect(() => {
    if (algorithm === 1) {
      if (step > dfsOrder.length) setStep(0);
      for (let i = 0; i < dfsOrder.length; i++) {
        if (i == step - 1) {
          setVisitedNodes((prev) => ({ [dfsOrder[i]]: true }));
          break;
        }
      }
    } else if (algorithm === 2) {
      if (step > bfsOrder.length) setStep(0);
      for (let i = 0; i < bfsOrder.length; i++) {
        if (i == step - 1) {
          setVisitedNodes((prev) => ({ [bfsOrder[i]]: true }));
          break;
        }
      }
    } else if (algorithm === 3) {
      if (step > dijkOrder.length) setStep(0);
      for (let i = 0; i < dijkOrder.length; i++) {
        if (i == step - 1) {
          setVisitedNodes((prev) => ({ [dijkOrder[i]]: true }));
          break;
        }
      }
    }
  }, [step]);

  useEffect(() => {
    for (const [id, src] of Object.entries(sourceNodes)) {
      if (!nodes.includes(id) && src) {
        setSourceNodes((prev) => ({ ...prev, [id]: false }));
      }
    }
  }, [nodes]);

  useEffect(() => {
    setStep(0);
    // Reset visited nodes
    setVisitedNodes({});
    // Clear all source nodes
    for (const id of Object.keys(sourceNodes)) {
      setSourceNodes((prev) => ({ ...prev, [id]: false }));
    }
  }, [algorithm]);

  useEffect(() => {
    console.log("DfsOrder:", dfsOrder);
  }, [dfsOrder]);
  useEffect(() => {
    console.log("BfsOrder:", bfsOrder);
  }, [bfsOrder]);
  useEffect(() => {
    console.log("DijkOrder:", dijkOrder);
  }, [dijkOrder]);

  return (
    <svg width={width} height={height}>
      {/* Render edges — skip if positions missing (but we log once) */}
      {edges.map(([u, v, w], i) => {
        const from = positions[u];
        const to = positions[v];
        if (!from || !to) {
          // still useful to warn (but not crash)
          // console.warn(`Skipping edge ${u}-${v}, missing positions`);
          return null;
        }
        return (
          <Edge
            key={i}
            from={from}
            to={to}
            weight={w}
            algorithm={algorithm}
            setAlgorithm={setAlgorithm}
          />
        );
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
            source={!!sourceNodes[id]}
            distance={
              algorithm === 2 && bfsDist[id] !== undefined
                ? bfsDist[id]
                : algorithm === 3 && dijkDist[id] !== undefined
                ? dijkDist[id]
                : algorithm === 1 && dfsOrderId.indexOf(id) !== -1
                ? dfsOrderId.indexOf(id)
                : Infinity
            }
            onClick={() => {
              if (chooseSourceMode) {
                setSources((prev) => {
                  const next = new Set(prev);
                  if (next.has(id)) next.delete(id);
                  else next.add(id);
                  return next;
                });
                setSourceNodes((prev) => ({ ...prev, [id]: !prev[id] }));
              }
            }}
          />
        );
      })}
    </svg>
  );
}

export default Graph;
