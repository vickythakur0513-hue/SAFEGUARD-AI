import { useState } from "react";
import { Shield, Eye, EyeOff, AlertCircle } from "lucide-react";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("safety.officer@oilindia.in");
  const [password, setPassword] = useState("demo1234");
  const [role, setRole] = useState("Safety Officer");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your credentials.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 900);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--background)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle at 50% 20%, rgba(59,130,246,0.07) 0%, transparent 60%), linear-gradient(rgba(30,45,69,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(30,45,69,0.15) 1px, transparent 1px)",
        backgroundSize: "100% 100%, 40px 40px, 40px 40px",
        pointerEvents: "none",
      }} />

      <div style={{ display: "flex", gap: 80, alignItems: "center", maxWidth: 900, width: "100%", position: "relative" }}>
        {/* Left branding */}
        <div style={{ flex: 1, display: "none" }} className="hero-left">
          <div style={{ marginBottom: 32 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: "linear-gradient(135deg, #1D4ED8, #3B82F6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 20,
              boxShadow: "0 0 40px rgba(59,130,246,0.3)",
            }}>
              <Shield size={28} color="white" />
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 8, lineHeight: 1.1 }}>
              SAFEGUARD AI
            </h1>
            <p style={{ fontSize: 16, color: "#60A5FA", fontWeight: 500, marginBottom: 24 }}>
              Industrial Safety Intelligence Platform
            </p>
            <p style={{ fontSize: 14, color: "var(--muted-foreground)", lineHeight: 1.7, maxWidth: 360 }}>
              AI-powered SIF precursor detection from unsafe-act, unsafe-condition, and near-miss reports. Built for Oil India Limited.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { icon: "🔍", label: "NLP-Powered Analysis", desc: "Extract safety factors from free-text reports" },
              { icon: "⚡", label: "Real-Time Risk Scoring", desc: "Explainable AI risk prioritisation" },
              { icon: "🔗", label: "Pattern Recognition", desc: "Detect recurring precursor patterns" },
            ].map((item) => (
              <div key={item.label} style={{
                display: "flex", gap: 12, alignItems: "flex-start",
                padding: "12px 16px", borderRadius: 10,
                background: "var(--card)", border: "1px solid var(--border)",
              }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Login card */}
        <div style={{
          width: "100%", maxWidth: 400, margin: "0 auto",
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: 36,
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: "linear-gradient(135deg, #1D4ED8, #3B82F6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 24px rgba(59,130,246,0.25)",
            }}>
              <Shield size={22} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.02em" }}>SAFEGUARD AI</div>
              <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>Industrial Safety Intelligence</div>
            </div>
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4, letterSpacing: "-0.02em" }}>Sign in</h2>
          <p style={{ fontSize: 13, color: "var(--muted-foreground)", marginBottom: 24 }}>Access your safety intelligence dashboard</p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", padding: "10px 14px" }}
                placeholder="your@oilindia.in"
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: "100%", padding: "10px 40px 10px 14px" }}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", color: "var(--muted-foreground)", cursor: "pointer", padding: 0 }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ width: "100%", padding: "10px 14px" }}
              >
                <option>Safety Officer</option>
                <option>Manager</option>
                <option>Admin</option>
              </select>
            </div>

            {error && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", marginBottom: 16, fontSize: 13, color: "#EF4444" }}>
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              style={{ width: "100%", padding: "12px", fontSize: 15, fontWeight: 700, borderRadius: 8, opacity: loading ? 0.7 : 1 }}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In to Demo"}
            </button>
          </form>

          <div style={{
            marginTop: 20, padding: "10px 14px", borderRadius: 8,
            background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)",
            fontSize: 12, color: "#93C5FD", textAlign: "center",
          }}>
            Demo environment — sample safety data. No real data used.
          </div>

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--border)", textAlign: "center", fontSize: 11, color: "var(--muted-foreground)" }}>
            SAFEGUARD AI • AI-Assisted Industrial Safety Intelligence • SIH 2026 Prototype
          </div>
        </div>
      </div>
    </div>
  );
}
