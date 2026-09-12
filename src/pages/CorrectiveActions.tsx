import { useState } from "react";
import { CheckSquare, Clock, AlertTriangle, CheckCircle, Filter } from "lucide-react";
import { CORRECTIVE_ACTIONS } from "../data/reports";
import type { CorrectiveAction, ActionStatus, RiskLevel } from "../data/reports";

export default function CorrectiveActions() {
  const [actions, setActions] = useState<CorrectiveAction[]>(CORRECTIVE_ACTIONS);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");

  function changeStatus(id: string, status: ActionStatus) {
    setActions((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  function changePriority(id: string, priority: RiskLevel) {
    setActions((prev) => prev.map((a) => (a.id === id ? { ...a, priority } : a)));
  }

  const filtered = actions.filter((a) => {
    if (filterStatus !== "All" && a.status !== filterStatus) return false;
    if (filterPriority !== "All" && a.priority !== filterPriority) return false;
    return true;
  });

  const counts = {
    open: actions.filter((a) => a.status === "Open").length,
    inProgress: actions.filter((a) => a.status === "In Progress").length,
    overdue: actions.filter((a) => a.status === "Overdue").length,
    completed: actions.filter((a) => a.status === "Completed").length,
  };

  const priorityColor = (p: RiskLevel) => {
    switch (p) {
      case "CRITICAL": return "#EF4444";
      case "HIGH": return "#F97316";
      case "MEDIUM": return "#EAB308";
      case "LOW": return "#22C55E";
    }
  };

  const statusStyle = (s: ActionStatus) => {
    switch (s) {
      case "Open": return { bg: "rgba(249,115,22,0.12)", color: "#F97316" };
      case "In Progress": return { bg: "rgba(59,130,246,0.12)", color: "#60A5FA" };
      case "Completed": return { bg: "rgba(34,197,94,0.12)", color: "#22C55E" };
      case "Overdue": return { bg: "rgba(239,68,68,0.12)", color: "#EF4444" };
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 4 }}>Corrective Actions</h1>
        <p style={{ fontSize: 13, color: "var(--muted-foreground)" }}>Track, assign, and close safety corrective actions</p>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Open", count: counts.open, icon: Clock, color: "#F97316" },
          { label: "In Progress", count: counts.inProgress, icon: AlertTriangle, color: "#60A5FA" },
          { label: "Overdue", count: counts.overdue, icon: AlertTriangle, color: "#EF4444" },
          { label: "Completed", count: counts.completed, icon: CheckCircle, color: "#22C55E" },
        ].map(({ label, count, icon: Icon, color }) => (
          <div key={label} className="card" style={{ padding: "16px 18px", cursor: "pointer" }} onClick={() => setFilterStatus(label === filterStatus ? "All" : label)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
              <Icon size={14} color={color} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color, fontFamily: "JetBrains Mono, monospace" }}>{count}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: "12px 16px", marginBottom: 16, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <Filter size={14} color="var(--muted-foreground)" />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: "7px 12px" }}>
          {["All", "Open", "In Progress", "Overdue", "Completed"].map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} style={{ padding: "7px 12px" }}>
          {["All", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((p) => <option key={p}>{p}</option>)}
        </select>
        <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--muted-foreground)" }}>{filtered.length} actions</span>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Action ID</th>
                <th>Related Report</th>
                <th style={{ minWidth: 280 }}>Action</th>
                <th>Owner</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Change Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const ss = statusStyle(a.status);
                const pc = priorityColor(a.priority);
                const isOverdue = new Date(a.dueDate) < new Date() && a.status !== "Completed";
                return (
                  <tr key={a.id}>
                    <td>
                      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "#60A5FA", fontWeight: 600 }}>{a.id}</span>
                    </td>
                    <td>
                      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "var(--muted-foreground)" }}>{a.reportId}</span>
                    </td>
                    <td style={{ fontSize: 13, color: "var(--card-foreground)", lineHeight: 1.4 }}>{a.action}</td>
                    <td style={{ fontSize: 13, color: "var(--card-foreground)", whiteSpace: "nowrap" }}>{a.owner}</td>
                    <td>
                      <select
                        value={a.priority}
                        onChange={(e) => changePriority(a.id, e.target.value as RiskLevel)}
                        style={{
                          padding: "4px 8px", fontSize: 11, fontWeight: 700,
                          background: `${pc}15`, color: pc,
                          border: `1px solid ${pc}30`, borderRadius: 4,
                          cursor: "pointer",
                        }}
                      >
                        {["CRITICAL", "HIGH", "MEDIUM", "LOW"].map((p) => <option key={p}>{p}</option>)}
                      </select>
                    </td>
                    <td>
                      <span style={{
                        fontFamily: "JetBrains Mono, monospace", fontSize: 11,
                        color: isOverdue ? "#EF4444" : "var(--muted-foreground)",
                        fontWeight: isOverdue ? 600 : 400,
                      }}>
                        {a.dueDate}{isOverdue && a.status !== "Completed" ? " ⚠" : ""}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 4, fontWeight: 600, background: ss.bg, color: ss.color, whiteSpace: "nowrap" }}>
                        {a.status}
                      </span>
                    </td>
                    <td>
                      <select
                        value={a.status}
                        onChange={(e) => changeStatus(a.id, e.target.value as ActionStatus)}
                        style={{ padding: "5px 8px", fontSize: 12, cursor: "pointer", borderRadius: 4 }}
                      >
                        {["Open", "In Progress", "Completed", "Overdue"].map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
