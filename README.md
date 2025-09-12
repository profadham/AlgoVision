# AlgoVision

**AlgoVision** — an interactive algorithm visualizer for graph traversals (DFS, BFS) and shortest paths (Dijkstra).  
Build, tinker, and visualize how graph algorithms explore nodes and edges step-by-step.

Live demo: **https://algo-vision-alpha.vercel.app/** ← _replace with your Vercel URL_

---

## Preview

![screenshot](./docs/screenshot.png)  
*(Add `docs/screenshot.png` or replace with your screenshot path)*

---

## Features

- Visualize DFS, BFS and Dijkstra's algorithm on an undirected graph.
- Click nodes to choose sources for BFS/Dijkstra.
- Step through algorithms with the **Advance** button.
- Force-directed automatic layout via `d3-force`, with bounds so nodes stay inside the board.
- Edge weights visible when Dijkstra is selected.
- Small, draggable nodes for manual layout tweaks.
- Exportable static build that deploys easily to Vercel / Netlify / GitHub Pages.

---

## Quick start (local)

```bash
# 1. clone
git clone https://github.com/<your-username>/AlgoVision.git
cd AlgoVision

# 2. install
npm install

# 3. run dev server
npm start
# open http://localhost:3000
