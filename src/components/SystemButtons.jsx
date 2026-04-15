import React from "react";
import { useNavigate } from "react-router-dom";

export default function SystemButtons() {
  const navigate = useNavigate();

  return (
    <div className="system-buttons">
      <button 
        onClick={() => navigate("/command-center")} // MUST match AppRouter path
        style={{
          background: "#0ea5e9",
          color: "white",
          padding: "6px 12px",
          border: "none",
          cursor: "pointer",
          fontWeight: "bold",
          textTransform: "uppercase"
        }}
      >
        Systems
      </button>
    </div>
  );
}