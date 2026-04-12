import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import allCasualties from "../data/all_casualties.json";
import drones from "../data/drones.json";

mapboxgl.accessToken = "pk.eyJ1IjoiYXl1c2gxMDIiLCJhIjoiY2xycTRtZW4xMDE0cTJtbno5dnU0dG12eCJ9.L9xmYztXX2yOahZoKDBr6g";

function createSVGMarker(svgString) {
  const el = document.createElement("div");
  el.className = "marker";
  el.innerHTML = svgString;
  return new mapboxgl.Marker(el);
}

// Steel blue drone, amber rover, muted red casualty — matches new palette
const droneSVG = `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#4a8db5" stroke-width="1.5"><circle cx="12" cy="12" r="3" /><line x1="2" y1="12" x2="9" y2="12" /><line x1="15" y1="12" x2="22" y2="12" /><line x1="12" y1="2" x2="12" y2="9" /><line x1="12" y1="15" x2="12" y2="22" /></svg>`;
const roverSVG = `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#c4975a" stroke-width="1.5"><rect x="4" y="10" width="16" height="6" /><circle cx="7" cy="18" r="2" fill="#c4975a" /><circle cx="17" cy="18" r="2" fill="#c4975a" /></svg>`;
const casualtySVG = `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#a84040" stroke-width="1.5"><circle cx="12" cy="8" r="3" /><line x1="12" y1="11" x2="12" y2="20" /><line x1="8" y1="14" x2="16" y2="14" /></svg>`;

export default function MapView() {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [77.2090, 28.6139],
      zoom: 10,
    });

    map.current.on("load", () => {
      // casualties.json stores coords under darpa.latitude / darpa.longitude
      allCasualties.forEach((c) => {
        createSVGMarker(casualtySVG)
          .setLngLat([c.gate1.longitude, c.gate1.latitude])
          .addTo(map.current);
      });

      drones.forEach((d) => {
        const svg = d.type === "Drone" ? droneSVG : roverSVG;
        createSVGMarker(svg)
          .setLngLat([d.lng, d.lat])
          .addTo(map.current);
      });
    });
  }, []);

  useEffect(() => {
    if (!map.current) return;
    const ro = new ResizeObserver(() => { map.current.resize(); });
    if (mapContainer.current) ro.observe(mapContainer.current);
    return () => ro.disconnect();
  }, []);

  return <div ref={mapContainer} className="map-container" />;
}
