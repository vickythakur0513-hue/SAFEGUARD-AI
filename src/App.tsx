import { useState } from "react";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import NewReport from "./pages/NewReport";
import AnalysisResult from "./pages/AnalysisResult";
import CorrectiveActions from "./pages/CorrectiveActions";
import RiskHeatmap from "./pages/RiskHeatmap";
import Analytics from "./pages/Analytics";
import Insights from "./pages/Insights";
import EarlyWarningCenter from "./pages/EarlyWarningCenter";

type Page = "dashboard" | "reports" | "new-report" | "analysis" | "actions" | "heatmap" | "analytics" | "insights" | "ewc";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState<Page>("dashboard");
  const [selectedReportId, setSelectedReportId] = useState<string | undefined>(undefined);
  const [analysisText, setAnalysisText] = useState<string | undefined>(undefined);
  const [analysisMeta, setAnalysisMeta] = useState<Record<string, string> | undefined>(undefined);

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  function navigate(p: string) {
    setPage(p as Page);
  }

  function handleSelectReport(id: string) {
    setSelectedReportId(id);
    setAnalysisText(undefined);
    setAnalysisMeta(undefined);
  }

  function handleAnalyze(text: string, meta: Record<string, string>) {
    setAnalysisText(text);
    setAnalysisMeta(meta);
    setSelectedReportId(undefined);
    setPage("analysis");
  }

  function renderPage() {
    switch (page) {
      case "dashboard":
        return <Dashboard onNavigate={navigate} />;
      case "reports":
        return <Reports onNavigate={navigate} onSelectReport={handleSelectReport} />;
      case "new-report":
        return <NewReport onAnalyze={handleAnalyze} />;
      case "analysis":
        return (
          <AnalysisResult
            reportId={selectedReportId}
            reportText={analysisText}
            reportMeta={analysisMeta}
            onNavigate={navigate}
          />
        );
      case "actions":
        return <CorrectiveActions />;
      case "heatmap":
        return <RiskHeatmap />;
      case "analytics":
        return <Analytics />;
      case "insights":
        return <Insights />;
      case "ewc":
        return <EarlyWarningCenter onNavigate={navigate} onSelectReport={handleSelectReport} />;
      default:
        return <Dashboard onNavigate={navigate} />;
    }
  }

  return (
    <Layout currentPage={page} onNavigate={navigate}>
      {renderPage()}
    </Layout>
  );
}
