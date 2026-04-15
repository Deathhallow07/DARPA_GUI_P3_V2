import React from "react";
import { useNavigate } from "react-router-dom";
import drones from "../data/drones.json";
import { DroneIcon, RoverIcon } from "./Icons";
import SystemButtons from "./SystemButtons"; // Ensure this import exists

export default function TopDronePanel() {
  const navigate = useNavigate();

  return (
    <div className="top-panel">
      {/* ── NEW INTEGRATION: The Portal to your New Interface ── */}
      <div className="nav-section" style={{ paddingRight: '15px', borderRight: '1px solid #333', marginRight: '15px' }}>
        <SystemButtons />
      </div>

      {/* ── ORIGINAL DRONE DATA ── */}
      {drones.map((d) => (
        <div 
          key={d.id} 
          className="drone-box"
          onClick={() => navigate(`/casualties/${d.id}`)} // Redirect to specific dashboard on click
          style={{ cursor: 'pointer' }}
        >
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
