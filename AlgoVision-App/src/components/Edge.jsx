// Edge.jsx
import React, { useEffect, useState } from "react";

function Edge({ nodeARef, nodeBRef, weight = 1 }) {
  const [line, setLine] = useState({ x1: 0, y1: 0, x2: 0, y2: 0 });

  useEffect(() => {
    const update = () => {
      if (nodeARef.current && nodeBRef.current) {
        setLine({
          x1: parseFloat(nodeARef.current.getAttribute("cx")),
          y1: parseFloat(nodeARef.current.getAttribute("cy")),
          x2: parseFloat(nodeBRef.current.getAttribute("cx")),
          y2: parseFloat(nodeBRef.current.getAttribute("cy")),
        });
      }
    };

    let frameId;
    const tick = () => {
      update();
      frameId = requestAnimationFrame(tick);
    };
    tick();

    return () => cancelAnimationFrame(frameId);
  }, [nodeARef, nodeBRef]);

  const midX = (line.x1 + line.x2) / 2;
  const midY = (line.y1 + line.y2) / 2;

  return (
    <>
      <line {...line} stroke="black" strokeWidth="2" />
      <text
        x={midX}
        y={midY}
        textAnchor="middle"
        dy="-5"
        fontSize="16"
        fill="black"
        fontWeight="bold"
        style={{ userSelect: "none" }}
      >
        {weight}
      </text>
    </>
  );
}

export default Edge;
