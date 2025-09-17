import React, { useState } from "react";
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
  onDragStart,
  onDrag,
  onDragEnd,
}) {
  const [dragging, setDragging] = useState(false);

  // Use pointer events (better for touch + mouse) and delegate drag behavior to Graph
  const handlePointerDown = (e) => {
    if (chooseSourceMode) return;
    setDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
    onDragStart?.(id, e.clientX, e.clientY);
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;
    onDrag?.(id, e.clientX, e.clientY);
  };

  const handlePointerUp = (e) => {
    if (!dragging) return;
    setDragging(false);
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    onDragEnd?.(id, e.clientX, e.clientY);
  };

  return (
    <>
      <motion.circle
        cx={x}
        cy={y}
        r="30"
        fill={colour}
        onPointerDown={chooseSourceMode ? null : handlePointerDown}
        onPointerUp={chooseSourceMode ? null : handlePointerUp}
        onPointerMove={chooseSourceMode ? null : handlePointerMove}
        style={{ cursor: "grab" }}
        onClick={onClick}
        animate={{
          fill: isVisited ? "orange" : source ? "red" : colour,
          r: isVisited ? 35 : 30,
        }}
        transition={{ duration: 0.12 }}
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
        x={x + 40}
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
