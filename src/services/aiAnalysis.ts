import { REPORTS, getRiskLevelFromScore } from "../data/reports";
import type { RiskLevel } from "../data/reports";

export interface ExtractedEntity {
  label: string;
  value: string;
  category: string;
}

export interface RiskFactor {
  label: string;
  score: number;
  explanation: string;
}

export interface SIFPrecursor {
  category: string;
  severity: RiskLevel;
  explanation: string;
}

export interface SimilarReport {
  id: string;
  similarity: number;
  description: string;
  hazard: string;
  location: string;
  riskScore: number;
  date: string;
}

export interface Recommendation {
  priority: RiskLevel;
  action: string;
  owner: string;
  dueDate: string;
}

export interface AnalysisResult {
  riskScore: number;
  riskLevel: RiskLevel;
  entities: ExtractedEntity[];
  riskFactors: RiskFactor[];
  sifPrecursors: SIFPrecursor[];
  similarReports: SimilarReport[];
  recommendations: Recommendation[];
  explanation: string;
  highlightedText: string;
  patternDetected: string;
}

const HAZARD_KEYWORDS: Record<string, string[]> = {
  FALL: ["height", "ladder", "roof", "elevated", "fall", "scaffolding", "scaffold", "harness", "guardrail", "grating", "platform", "elevated work"],
  PPE: ["helmet", "gloves", "harness", "safety shoes", "ppe", "protective equipment", "hi-vis", "face shield", "goggles", "respirator"],
  ELECTRICAL: ["wire", "cable", "voltage", "electric", "electrical", "conductor", "switchgear", "panel", "energised", "live", "hv", "kv", "arcing"],
  FIRE: ["fire", "flame", "ignition", "smoke", "combustible", "flammable", "burn", "flash", "explosion", "hot-work", "welding", "sparks", "solvent"],
  MACHINERY: ["machine", "rotating", "drilling", "equipment", "conveyor", "pump", "motor", "crane", "rotating shaft", "rigging"],
  CHEMICAL: ["chemical", "gas", "leak", "toxic", "exposure", "h2s", "acid", "sulphuric", "solvent", "vapour", "fumes", "hazmat"],
  CONFINED_SPACE: ["tank", "confined space", "vessel", "chamber", "enclosed", "manhole", "sump"],
  VEHICLE: ["vehicle", "truck", "forklift", "reversing", "collision", "speed", "pedestrian"],
  PRESSURE: ["pressure", "overpressure", "relief valve", "burst", "rupture", "pig receiver", "blowout"],
  TOXIC_GAS: ["h2s", "hydrogen sulphide", "toxic gas", "gas monitor", "lel", "ppm"],
};

const UNSAFE_ACT_PATTERNS = [
  "without harness", "without ppe", "without permit", "bypassed", "no permit",
  "not wearing", "without fall protection", "without isolation", "no tagline",
  "unauthorised", "without authorisation", "without guard", "using mobile phone",
  "without gas testing", "without buddy", "without face shield", "without lockout",
];

const MISSING_CONTROL_PATTERNS = [
  "no permit", "no harness", "no fall protection", "non-operational", "non-functional",
  "expired", "missing", "not available", "not in place", "not fitted", "not chained",
  "not operational", "bypassed", "removed", "without isolation", "without escort",
  "without second person", "without authorisation", "not worn",
];

const HIGH_RISK_ACTIVITIES = [
  "work at height", "working at height", "hot work", "confined space entry",
  "lifting operation", "high voltage", "live maintenance", "pipeline work",
  "overhead lifting", "crane operation", "elevated work", "maintenance on energised",
  "hydrogen sulphide", "pressurised line",
];

function normalise(text: string): string {
  return text.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
}

function detectKeywords(text: string): Record<string, string[]> {
  const norm = normalise(text);
  const detected: Record<string, string[]> = {};
  for (const [category, keywords] of Object.entries(HAZARD_KEYWORDS)) {
    const found = keywords.filter((kw) => norm.includes(kw));
    if (found.length > 0) detected[category] = found;
  }
  return detected;
}

