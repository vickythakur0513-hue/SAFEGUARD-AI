import { useState } from "react";
import { Shield, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, ExternalLink, Plus, Users } from "lucide-react";
import { analyzeSafetyReport } from "../services/aiAnalysis";
import { REPORTS } from "../data/reports";
import type { RiskLevel } from "../data/reports";

interface Props {
  reportId?: string;
  reportText?: string;
  reportMeta?: Record<string, string>;
  onNavigate: (page: string) => void;
}

function RiskBadge({ level }: { level: RiskLevel }) {
  const styles: Record<RiskLevel, { bg: string; color: string; border: string }> = {
    CRITICAL: { bg: "rgba(239,68,68,0.12)", color: "#EF4444", border: "rgba(239,68,68,0.3)" },
    HIGH: { bg: "rgba(249,115,22,0.12)", color: "#F97316", border: "rgba(249,115,22,0.3)" },
    MEDIUM: { bg: "rgba(234,179,8,0.12)", color: "#EAB308", border: "rgba(234,179,8,0.3)" },
    LOW: { bg: "rgba(34,197,94,0.12)", color: "#22C55E", border: "rgba(34,197,94,0.3)" },
  };
  const s = styles[level];
  return (
    <span style={{ padding: "4px 12px", borderRadius: 6, background: s.bg, color: s.color, border: `1px solid ${s.border}`, fontSize: 12, fontWeight: 700, letterSpacing: "0.05em" }}>
      {level}
    </span>
  );
}

