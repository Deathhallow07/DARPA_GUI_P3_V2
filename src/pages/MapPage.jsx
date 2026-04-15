import React from "react";
import MapView from "../components/MapView";
import ReportsPanel from "../components/ReportsPanel";
import CasualtyButton from "../components/CasualtyButton";

export default function MapPage() {
  return (
    <>
      <MapView />
      <ReportsPanel />
      <CasualtyButton/>
    </>
  );
}
