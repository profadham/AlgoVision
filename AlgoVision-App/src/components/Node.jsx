import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

function Node({ id, colour, init_x, init_y, refProp, isVisited = false }) {
  const [position, setPosition] = useState({
    x: init_x || 50,
    y: init_y || 50,
  });
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    console.log("Dragging changed:", dragging);
  }, [dragging]);

  const handleMouseDown = () => setDragging(true);
  const handleMouseUp = () => setDragging(false);

  const handleMouseMove = (e) => {
    if (!dragging) return;

    const svg = e.target.closest("svg");
    const rect = svg.getBoundingClientRect();

    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <>
      <circle
        ref={refProp}
        cx={position.x}
        cy={position.y}
        r="30"
        fill={colour}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ cursor: "grab" }}
        // animate={{
        //   fill: isVisited ? "orange" : "blue",
        //   scale: isVisited ? 1.2 : 1,
        // }}
        // transition={{ duration: 0.5 }}
      />
      <text
        x={position.x}
        y={position.y}
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