export default function AnalysisResult({ reportId, reportText, reportMeta, onNavigate }: Props) {
  const [expandedRec, setExpandedRec] = useState<number | null>(null);
  const [checkedRecs, setCheckedRecs] = useState<Set<number>>(new Set());
  const [showFullText, setShowFullText] = useState(false);

  // Use existing report or analyse provided text
  const report = reportId ? REPORTS.find((r) => r.id === reportId) : null;
  const textToAnalyze = reportText || report?.description || "";
  const analysis = analyzeSafetyReport(textToAnalyze, reportId);

  const displayId = reportId || `SR-${Math.floor(1000 + Math.random() * 900)}`;
  const riskLevel = report?.riskLevel || analysis.riskLevel;
  const riskScore = report?.riskScore || analysis.riskScore;
  const location = reportMeta?.location || report?.location || "Drilling Area";
  const reportType = reportMeta?.reportType || report?.type || "Near Miss";
  const displayDate = reportMeta?.date || report?.date || new Date().toISOString().split("T")[0];

  const scoreColor = riskLevel === "CRITICAL" ? "#EF4444" : riskLevel === "HIGH" ? "#F97316" : riskLevel === "MEDIUM" ? "#EAB308" : "#22C55E";
  const scoreGlow = `0 0 60px ${scoreColor}35`;

  function toggleRec(i: number) {
    setCheckedRecs((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  const priorityColor = (p: RiskLevel) => {
    switch (p) {
      case "CRITICAL": return "#EF4444";
      case "HIGH": return "#F97316";
      case "MEDIUM": return "#EAB308";
      case "LOW": return "#22C55E";
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: 1000, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "JetBrains Mono, monospace", color: "#60A5FA", fontWeight: 600 }}>{displayId}</span>
            <span>•</span>
            <span>{reportType}</span>
            <span>•</span>
            <span>{location}</span>
            <span>•</span>
            <span>{displayDate}</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em" }}>AI Safety Analysis</h1>
        </div>
        <button className="btn-ghost" onClick={() => onNavigate("reports")}>← Back to Reports</button>
      </div>

      {/* Hero risk score */}
      <div className="card" style={{
        padding: "28px 32px", marginBottom: 20,
        background: `linear-gradient(135deg, var(--card) 0%, rgba(${riskLevel === "CRITICAL" ? "239,68,68" : riskLevel === "HIGH" ? "249,115,22" : "234,179,8"},0.05) 100%)`,
        borderColor: `${scoreColor}30`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
          {/* Score circle */}
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{
              width: 120, height: 120, borderRadius: "50%",
              background: `radial-gradient(circle at center, ${scoreColor}18 0%, transparent 70%)`,
              border: `3px solid ${scoreColor}40`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              boxShadow: scoreGlow, position: "relative",
            }}>
              <div style={{ fontSize: 42, fontWeight: 900, fontFamily: "JetBrains Mono, monospace", color: scoreColor, lineHeight: 1 }}>{riskScore}</div>
              <div style={{ fontSize: 11, color: "var(--muted-foreground)", letterSpacing: "0.05em" }}>/ 100</div>
            </div>
          </div>

          {/* Labels */}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <RiskBadge level={riskLevel} />
              <span style={{ fontSize: 14, fontWeight: 700, color: scoreColor }}>
                {riskLevel === "CRITICAL" || riskLevel === "HIGH" ? "POTENTIAL SIF PRECURSOR DETECTED" : "RISK ASSESSMENT COMPLETE"}
              </span>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.02em" }}>
              {riskLevel === "CRITICAL" ? "Critical — Immediate Review Required" : riskLevel === "HIGH" ? "High — Priority Action Needed" : riskLevel === "MEDIUM" ? "Medium — Corrective Action Recommended" : "Low — Monitor and Document"}
            </h2>
            <p style={{ fontSize: 13, color: "var(--muted-foreground)", lineHeight: 1.6, maxWidth: 560 }}>
              {analysis.explanation}
            </p>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
            <button
              className="btn-primary"
              style={{ display: "flex", alignItems: "center", gap: 6 }}
              onClick={() => onNavigate("actions")}
            >
              <Plus size={14} /> Create Corrective Action
            </button>
            <button className="btn-ghost" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Users size={14} /> Assign to Team
            </button>
          </div>
        </div>

        <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${scoreColor}20`, fontSize: 12, color: "var(--muted-foreground)", display: "flex", alignItems: "center", gap: 6 }}>
          <Shield size={12} color="var(--muted-foreground)" />
          AI-assisted risk prioritisation. Final safety decisions remain with qualified safety personnel.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Explainable Risk Score */}
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Explainable Risk Factors</div>
          <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 16 }}>Weighted contributions to the overall risk score</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {analysis.riskFactors.map((factor, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{factor.label}</div>
                    <div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{factor.explanation}</div>
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 800, fontFamily: "JetBrains Mono, monospace", color: "#60A5FA", flexShrink: 0, marginLeft: 12 }}>+{factor.score}</span>
                </div>
                <div style={{ height: 5, borderRadius: 3, background: "var(--secondary)", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${(factor.score / 25) * 100}%`,
                    background: "linear-gradient(90deg, #1D4ED8, #3B82F6)",
                    borderRadius: 3,
                    transition: "width 1s ease",
                  }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--muted-foreground)" }}>Total Risk Score</span>
            <span style={{ fontSize: 24, fontWeight: 900, fontFamily: "JetBrains Mono, monospace", color: scoreColor }}>{riskScore}</span>
          </div>

          <div style={{ marginTop: 14, padding: "12px 14px", borderRadius: 8, background: "var(--secondary)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#60A5FA", marginBottom: 6 }}>Why is this report high risk?</div>
            <p style={{ margin: 0, fontSize: 12, color: "var(--card-foreground)", lineHeight: 1.6 }}>{analysis.explanation}</p>
          </div>
        </div>

        {/* NLP Extraction Panel */}
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Detected Safety Factors</div>
          <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 16 }}>Entities extracted by NLP analysis</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            {analysis.entities.map((entity, i) => (
              <div key={i} style={{ display: "flex", gap: 0, alignItems: "stretch", borderRadius: 7, overflow: "hidden", border: "1px solid var(--border)" }}>
                <div style={{ padding: "8px 12px", background: "var(--secondary)", fontSize: 11, fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em", minWidth: 110, display: "flex", alignItems: "center" }}>
                  {entity.label}
                </div>
                <div style={{ padding: "8px 12px", fontSize: 13, color: "var(--foreground)", flex: 1, display: "flex", alignItems: "center" }}>
                  {entity.value}
                </div>
              </div>
            ))}
            {analysis.entities.length === 0 && (
              <div style={{ color: "var(--muted-foreground)", fontSize: 13 }}>No specific entities extracted — report may need more detail.</div>
            )}
          </div>

          {/* Highlighted report text */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
              <span>Original Report Text</span>
              <button onClick={() => setShowFullText(!showFullText)} style={{ background: "transparent", border: "none", color: "#3B82F6", fontSize: 11, cursor: "pointer" }}>
                {showFullText ? "Show less" : "Show highlighted"}
              </button>
            </div>
            {showFullText ? (
              <div
                style={{
                  fontSize: 12.5, lineHeight: 1.7, padding: "12px 14px", borderRadius: 8,
                  background: "var(--secondary)", border: "1px solid var(--border)", maxHeight: 180, overflowY: "auto",
                  color: "var(--card-foreground)",
                }}
                dangerouslySetInnerHTML={{
                  __html: analysis.highlightedText.replace(/<mark>/g, '<mark style="background:rgba(59,130,246,0.25);color:#93C5FD;padding:1px 3px;border-radius:3px;">').replace(/<\/mark>/g, "</mark>"),
                }}
              />
            ) : (
              <div style={{ fontSize: 12.5, lineHeight: 1.7, color: "var(--muted-foreground)", padding: "12px 14px", borderRadius: 8, background: "var(--secondary)", border: "1px solid var(--border)" }}>
                {textToAnalyze.slice(0, 160)}...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SIF Precursors */}
      <div className="card" style={{ padding: "20px", marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Potential SIF Precursors</div>
        <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 16 }}>
          Conditions identified as Serious Injury and Fatality precursors — for risk prioritisation only
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
          {analysis.sifPrecursors.map((p, i) => {
            const pc = priorityColor(p.severity);
            return (
              <div key={i} style={{
                padding: "16px", borderRadius: 10,
                background: `${pc}08`,
                border: `1px solid ${pc}25`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)", flex: 1, marginRight: 8 }}>{p.category}</div>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: `${pc}18`, color: pc, flexShrink: 0, letterSpacing: "0.04em" }}>{p.severity}</span>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.5 }}>{p.explanation}</p>
              </div>
            );
          })}
          {analysis.sifPrecursors.length === 0 && (
            <div style={{ gridColumn: "1 / -1", color: "var(--muted-foreground)", fontSize: 13 }}>No specific SIF precursors identified from this report text.</div>
          )}
        </div>
      </div>

      {/* Similar incidents */}
      {analysis.similarReports.length > 0 && (
        <div className="card" style={{ padding: "20px", marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Similar Historical Reports</div>
          <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 12 }}>Reports with matching hazard signatures — identified by pattern analysis</div>

          {analysis.patternDetected && (
            <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)", marginBottom: 12, fontSize: 13, color: "#FDBA74", fontWeight: 500 }}>
              ⚠ {analysis.patternDetected}
            </div>
          )}

          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Similarity</th>
                  <th style={{ minWidth: 220 }}>Description</th>
                  <th>Hazard</th>
                  <th>Location</th>
                  <th>Risk</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {analysis.similarReports.map((sr) => (
                  <tr key={sr.id}>
                    <td><span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "#60A5FA" }}>{sr.id}</span></td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ height: 4, width: 60, borderRadius: 2, background: "var(--secondary)", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${sr.similarity}%`, background: "#3B82F6" }} />
                        </div>
                        <span style={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace", fontWeight: 600 }}>{sr.similarity}%</span>
                      </div>
                    </td>
                    <td style={{ fontSize: 12, color: "var(--card-foreground)" }}>{sr.description}</td>
                    <td style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{sr.hazard}</td>
                    <td style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{sr.location}</td>
                    <td>
                      <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700, fontSize: 14, color: sr.riskScore >= 80 ? "#EF4444" : sr.riskScore >= 55 ? "#F97316" : sr.riskScore >= 30 ? "#EAB308" : "#22C55E" }}>{sr.riskScore}</span>
                    </td>
                    <td style={{ fontSize: 11, color: "var(--muted-foreground)", fontFamily: "JetBrains Mono, monospace" }}>{sr.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="card" style={{ padding: "20px", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Recommended Preventive Actions</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-primary" style={{ fontSize: 12, padding: "7px 14px", display: "flex", alignItems: "center", gap: 6 }} onClick={() => onNavigate("actions")}>
              <Plus size={12} /> Create Corrective Action
            </button>
            <button className="btn-ghost" style={{ fontSize: 12, padding: "7px 14px", display: "flex", alignItems: "center", gap: 6 }}>
              <Users size={12} /> Assign to Team
            </button>
          </div>
        </div>
        <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 16 }}>AI-generated preventive actions based on hazard pattern and risk level</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {analysis.recommendations.map((rec, i) => {
            const pc = priorityColor(rec.priority);
            const checked = checkedRecs.has(i);
            return (
              <div
                key={i}
                style={{
                  padding: "14px 16px", borderRadius: 8,
                  background: checked ? "rgba(34,197,94,0.05)" : "var(--secondary)",
                  border: `1px solid ${checked ? "rgba(34,197,94,0.2)" : "var(--border)"}`,
                  transition: "all 0.15s",
                }}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <button
                    onClick={() => toggleRec(i)}
                    style={{
                      width: 20, height: 20, borderRadius: 4, flexShrink: 0, marginTop: 1,
                      background: checked ? "#22C55E" : "transparent",
                      border: `2px solid ${checked ? "#22C55E" : "var(--border)"}`,
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    {checked && <CheckCircle size={12} color="white" />}
                  </button>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: `${pc}15`, color: pc }}>{rec.priority}</span>
                      <span style={{ fontSize: 13, fontWeight: 500, color: checked ? "var(--muted-foreground)" : "var(--foreground)", textDecoration: checked ? "line-through" : "none" }}>
                        {rec.action}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted-foreground)", display: "flex", gap: 12 }}>
                      <span>Owner: <strong style={{ color: "var(--card-foreground)" }}>{rec.owner}</strong></span>
                      <span>Due: <strong style={{ color: "var(--card-foreground)", fontFamily: "JetBrains Mono, monospace" }}>{rec.dueDate}</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
