import React from "react";
import allCasualties from "../data/all_casualties.json";

export default function ReportsPanel() {
  // Sort: submitted first, then by casualty_id
  const sorted = [...allCasualties].sort((a, b) => {
    const aS = a.report.submitted ? 1 : 0;
    const bS = b.report.submitted ? 1 : 0;
    if (bS !== aS) return bS - aS;
    return a.casualty_id - b.casualty_id;
  });

  return (
    <div className="reports-panel">
      <div className="title">REPORTS</div>

      <div className="reports-list">
        {sorted.map((c, index) => {
          const report = c.report;
          const conf   = report.confirmation;
          const isLatest = index === 0 && report.submitted;

          const statusColor =
            conf?.report_status === "accepted"    ? "#5a9960" :
            conf?.report_status === "duplicate id" ? "#a07820" :
            !report.submitted                      ? "#c8922a" : "#707070";

          return (
            <div
              key={c.casualty_id}
              className={`report-card ${isLatest ? "latest" : ""}`}
            >
              <div className="report-header">
                CAS-{c.casualty_id}
                {isLatest && " (LATEST)"}
              </div>

              <div className="report-row">
                <span className="key">submitted</span>
                <span className="value" style={{ color: report.submitted ? "#5a9960" : "#c8922a" }}>
                  {report.submitted ? "true" : "false"}
                </span>
              </div>

              {report.submittedAt && (
                <div className="report-row">
                  <span className="key">at</span>
                  <span className="value">{report.submittedAt}</span>
                </div>
              )}

              {conf ? (<>
                <div className="report-row">
                  <span className="key">id</span>
                  <span className="value">{conf.report_id}</span>
                </div>
                <div className="report-row">
                  <span className="key">status</span>
                  <span className="value" style={{ color: statusColor }}>{conf.report_status}</span>
                </div>
                <div className="report-row">
                  <span className="key">clock</span>
                  <span className="value">{conf.clock}s</span>
                </div>
              </>) : (
                <div className="report-row">
                  <span className="key">status</span>
                  <span className="value" style={{ color: "#c8922a" }}>pending</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
