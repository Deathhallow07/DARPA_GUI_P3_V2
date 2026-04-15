import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import MapPage from "./pages/MapPage";
import CasualtiesPage from "./pages/CasualtiesPage";
import CommandCenter from "./pages/CommandCenter";
import MissionPlanner from "./pages/MissionPlanner"; 

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MapPage />} />
          <Route path="casualties" element={<CasualtiesPage />} />
          <Route path="command-center" element={<CommandCenter />} />
          <Route path="planner/:droneId" element={<MissionPlanner />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}