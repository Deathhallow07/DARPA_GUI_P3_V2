import React from "react";
import MapView from "./components/MapView";
import TopBar from "./components/TopBar";
import BottomBar from "./components/BottomBar";

export default function App() {
  return (
    <div className="app">
      <TopBar />
      <MapView />
      <BottomBar />
    </div>
  );
}
