import React from "react";
import { useNavigate } from "react-router-dom";

export default function CasualtyButton() {
  const navigate = useNavigate();

  return (
    <div className="casualty-btn">
      <button onClick={() => navigate("/casualties")}>Casualties</button>
    </div>
  );
}
