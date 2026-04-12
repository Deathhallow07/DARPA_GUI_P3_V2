import React from "react";
import drones from "../data/drones.json";
import { DroneIcon, RoverIcon } from "./Icons";

export default function TopDronePanel() {
  return (
    <div className="top-panel">
      {drones.map((d) => (
        <div key={d.id} className="drone-box">
          <div className="drone-header">
            {d.type === "Drone" ? <DroneIcon size={20} /> : <RoverIcon size={20} />}
            <span>{d.id}</span>
          </div>
          <div style={{ marginTop: 4, fontSize: 11, color: "#8a8070" }}>
            {d.battery}% &nbsp;|&nbsp; {d.mode}
          </div>
          <div className="drone-notif-bar">{d.notification}</div>
        </div>
      ))}
    </div>
  );
}
