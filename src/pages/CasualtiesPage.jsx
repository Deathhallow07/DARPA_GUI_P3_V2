import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import { useCasualties } from "../store/useCasualties";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYXl1c2gxMDIiLCJhIjoiY2xycTRtZW4xMDE0cTJtbno5dnU0dG12eCJ9.L9xmYztXX2yOahZoKDBr6g";

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
  bgBase:     "#111111",
  bgSurface:  "#1a1a1a",
  bgRaised:   "#222222",
  bgHeader:   "#0f0f0f",
  border:     "#2a2a2a",
  borderLight:"#383838",
  textPri:    "#e2e0db",
  textSec:    "#707070",
  textDim:    "#3a3a3a",
  accent:     "#5b8ab5",   // steel blue
  accentDim:  "#2e4a66",
  ok:         "#5a9960",   // medium green
  warn:       "#c8922a",   // amber
  err:        "#b85252",   // muted red
  info:       "#5b8ab5",   // steel blue
  drone:      "#5b8ab5",
  rover:      "#c8922a",
};

const CONFIRM_COLOR = {
  "accepted":            C.ok,
  "duplicate id":        "#a07820",
  "time limit exceeded": C.err,
  "run not started":     C.textSec,
  "admin stop":          "#a06820",
};

const SYSTEM_INFO = {
  D1:    { label: "Drone",   color: C.drone  },
  R1:    { label: "Rover",   color: C.rover  },
  "---": { label: "Unknown", color: C.textSec },
};

function fmtRunTime(sec) {
  const h = String(Math.floor(sec / 3600)).padStart(2, "0");
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `T+${h}:${m}:${s}`;
}

