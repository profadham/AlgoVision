// Node.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

function Node({
  id,
  colour,
  x,
  y,
  onPositionChange,
  isVisited = false,
  chooseSourceMode = false,
  setChooseSourceMode,
  onClick,
  source = false,
  distance = Infinity,
}) {
  const [dragging, setDragging] = useState(false);
  // const [source, setSource] = useState(false);

  // useEffect(() => {
  //   console.log(`Dragging ${id}:`, dragging);
  // }, [dragging]);

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
        onMouseDown={chooseSourceMode ? null : handleMouseDown}
        onMouseUp={chooseSourceMode ? null : handleMouseUp}
        onMouseMove={chooseSourceMode ? null : handleMouseMove}
        style={{ cursor: "grab" }}
        onClick={onClick}
        animate={{
          fill: isVisited ? "orange" : source ? "red" : colour,
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

      <text
        x={x + 40} // 40px to the right of the circle
        y={y}
        textAnchor="start"
        dy=".3em"
        fill="#daf110ff"
        fontSize={16}
        fontWeight="bold"
        pointerEvents="none"
      >
        {distance === Infinity ? "∞" : distance}
      </text>
    </>
  );
}

export default Node;
