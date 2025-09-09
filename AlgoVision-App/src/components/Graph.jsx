// Graph.jsx
import React, { useMemo } from "react";
import Node from "./Node";
import Edge from "./Edge";

function Graph({ edges }) {
  // Build adjacency list with weights
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

  const nodes = Object.keys(adjacency);

  // Create a ref for each node
  const nodeRefs = useMemo(() => {
    const refs = {};
    nodes.forEach((id) => {
      refs[id] = React.createRef();
    });
    return refs;
  }, [nodes]);

  return (
    <svg width="100%" height="100%" style={{ background: "#f4f4f4" }}>
      {/* Draw edges */}
      {edges.map(([u, v, w], i) => (
        <Edge
          key={i}
          nodeARef={nodeRefs[u]}
          nodeBRef={nodeRefs[v]}
          weight={w}
        />
      ))}

      {/* Draw nodes */}
      {nodes.map((id, i) => (
        <Node
          key={id}
          id={id}
          colour="blue"
          init_x={100 + i * 100} // arbitrary positions for now
          init_y={200}
          refProp={nodeRefs[id]}
        />
      ))}
    </svg>
  );
}

export default Graph;
