Build a polished, production-style web prototype called **SAFEGUARD AI — AI-Powered Industrial Safety Early-Warning & Risk Intelligence Platform**.

This project is for **Smart India Hackathon 2026 Problem Statement SIH26165**:

**“AI/NLP Engine to Detect Serious Injury & Fatality (SIF) Precursors in OIL's Unsafe-Act/Unsafe-Condition and Near-Miss Reports.”**

The application must NOT look like a generic student dashboard. It should look like a professional enterprise safety intelligence product that could realistically be presented to Oil India Limited and SIH judges.

IMPORTANT:

* Build a fully functional prototype, not a static UI mockup.
* All major buttons must work.
* Use realistic demo data.
* Avoid lorem ipsum.
* Avoid fake empty screens.
* Make the application responsive.
* Keep the architecture modular so the AI engine can later be replaced with a real trained NLP/ML model.
* The prototype must work even when no external AI API key is available.
* Do not claim that the system can definitively predict accidents. Describe results as “Potential SIF Precursor Risk” and “Risk Prioritization.”
* Use explainable AI concepts so every risk score has understandable contributing factors.

==================================================

1. PRODUCT CONCEPT
   ==================================================

SAFEGUARD AI analyses:

* Unsafe Act reports
* Unsafe Condition reports
* Near-Miss reports
* Incident observations

The platform extracts safety-related information using NLP and identifies potential Serious Injury & Fatality precursors.

The main product flow is:

Safety Report
→ NLP Analysis
→ Hazard / Unsafe Act / Unsafe Condition Extraction
→ SIF Precursor Identification
→ Risk Scoring
→ Explainable Risk Assessment
→ Similar Incident Detection
→ Preventive Recommendations
→ Corrective Action Tracking
→ Management Dashboard

==================================================
2. TECH STACK
=============

Use:

Frontend:

* React
* TypeScript
* Tailwind CSS
* Modern component library such as shadcn/ui if available
* Lucide icons
* Recharts for charts

Backend:

* Use the platform's supported backend technology.
* Prefer a clean REST API architecture.
* If a backend/database service is available, integrate it properly.
* Keep API logic separated from UI components.

Database:

* Prefer PostgreSQL/Supabase if available.
* Otherwise create a clean local mock-data/service layer with an easy migration path to PostgreSQL.

AI/NLP:
Create a modular `ai-analysis` service.
The prototype must have a working fallback analysis engine using:

* text preprocessing
* safety keyword/entity detection
* rule-based precursor identification
* weighted risk scoring
* similarity matching against demo reports

Structure the code so a real NLP/ML model or LLM API can later replace the fallback engine without changing the frontend.

==================================================
3. DESIGN SYSTEM
================

Create a premium industrial enterprise UI.

Brand:
SAFEGUARD AI

Tagline:
“From near-miss reporting to proactive safety.”

Design language:

* professional
* modern
* clean
* industrial
* trustworthy
* data-driven
* safety-focused

Use a sophisticated neutral interface with strong semantic risk indicators:

* Critical = red
* High = orange
* Medium = yellow
* Low = green

Do not overuse colors.
Use color primarily for risk/status communication.

Typography:

* modern sans-serif
* strong hierarchy
* highly readable tables and dashboards

Use:

* cards
* glass/subtle surfaces where appropriate
* clean tables
* charts
* badges
* progress indicators
* timelines
* expandable analysis sections
* smooth but restrained animations

Add:

* responsive sidebar
* top navigation
* user profile menu
* notifications
* global search
* breadcrumbs where useful

==================================================
4. LOGIN PAGE
=============

Create a professional login page.

Show:
SAFEGUARD AI

“Industrial Safety Intelligence Platform”

Fields:

* Email
* Password

Role selector:

* Safety Officer
* Manager
* Admin

Demo login button:
“Sign In to Demo”

Include a small note:
“Demo environment — sample safety data”

After login, redirect to Dashboard.

==================================================
5. MAIN DASHBOARD
=================

Create a powerful executive dashboard.

Header:
“Good morning, Safety Team”
Subtitle:
“Safety intelligence overview and emerging risk patterns.”

Top KPI cards:

Total Reports
2,458

Near Misses
842

High-Risk Reports
127

Critical SIF Precursors
23

Open Corrective Actions
68

