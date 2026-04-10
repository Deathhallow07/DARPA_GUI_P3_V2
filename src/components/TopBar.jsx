import React from "react";

export default function TopBar() {
  return (
    <div className="topbar">
      <div className="logo">UAV CONTROL</div>
      <div className="systems">
        <span>COMMS: OK</span>
        <span>GPS: LOCKED</span>
        <span>DRONES: ACTIVE</span>
      </div>
    </div>
  );
}