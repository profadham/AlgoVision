import React from "react";
import "./Board.css";

function Board({ children }) {
  return <div className="board">{children}</div>;
}

export default Board;