function detectPatterns(text: string, patterns: string[]): string[] {
  const norm = normalise(text);
  return patterns.filter((p) => norm.includes(p));
}

function findSimilarReports(reportText: string, excludeId?: string): SimilarReport[] {
  const norm = normalise(reportText);
  const keywordHits = detectKeywords(norm);
  const topCategories = Object.keys(keywordHits);

  return REPORTS.filter((r) => r.id !== excludeId)
    .map((r) => {
      const rNorm = normalise(r.description);
      let score = 0;
      for (const cat of topCategories) {
        const kws = HAZARD_KEYWORDS[cat] || [];
        for (const kw of kws) {
          if (rNorm.includes(kw)) score += 12;
        }
      }
      for (const pat of MISSING_CONTROL_PATTERNS) {
        if (norm.includes(pat) && rNorm.includes(pat)) score += 5;
      }
      const similarity = Math.min(99, Math.max(0, score));
      return { report: r, similarity };
    })
    .filter((x) => x.similarity >= 40)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 4)
    .map(({ report: r, similarity }) => ({
      id: r.id,
      similarity,
      description: r.description.slice(0, 110) + "...",
      hazard: r.hazard,
      location: r.location,
      riskScore: r.riskScore,
      date: r.date,
    }));
}

function extractEntities(text: string, detected: Record<string, string[]>): ExtractedEntity[] {
  const norm = normalise(text);
  const entities: ExtractedEntity[] = [];

  if (detected.FALL || detected.MACHINERY || detected.PRESSURE) {
    const activities = HIGH_RISK_ACTIVITIES.filter((a) => norm.includes(a));
    if (activities.length > 0) {
      entities.push({ label: "Activity", value: activities[0].replace(/\b\w/g, (c) => c.toUpperCase()), category: "activity" });
    } else if (detected.FALL) {
      entities.push({ label: "Activity", value: "Work at Height", category: "activity" });
    }
  }

  const unsafeActs = detectPatterns(text, UNSAFE_ACT_PATTERNS);
  if (unsafeActs.length > 0) {
    entities.push({
      label: "Unsafe Act",
      value: unsafeActs[0].replace(/\b\w/g, (c) => c.toUpperCase()),
      category: "unsafe-act",
    });
  }

  const categories = Object.keys(detected);
  if (categories.length > 0) {
    const hazardMap: Record<string, string> = {
      FALL: "Fall from Height",
      ELECTRICAL: "Electrical Shock",
      FIRE: "Fire / Explosion",
      CHEMICAL: "Chemical Exposure",
      MACHINERY: "Machinery Entanglement",
      CONFINED_SPACE: "Confined Space Hazard",
      VEHICLE: "Vehicle Collision",
      PPE: "PPE Non-Compliance",
      PRESSURE: "Pressure Release",
      TOXIC_GAS: "Toxic Gas Exposure",
    };
    entities.push({ label: "Hazard", value: hazardMap[categories[0]] || categories[0], category: "hazard" });
  }

  const missingControls = detectPatterns(text, MISSING_CONTROL_PATTERNS);
  if (missingControls.length > 0) {
    entities.push({
      label: "Safety Control",
      value: `Control missing: ${missingControls[0].replace(/\b\w/g, (c) => c.toUpperCase())}`,
      category: "control",
    });
  }

  if (detected.PPE) {
    entities.push({ label: "PPE Issue", value: "Personal Protective Equipment not compliant", category: "ppe" });
  }

  const locations = ["drilling area", "maintenance", "production", "warehouse", "pipeline", "electrical"];
  const loc = locations.find((l) => normalise(text).includes(l));
  if (loc) {
    entities.push({ label: "Location", value: loc.replace(/\b\w/g, (c) => c.toUpperCase()), category: "location" });
  }

  return entities;
}

