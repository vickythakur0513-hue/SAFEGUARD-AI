import { useState } from "react";
import {
  AlertOctagon, AlertTriangle, Eye, CheckCircle, XCircle,
  ArrowUpCircle, ChevronDown, ChevronUp, Clock, User, MessageSquare,
  Shield, Filter, BarChart2,
} from "lucide-react";
import { EWC_ENTRIES, REPORTS } from "../data/reports";
import type { EWCEntry, ReviewDecision, ReviewRecord, RiskLevel } from "../data/reports";

const TIER_CONFIG = {
  CRITICAL: {
    label: "Critical SIF Precursor",
    icon: AlertOctagon,
    color: "#EF4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.25)",
    description: "Immediate management escalation required",
  },
  HIGH: {
    label: "High Risk — Priority Action",
    icon: AlertTriangle,
    color: "#F97316",
    bg: "rgba(249,115,22,0.08)",
    border: "rgba(249,115,22,0.25)",
    description: "Prompt corrective action within 24 hours",
  },
  WATCHLIST: {
    label: "Watchlist — Monitor Closely",
    icon: Eye,
    color: "#EAB308",
    bg: "rgba(234,179,8,0.08)",
    border: "rgba(234,179,8,0.25)",
    description: "Trending toward elevated risk — preventive action recommended",
  },
};

const REVIEW_STYLES: Record<ReviewDecision, { icon: React.FC<any>; color: string; bg: string; label: string }> = {
  Pending: { icon: Clock, color: "#64748B", bg: "rgba(100,116,139,0.12)", label: "Awaiting Review" },
  Confirmed: { icon: CheckCircle, color: "#22C55E", bg: "rgba(34,197,94,0.12)", label: "Confirmed" },
  Rejected: { icon: XCircle, color: "#64748B", bg: "rgba(100,116,139,0.12)", label: "Rejected" },
  Escalated: { icon: ArrowUpCircle, color: "#A78BFA", bg: "rgba(167,139,250,0.12)", label: "Escalated" },
};

interface ReviewPanelProps {
  entry: EWCEntry;
  onReview: (id: string, decision: ReviewDecision, note: string) => void;
}

function ReviewPanel({ entry, onReview }: ReviewPanelProps) {
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState<ReviewDecision | null>(null);

  function handleDecision(decision: ReviewDecision) {
    setSubmitting(decision);
    setTimeout(() => {
      onReview(entry.reportId, decision, note);
      setSubmitting(null);
      setNote("");
    }, 500);
  }

  if (entry.reviewStatus !== "Pending") {
    const rec = entry.reviewRecord!;
    const rs = REVIEW_STYLES[entry.reviewStatus];
    const Icon = rs.icon;
    return (
      <div style={{ marginTop: 16, padding: "14px 16px", borderRadius: 10, background: rs.bg, border: `1px solid ${rs.color}25` }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <Icon size={16} color={rs.color} style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: rs.color }}>{rs.label}</span>
              <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>by {rec.reviewer} ({rec.reviewerRole})</span>
              <span style={{ fontSize: 11, color: "var(--muted-foreground)", fontFamily: "JetBrains Mono, monospace" }}>
                {new Date(rec.timestamp).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "var(--card-foreground)", lineHeight: 1.55 }}>{rec.note}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 16, padding: "16px", borderRadius: 10, background: "var(--secondary)", border: "1px solid var(--border)" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
        <MessageSquare size={12} /> Human-in-the-Loop Review
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add reviewer notes — context, field verification findings, escalation rationale, or rejection reason..."
        rows={3}
        style={{ width: "100%", padding: "10px 12px", marginBottom: 10, resize: "none", lineHeight: 1.55, fontSize: 13 }}
      />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          onClick={() => handleDecision("Confirmed")}
          disabled={!!submitting}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 16px", borderRadius: 7, border: "1px solid rgba(34,197,94,0.35)",
            background: "rgba(34,197,94,0.1)", color: "#22C55E",
            fontWeight: 600, fontSize: 13, cursor: "pointer",
            opacity: submitting && submitting !== "Confirmed" ? 0.4 : 1,
          }}
        >
          <CheckCircle size={14} />
          {submitting === "Confirmed" ? "Confirming..." : "Confirm SIF Precursor"}
        </button>
        <button
          onClick={() => handleDecision("Escalated")}
          disabled={!!submitting}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 16px", borderRadius: 7, border: "1px solid rgba(167,139,250,0.35)",
            background: "rgba(167,139,250,0.1)", color: "#A78BFA",
            fontWeight: 600, fontSize: 13, cursor: "pointer",
            opacity: submitting && submitting !== "Escalated" ? 0.4 : 1,
          }}
        >
          <ArrowUpCircle size={14} />
          {submitting === "Escalated" ? "Escalating..." : "Escalate to Management"}
        </button>
        <button
          onClick={() => handleDecision("Rejected")}
          disabled={!!submitting}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 16px", borderRadius: 7, border: "1px solid rgba(100,116,139,0.3)",
            background: "rgba(100,116,139,0.08)", color: "#94A3B8",
            fontWeight: 600, fontSize: 13, cursor: "pointer",
            opacity: submitting && submitting !== "Rejected" ? 0.4 : 1,
          }}
        >
          <XCircle size={14} />
          {submitting === "Rejected" ? "Rejecting..." : "Reject — Not a SIF Precursor"}
        </button>
      </div>
      <div style={{ marginTop: 8, fontSize: 11, color: "var(--muted-foreground)" }}>
        Reviewer: Rajan Mehta (Safety Officer) • Decision is logged with timestamp and cannot be undone
      </div>
    </div>
  );
}

