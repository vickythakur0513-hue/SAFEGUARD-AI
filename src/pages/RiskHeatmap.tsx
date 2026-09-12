import { useState } from "react";
import { REPORTS } from "../data/reports";
import { CORRECTIVE_ACTIONS } from "../data/reports";

const LOCATIONS = [
  {
    id: "drilling",
    label: "Drilling Area",
    x: 60, y: 80, w: 200, h: 140,
    description: "Primary drilling operations — Rig #1 through #4",
  },
  {
    id: "maintenance",
    label: "Maintenance",
    x: 300, y: 80, w: 160, h: 120,
    description: "Equipment maintenance workshops and tool stores",
  },
  {
    id: "production",
    label: "Production",
    x: 60, y: 260, w: 180, h: 120,
    description: "Production separation and processing units",
  },
  {
    id: "pipeline",
    label: "Pipeline",
    x: 500, y: 80, w: 280, h: 80,
    description: "Crude oil and gas pipeline corridors",
  },
  {
    id: "electrical",
    label: "Electrical",
    x: 300, y: 250, w: 140, h: 130,
    description: "HV/LV electrical substations and switchrooms",
  },
  {
    id: "warehouse",
    label: "Warehouse",
    x: 490, y: 200, w: 160, h: 180,
    description: "Chemical and material storage facilities",
  },
];

function getLocationStats(locationLabel: string) {
  const locationReports = REPORTS.filter((r) => r.location === locationLabel);
  const critical = locationReports.filter((r) => r.riskLevel === "CRITICAL").length;
  const high = locationReports.filter((r) => r.riskLevel === "HIGH").length;
  const avgScore = locationReports.length > 0
    ? Math.round(locationReports.reduce((s, r) => s + r.riskScore, 0) / locationReports.length)
    : 0;
  const openActions = CORRECTIVE_ACTIONS.filter((a) => {
    const rep = REPORTS.find((r) => r.id === a.reportId);
    return rep?.location === locationLabel && a.status !== "Completed";
  }).length;
  const hazards = [...new Set(locationReports.slice(0, 3).map((r) => r.hazard))];
  const trend = locationLabel === "Drilling Area" ? "+12%" : locationLabel === "Maintenance" ? "+7%" : locationLabel === "Pipeline" ? "+5%" : "-3%";
  const trendUp = !trend.startsWith("-");

  return { total: locationReports.length, critical, high, avgScore, openActions, hazards, trend, trendUp };
}

function getRiskColor(score: number, opacity = 1): string {
  if (score >= 80) return `rgba(239,68,68,${opacity})`;
  if (score >= 55) return `rgba(249,115,22,${opacity})`;
  if (score >= 30) return `rgba(234,179,8,${opacity})`;
  return `rgba(34,197,94,${opacity})`;
}

function getRiskLabel(score: number): string {
  if (score >= 80) return "CRITICAL";
  if (score >= 55) return "HIGH";
  if (score >= 30) return "MEDIUM";
  return "LOW";
}

