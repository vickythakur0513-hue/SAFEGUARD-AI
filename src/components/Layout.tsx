import { useState } from "react";
import {
  LayoutDashboard, FileText, Plus, AlertTriangle, Map, BarChart3,
  Brain, Bell, Search, ChevronDown, X, Menu, Shield, LogOut,
  User, Settings, CheckSquare, Siren,
} from "lucide-react";
import { REPORTS } from "../data/reports";
import type { RiskLevel } from "../data/reports";

type Page =
  | "dashboard"
  | "reports"
  | "new-report"
  | "analysis"
  | "actions"
  | "heatmap"
  | "analytics"
  | "insights"
  | "ewc";

interface LayoutProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "ewc", label: "Early Warning Center", icon: Siren, badge: "12" },
  { id: "reports", label: "Safety Reports", icon: FileText },
  { id: "new-report", label: "New Report", icon: Plus },
  { id: "actions", label: "Corrective Actions", icon: CheckSquare },
  { id: "heatmap", label: "Risk Heatmap", icon: Map },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "insights", label: "AI Insights", icon: Brain },
] as const;

const NOTIFICATIONS = [
  {
    icon: "🔴",
    title: "Critical SIF precursor detected",
    body: "SR-1022 — Exposed HV cable requires immediate isolation.",
    time: "2 min ago",
  },
  {
    icon: "⚠️",
    title: "Repeated hazard pattern detected",
    body: "3 fall-from-height reports in Drilling Area this month.",
    time: "18 min ago",
  },
  {
    icon: "📋",
    title: "Corrective action overdue",
    body: "CA-202 — Scaffolding guardrail replacement is past due.",
    time: "1 hr ago",
  },
  {
    icon: "🔴",
    title: "Critical report opened",
    body: "SR-1019 — Confined space entry without permit escalated.",
    time: "3 hr ago",
  },
  {
    icon: "⚠️",
    title: "H2S exposure near miss",
    body: "SR-1011 — Maintenance area gas level exceeded threshold.",
    time: "5 hr ago",
  },
];

function riskColor(level: RiskLevel) {
  switch (level) {
    case "CRITICAL": return "#EF4444";
    case "HIGH": return "#F97316";
    case "MEDIUM": return "#EAB308";
    case "LOW": return "#22C55E";
  }
}

