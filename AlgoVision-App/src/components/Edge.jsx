// Edge.jsx
import React from "react";
import { motion } from "framer-motion";

function Edge({
  from,
  to,
  weight = 1,
  is_visited = false,
  algorithm = 1,
  setAlgorithm,
}) {
  if (!from || !to) return null; // ✅ safety check

  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;

  return (
    <>
      <motion.line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={is_visited ? "orange" : "red"}
        strokeWidth="2"
        animate={{ stroke: is_visited ? "orange" : "red" }}
        transition={{ duration: 5 }}
      />
      <text
        x={midX}
        y={midY}
        textAnchor="middle"
        dy="-5"
        fontSize="16"
        fill="black"
        fontWeight="bold"
        style={{ userSelect: "none" }}
        opacity={algorithm === 3 ? 1 : 0} // Show weight only for Dijkstra's
      >
        {weight}
      </text>
    </>
  );
}

export default Edge;
