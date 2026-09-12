import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { FileText, AlertTriangle, TrendingUp, TrendingDown, Shield, ChevronRight, Brain } from "lucide-react";
import { REPORTS, CORRECTIVE_ACTIONS } from "../data/reports";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
const TREND_DATA = [
  { month: "Jan", reports: 38, nearMiss: 18, highRisk: 9 },
  { month: "Feb", reports: 44, nearMiss: 21, highRisk: 11 },
  { month: "Mar", reports: 41, nearMiss: 19, highRisk: 8 },
  { month: "Apr", reports: 52, nearMiss: 24, highRisk: 14 },
  { month: "May", reports: 47, nearMiss: 22, highRisk: 12 },
  { month: "Jun", reports: 58, nearMiss: 28, highRisk: 15 },
  { month: "Jul", reports: 62, nearMiss: 30, highRisk: 18 },
  { month: "Aug", reports: 71, nearMiss: 34, highRisk: 21 },
  { month: "Sep", reports: 55, nearMiss: 26, highRisk: 16 },
];

const RISK_DIST = [
  { name: "Critical", value: 23, color: "#EF4444" },
  { name: "High", value: 104, color: "#F97316" },
  { name: "Medium", value: 287, color: "#EAB308" },
  { name: "Low", value: 2044, color: "#22C55E" },
];

const HAZARD_DATA = [
  { hazard: "Fall", count: 312 },
  { hazard: "Electrical", count: 248 },
  { hazard: "Machinery", count: 187 },
  { hazard: "Fire", count: 143 },
  { hazard: "PPE", count: 421 },
  { hazard: "Chemical", count: 98 },
  { hazard: "Vehicle", count: 76 },
  { hazard: "Confined", count: 54 },
];

const LOCATION_DATA = [
  { location: "Drilling", risk: 87 },
  { location: "Maintenance", risk: 74 },
  { location: "Production", risk: 62 },
  { location: "Pipeline", risk: 71 },
  { location: "Electrical", risk: 65 },
  { location: "Warehouse", risk: 48 },
];

const AI_INSIGHTS = [
  { type: "warning", icon: "📈", text: "Fall-related SIF precursors increased 24% this month compared to the previous 30-day period." },
  { type: "alert", icon: "🔴", text: "Maintenance operations currently show the highest concentration of high-risk reports — 31% above site average." },
  { type: "pattern", icon: "🔗", text: "14 near-miss reports share similar equipment-related patterns — indicative of a systemic control gap." },
  { type: "critical", icon: "⚠️", text: "6 critical-risk reports are currently open and require immediate safety review and management escalation." },
];

const RECENT_REPORTS = REPORTS.slice(0, 6);

interface Props {
  onNavigate: (page: string) => void;
}

