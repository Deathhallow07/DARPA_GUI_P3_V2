import React from 'react';
import { useNavigate } from 'react-router-dom';
import droneData from '../data/drones.json';
import roverData from '../data/rovers.json';

export default function CommandCenter() {
  const navigate = useNavigate();

  // 1. Merge and Filter Duplicates (Ensures R1 appears once)
  const rawData = [
    ...(Array.isArray(droneData) ? droneData : []),
    ...(Array.isArray(roverData) ? roverData : [])
  ];

  const allSystems = rawData.filter((item, index, self) =>
    index === self.findIndex((t) => t.id === item.id)
  );

  return (
    <div style={{ 
      padding: '40px', 
      background: '#070b14', 
      minHeight: '100vh', 
      color: 'white', 
      fontFamily: 'monospace' 
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ borderLeft: '4px solid #0ea5e9', paddingLeft: '15px', letterSpacing: '2px', margin: 0 }}>
          SYSTEM <span style={{ color: '#0ea5e9' }}>OVERVIEW</span>
        </h2>
        <button 
          onClick={() => navigate('/')}
          style={{ 
            background: 'transparent', 
            border: '1px solid #1e293b', 
            color: '#8a8070', 
            padding: '8px 16px', 
            cursor: 'pointer' 
          }}
        >
          RETURN TO MAP
        </button>
      </div>

      {allSystems.length === 0 ? (
        <div style={{ color: '#ef4444', textAlign: 'center', marginTop: '50px' }}>
          NO ACTIVE TELEMETRY DETECTED
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '25px' 
        }}>
          {allSystems.map((item) => (
            <div 
              key={item.id} 
              onClick={() => navigate(`/planner/${item.id}`)}
              style={{ 
                position: 'relative',
                background: '#000', 
                border: '1px solid #1e293b', 
                height: '220px',
                cursor: 'pointer',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
            >
              {/* VIDEO FEED PLACEHOLDER BACKGROUND */}
              <div style={{ 
                position: 'absolute', 
                inset: 0, 
                background: 'linear-gradient(180deg, rgba(15,23,42,0.6) 0%, rgba(7,11,20,0.95) 100%)',
                zIndex: 1 
              }} />
              
              {/* Placeholder text for background video */}
              <div style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)', 
                color: '#1e293b', 
                fontSize: '10px',
                zIndex: 0 
              }}>
                [ STANDBY FOR WEBRTC FEED ]
              </div>

              {/* CARD CONTENT */}
              <div style={{ position: 'relative', zIndex: 2, padding: '20px', flexGrow: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: '#0ea5e9', fontWeight: 'bold', fontSize: '20px' }}>{item.id}</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: item.battery > 25 ? '#10b981' : '#ef4444', fontSize: '14px' }}>
                      {item.battery}% PWR
                    </div>
                  </div>
                </div>
                
                <div style={{ fontSize: '12px', color: '#8a8070', textTransform: 'uppercase' }}>
                  MODE: <span style={{ color: '#fff' }}>{item.mode || 'N/A'}</span>
                </div>

                {item.notification && (
                  <div style={{ 
                    marginTop: '15px', 
                    fontSize: '11px', 
                    color: '#ef4444', 
                    background: 'rgba(239, 68, 68, 0.1)',
                    padding: '5px',
                    borderLeft: '2px solid #ef4444'
                  }}>
                    LOG: {item.notification}
                  </div>
                )}
              </div>

              <button style={{ 
                position: 'relative', 
                zIndex: 2, 
                width: '100%', 
                padding: '12px', 
                background: '#0ea5e9', 
                border: 'none', 
                color: 'white', 
                fontWeight: 'bold', 
                cursor: 'pointer',
                letterSpacing: '1px'
              }}>
                ENGAGE MISSION PLANNER
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}