export default function Layout({ currentPage, onNavigate, children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = searchQuery.length > 1
    ? REPORTS.filter(
        (r) =>
          r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.hazard.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.id.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--background)" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? 240 : 0,
          minWidth: sidebarOpen ? 240 : 0,
          background: "var(--card)",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.2s ease, min-width 0.2s ease",
          overflow: "hidden",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
        }}
      >
        <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: "linear-gradient(135deg, #1D4ED8, #3B82F6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <Shield size={18} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>SAFEGUARD AI</div>
              <div style={{ fontSize: 10, color: "var(--muted-foreground)", whiteSpace: "nowrap" }}>Safety Intelligence Platform</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
          <div style={{ marginBottom: 4, padding: "4px 8px", fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: "var(--muted-foreground)", textTransform: "uppercase" }}>
            Navigation
          </div>
          {NAV_ITEMS.map(({ id, label, icon: Icon, ...rest }) => {
            const badge = (rest as any).badge as string | undefined;
            return (
              <button
                key={id}
                className={`sidebar-link${currentPage === id ? " active" : ""}`}
                onClick={() => onNavigate(id as Page)}
              >
                <Icon size={16} />
                <span style={{ whiteSpace: "nowrap", flex: 1 }}>{label}</span>
                {badge && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 20,
                    background: id === "ewc" ? "rgba(239,68,68,0.2)" : "rgba(59,130,246,0.2)",
                    color: id === "ewc" ? "#EF4444" : "#60A5FA",
                    lineHeight: "16px",
                  }}>{badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: "12px 8px", borderTop: "1px solid var(--border)" }}>
          <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", marginBottom: 8 }}>
            <div style={{ fontSize: 10, color: "#EF4444", fontWeight: 600, marginBottom: 2 }}>⚠ CRITICAL ALERTS</div>
            <div style={{ fontSize: 12, color: "var(--card-foreground)" }}>6 reports require immediate action</div>
          </div>
          <div style={{ fontSize: 11, color: "var(--muted-foreground)", textAlign: "center", padding: "4px 0" }}>
            SAFEGUARD AI • SIH 2026
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", marginLeft: sidebarOpen ? 240 : 0, transition: "margin-left 0.2s ease", minWidth: 0 }}>
        {/* Top bar */}
        <header style={{
          height: 56,
          background: "rgba(15,22,33,0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 12,
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: "transparent", border: "none", color: "var(--muted-foreground)", padding: 6, borderRadius: 6, cursor: "pointer" }}
          >
            <Menu size={18} />
          </button>

          {/* Breadcrumb */}
          <div style={{ fontSize: 13, color: "var(--muted-foreground)", display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
            <span>SAFEGUARD AI</span>
            <span>/</span>
            <span style={{ color: "var(--foreground)", fontWeight: 500 }}>
              {NAV_ITEMS.find((n) => n.id === currentPage)?.label || (currentPage === "ewc" ? "Early Warning Center" : "Analysis")}
            </span>
          </div>

          {/* Search */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "var(--secondary)", border: "1px solid var(--border)",
                borderRadius: 8, padding: "7px 12px", cursor: "pointer",
                color: "var(--muted-foreground)", fontSize: 13,
              }}
            >
              <Search size={14} />
              <span>Search reports...</span>
            </button>

            {searchOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 8px)", right: 0,
                background: "var(--card)", border: "1px solid var(--border)",
                borderRadius: 12, padding: 12, width: 360, zIndex: 100,
                boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
              }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search reports, hazards, locations..."
                    style={{ flex: 1, padding: "8px 12px", borderRadius: 6, fontSize: 13 }}
                  />
                  <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }} style={{ background: "transparent", border: "none", color: "var(--muted-foreground)", cursor: "pointer" }}>
                    <X size={16} />
                  </button>
                </div>
                {searchResults.length > 0 ? (
                  <div>
                    <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Reports</div>
                    {searchResults.map((r) => (
                      <div
                        key={r.id}
                        onClick={() => { onNavigate("reports"); setSearchOpen(false); setSearchQuery(""); }}
                        style={{ padding: "8px 10px", borderRadius: 6, cursor: "pointer", display: "flex", gap: 10, alignItems: "flex-start" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--muted)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#3B82F6", marginTop: 1, flexShrink: 0 }}>{r.id}</span>
                        <div>
                          <div style={{ fontSize: 12, color: "var(--foreground)", lineHeight: 1.4 }}>{r.description.slice(0, 70)}...</div>
                          <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 2 }}>{r.location} • {r.hazard}</div>
                        </div>
                        <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: riskColor(r.riskLevel), flexShrink: 0 }}>{r.riskScore}</span>
                      </div>
                    ))}
                  </div>
                ) : searchQuery.length > 1 ? (
                  <div style={{ textAlign: "center", color: "var(--muted-foreground)", fontSize: 13, padding: "12px 0" }}>No results found</div>
                ) : (
                  <div style={{ color: "var(--muted-foreground)", fontSize: 13 }}>Type to search reports, hazards, locations...</div>
                )}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
              style={{ position: "relative", background: "transparent", border: "none", color: "var(--muted-foreground)", padding: 8, borderRadius: 8, cursor: "pointer" }}
            >
              <Bell size={18} />
              <span style={{
                position: "absolute", top: 4, right: 4,
                width: 8, height: 8, borderRadius: "50%",
                background: "#EF4444", border: "2px solid var(--card)",
              }} />
            </button>

            {notifOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 8px)", right: 0,
                background: "var(--card)", border: "1px solid var(--border)",
                borderRadius: 12, width: 340, zIndex: 100,
                boxShadow: "0 16px 48px rgba(0,0,0,0.5)", overflow: "hidden",
              }}>
                <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>Notifications</span>
                  <span style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444", fontSize: 11, padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>5 new</span>
                </div>
                {NOTIFICATIONS.map((n, i) => (
                  <div key={i} style={{ padding: "12px 16px", borderBottom: "1px solid rgba(30,45,69,0.5)", cursor: "pointer" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--muted)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 16 }}>{n.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{n.title}</div>
                        <div style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.4 }}>{n.body}</div>
                        <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 4 }}>{n.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 10px", cursor: "pointer" }}
            >
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg, #1D4ED8, #3B82F6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <User size={13} color="white" />
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", lineHeight: 1.2 }}>Rajan Mehta</div>
                <div style={{ fontSize: 10, color: "var(--muted-foreground)" }}>Safety Officer</div>
              </div>
              <ChevronDown size={13} color="var(--muted-foreground)" />
            </button>

            {profileOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 8px)", right: 0,
                background: "var(--card)", border: "1px solid var(--border)",
                borderRadius: 10, width: 200, zIndex: 100,
                boxShadow: "0 16px 48px rgba(0,0,0,0.5)", overflow: "hidden",
              }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Rajan Mehta</div>
                  <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>r.mehta@oilindia.com</div>
                  <div style={{ marginTop: 6, fontSize: 11, background: "rgba(59,130,246,0.12)", color: "#60A5FA", padding: "2px 8px", borderRadius: 20, display: "inline-block", fontWeight: 600 }}>Safety Officer</div>
                </div>
                <div style={{ padding: "6px 8px" }}>
                  {[{ icon: User, label: "Profile" }, { icon: Settings, label: "Settings" }].map(({ icon: Icon, label }) => (
                    <button key={label} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 10px", borderRadius: 6, background: "transparent", border: "none", color: "var(--card-foreground)", fontSize: 13, cursor: "pointer" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--muted)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <Icon size={14} /> {label}
                    </button>
                  ))}
                  <button style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 10px", borderRadius: 6, background: "transparent", border: "none", color: "#EF4444", fontSize: 13, cursor: "pointer" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: "auto", padding: "28px 28px 40px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
