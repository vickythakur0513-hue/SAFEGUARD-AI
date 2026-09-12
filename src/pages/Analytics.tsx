import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const TREND_DATA = [
  { month: "Mar", reports: 41, riskScore: 54, nearMiss: 19, unsafeAct: 16, completed: 12 },
  { month: "Apr", reports: 52, riskScore: 58, nearMiss: 24, unsafeAct: 21, completed: 14 },
  { month: "May", reports: 47, riskScore: 55, nearMiss: 22, unsafeAct: 18, completed: 16 },
  { month: "Jun", reports: 58, riskScore: 62, nearMiss: 28, unsafeAct: 23, completed: 20 },
  { month: "Jul", reports: 62, riskScore: 67, nearMiss: 30, unsafeAct: 26, completed: 22 },
  { month: "Aug", reports: 71, riskScore: 71, nearMiss: 34, unsafeAct: 29, completed: 25 },
  { month: "Sep", reports: 55, riskScore: 69, nearMiss: 26, unsafeAct: 21, completed: 18 },
];

const HAZARD_FREQ = [
  { hazard: "PPE Non-Compliance", count: 421 },
  { hazard: "Fall from Height", count: 312 },
  { hazard: "Electrical", count: 248 },
  { hazard: "Machinery", count: 187 },
  { hazard: "Fire/Explosion", count: 143 },
  { hazard: "Chemical", count: 98 },
  { hazard: "Vehicle", count: 76 },
  { hazard: "Confined Space", count: 54 },
];

const LOCATION_RISK = [
  { location: "Drilling", q1: 72, q2: 78, q3: 83, q4: 87 },
  { location: "Maintenance", q1: 64, q2: 68, q3: 71, q4: 74 },
  { location: "Pipeline", q1: 60, q2: 65, q3: 69, q4: 71 },
  { location: "Electrical", q1: 58, q2: 60, q3: 63, q4: 65 },
  { location: "Production", q1: 55, q2: 58, q3: 61, q4: 62 },
  { location: "Warehouse", q1: 40, q2: 43, q3: 46, q4: 48 },
];

const ACTION_COMPLETION = [
  { month: "Apr", created: 18, completed: 11 },
  { month: "May", created: 15, completed: 13 },
  { month: "Jun", created: 22, completed: 16 },
  { month: "Jul", created: 20, completed: 18 },
  { month: "Aug", created: 26, completed: 20 },
  { month: "Sep", created: 17, completed: 12 },
];

const PATTERNS = [
  {
    id: "P01", label: "Repeated PPE Non-Compliance", trend: "+18%", reports: 42,
    detail: "Workers in Drilling and Maintenance areas repeatedly observed without required PPE despite toolbox talks. Pattern persistent over 3 months.",
    color: "#EF4444",
  },
  {
    id: "P02", label: "Recurring Equipment Near-Misses", trend: "+11%", reports: 28,
    detail: "Multiple near-miss reports reference similar equipment categories — conveyor, drilling rig, and pump skids — suggesting systemic guarding issues.",
    color: "#F97316",
  },
  {
    id: "P03", label: "Increasing Maintenance-Area Risk", trend: "+7%", reports: 19,
    detail: "Maintenance operations show an upward trend in high-risk reports, driven by LOTO bypass incidents and working on energised equipment.",
    color: "#EAB308",
  },
];

export default function Analytics() {
  const [dateRange, setDateRange] = useState("Last 6 Months");
  const [dept, setDept] = useState("All");

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 4 }}>Analytics</h1>
          <p style={{ fontSize: 13, color: "var(--muted-foreground)" }}>Advanced safety data analysis and trend identification</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { label: "Date Range", value: dateRange, setter: setDateRange, options: ["Last 30 Days", "Last 3 Months", "Last 6 Months", "This Year"] },
            { label: "Department", value: dept, setter: setDept, options: ["All", "Drilling Operations", "Maintenance", "Production", "Pipeline Operations", "Electrical"] },
          ].map(({ label, value, setter, options }) => (
            <select key={label} value={value} onChange={(e) => setter(e.target.value)} style={{ padding: "8px 12px", fontSize: 13 }}>
              {options.map((o) => <option key={o}>{o}</option>)}
            </select>
          ))}
        </div>
      </div>

      {/* Reports + Risk trend */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div className="card" style={{ padding: "20px 20px 12px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>Reports Trend</div>
          <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 16 }}>Near miss vs Unsafe act over time</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={TREND_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradNM" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradUA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,45,69,0.6)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0F1621", border: "1px solid #1E2D45", borderRadius: 8, fontSize: 12 }} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Area type="monotone" dataKey="nearMiss" name="Near Miss" stroke="#3B82F6" strokeWidth={2} fill="url(#gradNM)" />
              <Area type="monotone" dataKey="unsafeAct" name="Unsafe Act" stroke="#F97316" strokeWidth={2} fill="url(#gradUA)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding: "20px 20px 12px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>Average Risk Score Trend</div>
          <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 16 }}>Monthly site average risk score</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={TREND_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,45,69,0.6)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} domain={[40, 80]} />
              <Tooltip contentStyle={{ background: "#0F1621", border: "1px solid #1E2D45", borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="riskScore" name="Avg Risk Score" stroke="#EF4444" strokeWidth={2.5} dot={{ fill: "#EF4444", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Hazard frequency */}
        <div className="card" style={{ padding: "20px 20px 12px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>Hazard Frequency</div>
          <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 16 }}>Cumulative count by hazard type</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={HAZARD_FREQ} layout="vertical" margin={{ top: 0, right: 32, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,45,69,0.6)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="hazard" type="category" width={130} tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0F1621", border: "1px solid #1E2D45", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Action completion rate */}
        <div className="card" style={{ padding: "20px 20px 12px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>Corrective Action Completion Rate</div>
          <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 16 }}>Created vs completed per month</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ACTION_COMPLETION} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,45,69,0.6)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0F1621", border: "1px solid #1E2D45", borderRadius: 8, fontSize: 12 }} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Bar dataKey="created" name="Created" fill="#F97316" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" name="Completed" fill="#22C55E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          <div style={{ marginTop: 12, display: "flex", gap: 16, justifyContent: "center" }}>
            {["Apr", "May", "Jun", "Jul", "Aug", "Sep"].map((m, i) => {
              const d = ACTION_COMPLETION[i];
              const rate = Math.round((d.completed / d.created) * 100);
              return (
                <div key={m} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", color: rate >= 80 ? "#22C55E" : rate >= 60 ? "#EAB308" : "#EF4444" }}>{rate}%</div>
                  <div style={{ fontSize: 10, color: "var(--muted-foreground)" }}>{m}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Emerging risk patterns */}
      <div className="card" style={{ padding: "20px" }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Emerging Risk Patterns</div>
        <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 16 }}>AI-identified recurring safety patterns requiring management attention</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
          {PATTERNS.map((p) => (
            <div key={p.id} style={{
              padding: "16px", borderRadius: 10,
              background: `${p.color}08`, border: `1px solid ${p.color}20`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", color: p.color }}>Pattern {p.id}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#F97316" }}>{p.trend} trend</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{p.label}</div>
              <p style={{ margin: "0 0 10px", fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.5 }}>{p.detail}</p>
              <div style={{ fontSize: 11, color: p.color, fontWeight: 600 }}>{p.reports} reports affected</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
