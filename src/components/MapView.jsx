import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import casualties from "../data/casualties.json";
import drones from "../data/drones.json";

mapboxgl.accessToken = "pk.eyJ1IjoiYXl1c2gxMDIiLCJhIjoiY2xycTRtZW4xMDE0cTJtbno5dnU0dG12eCJ9.L9xmYztXX2yOahZoKDBr6g";

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
      // Casualties
      casualties.forEach((c) => {
        new mapboxgl.Marker({ color: "red" })
          .setLngLat([c.lng, c.lat])
          .setPopup(new mapboxgl.Popup().setText(`Casualty: ${c.id}`))
          .addTo(map.current);
      });

      // Drones / Rovers
      drones.forEach((d) => {
        new mapboxgl.Marker({ color: "cyan" })
          .setLngLat([d.lng, d.lat])
          .setPopup(new mapboxgl.Popup().setText(`${d.type}: ${d.id}`))
          .addTo(map.current);
      });
    });
  }, []);

  return <div ref={mapContainer} className="map-container" />;
}
