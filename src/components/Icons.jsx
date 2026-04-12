import React from "react";

export const DroneIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#5b8ab5" strokeWidth="1.5">
    <circle cx="12" cy="12" r="3" />
    <line x1="2"  y1="12" x2="9"  y2="12" />
    <line x1="15" y1="12" x2="22" y2="12" />
    <line x1="12" y1="2"  x2="12" y2="9"  />
    <line x1="12" y1="15" x2="12" y2="22" />
  </svg>
);

export const RoverIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#c8922a" strokeWidth="1.5">
    <rect x="4" y="10" width="16" height="6" />
    <circle cx="7"  cy="18" r="2" fill="#c8922a" />
    <circle cx="17" cy="18" r="2" fill="#c8922a" />
  </svg>
);

export const CasualtyIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#b85252" strokeWidth="1.5">
    <circle cx="12" cy="8" r="3" />
    <line x1="12" y1="11" x2="12" y2="20" />
    <line x1="8"  y1="14" x2="16" y2="14" />
  </svg>
);
