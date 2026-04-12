import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import MapPage from "./pages/MapPage";
import CasualtiesPage from "./pages/CasualtiesPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout is the persistent shell — TopDronePanel + BottomFeed always visible */}
        <Route path="/" element={<Layout />}>
          <Route index element={<MapPage />} />
          <Route path="casualties" element={<CasualtiesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
