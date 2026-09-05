# ALIGN — Product Specification

## 1. Executive Summary

**ALIGN** is an AI-assisted financial scheme discovery and decision-support platform engineered specifically for marginalized and micro-entrepreneurs in India (including beneficiaries under NSFDC, NBCFDC, NSKFDC, and related state channelising agencies). 

Micro-entrepreneurs often struggle to navigate the complex maze of government-backed credit schemes, opaque eligibility criteria, disparate channel partners, and confusing documentation requirements. ALIGN resolves this friction by translating unstructured, colloquial requirements into structured parameters, evaluating them against deterministic government scheme rules, empowering entrepreneurs with real-time financial simulation tools, connecting them to verified local channel partners, and generating personalized application checklists.

> [!IMPORTANT]
> **Core Product Principle**
> - **AI interprets.** (Gemini extracts intent and parses colloquial user needs)
> - **Code decides.** (Deterministic Rule Engine evaluates authoritative eligibility)
> - **Code calculates.** (Deterministic Financial Engine computes EMI and repayments)
> - **Database stores.** (MongoDB persists verified structured schemes and partner records)
> - **RAG retrieves.** (Vector search fetches official guidelines only when structured data is insufficient)

---

## 2. Problem Statement & Market Context

### The Challenge
1. **Information Asymmetry & Complexity:** Government financial corporations (such as NSFDC) offer highly concessional loans (microfinance at 6.5%, term loans at 8%, etc.), but scheme guidelines are buried in bureaucratic PDFs and policy circulars with rigid project limits, income ceilings, and moratorium clauses.
2. **The "AI Hallucination" Danger in Finance:** Generative AI tools frequently invent eligibility criteria, fabricate loan terms, or hallucinate EMI figures when asked financial questions. For marginalized borrowers, receiving inaccurate financial advice can lead to severe debt distress or rejected applications.
3. **Channel Partner Disconnect:** Borrowers rarely apply directly to apex corporations. Lending is routed through State Channelising Agencies (SCAs), Public Sector Banks (PSBs), Regional Rural Banks (RRBs), NBFC-MFIs, and Cooperative Banks. Beneficiaries frequently do not know which physical branch or agency to visit in their district.
4. **Application Intimidation:** The documentation process is opaque. Beneficiaries often make multiple futile visits to bank branches due to missing documents or lack of clarity regarding income certificate requirements.

### The ALIGN Solution
ALIGN bridges this divide through an approachable, human-centered web interface backed by a dual-engine architecture: an AI semantic layer for conversational understanding coupled to a zero-hallucination deterministic core for calculation and rule evaluation.

---

## 3. Product Boundaries & Non-Goals

To maintain strict alignment with regulatory reality and prototype focus, ALIGN defines clear operational boundaries:

| ALIGN Is | ALIGN Is NOT |
| :--- | :--- |
| An AI-assisted scheme discovery & decision-support tool | A government loan application submission portal |
| A financial simulator for EMI & comparative analysis | A loan approval or credit scoring engine |
| A channel partner directory and navigation guide | A payment processor or disbursement gateway |
| A dynamic checklist and readiness advisory system | An authoritative government decision-maker |
| A verified aggregator of published scheme rules | A source of speculative or fabricated loan terms |

---

## 4. Target User Persona

* **Primary Persona:** *Kishore / Anjali*, a marginalized micro-entrepreneur (e.g., tailor, street vendor, rural artisan, small retail shopkeeper, auto-rickshaw operator).
* **Language & Literacy:** May not know financial or bureaucratic jargon; thinks in terms of practical requirements: *"I need ₹1.2 lakh to start a tailoring business. My family income is around ₹3 lakh and I live in Kolkata."*
* **Income Profile:** Family annual income under ₹5,00,000 (qualifying under NSFDC revised income eligibility criteria).
* **Key Needs:**
  - Clear understanding of whether they qualify without bureaucratic hurdles.
  - Transparent monthly repayment estimates before committing.
  - Exact knowledge of which office or bank branch to visit.
  - A definitive, printable document checklist so they do not waste trips.

---

## 5. Core Value Propositions

1. **Conversational Input, Deterministic Precision:** Users describe their needs in everyday language. Gemini structures the request, but our deterministic rule engine makes the authoritative eligibility decision.
2. **Transparent "Why":** No opaque "AI Match Percentages" (e.g., "94% AI Fit"). The user is shown clear, explainable reasons: *"Eligible because your annual family income is under ₹5,00,000, requested loan of ₹1,20,000 is within the ₹1,25,000 ceiling, and tailoring is an eligible micro-enterprise."*
3. **Dynamic Universal Financial Comparison:** Users can compare eligible schemes side-by-side. Adjusting loan amount or tenure recalculates all compared schemes in real-time.
4. **Interactive Natural Language "What-If" Assistant:** A non-intrusive floating assistant allows users to ask colloquial scenario questions (*"What if I borrow ₹80,000 instead?"*). Gemini interprets the parameters, the financial engine recalculates, and the UI provides instant before/after clarity.
5. **Hyperlocal Partner Discovery:** Connected map and card views linking the selected scheme to verified physical channel partners (SCAs, PSBs, RRBs, etc.) in the user's city/district.
6. **Takeaway Action Plan:** Dynamically generated PDF checklist containing specific scheme details, selected partner contact info, exact document requirements, and step-by-step guidance.

