import React from "react";
import drones from "../data/drones.json";
import { DroneIcon, RoverIcon } from "./Icons";

export default function TopDronePanel() {
  return (
    <div className="top-panel">
      {drones.map((d) => (
        <div key={d.id} className="drone-box">
          <div className="drone-header">
            {d.type === "Drone" ? <DroneIcon size={24} /> : <RoverIcon size={24} />} {d.id}
          </div>
          <div>🔋 {d.battery}%</div>
          <div>Mode: {d.mode}</div>
          <div className="drone-notif-bar">{d.notification}</div>
        </div>
      ))}
    </div>
  );
}