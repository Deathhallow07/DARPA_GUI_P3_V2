import React from "react";
import MapView from "../components/MapView";
import SystemButtons from "../components/SystemButtons";
import ReportsPanel from "../components/ReportsPanel";
import CasualtyButton from "../components/CasualtyButton";

export default function MapPage() {
  return (
    <>
      <MapView />
      <SystemButtons />
      <ReportsPanel />
      <CasualtyButton />
    </>
  );
}