// ── Mapbox panel ──────────────────────────────────────────────────────────────
function PanelMap({ lat, lng }) {
  const ref = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current || !ref.current) return;
    mapRef.current = new mapboxgl.Map({
      container: ref.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [lng, lat],
      zoom: 13,
      interactive: true,
      attributionControl: false,
    });
    mapRef.current.on("load", () => {
      const el = document.createElement("div");
      el.style.cssText =
        "width:14px;height:14px;background:#b85252;border-radius:50%;" +
        "border:2px solid #e2e0db;box-shadow:0 0 0 4px rgba(184,82,82,0.25);";
      new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(mapRef.current);
    });
    return () => { mapRef.current?.remove(); mapRef.current = null; };
  }, [lat, lng]);

  return (
    <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
      <div ref={ref} style={{ position: "absolute", inset: 0 }} />
      <div style={{
        position: "absolute", bottom: 10, left: 10, zIndex: 10,
        background: "rgba(15,15,15,0.9)", border: `1px solid ${C.borderLight}`,
        borderRadius: 4, padding: "4px 10px", fontFamily: "monospace",
        fontSize: 11, color: C.accent, pointerEvents: "none",
      }}>
        {lat.toFixed(5)}&#176;N &nbsp; {lng.toFixed(5)}&#176;E
      </div>
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────
function ReportBadge({ submitted, reportStatus }) {
  if (!submitted)
    return <span style={{ ...S.badge, color: C.warn, background: "#c8922a18", border: `1px solid #c8922a50` }}>PENDING</span>;
  const col = CONFIRM_COLOR[reportStatus] || C.ok;
  return <span style={{ ...S.badge, color: col, background: `${col}18`, border: `1px solid ${col}50` }}>&#10003; {(reportStatus || "submitted").toUpperCase()}</span>;
}

// ── Row / SecHead ─────────────────────────────────────────────────────────────
function Row({ label, value, valueColor, mono }) {
  return (
    <div style={S.row}>
      <span style={S.rowKey}>{label}</span>
      <span style={{ ...S.rowVal, color: valueColor || C.textPri, fontFamily: mono ? "monospace" : "inherit" }}>{value}</span>
    </div>
  );
}

function SecHead({ title, sub }) {
  return (
    <div style={S.secHead}>
      <span style={{ color: C.accent, letterSpacing: 2 }}>{title}</span>
      {sub && <span style={{ color: C.textDim, fontSize: 10, marginLeft: 8 }}>{sub}</span>}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function Modal({ c, onClose }) {
  if (!c) return null;
  const sys = SYSTEM_INFO[c.darpa.system] || SYSTEM_INFO["---"];

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={e => e.stopPropagation()}>

        <div style={S.mHead}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div>
              <div style={{ fontSize: 10, color: C.textSec, letterSpacing: 2, marginBottom: 2 }}>DARPA | GATE 1 REPORT</div>
              <div style={{ fontSize: 20, fontWeight: "bold", color: C.textPri, letterSpacing: 1 }}>CASUALTY #{c.casualty_id}</div>
            </div>
            <ReportBadge submitted={c.submitted} reportStatus={c.confirmation?.report_status} />
          </div>
          <button style={S.xBtn} onClick={onClose}>&#10005;</button>
        </div>

        <div style={S.panels}>
          <div style={S.leftPanel}>

            <div style={{ display: "flex", gap: 14, marginBottom: 16, flexShrink: 0 }}>
              {c.photo
                ? <img src={c.photo} alt="" style={{ width: 130, height: 130, objectFit: "cover", borderRadius: 4, flexShrink: 0 }} />
                : <div style={{ width: 130, height: 130, borderRadius: 4, background: C.bgRaised, flexShrink: 0 }} />
              }
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 10, color: C.textSec, letterSpacing: 1.5, marginBottom: 3 }}>REPORTING SYSTEM</div>
                  <div style={{ fontSize: 16, fontWeight: "bold", color: sys.color }}>
                    {sys.label}
                    <span style={{ fontSize: 12, color: C.textSec, marginLeft: 8 }}>({c.darpa.system})</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: C.textSec, letterSpacing: 1.5, marginBottom: 3 }}>DETECTED AT</div>
                  <div style={{ fontSize: 16, fontWeight: "bold", color: C.info, fontFamily: "monospace" }}>
                    {fmtRunTime(c.timeDetected)}
                  </div>
                </div>
              </div>
            </div>

            <div style={S.block}>
              <SecHead title="POST /api/location" sub="request body" />
              <Row label="casualty_id" value={c.casualty_id}         valueColor={C.info} mono />
              <Row label="team"        value={`"${c.darpa.team}"`}   mono />
              <Row label="system"      value={`"${c.darpa.system}"`} mono />
              <Row label="latitude"    value={c.darpa.latitude}       valueColor={C.info} mono />
              <Row label="longitude"   value={c.darpa.longitude}      valueColor={C.info} mono />
              <Row label="level"       value={c.darpa.level}          valueColor={C.info} mono />
            </div>

            <div style={S.block}>
              <SecHead title="SUBMISSION" />
              <Row label="submitted"   value={c.submitted ? "true" : "false"} valueColor={c.submitted ? C.ok : C.warn} mono />
              {c.submittedAt && <Row label="submitted_at" value={`"${c.submittedAt}"`} mono />}
            </div>

            <div style={S.block}>
              <SecHead title="DARPA RESPONSE" sub="server confirmation" />
              {c.confirmation ? (<>
                <Row label="run"              value={`"${c.confirmation.run}"`} mono />
                <Row label="user"             value={`"${c.confirmation.user}"`} mono />
                <Row label="clock"            value={`${c.confirmation.clock}s`} valueColor={C.info} mono />
                <Row label="report_id"        value={`"${c.confirmation.report_id}"`} mono />
                <Row label="report_timestamp" value={`"${c.confirmation.report_timestamp.slice(0, 16).replace("T", " ")}"`} mono />
                <Row label="report_status"    value={`"${c.confirmation.report_status}"`}
                  valueColor={CONFIRM_COLOR[c.confirmation.report_status] || C.ok} mono />
                <Row label="casualty_id"      value={c.casualty_id} valueColor={C.info} mono />
              </>) : (
                <div style={{ color: C.textSec, fontSize: 12, padding: "8px 0" }}>-- No confirmation yet.</div>
              )}
            </div>
          </div>

          <PanelMap lat={c.darpa.latitude} lng={c.darpa.longitude} />
        </div>
      </div>
    </div>
  );
}