export default function Dashboard({ onNavigate }: Props) {
  const criticalCount = REPORTS.filter((r) => r.riskLevel === "CRITICAL").length;
  const highCount = REPORTS.filter((r) => r.riskLevel === "HIGH").length;
  const openActions = CORRECTIVE_ACTIONS.filter((a) => a.status !== "Completed").length;

  const kpis = [
    { label: "Total Reports", value: "2,458", icon: FileText, trend: "+8.2%", up: true, color: "#3B82F6" },
    { label: "Near Misses", value: "842", icon: AlertTriangle, trend: "+12.4%", up: true, color: "#F97316" },
    { label: "High-Risk Reports", value: "127", icon: TrendingUp, trend: "+3.1%", up: true, color: "#EAB308" },
    { label: "Critical SIF Precursors", value: "23", icon: Shield, trend: "-4.5%", up: false, color: "#EF4444" },
    { label: "Open Corrective Actions", value: String(openActions), icon: FileText, trend: "+2", up: true, color: "#8B5CF6" },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 4 }}>
          Good morning, Safety Team
        </h1>
        <p style={{ fontSize: 14, color: "var(--muted-foreground)" }}>
          Safety intelligence overview and emerging risk patterns — {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 24 }}>
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="card" style={{ padding: "16px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{kpi.label}</div>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: `${kpi.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={13} color={kpi.color} />
                </div>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--foreground)", lineHeight: 1, marginBottom: 8 }}>
                {kpi.value}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
                {kpi.up ? <TrendingUp size={12} color="#22C55E" /> : <TrendingDown size={12} color="#22C55E" />}
                <span style={{ color: kpi.up ? "#22C55E" : "#22C55E", fontWeight: 600 }}>{kpi.trend}</span>
                <span style={{ color: "var(--muted-foreground)" }}>vs last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts row 1 */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Trend chart */}
        <div className="card" style={{ padding: "20px 20px 12px" }}>
          <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>Safety Reports Over Time</div>
              <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>Monthly report volume — 2026</div>
            </div>
            <div style={{ display: "flex", gap: 16, fontSize: 11 }}>
              {[
                { color: "#3B82F6", label: "Total" },
                { color: "#F97316", label: "Near Miss" },
                { color: "#EF4444", label: "High Risk" },
              ].map((l) => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--muted-foreground)" }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
                  {l.label}
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={TREND_DATA} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,45,69,0.6)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0F1621", border: "1px solid #1E2D45", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="reports" stroke="#3B82F6" strokeWidth={2} fill="url(#gradTotal)" />
              <Area type="monotone" dataKey="nearMiss" stroke="#F97316" strokeWidth={2} fill="none" />
              <Area type="monotone" dataKey="highRisk" stroke="#EF4444" strokeWidth={2} fill="none" strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Risk distribution donut */}
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Risk Distribution</div>
          <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 12 }}>All reports by risk level</div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={RISK_DIST} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                {RISK_DIST.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#0F1621", border: "1px solid #1E2D45", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {RISK_DIST.map((d) => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                <span style={{ color: "var(--card-foreground)", flex: 1 }}>{d.name}</span>
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 600, color: d.color }}>{d.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        {/* Hazard distribution */}
        <div className="card" style={{ padding: "20px 20px 12px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>Hazard Distribution</div>
          <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 16 }}>Reports by hazard category</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={HAZARD_DATA} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,45,69,0.6)" vertical={false} />
              <XAxis dataKey="hazard" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0F1621", border: "1px solid #1E2D45", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk by location */}
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>Risk by Location</div>
          <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 16 }}>Average risk score by operational area</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {LOCATION_DATA.map((loc) => {
              const color = loc.risk >= 80 ? "#EF4444" : loc.risk >= 55 ? "#F97316" : loc.risk >= 30 ? "#EAB308" : "#22C55E";
              return (
                <div key={loc.location}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 12 }}>
                    <span style={{ color: "var(--card-foreground)", fontWeight: 500 }}>{loc.location}</span>
                    <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color }}>{loc.risk}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: "var(--secondary)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${loc.risk}%`, background: color, borderRadius: 3, transition: "width 0.8s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Safety Intelligence */}
      <div className="card" style={{ padding: "20px", marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(59,130,246,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Brain size={16} color="#3B82F6" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>AI Safety Intelligence</div>
              <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>Generated insights from pattern analysis</div>
            </div>
          </div>
          <button className="btn-ghost" onClick={() => onNavigate("insights")}>View All Insights</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {AI_INSIGHTS.map((insight, i) => (
            <div key={i} style={{
              padding: "14px 16px", borderRadius: 8,
              background: "var(--secondary)", border: "1px solid var(--border)",
              display: "flex", gap: 10, alignItems: "flex-start",
            }}>
              <span style={{ fontSize: 18 }}>{insight.icon}</span>
              <p style={{ margin: 0, fontSize: 13, color: "var(--card-foreground)", lineHeight: 1.5 }}>{insight.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent reports */}
      <div className="card" style={{ padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Recent High-Risk Reports</div>
            <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>Latest safety reports requiring attention</div>
          </div>
          <button className="btn-ghost" onClick={() => onNavigate("reports")}>View All Reports <ChevronRight size={14} style={{ display: "inline" }} /></button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Type</th>
                <th>Hazard</th>
                <th>Location</th>
                <th>Risk Score</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_REPORTS.map((r) => (
                <tr key={r.id} style={{ cursor: "pointer" }} onClick={() => onNavigate("reports")}>
                  <td><span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "#60A5FA" }}>{r.id}</span></td>
                  <td><span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{r.type}</span></td>
                  <td style={{ fontSize: 13 }}>{r.hazard}</td>
                  <td style={{ fontSize: 13, color: "var(--muted-foreground)" }}>{r.location}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700, fontSize: 14, color: r.riskLevel === "CRITICAL" ? "#EF4444" : r.riskLevel === "HIGH" ? "#F97316" : r.riskLevel === "MEDIUM" ? "#EAB308" : "#22C55E" }}>{r.riskScore}</span>
                      <span className={`badge-${r.riskLevel.toLowerCase()}`} style={{ padding: "2px 7px", borderRadius: 4, fontSize: 10, fontWeight: 700 }}>{r.riskLevel}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 12, color: "var(--muted-foreground)", fontFamily: "JetBrains Mono, monospace" }}>{r.date}</td>
                  <td>
                    <span style={{
                      fontSize: 11, padding: "3px 8px", borderRadius: 4, fontWeight: 600,
                      background: r.status === "Escalated" ? "rgba(239,68,68,0.12)" : r.status === "Open" ? "rgba(249,115,22,0.12)" : "rgba(100,116,139,0.12)",
                      color: r.status === "Escalated" ? "#EF4444" : r.status === "Open" ? "#F97316" : "#64748B",
                    }}>{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
