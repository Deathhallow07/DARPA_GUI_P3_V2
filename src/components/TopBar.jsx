import React from "react";
import drones from "../data/drones.json";
import DroneCard from "./DroneCard";

export default function TopBar() {
  return (
    <div className="topbar">
      <div className="logo">UAV CONTROL</div>
      <div className="drone-stats">
        {drones.map((d) => (
          <DroneCard key={d.id} drone={d} />
        ))}
      </div>
    </div>
  );
}