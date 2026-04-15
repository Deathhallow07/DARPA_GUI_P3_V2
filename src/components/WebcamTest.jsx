import React, { useEffect, useRef, useState } from "react";

const WebcamTest = () => {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [streamActive, setStreamActive] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 1920 }, 
            height: { ideal: 1080 },
            facingMode: "user" 
          }, 
          audio: false 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreamActive(true);
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
        setError("MISSION CRITICAL: CAMERA ACCESS DENIED");
      }
    };

    startCamera();

    // Cleanup: Stop the camera tracks when you leave the page
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: '100%', 
      background: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      {error ? (
        <div style={{ 
          color: '#ef4444', 
          fontFamily: 'monospace', 
          textAlign: 'center',
          padding: '20px',
          border: '1px solid #ef4444',
          background: 'rgba(239, 68, 68, 0.1)'
        }}>
          {error}
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              // Adds a tactical "monitor" feel
              filter: 'contrast(1.1) brightness(0.9) saturate(1.1)',
              transform: 'scaleX(-1)' // Mirroring for natural laptop use
            }}
          />
          
          {/* SCANLINE EFFECT OVERLAY */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))',
            backgroundSize: '100% 4px, 3px 100%',
            pointerEvents: 'none',
            zIndex: 2
          }} />
        </>
      )}

      {/* DYNAMIC HUD DATA */}
      {streamActive && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          textAlign: 'right',
          color: '#0ea5e9',
          fontSize: '10px',
          fontFamily: 'monospace',
          zIndex: 3,
          textShadow: '0 0 5px #000'
        }}>
          LOCAL_LINK: STABLE <br />
          LATENCY: 0.02ms <br />
          SOURCE: INTERNAL_CAM_01
        </div>
      )}
    </div>
  );
};

export default WebcamTest;