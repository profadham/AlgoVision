import React, { useRef, useEffect } from "react";
import "./Board.css";

function Board({
  children,
  widthPx = 0,
  setWidthPx,
  heightPx = 0,
  setHeightPx,
}) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      setWidthPx(ref.current.offsetWidth); // measure in pixels
      setHeightPx(ref.current.offsetHeight);
    }

    // Optional: handle window resize
    const handleResize = () => {
      if (ref.current) {
        setWidthPx(ref.current.offsetWidth);
        setHeightPx(ref.current.offsetHeight);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="board" ref={ref} style = {{height: "100vh"}}>
      {children}
    </div>
  );
}

export default Board;
