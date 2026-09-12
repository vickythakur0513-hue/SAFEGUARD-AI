import { useState } from "react";
import { Upload, Zap, ChevronDown, AlertCircle } from "lucide-react";
import { DEMO_SCENARIOS } from "../services/aiAnalysis";

interface Props {
  onAnalyze: (text: string, meta: Record<string, string>) => void;
}

const STEPS = [
  "Reading safety report...",
  "Extracting safety factors...",
  "Checking precursor patterns...",
  "Calculating risk score...",
  "Preparing recommendations...",
];

export default function NewReport({ onAnalyze }: Props) {
  const [reportType, setReportType] = useState("Near Miss");
  const [date, setDate] = useState("2026-09-12");
  const [time, setTime] = useState("09:45");
  const [location, setLocation] = useState("Drilling Area");
  const [department, setDepartment] = useState("Drilling Operations");
  const [equipment, setEquipment] = useState("");
  const [reporterRole, setReporterRole] = useState("Safety Officer");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState("");
  const [showDemo, setShowDemo] = useState(false);

  function applySample(idx: number) {
    const s = DEMO_SCENARIOS[idx];
    setReportType(s.type);
    setLocation(s.location);
    setDepartment(s.department);
    setEquipment(s.equipment);
    setReporterRole(s.reporterRole);
    setDescription(s.description);
    setShowDemo(false);
  }

  function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim() || description.trim().length < 20) {
      setError("Please enter a description of at least 20 characters.");
      return;
    }
    setError("");
    setLoading(true);
    setLoadingStep(0);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < STEPS.length) {
        setLoadingStep(step);
      } else {
        clearInterval(interval);
        setLoading(false);
        onAnalyze(description, { reportType, date, time, location, department, equipment, reporterRole });
      }
    }, 600);
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: 820, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 4 }}>New Safety Report</h1>
        <p style={{ fontSize: 13, color: "var(--muted-foreground)" }}>Submit an unsafe act, unsafe condition, near miss, or incident for AI-assisted analysis.</p>
      </div>

      {/* Demo scenarios */}
      <div style={{ marginBottom: 20, padding: "14px 16px", borderRadius: 10, background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#60A5FA", marginBottom: 2 }}>⚡ Demo Mode — Use a Sample Report</div>
            <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>Pre-populated scenarios to demonstrate the full AI analysis workflow</div>
          </div>
          <button
            className="btn-primary"
            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}
            onClick={() => setShowDemo(!showDemo)}
          >
            Use Sample Report <ChevronDown size={13} />
          </button>
        </div>
        {showDemo && (
          <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
            {DEMO_SCENARIOS.map((s, i) => (
              <button
                key={i}
                onClick={() => applySample(i)}
                style={{
                  padding: "10px 16px", borderRadius: 8,
                  background: "var(--card)", border: "1px solid var(--border)",
                  cursor: "pointer", textAlign: "left", flex: "1 1 200px",
                  transition: "border-color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#3B82F6")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              >
                <div style={{ fontSize: 10, fontWeight: 700, color: "#3B82F6", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Scenario {i + 1}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>{s.label}</div>
                <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 2 }}>{s.type} • {s.location}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading overlay */}
      {loading && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(8,12,20,0.85)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          zIndex: 200, backdropFilter: "blur(8px)",
        }}>
          <div style={{ textAlign: "center", maxWidth: 380 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16,
              background: "linear-gradient(135deg, #1D4ED8, #3B82F6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px", boxShadow: "0 0 40px rgba(59,130,246,0.4)",
            }}>
              <Zap size={28} color="white" />
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Analyzing with SAFEGUARD AI</div>
            <div style={{ fontSize: 14, color: "#60A5FA", fontWeight: 500, marginBottom: 28, minHeight: 22 }}>
              {STEPS[loadingStep]}
            </div>
            <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: 4, flex: 1, borderRadius: 2,
                    background: i <= loadingStep ? "#3B82F6" : "var(--secondary)",
                    transition: "background 0.3s",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleAnalyze}>
        <div className="card" style={{ padding: "24px", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, color: "var(--foreground)", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid var(--border)", paddingBottom: 10 }}>Report Details</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Report Type *</label>
              <select value={reportType} onChange={(e) => setReportType(e.target.value)} style={{ width: "100%", padding: "10px 12px" }}>
                <option>Unsafe Act</option>
                <option>Unsafe Condition</option>
                <option>Near Miss</option>
                <option>Incident</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Date *</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: "100%", padding: "10px 12px" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Time</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} style={{ width: "100%", padding: "10px 12px" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Location *</label>
              <select value={location} onChange={(e) => setLocation(e.target.value)} style={{ width: "100%", padding: "10px 12px" }}>
                {["Drilling Area", "Maintenance", "Production", "Warehouse", "Pipeline", "Electrical"].map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Department</label>
              <select value={department} onChange={(e) => setDepartment(e.target.value)} style={{ width: "100%", padding: "10px 12px" }}>
                {["Drilling Operations", "Maintenance", "Production", "Logistics", "Chemical Handling", "Electrical", "Pipeline Operations", "Civil/Structural"].map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Equipment / Asset</label>
              <input value={equipment} onChange={(e) => setEquipment(e.target.value)} placeholder="e.g. Drilling Rig, Forklift..." style={{ width: "100%", padding: "10px 12px" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Reporter Role</label>
              <select value={reporterRole} onChange={(e) => setReporterRole(e.target.value)} style={{ width: "100%", padding: "10px 12px" }}>
                {["Safety Officer", "Supervisor", "Shift Incharge", "HSE Inspector", "Operator", "Technician"].map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: "24px", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Incident Description *</div>
          <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 12 }}>
            Describe in detail what happened, what unsafe condition or action was observed, relevant equipment, and environmental factors. The AI engine analyses free text.
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={8}
            style={{ width: "100%", padding: "12px 14px", resize: "vertical", lineHeight: 1.7 }}
            placeholder="Describe what happened, what unsafe condition/action was observed, and any relevant equipment or environmental factors. Include details about PPE, permits, safety controls, and context."
          />
          <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 6, textAlign: "right" }}>
            {description.length} characters — minimum 20 required
          </div>
        </div>

        <div className="card" style={{ padding: "20px", marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>Evidence Attachments</div>
          <div style={{
            border: "2px dashed var(--border)", borderRadius: 8,
            padding: "24px", textAlign: "center", cursor: "pointer",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#3B82F6")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          >
            <Upload size={24} color="var(--muted-foreground)" style={{ margin: "0 auto 10px" }} />
            <div style={{ fontSize: 13, color: "var(--card-foreground)", marginBottom: 4 }}>Drop files here or click to upload</div>
            <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>PDF, TXT, JPG, PNG — max 10 MB</div>
          </div>
        </div>

        {error && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", marginBottom: 16, fontSize: 13, color: "#EF4444" }}>
            <AlertCircle size={15} /> {error}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button type="button" className="btn-ghost">Save Draft</button>
          <button
            type="submit"
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "linear-gradient(135deg, #1D4ED8, #3B82F6)",
              color: "white", border: "none",
              padding: "12px 28px", borderRadius: 8,
              fontWeight: 700, fontSize: 15, cursor: "pointer",
              boxShadow: "0 4px 24px rgba(59,130,246,0.3)",
            }}
          >
            <Zap size={16} /> Analyze with SAFEGUARD AI
          </button>
        </div>
      </form>
    </div>
  );
}