---

## 6. Detailed Feature Capabilities

### Feature 1: AI Scheme Matching (Screen 2)
- Natural language requirement input box.
- Structured parameter extraction via Gemini (loan purpose, business type, amount, income, location, education status).
- User review & edit form for extracted values (ensuring user agency).
- Deterministic Rule Engine verification against MongoDB scheme collection.
- Deterministic ranking of eligible schemes with human-readable rationale tags.

### Feature 2: Side-by-Side Scheme Comparison & Universal Calculator (Screen 3)
- Comparison matrix of up to 3 selected schemes.
- Global loan amount and tenure controls that simultaneously update all compared schemes.
- Deterministic financial output: Monthly EMI, Total Repayment, Total Interest, Interest Rate, Repayment Period, Moratorium, Max Loan Limit.
- Highlighting differences in interest rate, tenure, and moratorium grace periods.

### Feature 3: Floating "What-If" AI Assistant (Screen 3)
- Compact, unobtrusive message drawer docked at the bottom of the comparison view.
- Natural language query parser: converts conversational questions into simulation deltas.
- Real-time recalculation using the Financial Engine.
- Simple, human explanation of financial impact without duplicating the comparison table.
- Direct "Apply this scenario" action button to commit parameters to the universal calculator.

### Feature 4: Channel Partner Discovery (Screen 4)
- Convergent navigation: accessible both directly from matching (Path A) and post-comparison (Path B).
- Filtered to display only channel partners authorized for the chosen scheme in the user's vicinity.
- Interactive Google Maps integration with bi-directional synchronization (clicking list card highlights map marker; clicking map pin highlights card).
- Dual viewports: Compact map mode (partner list prioritized) and Expanded map mode (map canvas prioritized).

### Feature 5: Documents, Application Guidance & Dynamic PDF (Screen 5)
- Scheme-specific document checklist categorized into Identity, Income/Caste, and Business/Project records.
- Official step-by-step application guidance specific to the selected channel partner type.
- On-the-fly server-side generation of `ALIGN Application Checklist.pdf` pre-filled with user requirement, scheme terms, partner address, checklist, and official source links.

### Feature 6: Scheme-Specific AI Assistant with Grounded RAG (Screen 5)
- Context-aware Q&A drawer.
- Hierarchical query routing:
  1. Checks structured MongoDB scheme/partner fields first.
  2. If absent, triggers Pinecone/LangChain RAG over verified official scheme circulars.
  3. Strict attribution with official citation links.

---

## 7. Success Criteria & Evaluation Metrics

1. **Deterministic Accuracy:** 0% rate calculation errors; 100% adherence to defined scheme loan ceilings and income thresholds.
2. **Zero Hallucinated Rules:** Rule decisions must strictly match rule engine code logic; LLM never outputs an authoritative `eligible: true/false`.
3. **End-to-End Latency:** 
   - Requirement extraction: < 2.0s
   - Rule engine evaluation: < 50ms
   - Financial calculation: < 5ms
   - RAG query response: < 3.0s
4. **Usability & Clarity:** Complete demo scenario executable in under 3 minutes by an SIH judge without prior training.

---

## 8. Open Decisions

| # | Item | Details | Proposed Resolution |
| :--- | :--- | :--- | :--- |
| OD-1 | Cross-Category Tenure Comparison | When comparing a Micro Finance loan (max 3 yrs) with an Educational loan (up to 12 yrs), a 5-year slider setting exceeds the Micro Finance limit. | Universal calculator should bound each scheme to its respective `maxTenure` and show a visible warning badge: *"Tenure capped at scheme maximum (36 months)"*. |
| OD-2 | Tiered Partner Interest Rates | Schemes like Udyam Nidhi Yojana have varying interest rates (13% via Cooperative Banks, 15% via SFBs). | Display baseline rate (13%) or range (13%–15%) on comparison screen; lock exact rate once specific partner is selected on Screen 4. |
| OD-3 | PDF Engine Selection | PDFKit (pure JS, headless, lightweight) vs Puppeteer (Chromium HTML-to-PDF). | Recommended: PDFKit or `@react-pdf/renderer` for lightweight, reliable server-side execution without Chromium browser dependencies in hackathon deployment. |
