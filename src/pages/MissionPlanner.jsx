import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// Direct path imports to maintain build stability
import Map, { Marker } from "../../node_modules/react-map-gl/dist/esm/index.js";
import "../../node_modules/mapbox-gl/dist/mapbox-gl.css";
import droneData from "../data/drones.json";
import roverData from "../data/rovers.json";

// Replace with your Mapbox public token
const MAPBOX_TOKEN = "pk.eyJ1IjoiYXl1c2gxMDIiLCJhIjoiY2xycTRtZW4xMDE0cTJtbno5dnU0dG12eCJ9.L9xmYztXX2yOahZoKDBr6g"; 

export default function MissionPlanner() {
  const { droneId } = useParams();
  const [asset, setAsset] = useState(null);
  const [isArmed, setIsArmed] = useState(false);
  const [viewState, setViewState] = useState({ 
    latitude: 28.63, 
    longitude: 77.21, 
    zoom: 15 
  });

  useEffect(() => {
    // Merges both JSON sources to find the active ID (D1 or R1)
    const all = [...(droneData || []), ...(roverData || [])];
    const found = all.find(a => a.id === droneId);
    
    if (found) {
      setAsset(found);
      setViewState({ 
        latitude: found.lat, 
        longitude: found.lng, 
        zoom: 15 
      });
    }
  }, [droneId]);

  if (!asset) {
    return (
      <div style={{ 
        height: '100vh', 
        background: '#070b14', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        color: '#0ea5e9', 
        fontFamily: 'monospace' 
      }}>
        ESTABLISHING SECURE LINK...
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      background: '#070b14', 
      color: 'white', 
      fontFamily: 'monospace', 
      overflow: 'hidden' 
    }}>
      
      {/* LEFT SIDE: FULL MAP VIEW (35% Width) */}
      <div style={{ width: '35%', borderRight: '1px solid #1e293b', position: 'relative' }}>
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/satellite-v9"
          mapboxAccessToken={MAPBOX_TOKEN}
        >
          <Marker latitude={asset.lat} longitude={asset.lng}>
            <div style={{ 
              width: '14px', height: '14px', 
              background: isArmed ? '#ef4444' : '#0ea5e9', 
              borderRadius: '50%', 
              border: '2px solid white',
              boxShadow: isArmed ? '0 0 15px #ef4444' : '0 0 15px #0ea5e9'
            }} />
          </Marker>
        </Map>
        
        <div style={{ 
          position: 'absolute', 
          bottom: '15px', 
          left: '15px', 
          background: 'rgba(7, 11, 20, 0.8)', 
          padding: '8px 12px', 
          fontSize: '10px', 
          color: '#8a8070',
          border: '1px solid #1e293b'
        }}>
          LINK: ACTIVE // COORDS: {viewState.latitude.toFixed(4)}, {viewState.longitude.toFixed(4)}
        </div>
      </div>

      {/* RIGHT SIDE: CONTROLS & VIDEO FEED */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* HORIZONTAL TOP BAR */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '15px 25px', 
          background: '#0f172a', 
          borderBottom: '1px solid #1e293b',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
            <h3 style={{ color: '#0ea5e9', margin: 0, fontSize: '18px', letterSpacing: '1px' }}>
              {asset.id} TERMINAL
            </h3>
            
            {/* Dynamic Casualty Counter */}
            <div style={{ 
              background: 'rgba(239, 68, 68, 0.1)', 
              padding: '6px 14px', 
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '2px',
              display: 'flex',
              gap: '10px',
              alignItems: 'center'
            }}>
              <small style={{ color: '#8a8070', fontSize: '10px', textTransform: 'uppercase' }}>
                Casualties Detected:
              </small>
              <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '18px' }}>
                {asset["casualities detected"] ?? 0}
              </span>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '35px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <small style={{ color: '#8a8070', fontSize: '11px' }}>BATTERY</small>
              <span style={{ 
                fontSize: '22px', 
                color: asset.battery > 25 ? '#10b981' : '#ef4444',
                fontWeight: 'bold'
              }}>
                {asset.battery}%
              </span>
            </div>

            <button 
              onClick={() => setIsArmed(!isArmed)}
              style={{ 
                padding: '10px 35px', 
                background: isArmed ? '#ef4444' : '#10b981', 
                color: 'white', 
                border: 'none', 
                fontWeight: 'bold', 
                cursor: 'pointer',
                textTransform: 'uppercase',
                borderRadius: '2px',
                minWidth: '180px',
                transition: 'background 0.3s ease'
              }}
            >
              {isArmed ? "DISARM SYSTEM" : "ARM SYSTEM"}
            </button>
          </div>
        </div>

        {/* LIVE VIDEO FEED AREA */}
        <div style={{ 
          flexGrow: 1, 
          position: 'relative', 
          background: '#000', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '13px', color: '#0ea5e9', marginBottom: '10px', letterSpacing: '3px' }}>
              LIVE WEBRTC STREAM
            </div>
            <div style={{ width: '150px', height: '1px', background: '#1e293b', margin: '0 auto' }}></div>
            <div style={{ marginTop: '20px', color: '#334155', fontSize: '12px' }}>
              [ WAITING FOR RTMPS_INBOUND_SIGNAL ]
            </div>
          </div>
          
          {/* HUD Overlays */}
          <div className="rec-indicator" style={{ 
            position: 'absolute', 
            top: '25px', 
            left: '25px', 
            padding: '5px 12px', 
            background: 'rgba(239, 68, 68, 0.15)', 
            color: '#ef4444', 
            fontSize: '11px', 
            border: '1px solid #ef4444', 
            borderRadius: '2px'
          }}>
            REC ●
          </div>
          
          <div style={{ position: 'absolute', bottom: '25px', right: '25px', color: '#8a8070', fontSize: '10px' }}>
            FEED_SOURCE: {asset.id}_NODE_V2
          </div>
        </div>
      </div>
      
      {/* Styles for the Pulse Animation */}
      <style>
        {`
          .rec-indicator {
            animation: pulse-red 2s infinite;
          }
          @keyframes pulse-red {
            0% { opacity: 1; }
            50% { opacity: 0.4; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}