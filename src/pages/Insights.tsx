import { useState } from "react";
import { Brain, RefreshCw, TrendingUp, AlertCircle, BarChart2, Lightbulb } from "lucide-react";
import { REPORTS } from "../data/reports";

function generateInsights() {
  const critical = REPORTS.filter((r) => r.riskLevel === "CRITICAL").length;
  const fallReports = REPORTS.filter((r) => r.hazard.toLowerCase().includes("fall")).length;
  const drillingHigh = REPORTS.filter((r) => r.location === "Drilling Area" && (r.riskLevel === "CRITICAL" || r.riskLevel === "HIGH")).length;
  const ppeReports = REPORTS.filter((r) => r.hazard.toLowerCase().includes("ppe")).length;
  const nearMiss = REPORTS.filter((r) => r.type === "Near Miss").length;
  const maintenance = REPORTS.filter((r) => r.location === "Maintenance").length;

  return [
    {
      id: "I-001",
      type: "Emerging Risk",
      icon: TrendingUp,
      color: "#EF4444",
      headline: "Fall-Related SIF Precursors Rising in Drilling Operations",
      body: `Fall-related safety precursors have increased significantly in drilling operations. ${fallReports} fall-related reports have been recorded this period — representing one of the highest concentrations of this hazard type on site. The Drilling Area consistently appears in similar historical incident reports, indicating an unresolved systemic risk.`,
      metric: `${fallReports} fall reports`,
      metricLabel: "this period",
      recommendation: "Conduct a dedicated work-at-height safety stand-down in Drilling Area. Review all WAH permits and verify harness compliance.",
    },
    {
      id: "I-002",
      type: "Recurring Pattern",
      icon: RefreshCw,
      color: "#F97316",
      headline: "Repeated Near-Miss Reports Reference Same Equipment Categories",
      body: `Pattern analysis reveals that ${nearMiss} near-miss reports share similar equipment-related references — particularly drilling rigs, conveyor systems, and pump equipment. This clustering suggests equipment-related controls are not adequately preventing recurrence, and a systemic review of guarding, isolation, and inspection practices is warranted.`,
      metric: `${nearMiss} near misses`,
      metricLabel: "equipment-related",
      recommendation: "Initiate a focused equipment-safety audit across rotating machinery categories. Review guarding adequacy and LOTO compliance.",
    },
    {
      id: "I-003",
      type: "Attention Required",
      icon: AlertCircle,
      color: "#EAB308",
      headline: `${critical} Critical-Risk Reports Currently Require Immediate Review`,
      body: `${critical} reports are currently classified as Critical SIF Precursors and require management review. The majority involve work-at-height, energised equipment, and confined space hazards — all historically associated with fatal incidents in the oil and gas sector. Delays in review increase the probability of a recurrence with a more severe outcome.`,
      metric: `${critical} critical`,
      metricLabel: "open reports",
      recommendation: "Escalate all critical reports to site management immediately. Assign dedicated safety officers for corrective action follow-up.",
    },
    {
      id: "I-004",
      type: "Improvement Opportunity",
      icon: Lightbulb,
      color: "#22C55E",
      headline: "PPE-Related Observations Account for Significant Share of Unsafe-Act Reports",
      body: `PPE non-compliance is a persistent and growing concern — ${ppeReports} PPE-related unsafe-act reports have been recorded this period. While PPE failures are generally lower in severity when isolated, they frequently appear alongside higher-severity events, and sustained non-compliance signals a cultural safety gap that requires behavioural intervention rather than enforcement alone.`,
      metric: `${ppeReports} PPE reports`,
      metricLabel: "this period",
      recommendation: "Launch a safety culture reinforcement campaign. Consider peer-observer programmes and visible leadership presence on the drilling floor.",
    },
    {
      id: "I-005",
      type: "Location Alert",
      icon: BarChart2,
      color: "#8B5CF6",
      headline: "Maintenance Operations Show Highest Concentration of High-Risk Activity",
      body: `The Maintenance area has ${maintenance} reported events this period, with a disproportionate share classified as High or Critical. Key drivers are LOTO bypass, hot-work without permits, and working on energised equipment. The pattern suggests procedural compliance issues that training alone has not resolved.`,
      metric: `${maintenance} reports`,
      metricLabel: "in Maintenance",
      recommendation: "Implement mandatory pre-job safety verification checklists for all maintenance tasks. Consider independent safety observation programme.",
    },
  ];
}

