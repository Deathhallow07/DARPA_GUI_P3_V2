import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import TopDronePanel from "./components/TopDronePanel";
import BottomFeed from "./components/BottomFeed";

export default function Layout() {
  const [bottomHeight, setBottomHeight] = useState(80);
  const location = useLocation();

  return (
    <>
      {/* ── Animation keyframes injected once ── */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes slideOutLeft {
          from { transform: translateX(0);    opacity: 1; }
          to   { transform: translateX(-40%); opacity: 0; }
        }
        .route-container {
          position: absolute;
          inset: 0;
          overflow-y: auto;
          overflow-x: hidden;
        }
        .route-container.slide-in {
          animation: slideInRight 0.32s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
      `}</style>

      <div className="app">
        {/* ── Always-visible top bar ── */}
        <TopDronePanel />

        {/* ── Map-area: only this zone animates ── */}
        <div
          className="map-wrapper"
          style={{ height: `calc(100vh - ${bottomHeight + 80}px)` }}
        >
          {/*
            key = pathname so React unmounts/remounts on route change,
            triggering the CSS animation fresh every time.
            The map route gets no animation class; only non-map routes slide in.
          */}
          <div
            key={location.pathname}
            className={`route-container${location.pathname !== "/" ? " slide-in" : ""}`}
          >
            <Outlet />
          </div>
        </div>

        {/* ── Always-visible bottom feed ── */}
        <BottomFeed height={bottomHeight} setHeight={setBottomHeight} />
      </div>
    </>
  );
}
