import React, { useState } from "react";
import MapView from "./components/MapView";
import TopDronePanel from "./components/TopDronePanel";
import BottomFeed from "./components/BottomFeed";
import ReportsPanel from "./components/ReportsPanel";
import CasualtyButton from "./components/CasualtyButton";
import SystemButtons from "./components/SystemButtons";

export default function App() {
  const [bottomHeight, setBottomHeight] = useState(80);

  return (
    <div className="app">
      <TopDronePanel />

      <div
        className="map-wrapper"
        style={{ height: `calc(100vh - ${bottomHeight + 80}px)` }}
      >
        <MapView />
        <SystemButtons />
        <ReportsPanel />
        <CasualtyButton />
      </div>

      <BottomFeed height={bottomHeight} setHeight={setBottomHeight} />
    </div>
  );
}