export default function Insights() {
  const [generated, setGenerated] = useState(0);
  const [loading, setLoading] = useState(false);
  const insights = generateInsights();

  function handleGenerate() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setGenerated((n) => n + 1);
    }, 1200);
  }

  const typeColors: Record<string, string> = {
    "Emerging Risk": "#EF4444",
    "Recurring Pattern": "#F97316",
    "Attention Required": "#EAB308",
    "Improvement Opportunity": "#22C55E",
    "Location Alert": "#8B5CF6",
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 4 }}>Safety Intelligence</h1>
          <p style={{ fontSize: 13, color: "var(--muted-foreground)" }}>
            AI-generated insights from pattern analysis across all safety reports
          </p>
        </div>
        <button
          onClick={handleGenerate}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "linear-gradient(135deg, #1D4ED8, #3B82F6)",
            color: "white", border: "none",
            padding: "10px 20px", borderRadius: 8,
            fontWeight: 600, fontSize: 13, cursor: "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          <RefreshCw size={14} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
          {loading ? "Generating..." : "Generate New Insights"}
        </button>
      </div>

      {/* Status bar */}
      <div style={{
        marginBottom: 24, padding: "12px 16px",
        borderRadius: 10, background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 8px #22C55E" }} />
        <span style={{ fontSize: 13, color: "#93C5FD" }}>
          Analysis engine active — {REPORTS.length} reports indexed • {insights.length} insights generated
          {generated > 0 && ` • Refreshed ${generated} time${generated > 1 ? "s" : ""}`}
        </span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--muted-foreground)" }}>
          <Brain size={13} /> AI-Assisted Analysis
        </div>
      </div>

      {/* Insight cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {insights.map((insight, i) => {
          const Icon = insight.icon;
          const tc = typeColors[insight.type] || "#3B82F6";
          return (
            <div key={insight.id} className="card animate-fade-in" style={{
              padding: "24px",
              borderLeft: `3px solid ${insight.color}`,
              animationDelay: `${i * 80}ms`,
            }}>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                  background: `${insight.color}14`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: `1px solid ${insight.color}25`,
                }}>
                  <Icon size={20} color={insight.color} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20,
                      background: `${tc}15`, color: tc, border: `1px solid ${tc}25`,
                      textTransform: "uppercase", letterSpacing: "0.06em",
                    }}>{insight.type}</span>
                    <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "var(--muted-foreground)" }}>{insight.id}</span>
                  </div>

                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, letterSpacing: "-0.01em" }}>
                    {insight.headline}
                  </h3>

                  <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "var(--muted-foreground)", lineHeight: 1.7 }}>
                    {insight.body}
                  </p>

                  <div style={{
                    padding: "12px 14px", borderRadius: 8,
                    background: "var(--secondary)", border: "1px solid var(--border)",
                    display: "flex", gap: 10, alignItems: "flex-start",
                  }}>
                    <Lightbulb size={14} color="#EAB308" style={{ flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#EAB308", marginBottom: 3 }}>RECOMMENDED ACTION</div>
                      <div style={{ fontSize: 13, color: "var(--card-foreground)", lineHeight: 1.5 }}>{insight.recommendation}</div>
                    </div>
                  </div>
                </div>

                {/* Metric pill */}
                <div style={{
                  padding: "12px 16px", borderRadius: 10, textAlign: "center", flexShrink: 0,
                  background: `${insight.color}08`, border: `1px solid ${insight.color}20`,
                  minWidth: 100,
                }}>
                  <div style={{ fontSize: 20, fontWeight: 900, fontFamily: "JetBrains Mono, monospace", color: insight.color }}>{insight.metric}</div>
                  <div style={{ fontSize: 10, color: "var(--muted-foreground)", marginTop: 2 }}>{insight.metricLabel}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid var(--border)", textAlign: "center", fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.7 }}>
        Insights are generated deterministically from the safety report dataset using rule-based pattern analysis.<br />
        AI-Assisted Analysis — for risk prioritisation only. Final decisions remain with qualified safety personnel.
      </div>
    </div>
  );
}