export default function RiskHeatmap() {
  const [selected, setSelected] = useState<string | null>("drilling");

  const selectedLoc = LOCATIONS.find((l) => l.id === selected);
  const selectedStats = selectedLoc ? getLocationStats(selectedLoc.label) : null;

  const sortedByRisk = LOCATIONS.map((l) => ({
    ...l,
    stats: getLocationStats(l.label),
  })).sort((a, b) => b.stats.avgScore - a.stats.avgScore);

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 4 }}>Industrial Risk Heatmap</h1>
        <p style={{ fontSize: 13, color: "var(--muted-foreground)" }}>Visual risk profile by operational area — click a zone to explore</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>
        {/* Heatmap SVG */}
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Site Risk Overview</div>
          <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 16 }}>Oil India Limited — Field Operations</div>

          <svg viewBox="0 0 820 420" style={{ width: "100%", height: "auto", display: "block" }}>
            {/* Background */}
            <rect x="0" y="0" width="820" height="420" fill="#080C14" rx="8" />
            {/* Grid lines */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2="420" stroke="#1E2D45" strokeWidth="0.5" />
            ))}
            {[1, 2, 3].map((i) => (
              <line key={`h${i}`} x1="0" y1={i * 100} x2="820" y2={i * 100} stroke="#1E2D45" strokeWidth="0.5" />
            ))}

            {/* Location zones */}
            {LOCATIONS.map((loc) => {
              const stats = getLocationStats(loc.label);
              const baseColor = getRiskColor(stats.avgScore, 0.18);
              const borderColor = getRiskColor(stats.avgScore, 0.5);
              const isSelected = selected === loc.id;

              return (
                <g key={loc.id} style={{ cursor: "pointer" }} onClick={() => setSelected(loc.id === selected ? null : loc.id)}>
                  <rect
                    x={loc.x} y={loc.y} width={loc.w} height={loc.h}
                    rx="8" fill={baseColor}
                    stroke={isSelected ? getRiskColor(stats.avgScore, 0.9) : borderColor}
                    strokeWidth={isSelected ? 2 : 1}
                  />
                  {/* Pulse effect for critical */}
                  {stats.avgScore >= 70 && (
                    <rect
                      x={loc.x} y={loc.y} width={loc.w} height={loc.h}
                      rx="8" fill="none"
                      stroke={getRiskColor(stats.avgScore, 0.3)}
                      strokeWidth="6"
                      style={{ filter: "blur(4px)" }}
                    />
                  )}
                  <text x={loc.x + loc.w / 2} y={loc.y + 22} textAnchor="middle" fill="white" fontSize="12" fontWeight="700" fontFamily="Inter, sans-serif">
                    {loc.label}
                  </text>
                  <text x={loc.x + loc.w / 2} y={loc.y + 42} textAnchor="middle" fill={getRiskColor(stats.avgScore, 1)} fontSize="22" fontWeight="900" fontFamily="JetBrains Mono, monospace">
                    {stats.avgScore}
                  </text>
                  <text x={loc.x + loc.w / 2} y={loc.y + 58} textAnchor="middle" fill={getRiskColor(stats.avgScore, 0.8)} fontSize="9" fontWeight="700" fontFamily="Inter, sans-serif" letterSpacing="1">
                    {getRiskLabel(stats.avgScore)}
                  </text>
                  <text x={loc.x + loc.w / 2} y={loc.y + loc.h - 12} textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="Inter, sans-serif">
                    {stats.total} reports • {stats.critical} critical
                  </text>
                </g>
              );
            })}

            {/* Legend */}
            <g transform="translate(20, 380)">
              {[
                { label: "Critical ≥80", color: "rgba(239,68,68,0.7)" },
                { label: "High ≥55", color: "rgba(249,115,22,0.7)" },
                { label: "Medium ≥30", color: "rgba(234,179,8,0.7)" },
                { label: "Low <30", color: "rgba(34,197,94,0.7)" },
              ].map(({ label, color }, i) => (
                <g key={label} transform={`translate(${i * 120}, 0)`}>
                  <rect width="10" height="10" fill={color} rx="2" />
                  <text x="14" y="9" fill="#64748B" fontSize="10" fontFamily="Inter, sans-serif">{label}</text>
                </g>
              ))}
            </g>
          </svg>
        </div>

        {/* Side panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Selected location details */}
          {selectedStats && selectedLoc && (
            <div className="card" style={{ padding: "20px" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                Selected Zone
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 4 }}>{selectedLoc.label}</div>
              <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 16, lineHeight: 1.5 }}>{selectedLoc.description}</div>

              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 32, fontWeight: 900, fontFamily: "JetBrains Mono, monospace", color: getRiskColor(selectedStats.avgScore) }}>{selectedStats.avgScore}</span>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 2 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: getRiskColor(selectedStats.avgScore, 0.15), color: getRiskColor(selectedStats.avgScore), letterSpacing: "0.05em" }}>{getRiskLabel(selectedStats.avgScore)}</span>
                  <span style={{ fontSize: 11, color: selectedStats.trendUp ? "#F97316" : "#22C55E" }}>{selectedStats.trend} this month</span>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                {[
                  { label: "Total Reports", value: selectedStats.total },
                  { label: "Critical", value: selectedStats.critical, color: "#EF4444" },
                  { label: "High Risk", value: selectedStats.high, color: "#F97316" },
                  { label: "Open Actions", value: selectedStats.openActions, color: "#60A5FA" },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ padding: "10px 12px", borderRadius: 8, background: "var(--secondary)", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "JetBrains Mono, monospace", color: color || "var(--foreground)" }}>{value}</div>
                  </div>
                ))}
              </div>

              {selectedStats.hazards.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Top Hazards</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {selectedStats.hazards.map((h, i) => (
                      <div key={h} style={{ padding: "6px 10px", borderRadius: 6, background: "var(--secondary)", fontSize: 12, display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "var(--muted-foreground)" }}>{i + 1}</span>
                        {h}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Rankings */}
          <div className="card" style={{ padding: "16px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Risk Rankings</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {sortedByRisk.map((loc, i) => (
                <div
                  key={loc.id}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 7, cursor: "pointer", background: selected === loc.id ? "rgba(59,130,246,0.08)" : "transparent", transition: "background 0.12s" }}
                  onClick={() => setSelected(loc.id)}
                  onMouseEnter={(e) => { if (selected !== loc.id) e.currentTarget.style.background = "var(--secondary)"; }}
                  onMouseLeave={(e) => { if (selected !== loc.id) e.currentTarget.style.background = "transparent"; }}
                >
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--muted-foreground)", width: 16 }}>#{i + 1}</span>
                  <span style={{ flex: 1, fontSize: 12, fontWeight: 500 }}>{loc.label}</span>
                  <div style={{ width: 60, height: 4, borderRadius: 2, background: "var(--secondary)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${loc.stats.avgScore}%`, background: getRiskColor(loc.stats.avgScore) }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, fontFamily: "JetBrains Mono, monospace", color: getRiskColor(loc.stats.avgScore), width: 28, textAlign: "right" }}>{loc.stats.avgScore}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
