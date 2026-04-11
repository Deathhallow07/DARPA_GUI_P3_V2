import React, { useEffect, useRef, useState } from "react";

export default function BottomFeed({ height, setHeight }) {
  const [dragging, setDragging] = useState(false);
  const startY = useRef(0);
  const [messages, setMessages] = useState([
    "System initialized",
    "Awaiting commands"
  ]);

  const onMouseDown = (e) => {
    setDragging(true);
    startY.current = e.clientY;
  };

  const onMouseMove = (e) => {
    if (!dragging) return;
    const diff = startY.current - e.clientY;
    setHeight((h) => Math.max(60, Math.min(400, h + diff)));
    startY.current = e.clientY;
  };

  const onMouseUp = () => setDragging(false);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMessages((prev) => [...prev, "Server update received"]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bottom-feed" style={{ height }}>
      <div className="drag-handle" onMouseDown={onMouseDown} />
      {messages.slice(-15).map((m, i) => (
        <div key={i}>{m}</div>
      ))}
    </div>
  );
}