function buildRiskFactors(detected: Record<string, string[]>, missingControls: string[], highRiskActivities: string[], similarCount: number, text: string): RiskFactor[] {
  const factors: RiskFactor[] = [];

  const categories = Object.keys(detected);
  if (categories.includes("FALL") || categories.includes("PRESSURE") || categories.includes("TOXIC_GAS")) {
    factors.push({ label: "Hazard Severity", score: 25, explanation: "Report involves a hazard category associated with potentially severe outcomes." });
  } else if (categories.includes("ELECTRICAL") || categories.includes("FIRE") || categories.includes("CHEMICAL")) {
    factors.push({ label: "Hazard Severity", score: 22, explanation: "Report contains high-energy or toxic hazard indicators." });
  } else if (categories.length > 0) {
    factors.push({ label: "Hazard Severity", score: 15, explanation: "Identifiable hazard category detected in report." });
  }

  if (missingControls.length >= 3) {
    factors.push({ label: "Missing Safety Controls", score: 20, explanation: `${missingControls.length} missing or bypassed safety controls detected.` });
  } else if (missingControls.length >= 1) {
    factors.push({ label: "Missing Safety Controls", score: 12, explanation: "One or more safety controls identified as absent or bypassed." });
  }

  if (highRiskActivities.length > 0) {
    factors.push({ label: "High-Risk Activity", score: 20, explanation: `Activity type '${highRiskActivities[0]}' is classified as high-consequence in safety standards.` });
  } else if (categories.length >= 2) {
    factors.push({ label: "High-Risk Activity", score: 10, explanation: "Multiple hazard categories indicate elevated operational risk." });
  }

  if (similarCount >= 3) {
    factors.push({ label: "Similar Historical Events", score: 15, explanation: `${similarCount} similar reports found — pattern of recurring risk in this category.` });
  } else if (similarCount >= 1) {
    factors.push({ label: "Similar Historical Events", score: 8, explanation: `${similarCount} similar report(s) found in historical records.` });
  }

  const norm = normalise(text);
  if (norm.includes("night") || norm.includes("shift") || norm.includes("alone") || norm.includes("no second person")) {
    factors.push({ label: "Environmental / Situational Risk", score: 7, explanation: "Environmental factors (night shift, lone working) increase consequence severity." });
  } else if (norm.includes("weather") || norm.includes("rain") || norm.includes("wet") || norm.includes("water")) {
    factors.push({ label: "Environmental / Situational Risk", score: 7, explanation: "Adverse environmental conditions detected." });
  }

  return factors;
}

function buildSIFPrecursors(detected: Record<string, string[]>, missingControls: string[]): SIFPrecursor[] {
  const precursors: SIFPrecursor[] = [];
  const categories = Object.keys(detected);

  if (categories.includes("FALL")) {
    precursors.push({
      category: "Working at Height",
      severity: "HIGH",
      explanation: "Work at elevation is one of the leading causes of fatal workplace injuries in oil and gas operations.",
    });
    if (missingControls.some((c) => c.includes("harness") || c.includes("fall protection"))) {
      precursors.push({
        category: "Missing Fall Protection",
        severity: "CRITICAL",
        explanation: "Absence of fall protection at height is a direct SIF precursor — no secondary barrier against fatal fall.",
      });
    }
  }

  if (categories.includes("ELECTRICAL")) {
    precursors.push({
      category: "Energised Equipment Contact Risk",
      severity: missingControls.length > 0 ? "CRITICAL" : "HIGH",
      explanation: "Contact with energised electrical equipment is a recognised SIF precursor in industrial environments.",
    });
  }

  if (categories.includes("FIRE") || categories.includes("CHEMICAL")) {
    precursors.push({
      category: "Ignition / Toxic Release Risk",
      severity: "HIGH",
      explanation: "Conditions suitable for fire, explosion or toxic substance release detected in this report.",
    });
  }

  if (categories.includes("CONFINED_SPACE")) {
    precursors.push({
      category: "Confined Space Entry Risk",
      severity: "CRITICAL",
      explanation: "Confined space entry without proper controls is a high-consequence SIF precursor.",
    });
  }

  if (categories.includes("MACHINERY")) {
    precursors.push({
      category: "High-Risk Equipment Proximity",
      severity: "HIGH",
      explanation: "Proximity to rotating or pressurised machinery without adequate isolation is a SIF precursor.",
    });
  }

  if (missingControls.length >= 2) {
    precursors.push({
      category: "Repeated Control Failures",
      severity: "MEDIUM",
      explanation: "Multiple missing safety controls suggest systemic safety management gaps beyond individual incidents.",
    });
  }

  return precursors.slice(0, 4);
}