interface RiskBreakdownProps {
  entry: EWCEntry;
}

function RiskBreakdown({ entry }: RiskBreakdownProps) {
  const total = entry.riskFactors.reduce((s, f) => s + f.score, 0);
  const capped = Math.min(100, total);
  const scoreColor = entry.tier === "CRITICAL" ? "#EF4444" : entry.tier === "HIGH" ? "#F97316" : "#EAB308";
  const barColors = ["#3B82F6", "#6366F1", "#8B5CF6", "#A78BFA", "#C4B5FD"];

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
        Explainable Risk Score Breakdown
      </div>

      {/* Score summary bar */}
      <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 14 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 10,
          background: `${scoreColor}14`, border: `2px solid ${scoreColor}35`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <span style={{ fontSize: 22, fontWeight: 900, fontFamily: "JetBrains Mono, monospace", color: scoreColor, lineHeight: 1 }}>{capped}</span>
          <span style={{ fontSize: 9, color: "var(--muted-foreground)" }}>/ 100</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ height: 8, borderRadius: 4, background: "var(--secondary)", overflow: "hidden", marginBottom: 6 }}>
            {/* Stacked bar segments */}
            <div style={{ height: "100%", display: "flex" }}>
              {entry.riskFactors.map((f, i) => (
                <div
                  key={i}
                  style={{
                    height: "100%",
                    width: `${(f.score / 100) * 100}%`,
                    background: barColors[i % barColors.length],
                    transition: "width 0.8s ease",
                  }}
                />
              ))}
            </div>
          </div>
          <div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>
            {entry.riskFactors.length} contributing factors • Score capped at 100
          </div>
        </div>
      </div>

      {/* Factor rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {entry.riskFactors.map((factor, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{
              width: 28, height: 28, borderRadius: 6, flexShrink: 0,
              background: `${barColors[i % barColors.length]}18`,
              border: `1px solid ${barColors[i % barColors.length]}30`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 800, fontFamily: "JetBrains Mono, monospace",
              color: barColors[i % barColors.length],
            }}>
              +{factor.score}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 2 }}>{factor.label}</div>
              <div style={{ fontSize: 11.5, color: "var(--muted-foreground)", lineHeight: 1.5 }}>{factor.explanation}</div>
            </div>
            <div style={{ flexShrink: 0, width: 64 }}>
              <div style={{ height: 4, borderRadius: 2, background: "var(--secondary)", overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${(factor.score / 25) * 100}%`,
                  background: barColors[i % barColors.length],
                  transition: "width 0.8s ease",
                }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface EWCCardProps {
  entry: EWCEntry;
  onReview: (id: string, decision: ReviewDecision, note: string) => void;
  onNavigateToReport: (id: string) => void;
  defaultExpanded?: boolean;
}

function EWCCard({ entry, onReview, onNavigateToReport, defaultExpanded = false }: EWCCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [activeTab, setActiveTab] = useState<"breakdown" | "review">("breakdown");

  const report = REPORTS.find((r) => r.id === entry.reportId);
  const cfg = TIER_CONFIG[entry.tier];
  const TierIcon = cfg.icon;
  const rs = REVIEW_STYLES[entry.reviewStatus];
  const ReviewIcon = rs.icon;

  const flaggedDate = new Date(entry.flaggedAt);
  const flaggedStr = flaggedDate.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <div
      className="card"
      style={{
        borderLeft: `3px solid ${cfg.color}`,
        overflow: "hidden",
        transition: "box-shadow 0.15s",
      }}
    >
      {/* Card header — always visible */}
      <div
        style={{ padding: "16px 20px", cursor: "pointer", display: "flex", gap: 14, alignItems: "flex-start" }}
        onClick={() => setExpanded((v) => !v)}
      >
        <div style={{
          width: 36, height: 36, borderRadius: 8, flexShrink: 0,
          background: cfg.bg, border: `1px solid ${cfg.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <TierIcon size={17} color={cfg.color} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 5, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", color: "#60A5FA" }}>{entry.reportId}</span>
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 700, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, letterSpacing: "0.04em" }}>{entry.tier}</span>
            <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{report?.type}</span>
            <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>•</span>
            <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{report?.location}</span>
            {report && (
              <>
                <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>•</span>
                <span style={{ fontSize: 14, fontWeight: 800, fontFamily: "JetBrains Mono, monospace", color: cfg.color }}>{report.riskScore}</span>
              </>
            )}
          </div>
          <p style={{ margin: "0 0 8px", fontSize: 13, color: "var(--foreground)", lineHeight: 1.5, fontWeight: 500 }}>
            {entry.alertReason}
          </p>
          <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: "var(--muted-foreground)", display: "flex", alignItems: "center", gap: 4 }}>
              <Clock size={11} /> Flagged {flaggedStr}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <ReviewIcon size={12} color={rs.color} />
              <span style={{ fontSize: 11, fontWeight: 600, color: rs.color }}>{rs.label}</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <button
            onClick={(e) => { e.stopPropagation(); onNavigateToReport(entry.reportId); }}
            style={{
              padding: "5px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600,
              background: "transparent", border: "1px solid var(--border)",
              color: "var(--muted-foreground)", cursor: "pointer",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--foreground)"; e.currentTarget.style.borderColor = "#3B82F6"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted-foreground)"; e.currentTarget.style.borderColor = "var(--border)"; }}
          >
            Full Report
          </button>
          {expanded ? <ChevronUp size={16} color="var(--muted-foreground)" /> : <ChevronDown size={16} color="var(--muted-foreground)" />}
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{ borderTop: "1px solid var(--border)", padding: "0 20px 20px" }}>
          {/* Original report text excerpt */}
          {report && (
            <div style={{ marginTop: 16, padding: "12px 14px", borderRadius: 8, background: "var(--secondary)", border: "1px solid var(--border)", fontSize: 13, color: "var(--card-foreground)", lineHeight: 1.65 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted-foreground)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Original Report</div>
              {report.description}
            </div>
          )}

          {/* Tab bar */}
          <div style={{ display: "flex", gap: 0, marginTop: 16, borderBottom: "1px solid var(--border)" }}>
            {[
              { key: "breakdown" as const, label: "Risk Score Breakdown", icon: BarChart2 },
              { key: "review" as const, label: entry.reviewStatus === "Pending" ? "Human Review" : "Review Record", icon: MessageSquare },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "9px 16px", background: "transparent", border: "none",
                  borderBottom: activeTab === key ? `2px solid #3B82F6` : "2px solid transparent",
                  color: activeTab === key ? "#60A5FA" : "var(--muted-foreground)",
                  fontSize: 13, fontWeight: activeTab === key ? 600 : 400,
                  cursor: "pointer", marginBottom: -1, transition: "color 0.12s",
                }}
              >
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>

          {activeTab === "breakdown" && <RiskBreakdown entry={entry} />}
          {activeTab === "review" && <ReviewPanel entry={entry} onReview={onReview} />}
        </div>
      )}
    </div>
  );
}

