/**
 * useCasualties — central data hook.
 *
 * SINGLE SOURCE OF TRUTH: src/data/all_casualties.json
 *   One global file with the full HMT lane structure for all 10 casualties.
 *   Called by both CasualtiesPage and MapView.
 *
 * CURRENT MODE: Gate 1 only.
 *   The hook exposes `darpa` shaped from gate1 fields so the rest of the
 *   app works without any changes. When you move to Gate 2/3/4/HMT, just
 *   change the `activegate` constant below — nothing else needs touching.
 *
 * GATE FIELD STRUCTURE (all_casualties.json):
 *   gate1  — team, system, latitude, longitude, level
 *   gate2  — category, category_label
 *   gate3  — second_pass_category, all trauma fields, all alertness fields
 *   gate4  — hr, rr, time_ago
 *   hmt    — all gate1 + category + time_ago (combined HMT submission)
 *   report — submitted, submittedAt, confirmation (DARPA server response)
 *
 * ─── TO SWITCH TO WEBSOCKET ──────────────────────────────────────────────────
 *   1. Delete the JSON import and loadFromJson() useEffect.
 *   2. Uncomment the WebSocket block at the bottom.
 *   3. Set WS_URL to your server endpoint.
 *   Server should send the same all_casualties.json structure.
 *
 * ─── WEBSOCKET MESSAGE CONTRACT ──────────────────────────────────────────────
 *   { type: "snapshot",         data: AllCasualty[]         }
 *   { type: "new_casualty",     data: AllCasualty           }
 *   { type: "report_update",    data: { casualty_id, ...report fields } }
 *   { type: "casualty_update",  data: { casualty_id, ...any fields }   }
 */

import { useState, useEffect, useCallback } from "react";
import allCasualtiesJson from "../data/all_casualties.json";

// ── Photo asset map ───────────────────────────────────────────────────────────
import cas1 from "../assets/cas1.jpg";
import cas2 from "../assets/cas2.png";
import cas3 from "../assets/cas3.png";
import cas4 from "../assets/cas4.png";
import cas5 from "../assets/cas5.png";
import cas6 from "../assets/cas6.jpg";

const PHOTO_MAP = {
  "cas1.jpg": cas1,
  "cas2.png": cas2,
  "cas3.png": cas3,
  "cas4.png": cas4,
  "cas5.png": cas5,
  "cas6.jpg": cas6,
};

function resolvePhoto(filename) {
  if (!filename) return null;
  if (filename.startsWith("http") || filename.startsWith("/")) return filename;
  return PHOTO_MAP[filename] ?? null;
}

/**
 * Flatten one entry from all_casualties.json into the shape the UI expects.
 *
 * Currently wired to Gate 1: `darpa` is populated from raw.gate1.
 * To switch gates, change the mapping below — UI doesn't change.
 */
function flatten(raw) {
  return {
    casualty_id:  raw.casualty_id,
    photo:        resolvePhoto(raw.photo),
    timeDetected: raw.timeDetected,

    // ── Gate 1 fields (location) — what the site uses now ──
    darpa: {
      team:      raw.gate1.team,
      system:    raw.gate1.system,
      latitude:  raw.gate1.latitude,
      longitude: raw.gate1.longitude,
      level:     raw.gate1.level,
    },

    // ── All other gates — available for future pages ──
    gate2:  raw.gate2,
    gate3:  raw.gate3,
    gate4:  raw.gate4,
    hmt:    raw.hmt,

    // ── Report / submission state ──
    submitted:    raw.report.submitted,
    submittedAt:  raw.report.submittedAt,
    confirmation: raw.report.confirmation,
  };
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useCasualties() {
  const [casualties,  setCasualties]  = useState([]);
  const [connected,   setConnected]   = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // ── JSON / static mode ────────────────────────────────────────────────────
  useEffect(() => {
    setCasualties(allCasualtiesJson.map(flatten));
    setConnected(true);
    setLastUpdated(new Date());
  }, []);

  // ── Helpers (same API regardless of data source) ──────────────────────────

  /** Update the report slice (submitted, submittedAt, confirmation) */
  const updateReport = useCallback((casualty_id, reportPatch) => {
    setCasualties(prev => prev.map(c =>
      c.casualty_id === casualty_id
        ? { ...c, ...reportPatch }
        : c
    ));
    setLastUpdated(new Date());
  }, []);

  /** Update any field on a casualty */
  const updateCasualty = useCallback((casualty_id, patch) => {
    setCasualties(prev => prev.map(c =>
      c.casualty_id === casualty_id ? { ...c, ...patch } : c
    ));
    setLastUpdated(new Date());
  }, []);

  /** Add a new casualty detected in the field */
  const addCasualty = useCallback((raw) => {
    setCasualties(prev => [...prev, flatten(raw)]);
    setLastUpdated(new Date());
  }, []);

  return { casualties, updateReport, updateCasualty, addCasualty, connected, lastUpdated };
}


// ── WebSocket mode (uncomment to deploy) ──────────────────────────────────────
/*
const WS_URL = "ws://YOUR_SERVER_IP/ws";

export function useCasualties() {
  const [casualties,  setCasualties]  = useState([]);
  const [connected,   setConnected]   = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const updateReport = useCallback((casualty_id, patch) => {
    setCasualties(prev => prev.map(c =>
      c.casualty_id === casualty_id ? { ...c, ...patch } : c
    ));
    setLastUpdated(new Date());
  }, []);

  const updateCasualty = useCallback((casualty_id, patch) => {
    setCasualties(prev => prev.map(c =>
      c.casualty_id === casualty_id ? { ...c, ...patch } : c
    ));
    setLastUpdated(new Date());
  }, []);

  const addCasualty = useCallback((raw) => {
    setCasualties(prev => [...prev, flatten(raw)]);
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    ws.onopen  = () => setConnected(true);
    ws.onclose = () => setConnected(false);

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "snapshot") {
        setCasualties(msg.data.map(flatten));
        setLastUpdated(new Date());
      } else if (msg.type === "new_casualty") {
        addCasualty(msg.data);
      } else if (msg.type === "report_update") {
        const { casualty_id, ...patch } = msg.data;
        updateReport(casualty_id, patch);
      } else if (msg.type === "casualty_update") {
        const { casualty_id, ...patch } = msg.data;
        updateCasualty(casualty_id, patch);
      }
    };

    return () => ws.close();
  }, []);

  return { casualties, updateReport, updateCasualty, addCasualty, connected, lastUpdated };
}
*/