function buildExplanation(detected: Record<string, string[]>, riskScore: number, missingControls: string[]): string {
  const categories = Object.keys(detected);
  if (riskScore >= 80) {
    return `This report contains multiple indicators associated with potentially severe or fatal outcomes. Detected hazard categories include ${categories.slice(0, 2).join(" and ").toLowerCase()}. ${missingControls.length > 0 ? `Critical safety controls — including ${missingControls[0]} — are identified as absent or bypassed.` : ""} The combination of hazard type, missing controls, and historical precedent places this report in the Critical SIF Precursor tier requiring immediate management attention.`;
  }
  if (riskScore >= 55) {
    return `This report contains significant risk indicators in the ${categories[0]?.toLowerCase() || "safety"} category. ${missingControls.length > 0 ? "One or more safety controls are identified as missing or ineffective." : ""} Risk prioritisation indicates this event warrants prompt investigation and corrective action before recurrence.`;
  }
  return `Report contains identifiable safety risk indicators. ${categories.length > 0 ? `Primary hazard category: ${categories[0]?.toLowerCase()}.` : ""} Preventive action is recommended to prevent escalation.`;
}

function buildRecommendations(detected: Record<string, string[]>, riskScore: number): Recommendation[] {
  const recs: Recommendation[] = [];
  const categories = Object.keys(detected);
  const daysOut = (n: number) => {
    const d = new Date("2026-09-12");
    d.setDate(d.getDate() + n);
    return d.toISOString().split("T")[0];
  };

  if (categories.includes("FALL")) {
    recs.push({ priority: "CRITICAL", action: "Conduct immediate work-at-height safety inspection across all active platforms", owner: "HSE Manager", dueDate: daysOut(1) });
    recs.push({ priority: "HIGH", action: "Verify fall-protection and harness compliance for all personnel working above 2 metres", owner: "Site Supervisor", dueDate: daysOut(2) });
    recs.push({ priority: "HIGH", action: "Review and reissue work-at-height permits with updated risk assessment", owner: "Permit Officer", dueDate: daysOut(3) });
  }

  if (categories.includes("ELECTRICAL")) {
    recs.push({ priority: "CRITICAL", action: "Isolate energised equipment immediately — no further work until LOTO verified", owner: "Electrical Supervisor", dueDate: daysOut(0) });
    recs.push({ priority: "HIGH", action: "Inspect all HV/LV cable routes in affected area for damage or exposure", owner: "Electrical Team", dueDate: daysOut(2) });
  }

  if (categories.includes("MACHINERY")) {
    recs.push({ priority: "HIGH", action: "Inspect nearby drilling and rotating equipment for guarding and isolation integrity", owner: "Maintenance Supervisor", dueDate: daysOut(3) });
  }

  if (categories.includes("PPE")) {
    recs.push({ priority: "MEDIUM", action: "Issue mandatory PPE compliance toolbox talk — all workers in affected area", owner: "Safety Officer", dueDate: daysOut(1) });
  }

  recs.push({ priority: "MEDIUM", action: "Monitor recurrence of similar near-miss reports in this location over next 30 days", owner: "HSE Team", dueDate: daysOut(30) });

  const priorityOrder: Record<RiskLevel, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
  return recs.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]).slice(0, 5);
}

