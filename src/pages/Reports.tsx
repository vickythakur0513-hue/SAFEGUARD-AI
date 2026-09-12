import { useState } from "react";
import { Search, Plus, Download, Upload, ChevronRight, Filter } from "lucide-react";
import { REPORTS } from "../data/reports";
import type { RiskLevel, ReportType, ReportStatus } from "../data/reports";

interface Props {
  onNavigate: (page: string) => void;
  onSelectReport: (id: string) => void;
}

export default function Reports({ onNavigate, onSelectReport }: Props) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterRisk, setFilterRisk] = useState("All");
  const [filterLocation, setFilterLocation] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const filtered = REPORTS.filter((r) => {
    if (search && !r.description.toLowerCase().includes(search.toLowerCase()) && !r.id.toLowerCase().includes(search.toLowerCase()) && !r.hazard.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType !== "All" && r.type !== filterType) return false;
    if (filterRisk !== "All" && r.riskLevel !== filterRisk) return false;
    if (filterLocation !== "All" && r.location !== filterLocation) return false;
    if (filterStatus !== "All" && r.status !== filterStatus) return false;
    return true;
  });

  const riskColor = (level: RiskLevel) => {
    switch (level) {
      case "CRITICAL": return "#EF4444";
      case "HIGH": return "#F97316";
      case "MEDIUM": return "#EAB308";
      case "LOW": return "#22C55E";
    }
  };

  const statusColor = (s: ReportStatus) => {
    switch (s) {
      case "Escalated": return { bg: "rgba(239,68,68,0.12)", color: "#EF4444" };
      case "Open": return { bg: "rgba(249,115,22,0.12)", color: "#F97316" };
      case "Under Review": return { bg: "rgba(59,130,246,0.12)", color: "#60A5FA" };
      case "Closed": return { bg: "rgba(100,116,139,0.12)", color: "#64748B" };
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 4 }}>Safety Reports</h1>
          <p style={{ fontSize: 13, color: "var(--muted-foreground)" }}>
            {filtered.length} of {REPORTS.length} reports • AI-assisted risk prioritisation enabled
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-ghost" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Upload size={14} /> Import
          </button>
          <button className="btn-ghost" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Download size={14} /> Export
          </button>
          <button className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 6 }} onClick={() => onNavigate("new-report")}>
            <Plus size={14} /> New Report
          </button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="card" style={{ padding: "16px", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: "1 1 220px", minWidth: 200 }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reports, hazards, locations..."
              style={{ width: "100%", padding: "9px 12px 9px 34px" }}
            />
          </div>
          <Filter size={14} color="var(--muted-foreground)" />
          {[
            { label: "Type", value: filterType, setter: setFilterType, options: ["All", "Unsafe Act", "Unsafe Condition", "Near Miss", "Incident"] },
            { label: "Risk", value: filterRisk, setter: setFilterRisk, options: ["All", "CRITICAL", "HIGH", "MEDIUM", "LOW"] },
            { label: "Location", value: filterLocation, setter: setFilterLocation, options: ["All", "Drilling Area", "Maintenance", "Production", "Warehouse", "Pipeline", "Electrical"] },
            { label: "Status", value: filterStatus, setter: setFilterStatus, options: ["All", "Open", "Under Review", "Escalated", "Closed"] },
          ].map(({ label, value, setter, options }) => (
            <select
              key={label}
              value={value}
              onChange={(e) => setter(e.target.value)}
              style={{ padding: "8px 12px", minWidth: 120 }}
            >
              {options.map((o) => <option key={o}>{o}</option>)}
            </select>
          ))}
          {(search || filterType !== "All" || filterRisk !== "All" || filterLocation !== "All" || filterStatus !== "All") && (
            <button
              className="btn-ghost"
              style={{ fontSize: 12, padding: "8px 12px" }}
              onClick={() => { setSearch(""); setFilterType("All"); setFilterRisk("All"); setFilterLocation("All"); setFilterStatus("All"); }}
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Type</th>
                <th style={{ minWidth: 300 }}>Description</th>
                <th>Location</th>
                <th>Hazard</th>
                <th>Risk Score</th>
                <th>Date</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const sc = statusColor(r.status);
                return (
                  <tr
                    key={r.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => { onSelectReport(r.id); onNavigate("analysis"); }}
                  >
                    <td>
                      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "#60A5FA", fontWeight: 600 }}>{r.id}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: 11, padding: "2px 7px", borderRadius: 4, background: "var(--secondary)", color: "var(--muted-foreground)", fontWeight: 500, whiteSpace: "nowrap" }}>{r.type}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: 12.5, color: "var(--card-foreground)", lineHeight: 1.4 }}>
                        {r.description.slice(0, 90)}{r.description.length > 90 ? "..." : ""}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: "var(--muted-foreground)", whiteSpace: "nowrap" }}>{r.location}</td>
                    <td style={{ fontSize: 12, whiteSpace: "nowrap" }}>{r.hazard}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 800, fontSize: 16, color: riskColor(r.riskLevel) }}>{r.riskScore}</span>
                        <span className={`badge-${r.riskLevel.toLowerCase()}`} style={{ padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700 }}>{r.riskLevel}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: 11, color: "var(--muted-foreground)", fontFamily: "JetBrains Mono, monospace", whiteSpace: "nowrap" }}>{r.date}</td>
                    <td>
                      <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 4, fontWeight: 600, background: sc.bg, color: sc.color, whiteSpace: "nowrap" }}>{r.status}</span>
                    </td>
                    <td>
                      <ChevronRight size={14} color="var(--muted-foreground)" />
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: "40px", color: "var(--muted-foreground)" }}>
                    No reports match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