Add percentage/trend indicators.

Create charts:

1. Safety Reports Over Time
   Line/area chart.

2. Risk Distribution
   Donut chart:

* Critical
* High
* Medium
* Low

3. Hazard Distribution
   Bar chart:

* Fall
* Electrical
* Machinery
* Fire
* PPE
* Chemical
* Vehicle
* Confined Space

4. Risk by Location
   Horizontal bar chart:

* Drilling
* Maintenance
* Production
* Warehouse
* Pipeline
* Electrical

Add a large section:

### AI Safety Intelligence

Display 3–4 generated insights such as:

“Fall-related precursors increased 24% this month.”

“Maintenance operations currently show the highest concentration of high-risk reports.”

“14 near-miss reports share similar equipment-related patterns.”

“3 critical reports require immediate safety review.”

Add a “View All Insights” button.

==================================================
6. REPORTS PAGE
===============

Create a professional safety-report management page.

Header:
“Safety Reports”

Actions:

* * New Report
* Import Report
* Export Report

Search bar:
“Search reports, hazards, locations...”

Filters:

* Report Type
* Risk Level
* Location
* Hazard
* Status
* Date

Table columns:

Report ID
Type
Description
Location
Hazard
Risk Score
Risk Level
Date
Status
Action

Use realistic data.

Risk score should show values like:
87
76
64
42
18

Clicking a row opens Report Details.

==================================================
7. NEW REPORT PAGE
==================

Create a polished report submission form.

Fields:

Report Type:

* Unsafe Act
* Unsafe Condition
* Near Miss
* Incident

Date

Time

Location

Department

Equipment

Reporter Role

Description textarea

Example placeholder:
“Describe what happened, what unsafe condition/action was observed, and any relevant equipment or environmental factors.”

Upload evidence:

* PDF
* TXT
* Image

Main CTA:

“Analyze with SAFEGUARD AI”

After submission, show a loading state:

“Reading safety report...”
“Extracting safety factors...”
“Checking precursor patterns...”
“Calculating risk...”
“Preparing recommendations...”

Then open the AI Analysis Result page.

==================================================
8. AI ANALYSIS RESULT
=====================

This is the MOST IMPORTANT screen.

Make it visually impressive.

Header:

“AI Safety Analysis”

Report ID:
SR-1024

Show a large risk score:

87 / 100

Label:

CRITICAL — POTENTIAL SIF PRECURSOR

Include:
“AI-assisted risk prioritization. Final safety decisions remain with qualified personnel.”

==================================================
9. EXPLAINABLE RISK SCORE
=========================

Create a visual risk breakdown.

Example:

Hazard Severity
+25

Missing Safety Control
+20

High-Risk Activity
+20

Similar Historical Events
+15

Environmental Risk
+07

Total:
87

Show these as animated progress bars or cards.

Add:

### Why is this report high risk?

Example:
“The report contains multiple indicators associated with potentially severe outcomes, including work at height, missing fall protection and proximity to high-risk equipment.”

==================================================
10. NLP EXTRACTION PANEL
========================

Display extracted entities.

Section:

### Detected Safety Factors

Activity:
Working at height

Unsafe Act:
No fall protection

Equipment:
Drilling equipment

Hazard:
Fall from height

Safety Control:
Fall protection missing

Location:
Drilling Area

Highlight these entities visually inside the original report text.

==================================================
11. SIF PRECURSOR PANEL
=======================

Create a section:

### Potential SIF Precursors

Cards:

Working at Height
HIGH

Missing Fall Protection
CRITICAL

High-Risk Equipment Proximity
HIGH

Repeated Similar Events
MEDIUM

Each card should include:

* category
* severity
* short explanation

==================================================
12. SIMILAR INCIDENT DETECTION
==============================

Create:

### Similar Reports

Show 3–5 historical reports.

Each card/table row contains:

Report ID
Similarity
Hazard
Location
Risk
Date

Example:

SR-0912 — 92% similar
“Worker working at height without fall protection”

SR-0844 — 86% similar
“Unsafe maintenance activity near drilling equipment”

SR-0731 — 81% similar
“Missing PPE during elevated work”

Add:

“Pattern detected: Repeated fall-from-height safety violations.”

==================================================
13. PREVENTIVE RECOMMENDATIONS
==============================

Create a section:

### Recommended Preventive Actions

1. Conduct immediate work-at-height safety inspection.
2. Verify fall-protection and PPE compliance.
3. Review the work-at-height permit/procedure.
4. Inspect nearby drilling equipment.
5. Monitor recurrence of similar near-miss reports.

Each action should have:

* priority
* suggested owner
* due date
* checkbox/status

Add buttons:

“Create Corrective Action”

“Assign to Team”

==================================================
14. CORRECTIVE ACTIONS PAGE
===========================

Create a dedicated action management page.

Columns:

Action ID
Related Report
Action
Owner
Priority
Due Date
Status

Statuses:

* Open
* In Progress
* Completed
* Overdue

Add filters.

Allow demo interactions:

* assign action
* change status
* change priority
* mark completed

==================================================
15. RISK HEATMAP PAGE
=====================

Create:

### Industrial Risk Heatmap

Display a professional visual representation of site/department risk.

Locations:

Drilling Area
Maintenance
Production
Warehouse
Electrical
Pipeline

Use semantic risk colors.

Clicking a location should display:

* report count
* high-risk count
* critical count
* top hazards
* trend

Add a side panel:

“Highest Risk Area”
Drilling Operations

“Primary Hazard”
Fall from Height

“Open Actions”
14

==================================================
16. ANALYTICS PAGE
==================

Create advanced analytics.

Filters:

* Date Range
* Department
* Location
* Hazard
* Report Type
* Risk Level

Charts:

* Reports trend
* Risk score trend
* Hazard frequency
* Location risk
* Near-miss vs unsafe-act comparison
* Corrective action completion rate

Add a section:

### Emerging Risk Patterns

Example:

Pattern 01
Repeated PPE non-compliance

Pattern 02
Recurring equipment-related near misses

Pattern 03
Increasing maintenance-area risks

==================================================
17. AI INSIGHTS PAGE
====================

Create an intelligence-focused page.

Header:
“Safety Intelligence”

Show cards:

### Emerging Risk

“Fall-related safety precursors are increasing in drilling operations.”

### Recurring Pattern

“Multiple near-miss reports reference the same equipment category.”

### Attention Required

“23 reports currently require critical-risk review.”

### Improvement Opportunity

“PPE-related observations account for a significant share of repeated unsafe-act reports.”

Include a “Generate New Insights” button.

For demo purposes, generate deterministic insights from the sample dataset rather than returning random text.

==================================================
18. NOTIFICATIONS
=================

Create notification dropdown.

Examples:

🔴 Critical SIF precursor detected
SR-1024 requires immediate review.

⚠️ Repeated hazard detected
3 similar electrical near-miss reports found.

📋 Corrective action due
Safety inspection is approaching its deadline.

==================================================
19. SEARCH
==========

Global search should work across:

* Reports
* Hazards
* Locations
* Equipment
* Corrective Actions

Example search:
“drilling”

Show:

* related reports
* hazards
* actions
* insights

==================================================
20. SAMPLE DATA
===============

Seed realistic demo data.

Create at least 40 safety reports.

Use realistic industrial examples involving:

* working at height
* PPE non-compliance
* electrical hazards
* machinery
* fire
* chemical exposure
* vehicle movement
* confined spaces
* oil leakage
* equipment failure
* unsafe maintenance
* restricted-area access

Locations:

* Drilling Area
* Maintenance
* Production
* Warehouse
* Pipeline
* Electrical

Mix:

* Unsafe Acts
* Unsafe Conditions
* Near Misses

Create realistic risk scores.

Include:

* 4–6 critical
* 10–12 high
* 12–15 medium
* remaining low

Create 15+ corrective actions.

Create historical similar-report relationships.

==================================================
21. AI FALLBACK ENGINE
======================

Implement a deterministic prototype AI engine.

Create a service such as:

`analyzeSafetyReport(text)`

It should:

1. Normalize text.
2. Detect safety keywords.
3. Detect hazard categories.
4. Detect unsafe acts.
5. Detect unsafe conditions.
6. Detect missing controls.
7. Detect high-risk activities.
8. Compare against historical reports.
9. Calculate weighted risk score.
10. Generate explanation.
11. Generate preventive recommendations.

Example keyword categories:

FALL:
height, ladder, roof, elevated, fall, scaffolding

