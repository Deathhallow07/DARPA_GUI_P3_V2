import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Map, { Marker } from "../../node_modules/react-map-gl/dist/esm/index.js";
import "../../node_modules/mapbox-gl/dist/mapbox-gl.css";
import droneData from "../data/drones.json";
import roverData from "../data/rovers.json";
import WebcamTest from "../components/WebcamTest";



const MAPBOX_TOKEN = "pk.eyJ1IjoiYXl1c2gxMDIiLCJhIjoiY2xycTRtZW4xMDE0cTJtbno5dnU0dG12eCJ9.L9xmYztXX2yOahZoKDBr6g";
; 

export default function MissionPlanner() {
  const { droneId } = useParams();
  const [asset, setAsset] = useState(null);
  const [isArmed, setIsArmed] = useState(false);
  const [viewState, setViewState] = useState({ latitude: 28.63, longitude: 77.21, zoom: 15 });

  useEffect(() => {
    const all = [...(droneData || []), ...(roverData || [])];
    const found = all.find(a => a.id === droneId);
    if (found) {
      setAsset(found);
      setViewState({ latitude: found.lat, longitude: found.lng, zoom: 15 });
    }
  }, [droneId]);

  if (!asset) return <div style={{ color: '#0ea5e9', padding: '20px' }}>LINKING...</div>;

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#070b14', color: 'white', fontFamily: 'monospace', overflow: 'hidden' }}>
      
      {/* LEFT: MAP */}
      <div style={{ width: '35%', borderRight: '1px solid #1e293b', position: 'relative' }}>
        <Map {...viewState} onMove={evt => setViewState(evt.viewState)} mapStyle="mapbox://styles/mapbox/satellite-v9" mapboxAccessToken={MAPBOX_TOKEN}>
          <Marker latitude={asset.lat} longitude={asset.lng}>
            <div style={{ width: '14px', height: '14px', background: isArmed ? '#ef4444' : '#0ea5e9', borderRadius: '50%', border: '2px solid white' }} />
          </Marker>
        </Map>
      </div>

      {/* RIGHT: CONTROLS & VIDEO */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* TOP BAR */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 25px', background: '#0f172a', borderBottom: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <h3 style={{ color: '#0ea5e9', margin: 0 }}>{asset.id} TERMINAL</h3>
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '4px 12px', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '2px' }}>
              <small style={{ color: '#8a8070' }}>Casualties Detected: </small>
              <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{asset["casualities detected"] ?? 0}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            <span style={{ color: asset.battery > 25 ? '#10b981' : '#ef4444' }}>BATTERY {asset.battery}%</span>
            <button onClick={() => setIsArmed(!isArmed)} style={{ padding: '10px 30px', background: isArmed ? '#ef4444' : '#10b981', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
              {isArmed ? "DISARM" : "ARM"}
            </button>
          </div>
        </div>

        {/* VIDEO AREA */}
        <div style={{ flexGrow: 1, position: 'relative', background: '#000' }}>
          <WebcamTest />
          <div style={{ position: 'absolute', top: '20px', left: '20px', padding: '5px 12px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid #ef4444', zIndex: 10 }}>
            REC ●
          </div>
        </div>
      </div>
    </div>
  );
}