# ALIGN — AI-Assisted Financial Scheme Discovery & Decision Support

> **Smart India Hackathon (SIH 2026)**  
> **Platform for Marginalized Entrepreneurs**

---

```
┌─────────────────────────────────────────────────────────────┐
│                    CORE PRODUCT PRINCIPLE                   │
│                                                             │
│       AI interprets.                                        │
│       Code decides.                                         │
│       Code calculates.                                      │
│       Database stores.                                      │
│       RAG retrieves.                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. Executive Overview

**ALIGN** is an AI-assisted financial scheme discovery and decision-support platform engineered specifically for marginalized entrepreneurs in India (such as artisans, tailors, street vendors, and micro-business owners qualifying under NSFDC, NBCFDC, and State Channelising Agencies).

Rather than forcing users to navigate complex bureaucratic circulars and confusing banking jargon, ALIGN allows entrepreneurs to express their financial need in natural language. ALIGN extracts structured requirements, tests them against deterministic government scheme rules, performs side-by-side comparative financial simulations, links users to authorized local channel partners with interactive maps, provides structured application guidance, and generates a personalized application checklist PDF.

### Regulatory & Operational Boundaries
- **ALIGN is NOT a government loan submission portal.**
- **ALIGN does NOT approve loans or issue credit scores.**
- **ALIGN provides decision support, financial transparency, and navigation guidance.**

---

## 2. Current Status

**Current Milestone:** `Implementation Complete & Verified (All Milestones 1-14 Passed)`  
**End-to-End Demo Script:** Automated test `server/test/demoScenario.test.js` executed with 100% pass rate across all 23 steps.

---

## 3. Documentation Map

Every subsystem, data schema, and UI component is documented in detail within the [`docs/`](docs/) directory:

| Document | Description |
| :--- | :--- |
| [**`PRODUCT_SPEC.md`**](docs/PRODUCT_SPEC.md) | Product vision, target persona, problem statement, core value propositions, success criteria, and non-goals. |
| [**`USER_FLOW.md`**](docs/USER_FLOW.md) | Comprehensive 5-screen user journey covering both **Path A (Direct Selection)** and **Path B (Comparison & What-If)**. |
| [**`ARCHITECTURE.md`**](docs/ARCHITECTURE.md) | Full system architecture, layer diagrams, sequence charts, deterministic vs AI boundaries, and security safeguards. |
| [**`DATA_MODEL.md`**](docs/DATA_MODEL.md) | MongoDB Mongoose schemas for schemes, channel partners, user requirements, and verified seed data for 5 government schemes. |
| [**`API_SPEC.md`**](docs/API_SPEC.md) | Complete REST API endpoint contracts, request/response JSON payloads, validation rules, and error handling. |
| [**`FINANCIAL_ENGINE.md`**](docs/FINANCIAL_ENGINE.md) | Actuarial reducing-balance EMI mathematical formulas, moratorium logic, constraint capping, and reference TypeScript implementation. |
| [**`AI_AND_RAG.md`**](docs/AI_AND_RAG.md) | Gemini requirement extraction schemas, what-if conversational delta parsing, hierarchical RAG routing, and anti-hallucination guardrails. |
| [**`DESIGN_IMPLEMENTATION.md`**](docs/DESIGN_IMPLEMENTATION.md) | Google Stitch design system translated to React & Tailwind CSS (colors, typography, cards, calculators, maps, and motion). |
| [**`DEMO_SCENARIO.md`**](docs/DEMO_SCENARIO.md) | Minute-by-minute SIH judge walkthrough using the tailoring demo persona in Kolkata, with jury Q&A strategy. |
| [**`MVP_SCOPE.md`**](docs/MVP_SCOPE.md) | MoSCoW feature classification (Must Have, Should Have, Nice to Have, Out of Scope) and implementation phasing. |

---

## 4. Technology Stack

### Frontend
- **Framework:** React 18 (Vite)
- **Styling:** Tailwind CSS with Google Stitch warm institutional clarity design tokens
- **Routing:** React Router v6
- **Icons:** Lucide React & Google Material Symbols Outlined
- **State:** React Context (`AlignStateContext`) synchronized with `sessionStorage`

### Backend
- **Runtime:** Node.js (LTS v20+)
- **Framework:** Express.js (REST API)
- **Database:** MongoDB & Mongoose (with in-memory fallback for offline resilience)
- **PDF Engine:** PDFKit (server-side dynamic PDF generation)
- **AI & RAG:** Google Gemini API (`@google/generative-ai`) with strict JSON schema constraints

---

## 5. Getting Started & Running the Application

### Prerequisites
- Node.js (v18 or higher)
- npm

### Launch Commands
```bash
# 1. Start Backend Server (runs on http://localhost:5001)
cd server
npm start

# 2. In a separate terminal, start Frontend Development Server (runs on http://localhost:5173)
cd client
npm run dev
```

### Running the End-to-End Automated Test
```bash
cd server
node test/demoScenario.test.js
```

---

## 6. Architectural Guarantees & Safeguards

1. **Zero Math Hallucinations:** Generative AI is prohibited from computing EMIs, interest totals, or amortization figures. All calculations run through `FINANCIAL_ENGINE.md`.
2. **Zero Eligibility Hallucinations:** The Rule Engine deterministically tests statutory limits (such as family income ceilings $\le$ ₹5,00,000 and loan amount limits $\le$ ₹1,25,000). The LLM never decides whether an applicant is eligible.
3. **Transparent Reasoning:** Every recommendation is accompanied by explainable statutory reasons rather than opaque "AI match percentages".
4. **Resilience During Hackathon Demos:** A dedicated `USE_MOCK_AI` toggle guarantees that network dropouts or API rate limits at the hackathon venue cannot break the live presentation.