// ── Grid card ─────────────────────────────────────────────────────────────────
function Card({ c, onClick }) {
  const sys = SYSTEM_INFO[c.darpa.system] || SYSTEM_INFO["---"];
  const [hovered, setHovered] = useState(false);
  const glowColor = c.submitted ? C.accentDim : C.err;

  return (
    <div
      style={{
        background: hovered ? C.bgRaised : C.bgSurface,
        border: hovered ? `1px solid ${glowColor}` : `1px solid ${C.border}`,
        boxShadow: hovered ? `0 0 14px 2px ${glowColor}40, 0 4px 16px rgba(0,0,0,0.5)` : "none",
        borderRadius: 5,
        cursor: "pointer",
        overflow: "hidden",
        transform: hovered ? "translateY(-2px)" : "translateY(0px)",
        transition: "all 0.15s ease",
      }}
      onClick={() => onClick(c)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {c.photo
        ? <img src={c.photo} alt="" style={{ width: "100%", height: 140, objectFit: "cover", display: "block", borderRadius: "4px 4px 0 0" }} />
        : <div style={{ width: "100%", height: 140, background: C.bgRaised, borderRadius: "4px 4px 0 0" }} />
      }
      <div style={{ padding: "10px 12px 12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: "bold", color: C.textPri, letterSpacing: 1 }}>CASUALTY #{c.casualty_id}</span>
          <ReportBadge submitted={c.submitted} reportStatus={c.confirmation?.report_status} />
        </div>
        <div style={S.infoRow}><span style={S.iKey}>DETECTED</span><span style={{ ...S.iVal, color: C.info }}>{fmtRunTime(c.timeDetected)}</span></div>
        <div style={S.infoRow}>
          <span style={S.iKey}>SYSTEM</span>
          <span style={{ ...S.iVal, color: sys.color }}>{sys.label} <span style={{ color: C.textSec }}>({c.darpa.system})</span></span>
        </div>
        <div style={{ ...S.infoRow, marginBottom: 0 }}>
          <span style={S.iKey}>COORDS</span>
          <span style={{ ...S.iVal, fontSize: 11, color: C.textSec }}>{c.darpa.latitude.toFixed(4)}, {c.darpa.longitude.toFixed(4)}</span>
        </div>
      </div>
    </div>
  );
}

function ConnDot({ connected }) {
  const col = connected ? C.ok : C.err;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10, color: col }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: col, display: "inline-block" }} />
      {connected ? "STATIC" : "OFFLINE"}
    </span>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function CasualtiesPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const { casualties, connected, lastUpdated } = useCasualties();

  const total     = casualties.length;
  const submitted = casualties.filter(c => c.submitted).length;
  const confirmed = casualties.filter(c => c.confirmation?.report_status === "accepted").length;
  const pending   = total - submitted;

  return (
    <div style={S.page}>

      <div style={S.header}>
        <button style={S.backBtn} onClick={() => navigate("/")}>&#8592; MAP</button>
        <span style={S.title}>CASUALTY REPORTS</span>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <ConnDot connected={connected} />
          {lastUpdated && <span style={{ fontSize: 10, color: C.textSec }}>{lastUpdated.toLocaleTimeString()}</span>}
          <span style={{ fontSize: 10, color: C.textDim, letterSpacing: 1 }}>DARPA DTC | PHASE 3 | GATE 1</span>
        </div>
      </div>

      <div style={S.stats}>
        {[
          { label: "TOTAL",     value: total,     col: C.textPri },
          { label: "SUBMITTED", value: submitted, col: C.accent  },
          { label: "CONFIRMED", value: confirmed, col: C.ok      },
          { label: "PENDING",   value: pending,   col: pending > 0 ? C.warn : C.textSec },
        ].map(s => (
          <div key={s.label} style={S.statCard}>
            <div style={{ fontSize: 24, fontWeight: "bold", color: s.col, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 10, color: C.textSec, marginTop: 4, letterSpacing: 1.5 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={S.grid}>
        {casualties.length === 0
          ? <div style={{ color: C.textSec, padding: 20, gridColumn: "1/-1" }}>Loading...</div>
          : casualties.map(c => <Card key={c.casualty_id} c={c} onClick={setSelected} />)
        }
      </div>

      <Modal c={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const S = {
  page: {
    background: C.bgBase, color: C.textPri, fontFamily: "monospace",
    height: "100%", display: "flex", flexDirection: "column", overflow: "hidden",
  },
  header: {
    background: C.bgHeader, borderBottom: `1px solid ${C.border}`,
    padding: "10px 16px", display: "flex", alignItems: "center", gap: 14, flexShrink: 0,
  },
  backBtn: {
    background: C.bgRaised,
    border: `1px solid ${C.borderLight}`,
    color: C.textPri,
    fontFamily: "monospace", fontSize: 11, padding: "5px 12px", borderRadius: 4, cursor: "pointer",
    transition: "border-color 0.15s, color 0.15s",
  },
  title: { fontSize: 13, fontWeight: "bold", letterSpacing: 3, color: C.textPri, flex: 1 },
  stats: { display: "flex", gap: 1, borderBottom: `1px solid ${C.border}`, flexShrink: 0 },
  statCard: {
    flex: 1, padding: "12px 20px", background: C.bgSurface,
    borderRight: `1px solid ${C.border}`, textAlign: "center",
  },
  grid: {
    flex: 1, overflowY: "auto",
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
    gridAutoRows: "min-content", gap: 8, padding: 14, alignContent: "start",
  },
  infoRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 },
  iKey: { fontSize: 10, color: C.textSec, letterSpacing: 1.5 },
  iVal: { fontSize: 13, color: C.textPri },
  badge: { fontSize: 10, fontWeight: "bold", letterSpacing: 0.8, padding: "2px 7px", borderRadius: 3 },

  overlay: {
    position: "absolute", inset: 0, background: "rgba(0,0,0,0.82)",
    display: "flex", alignItems: "flex-start", justifyContent: "center",
    zIndex: 200, padding: "10px 10px 0",
  },
  modal: {
    background: C.bgSurface, border: `1px solid ${C.borderLight}`, borderRadius: 6,
    width: "100%", maxWidth: 1060,
    display: "flex", flexDirection: "column", overflow: "hidden", maxHeight: "100%",
  },
  mHead: {
    padding: "12px 20px", borderBottom: `1px solid ${C.border}`,
    display: "flex", justifyContent: "space-between", alignItems: "center",
    background: C.bgHeader, flexShrink: 0,
  },
  xBtn: {
    background: C.bgRaised,
    border: `1px solid ${C.borderLight}`,
    color: C.textSec,
    fontFamily: "monospace", width: 28, height: 28, borderRadius: 4, cursor: "pointer", fontSize: 13,
  },
  panels: { display: "flex", flex: 1, overflow: "hidden", minHeight: 0 },
  leftPanel: {
    width: "50%", flexShrink: 0, borderRight: `1px solid ${C.border}`,
    padding: 16, overflowY: "auto", display: "flex", flexDirection: "column",
  },
  block: {
    marginBottom: 12, background: C.bgBase,
    border: `1px solid ${C.border}`, borderRadius: 4, padding: "9px 12px",
  },
  secHead: {
    fontSize: 10, fontWeight: "bold", letterSpacing: 2,
    paddingBottom: 6, marginBottom: 6, borderBottom: `1px solid ${C.border}`,
  },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5, fontSize: 12 },
  rowKey: { color: C.textSec, flexShrink: 0, marginRight: 12 },
  rowVal: { color: C.textPri, textAlign: "right" },
};
