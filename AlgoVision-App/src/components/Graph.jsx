import React, { useState, useMemo, useEffect } from "react";
import Node from "./Node";
import Edge from "./Edge";

function Graph({ edges = [], width = "100%", height = "100%" }) {
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
          />
        );
      })}
    </svg>
  );
}

export default Graph;
