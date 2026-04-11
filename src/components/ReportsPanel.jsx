import React from "react";
import reports from "../data/reports.json";

export default function ReportsPanel() {
  return (
    <div className="reports-panel">
      <div className="title">REPORTS</div>

      <div className="reports-list">
        {reports.map((report, index) => (
          <div
            key={report.id}
            className={`report-card ${index === 0 ? "latest" : ""}`}
          >
            <div className="report-header">
              {report.id} {index === 0 && "(LATEST)"}
            </div>

            {Object.entries(report).map(([key, value]) => {
              if (key === "id") return null;

              return (
                <div key={key} className="report-row">
                  <span className="key">{key}</span>
                  <span className="value">{value}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}