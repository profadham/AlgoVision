import React, { useState, useMemo, useEffect, useRef } from "react";
import Node from "./Node";
import Edge from "./Edge";
import { MinPriorityQueue } from "@datastructures-js/priority-queue";
import * as d3 from "d3-force";

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
  widthPx,
  heightPx,
}) {
  // main controls
  const [sources, setSources] = useState(new Set());
  const [sourceNodes, setSourceNodes] = useState({});
  const [indegree, setIndegree] = useState({});

  // Build adjacency list (string keys)
  const adjacency = useMemo(() => {
    const adj = {};
    edges.forEach(([u, v, w], i) => {
      const su = String(u);
      const sv = String(v);
      if (!adj[su]) adj[su] = [];
      if (!adj[sv]) adj[sv] = [];
      adj[su].push({ node: sv, weight: w, edgeId: i });
      adj[sv].push({ node: su, weight: w, edgeId: i });
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

  // Refs to expose d3 simulation and nodes to drag handlers
  const simulationRef = useRef(null);
  const d3NodesRef = useRef([]);
  const dragStateRef = useRef({ component: new Set(), lastMouse: null });

  useEffect(() => {
    if (!nodes || nodes.length === 0) return;
    if (widthPx <= 0 || heightPx <= 0) return;

    const margin = 40; // padding from edges

    // custom force to keep nodes inside board
    function forceBox(width, height, margin = 40) {
      let nodesVar;
      function force() {
        for (const node of nodesVar) {
          if (node.x < margin) {
            node.x = margin;
            node.vx *= -0.5;
          }
          if (node.x > width - margin) {
            node.x = width - margin;
            node.vx *= -0.5;
          }
          if (node.y < margin) {
            node.y = margin;
            node.vy *= -0.5;
          }
          if (node.y > height - margin) {
            node.y = height - margin;
            node.vy *= -0.5;
          }
        }
      }
      force.initialize = (_) => (nodesVar = _);
      return force;
    }

    // build d3 node objects
    const d3Nodes = nodes.map((id) => ({
      id,
      x: positions[id]?.x || Math.random() * widthPx,
      y: positions[id]?.y || Math.random() * heightPx,
    }));

    const d3Links = edges.map(([u, v]) => ({
      source: String(u),
      target: String(v),
    }));

    const simulation = d3
      .forceSimulation(d3Nodes)
      .force(
        "link",
        d3
          .forceLink(d3Links)
          .id((d) => d.id)
          .distance(120)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      // use weak centering forces instead of forceCenter
      .force("x", d3.forceX(widthPx / 2).strength(0.05))
      .force("y", d3.forceY(heightPx / 2).strength(0.05))
      // keep nodes inside board
      .force("box", forceBox(widthPx, heightPx, margin));

    // save refs for drag handlers
    simulationRef.current = simulation;
    d3NodesRef.current = d3Nodes;

    simulation.on("tick", () => {
      setPositions(() => {
        const next = {};
        d3Nodes.forEach((n) => {
          next[n.id] = { x: n.x, y: n.y };
        });
        return next;
      });
    });

    return () => {
      simulation.stop();
      simulationRef.current = null;
      d3NodesRef.current = [];
    };
  }, [nodes, edges, widthPx, heightPx]);

  // Called by Node: onPositionChange(id, x, y)
  const updatePosition = (id, x, y) => {
    setPositions((prev) => ({ ...prev, [id]: { x, y } }));
  };

  const [visitedNodes, setVisitedNodes] = useState({});
  const [visitedEdges, setVisitedEdges] = useState({});

  //dfs controls
  const [visited, setVisited] = useState(new Set());
  const [dfsOrder, setDfsOrder] = useState([]);
  const [dfsOrderId, setDfsOrderId] = useState([]);
  const [exploredEgesDfs, setExploredEdgesDfs] = useState({});

  useEffect(() => {
    // If step is 0 we want to reset visited / order
    setVisited(new Set());
    setDfsOrder([]);

    // local structures (do NOT mutate React state directly)
    const localVisited = new Set();
    const localOrder = [];
    const localExploredEdges = {};
    // recursive DFS using localVisited and localOrder
    const dfs = (node) => {
      if (localVisited.has(node)) return;
      localVisited.add(node);
      localOrder.push(node);
      localExploredEdges[localOrder.length - 1] = [];
      const neighbors = adjacency[node] || [];
      for (const { node: neighbor, edgeId: curEdge } of neighbors) {
        if (!localVisited.has(neighbor)) {
          localExploredEdges[localOrder.length - 1].push(curEdge);
        }
      }
      for (const { node: neighbor, edgeId: curEdge } of neighbors) {
        if (!localVisited.has(neighbor)) {
          dfs(neighbor);
        }
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
    setExploredEdgesDfs(localExploredEdges);
    // Log the result (log localOrder — this is reliable)
  }, [adjacency, nodes]);

  //bfs controls
  const [bfsDist, setBfsDist] = useState({});
  const [bfsOrder, setBfsOrder] = useState([]);
  const [bfsOrderId, setBfsOrderId] = useState([]);
  const [exploredEdgesBfs, setExploredEdgesBfs] = useState({});
  const [bfsDistOrder, setBfsDistOrder] = useState({});

  useEffect(() => {
    setBfsDist({});
    setBfsOrder([]);
    setBfsOrderId([]);
    const queue = [];

    const localDist = {};
    const localOrder = [];
    const localExploredEdges = {};
    const localDistOrder = {};

    // Initialize queue with all source nodes
    for (const id of Object.keys(sourceNodes)) {
      if (sourceNodes[id]) {
        queue.push(id);
        localDist[id] = 0;
        localOrder.push(id);
      }
    }
    let cur = 0;
    // Perform BFS
    while (queue.length > 0) {
      const node = queue.shift();
      const neighbors = adjacency[node] || [];
      localExploredEdges[cur] = [];
      localDistOrder[cur] = { ...localDist };
      cur++;
      for (const { node: neighbor, edgeId: curEdge } of neighbors) {
        if (localDist[neighbor] === undefined) {
          localDist[neighbor] = localDist[node] + 1;
          localOrder.push(neighbor);
          localExploredEdges[cur - 1].push(curEdge);
          queue.push(neighbor);
        }
      }
    }
    setBfsDist(localDist);
    setBfsOrder(localOrder);
    setBfsOrderId(localOrder.map((n) => String(n)));
    setExploredEdgesBfs(localExploredEdges);
    setBfsDistOrder(localDistOrder);
  }, [adjacency, nodes, sourceNodes]);

  //dijkstra controls
  const [dijkDist, setDijkDist] = useState({});
  const [dijkOrder, setDijkOrder] = useState([]);
  const [dijkDistOrder, setDijkDistOrder] = useState({});
  const [dijkOrderId, setDijkOrderId] = useState([]);
  const [dijkVis, setDijkVis] = useState({});
  const [exploredEdgesDijk, setExploredEdgesDijk] = useState({});

  useEffect(() => {
    setDijkDist({});
    setDijkOrder([]);
    setDijkOrderId([]);
    setDijkVis({});
    const pq = new MinPriorityQueue((x) => x.dist);
    const localDist = {};
    for (const id of nodes) {
      localDist[id] = Infinity;
    }
    const localOrder = [];
    const localExploredEdges = {};
    const localDistOrder = {};
    const localVis = {};
    // Initialize pq with all source nodes
    for (const id of Object.keys(sourceNodes)) {
      if (sourceNodes[id]) {
        pq.enqueue({ id, dist: 0 });
        localDist[id] = 0;
      }
    }
    let cur = 0;
    // Perform Dijkstra
    while (!pq.isEmpty()) {
      const { id: node } = pq.dequeue();
      if (localVis[node]) continue; // already processed
      localVis[node] = true;
      // Explore neighbors
      localOrder.push(node);
      localExploredEdges[cur] = [];
      localDistOrder[cur] = { ...localDist };
      cur++;
      const neighbors = adjacency[node] || [];
      for (const { node: neighbor, weight, edgeId: curEdge } of neighbors) {
        const newDist =
          localDist[node] === Infinity
            ? Infinity
            : localDist[node] + (weight ?? 1);
        localExploredEdges[cur - 1].push(curEdge);
        if (
          localDist[neighbor] === undefined ||
          newDist < localDist[neighbor]
        ) {
          localDist[neighbor] = newDist;
          pq.enqueue({ id: neighbor, dist: newDist });
        }
      }
    }
    setDijkDist(localDist);
    setDijkOrder(localOrder);
    setDijkOrderId(localOrder.map((n) => String(n)));
    setDijkVis(localVis);
    setExploredEdgesDijk(localExploredEdges);
    setDijkDistOrder(localDistOrder);
  }, [adjacency, nodes, sourceNodes]);

  //step effect
  useEffect(() => {
    if (step === 0) {
      setVisitedNodes({});
      setVisitedEdges({});
    }
    if (algorithm === 1) {
      if (step > dfsOrder.length) setStep(0);
      for (let i = 0; i < dfsOrder.length; i++) {
        if (i == step - 1) {
          setVisitedNodes((prev) => ({ ...prev, [dfsOrder[i]]: true }));
          setVisitedEdges((prev) => {
            const newEdges = { ...prev };
            const edgesToAdd = exploredEgesDfs[i] || [];
            edgesToAdd.forEach((eId) => {
              newEdges[eId] = true;
            });
            return newEdges;
          });
          break;
        }
      }
    } else if (algorithm === 2) {
      if (step > bfsOrder.length) setStep(0);
      for (let i = 0; i < bfsOrder.length; i++) {
        if (i == step - 1) {
          setVisitedNodes((prev) => ({ ...prev, [bfsOrder[i]]: true }));
          setVisitedEdges((prev) => {
            const newEdges = { ...prev };
            const edgesToAdd = exploredEdgesBfs[i] || [];
            edgesToAdd.forEach((eId) => {
              newEdges[eId] = true;
            });
            return newEdges;
          });
          break;
        }
      }
    } else if (algorithm === 3) {
      if (step > dijkOrder.length) setStep(0);
      for (let i = 0; i < dijkOrder.length; i++) {
        if (i == step - 1) {
          setVisitedNodes((prev) => ({ ...prev, [dijkOrder[i]]: true }));
          setVisitedEdges((prev) => {
            const newEdges = { ...prev };
            const edgesToAdd = exploredEdgesDijk[i] || [];
            edgesToAdd.forEach((eId) => {
              newEdges[eId] = true;
            });
            return newEdges;
          });
          break;
        }
      }
    }
  }, [step, algorithm, dfsOrder, bfsOrder, dijkOrder]);

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
    setVisitedEdges({});
    // Clear all source nodes
    for (const id of Object.keys(sourceNodes)) {
      setSourceNodes((prev) => ({ ...prev, [id]: false }));
    }
  }, [algorithm]);

  useEffect(() => {
    setStep(0);
    setVisitedNodes({});
    setVisitedEdges({});
    // console.log("SourceNodes:", sourceNodes);
  }, [sourceNodes]);

  useEffect(() => {
    // console.log("DfsOrder:", dfsOrder);
  }, [dfsOrder]);
  useEffect(() => {
    // console.log("BfsOrder:", bfsOrder);
  }, [bfsOrder]);
  useEffect(() => {
    // console.log("DijkOrder:", dijkOrder);
    // console.log("DijkDistOrder:", dijkDistOrder);
  }, [dijkOrder]);

  // Utility: get connected component of a node (BFS)
  const getComponent = (startId) => {
    const comp = new Set();
    const q = [String(startId)];
    while (q.length > 0) {
      const cur = q.shift();
      if (comp.has(cur)) continue;
      comp.add(cur);
      const neighbors = adjacency[cur] || [];
      for (const { node: nb } of neighbors) {
        if (!comp.has(nb)) q.push(nb);
      }
    }
    return comp;
  };

  // Drag handlers called from Node (client coords)
  const handleDragStart = (id, clientX, clientY) => {
    const comp = getComponent(id);
    dragStateRef.current = {
      component: comp,
      lastMouse: { x: clientX, y: clientY },
    };
    const sim = simulationRef.current;
    if (sim) {
      sim.alphaTarget(0.3).restart();
      // fix the nodes currently in the component so they move with us
      for (const n of d3NodesRef.current) {
        if (comp.has(String(n.id))) {
          n.fx = n.x;
          n.fy = n.y;
        }
      }
    }
  };

  const handleDrag = (id, clientX, clientY) => {
    const ds = dragStateRef.current;
    if (!ds.lastMouse) return;
    const dx = clientX - ds.lastMouse.x;
    const dy = clientY - ds.lastMouse.y;
    ds.lastMouse = { x: clientX, y: clientY };

    // move all fixed nodes in the component
    const sim = simulationRef.current;
    if (sim) {
      for (const n of d3NodesRef.current) {
        if (ds.component.has(String(n.id))) {
          // if fx/fy are null for some reason, initialize from x/y
          n.fx = (n.fx ?? n.x) + dx;
          n.fy = (n.fy ?? n.y) + dy;
        }
      }
      // update React positions quickly so edges render without waiting for many ticks
      setPositions((prev) => {
        const next = { ...prev };
        for (const nid of ds.component) {
          const p = next[nid] || { x: 0, y: 0 };
          next[nid] = { x: p.x + dx, y: p.y + dy };
        }
        return next;
      });

      // run a single tick so d3 updates internal positions immediately
      try {
        sim.tick();
      } catch (e) {
        // tick can sometimes throw if simulation stopped — ignore harmlessly
      }
    }
  };

  const handleDragEnd = (id, clientX, clientY) => {
    const ds = dragStateRef.current;
    const sim = simulationRef.current;
    if (sim) {
      for (const n of d3NodesRef.current) {
        if (ds.component.has(String(n.id))) {
          n.fx = null;
          n.fy = null;
        }
      }
      sim.alphaTarget(0);
    }
    dragStateRef.current = { component: new Set(), lastMouse: null };
  };

  return (
    <svg width={width} height={height}>
      {/* Render edges — skip if positions missing (but we log once) */}
      {edges.map(([u, v, w], i) => {
        const from = positions[String(u)];
        const to = positions[String(v)];
        if (!from || !to) {
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
            is_visited={!!visitedEdges[i]}
          />
        );
      })}

      {/* Render nodes. Use a safe fallback position to avoid runtime errors */}
      {nodes.map((id) => {
        const pos = positions[id] ?? { x: widthPx / 2, y: heightPx / 2 }; // fallback
        let dist = Infinity;
        if (algorithm === 1) {
          const idx = dfsOrderId.indexOf(String(id));
          dist = idx !== -1 ? idx : Infinity;
        } else if (algorithm === 2) {
          if (bfsDistOrder[step - 1] === undefined) {
            dist = Infinity;
          } else {
            dist =
              bfsDistOrder[step - 1][id] !== undefined
                ? bfsDistOrder[step - 1][id]
                : Infinity;
          }
        } else if (algorithm === 3) {
          if (dijkDistOrder[step - 1] === undefined) {
            dist = Infinity;
          } else {
            dist =
              dijkDistOrder[step - 1][id] !== undefined
                ? dijkDistOrder[step - 1][id]
                : Infinity;
          }
        }
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
            distance={dist}
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
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
          />
        );
      })}
    </svg>
  );
}

export default Graph;
