// Node.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

function Node({ id, colour, x, y, onPositionChange, isVisited = false }) {
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    console.log(`Dragging ${id}:`, dragging);
  }, [dragging]);

  const handleMouseDown = () => setDragging(true);
  const handleMouseUp = () => setDragging(false);

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const svg = e.target.closest("svg");
    const rect = svg.getBoundingClientRect();
    const newX = e.clientX - rect.left;
    const newY = e.clientY - rect.top;
    onPositionChange(id, newX, newY);
  };

  return (
    <>
      <motion.circle
        cx={x}
        cy={y}
        r="30"
        fill={colour}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ cursor: "grab" }}
        animate={{
          fill: isVisited ? "orange" : colour,
          r: isVisited ? 35 : 30,
        }}
        transition={{ duration: 5 }}
      />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dy=".3em"
        fill="white"
        pointerEvents="none"
        fontSize={20}
      >
        {id}
      </text>
    </>
  );
}

export default Node;
