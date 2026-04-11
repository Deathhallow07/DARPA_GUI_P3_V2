import React from "react";

export default function DroneCard({ drone }) {
  return (
    <div className="drone-card">
      <div><strong>{drone.id}</strong> ({drone.type})</div>
      <div>Battery: {drone.battery}%</div>
      <div>Mode: {drone.mode}</div>
      <div className="drone-notif">{drone.notification}</div>
    </div>
  );
}