PPE:
helmet, gloves, harness, safety shoes, PPE, protective equipment

ELECTRICAL:
wire, cable, voltage, electric, electrical, exposed conductor

FIRE:
fire, flame, ignition, smoke, combustible

MACHINERY:
machine, rotating, drilling, equipment, conveyor

CHEMICAL:
chemical, gas, leak, toxic, exposure

CONFINED SPACE:
tank, confined space, vessel, chamber

VEHICLE:
vehicle, truck, forklift, reversing, collision

Make the scoring engine transparent.

Example:

High-risk activity = +20
Missing safety control = +20
Severe hazard = +25
Previous similar reports = +15
Environmental factor = +7

Cap score at 100.

Risk categories:

0–29 = LOW
30–54 = MEDIUM
55–79 = HIGH
80–100 = CRITICAL

==================================================
22. DEMO MODE
=============

Create a clearly accessible:

“Launch Demo”

or

“Use Sample Report”

button.

Provide 3 predefined scenarios:

Scenario 1:
HIGH-RISK WORK AT HEIGHT

Scenario 2:
ELECTRICAL NEAR MISS

Scenario 3:
MACHINERY SAFETY INCIDENT

When the user selects one, automatically populate the report and run the analysis.

This is extremely important for the SIH presentation because the complete AI workflow can be demonstrated quickly.

==================================================
23. DEMO STORY
==============

Make sure the application supports this exact demo:

1. Open Dashboard.
2. Show existing safety statistics.
3. Click “New Report”.
4. Select “Near Miss”.
5. Choose “Use Sample Report”.
6. Click “Analyze with SAFEGUARD AI”.
7. Show NLP extraction.
8. Show risk score.
9. Show explainable risk factors.
10. Show potential SIF precursors.
11. Show similar historical incidents.
12. Show preventive recommendations.
13. Create corrective action.
14. Open Risk Heatmap.
15. Show that the drilling area has elevated risk.
16. Open AI Insights.
17. Show the detected recurring pattern.

The whole flow should be smooth enough to demonstrate in approximately 3 minutes.

==================================================
24. RESPONSIVE DESIGN
=====================

Desktop:

* persistent sidebar
* large analytics dashboard
* multi-column cards

Tablet:

* collapsible sidebar
* responsive grids

Mobile:

* bottom navigation or collapsible menu
* stacked cards
* responsive tables

==================================================
25. ERROR HANDLING
==================

Handle:

* empty report
* invalid file
* analysis failure
* missing data
* API failure
* loading states

Never show a blank screen.

Use friendly messages.

==================================================
26. IMPORTANT PRODUCT LANGUAGE
==============================

Use these terms consistently:

“Potential SIF Precursor”

“Risk Prioritization”

“AI-Assisted Analysis”

“Explainable Risk Factors”

“Safety Intelligence”

“Preventive Recommendation”

Avoid claims like:

“Predicts accidents with certainty”

“Guarantees accident prevention”

“100% accurate”

The platform supports qualified safety professionals; it does not replace human safety judgment.

==================================================
27. FINAL QUALITY REQUIREMENTS
==============================

Before completing the build:

* Test every navigation link.
* Test report creation.
* Test sample report analysis.
* Test risk scoring.
* Test dashboard charts.
* Test filters.
* Test search.
* Test corrective-action status changes.
* Test responsive layouts.
* Remove all placeholder text.
* Remove broken buttons.
* Remove console errors where possible.
* Ensure realistic demo data is visible.
* Ensure the AI analysis flow works without requiring a paid API.
* Make the visual design consistent across every page.

The final result should feel like a **real industrial safety intelligence product**, not a basic CRUD application.

Most important screens for visual quality:

1. Dashboard
2. New Safety Report
3. AI Analysis Result
4. Risk Heatmap
5. Analytics
6. Corrective Actions
7. AI Safety Intelligence

Make the **AI Analysis Result** the hero experience of the entire prototype.

==================================================
28. BRANDING
============

Logo text:

SAFEGUARD AI

Logo concept:
shield + AI circuit + safety signal

Tagline:

“From Near-Miss Reporting to Proactive Safety.”

Use a polished enterprise visual identity.

Add footer:

“SAFEGUARD AI • AI-Assisted Industrial Safety Intelligence • SIH 2026 Prototype”