interface Props {
  onNavigate: (page: string) => void;
  onSelectReport: (id: string) => void;
}

export default function EarlyWarningCenter({ onNavigate, onSelectReport }: Props) {
  const [entries, setEntries] = useState<EWCEntry[]>(EWC_ENTRIES);
  const [filterTier, setFilterTier] = useState<"ALL" | "CRITICAL" | "HIGH" | "WATCHLIST">("ALL");
  const [filterReview, setFilterReview] = useState<"ALL" | ReviewDecision>("ALL");

  function handleReview(reportId: string, decision: ReviewDecision, note: string) {
    setEntries((prev) =>
      prev.map((e) =>
        e.reportId === reportId
          ? {
              ...e,
              reviewStatus: decision,
              reviewRecord: {
                reportId,
                decision,
                reviewer: "Rajan Mehta",
                reviewerRole: "Safety Officer",
                note: note || `${decision} by safety review team.`,
                timestamp: new Date().toISOString(),
              },
            }
          : e
      )
    );
  }

  function handleNavigateToReport(id: string) {
    onSelectReport(id);
    onNavigate("analysis");
  }

  const criticalEntries = entries.filter((e) => e.tier === "CRITICAL");
  const highEntries = entries.filter((e) => e.tier === "HIGH");
  const watchlistEntries = entries.filter((e) => e.tier === "WATCHLIST");

  const pendingCount = entries.filter((e) => e.reviewStatus === "Pending").length;
  const confirmedCount = entries.filter((e) => e.reviewStatus === "Confirmed").length;
  const escalatedCount = entries.filter((e) => e.reviewStatus === "Escalated").length;

  const filtered = entries.filter((e) => {
    if (filterTier !== "ALL" && e.tier !== filterTier) return false;
    if (filterReview !== "ALL" && e.reviewStatus !== filterReview) return false;
    return true;
  });

  const grouped = {
    CRITICAL: filtered.filter((e) => e.tier === "CRITICAL"),
    HIGH: filtered.filter((e) => e.tier === "HIGH"),
    WATCHLIST: filtered.filter((e) => e.tier === "WATCHLIST"),
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 4 }}>SIF Early Warning Center</h1>
          <p style={{ fontSize: 13, color: "var(--muted-foreground)" }}>
            AI-flagged Serious Injury &amp; Fatality precursors requiring human safety review
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <select value={filterTier} onChange={(e) => setFilterTier(e.target.value as any)} style={{ padding: "8px 12px", fontSize: 13 }}>
            <option value="ALL">All Tiers</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="WATCHLIST">Watchlist</option>
          </select>
          <select value={filterReview} onChange={(e) => setFilterReview(e.target.value as any)} style={{ padding: "8px 12px", fontSize: 13 }}>
            <option value="ALL">All Statuses</option>
            <option value="Pending">Pending Review</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Escalated">Escalated</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Summary strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, marginBottom: 24 }}>
        {[
          { label: "Critical", value: criticalEntries.length, color: "#EF4444", onClick: () => setFilterTier("CRITICAL") },
          { label: "High", value: highEntries.length, color: "#F97316", onClick: () => setFilterTier("HIGH") },
          { label: "Watchlist", value: watchlistEntries.length, color: "#EAB308", onClick: () => setFilterTier("WATCHLIST") },
          { label: "Pending Review", value: pendingCount, color: "#64748B", onClick: () => setFilterReview("Pending") },
          { label: "Escalated", value: escalatedCount, color: "#A78BFA", onClick: () => setFilterReview("Escalated") },
          { label: "Confirmed", value: confirmedCount, color: "#22C55E", onClick: () => setFilterReview("Confirmed") },
        ].map(({ label, value, color, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            style={{
              padding: "12px 14px", borderRadius: 8, textAlign: "left",
              background: "var(--card)", border: "1px solid var(--border)",
              cursor: "pointer", transition: "border-color 0.12s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = color)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          >
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: 26, fontWeight: 900, fontFamily: "JetBrains Mono, monospace", color, lineHeight: 1 }}>{value}</div>
          </button>
        ))}
      </div>

      {/* EWC notice */}
      <div style={{ marginBottom: 20, padding: "12px 16px", borderRadius: 10, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", display: "flex", alignItems: "center", gap: 10 }}>
        <Shield size={16} color="#EF4444" style={{ flexShrink: 0 }} />
        <p style={{ margin: 0, fontSize: 13, color: "#FCA5A5", lineHeight: 1.5 }}>
          <strong style={{ color: "#EF4444" }}>Human-in-the-Loop:</strong> AI risk flagging is a decision-support tool only. Every entry below requires review and decision by a qualified safety professional before corrective action is triggered. Confirm, Reject, or Escalate each alert.
        </p>
      </div>

      {/* Tier sections */}
      {(["CRITICAL", "HIGH", "WATCHLIST"] as const).map((tier) => {
        const tierEntries = grouped[tier];
        if (tierEntries.length === 0) return null;
        const cfg = TIER_CONFIG[tier];
        const TierIcon = cfg.icon;

        return (
          <div key={tier} style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <TierIcon size={16} color={cfg.color} />
              <span style={{ fontSize: 14, fontWeight: 700, color: cfg.color }}>{cfg.label}</span>
              <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>— {cfg.description}</span>
              <span style={{
                marginLeft: "auto", fontSize: 12, fontWeight: 700, fontFamily: "JetBrains Mono, monospace",
                padding: "2px 10px", borderRadius: 20,
                background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
              }}>{tierEntries.length}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {tierEntries.map((entry, i) => (
                <EWCCard
                  key={entry.reportId}
                  entry={entry}
                  onReview={handleReview}
                  onNavigateToReport={handleNavigateToReport}
                  defaultExpanded={i === 0 && tier === "CRITICAL" && filterTier === "ALL"}
                />
              ))}
            </div>
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted-foreground)" }}>
          No entries match the selected filters.
        </div>
      )}

      <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border)", fontSize: 12, color: "var(--muted-foreground)", textAlign: "center" }}>
        All review decisions are logged with reviewer identity and timestamp. AI-assisted risk flagging — human safety judgment is always required.
      </div>
    </div>
  );
}