function highlightText(text: string, detected: Record<string, string[]>): string {
  const allKeywords = Object.values(detected).flat();
  const unsafeActs = MISSING_CONTROL_PATTERNS;
  const allPatterns = [...allKeywords, ...unsafeActs];

  let result = text;
  const replaced = new Set<string>();

  for (const kw of allPatterns.sort((a, b) => b.length - a.length)) {
    if (replaced.has(kw)) continue;
    const regex = new RegExp(`\\b(${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})\\b`, "gi");
    if (regex.test(result)) {
      result = result.replace(regex, `<mark>$1</mark>`);
      replaced.add(kw);
    }
  }

  return result;
}

export function analyzeSafetyReport(text: string, reportId?: string): AnalysisResult {
  const detected = detectKeywords(text);
  const missingControls = detectPatterns(text, MISSING_CONTROL_PATTERNS);
  const highRiskActivities = detectPatterns(text, HIGH_RISK_ACTIVITIES);
  const similar = findSimilarReports(text, reportId);

  const riskFactors = buildRiskFactors(detected, missingControls, highRiskActivities, similar.length, text);
  const rawScore = riskFactors.reduce((acc, f) => acc + f.score, 0);
  const riskScore = Math.min(100, rawScore);
  const riskLevel = getRiskLevelFromScore(riskScore);

  const entities = extractEntities(text, detected);
  const sifPrecursors = buildSIFPrecursors(detected, missingControls);
  const recommendations = buildRecommendations(detected, riskScore);
  const explanation = buildExplanation(detected, riskScore, missingControls);
  const highlightedText = highlightText(text, detected);

  const categories = Object.keys(detected);
  let patternDetected = "";
  if (similar.length >= 2) {
    const hazard = categories[0]?.toLowerCase().replace("_", " ") || "safety";
    patternDetected = `Pattern detected: Repeated ${hazard}-related safety violations found across ${similar.length + 1} reports in this location.`;
  }

  return {
    riskScore,
    riskLevel,
    entities,
    riskFactors,
    sifPrecursors,
    similarReports: similar,
    recommendations,
    explanation,
    highlightedText,
    patternDetected,
  };
}

export const DEMO_SCENARIOS = [
  {
    label: "HIGH-RISK WORK AT HEIGHT",
    type: "Near Miss" as const,
    location: "Drilling Area",
    department: "Drilling Operations",
    equipment: "Drilling Rig / Scaffolding",
    reporterRole: "Safety Officer",
    description:
      "Worker observed operating at height of 8 metres without harness or fall protection equipment. Scaffolding lacked guardrails on the eastern face. No work-at-height permit was displayed at the site. Equipment inspection tag was expired by 3 months. Supervisor was not present on-site during the observation. Worker was leaning out over the edge of the platform to reach valve. Similar incidents involving fall from height were reported in this area in the last quarter.",
  },
  {
    label: "ELECTRICAL NEAR MISS",
    type: "Near Miss" as const,
    location: "Electrical",
    department: "Electrical",
    equipment: "MCC Panel / HT Switchgear",
    reporterRole: "Electrical Supervisor",
    description:
      "Exposed 415V electrical cable found lying in standing water near pump station. Insulation on cable was visibly damaged over a stretch of approximately 30 cm. Area was not cordoned off or barricaded. No warning signs were in place. Three workers walked through the area during the observation period without awareness of the hazard. Last electrical inspection in this zone was completed six weeks ago. No lockout tagout applied to the circuit.",
  },
  {
    label: "MACHINERY SAFETY INCIDENT",
    type: "Unsafe Act" as const,
    location: "Maintenance",
    department: "Maintenance",
    equipment: "Conveyor Belt / Rotating Equipment",
    reporterRole: "Safety Observer",
    description:
      "Maintenance technician bypassed lockout tagout procedure on rotating conveyor belt while performing lubrication task. Machine was fully energised during the work. No second person was present as safety watch. Technician's sleeve was caught by rotating shaft and pulled into the machine — released only because fabric tore. Technician sustained minor abrasion. Lockout isolation lock was not applied despite being present at the switchboard. Incident was not immediately reported and was only identified through CCTV review.",
  },
];
