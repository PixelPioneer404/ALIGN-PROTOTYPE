# ALIGN — SIH 2026 Judge Demonstration Script & Walkthrough

## 1. Demo Narrative Overview

* **Persona:** Kishore Sen, a 32-year-old aspiring tailor from Kolkata.
* **Goal:** Secure financial assistance to purchase industrial sewing machines and working capital for a new tailoring unit.
* **Household Income:** ₹3,00,000 / year (qualifying under the revised ₹5,00,000 NSFDC income threshold).
* **Funding Need:** ₹1,20,000.
* **Live Query String:**
  > *"I need ₹1.2 lakh to start a tailoring business. My family income is around ₹3 lakh and I live in Kolkata."*

---

## 2. Minute-by-Minute Stage Walkthrough

### Stage 1: Screen 1 — The Approachable Landing Page (0:00 - 0:30)
* **What the Judge Sees:**
  - A warm, serene, human-centered interface (linen/warm stone background, deep forest green branding, crisp charcoal typography).
  - Clear trust banner: *"AI interprets. Deterministic code calculates and decides."*
  - Prominent primary CTA button: **`Find a Scheme`**.
* **Presenter Script:**
  > *"Good morning, esteemed jury. This is ALIGN. Marginalized entrepreneurs face a crippling barrier when trying to access government-backed financial assistance: opaque eligibility rules, hundreds of disconnected channel partners, and the constant threat of AI hallucinations when asking generic chatbots for financial advice. ALIGN changes this. Let's see how Kishore, an aspiring tailor from Kolkata, finds and plans his government financial assistance in less than three minutes."*
* **Action:** Presenter clicks **`Find a Scheme`**.

---

### Stage 2: Screen 2 — AI Requirement Extraction & Deterministic Matching (0:30 - 1:15)
* **What the Judge Sees:**
  - Large consultation prompt box.
  - Presenter pastes or types the exact prompt:
    *"I need ₹1.2 lakh to start a tailoring business. My family income is around ₹3 lakh and I live in Kolkata."*
  - Presenter clicks **`Analyze My Need`**.
  - **Structured Review Card Appears:**
    - Purpose: `Business`
    - Business Type: `Tailoring`
    - Funding Required: `₹1,20,000`
    - Annual Family Income: `₹3,00,000`
    - Location: `Kolkata`
  - Presenter highlights: *"Notice that the user is in complete control. If Gemini misheard an amount, the user can review and edit these fields directly before any calculation occurs."*
  - Presenter clicks **`Check Eligibility & Find Schemes`**.
  - **Results Matrix Appears:**
    - 3 schemes returned, ranked deterministically:
      1. **NSFDC Micro Finance Scheme** (Rank #1, 6.5% interest, max ₹1.25L)
      2. **Aajeevika Micro-Finance Yojana** (Rank #2, 15% interest, max ₹1.25L)
      3. **NSFDC Term Loan Scheme** (Rank #3, 8% interest, up to ₹45L)
  - Presenter highlights: *"Look at the rationale badges. There are no arbitrary '94% AI match' percentages. Instead, ALIGN shows explainable rules: 'Family income is within the ₹5L ceiling', 'Requested amount fits the ₹1.25L limit', and 'Tailoring is an approved vocational trade'."*
* **Action:** Presenter checks checkboxes for all 3 schemes and clicks **`Compare Schemes (3)`** (entering **Path B**).

---

### Stage 3: Screen 3 — Universal Financial Comparison & What-If Simulation (1:15 - 2:05)
* **What the Judge Sees:**
  - Side-by-side 3-column financial matrix.
  - Sticky Universal Calculator at top, initialized at `Loan Amount: ₹1,20,000` and `Tenure: 36 Months`.
  - Column 1 (Micro Finance): **₹3,678 / month** | Total Repay: ₹1,32,422 | Interest: ₹12,422 (6.5%)
  - Column 2 (Aajeevika MF): **₹4,160 / month** | Total Repay: ₹1,49,754 | Interest: ₹29,754 (15.0%)
  - Column 3 (Term Loan): **₹3,760 / month** | Total Repay: ₹1,35,373 | Interest: ₹15,373 (8.0%)
* **Presenter Interaction 1 (Direct Calculation):**
  - Presenter slides the loan amount slider down to **₹80,000**.
  - **Live Result:** In under 5 milliseconds, all three columns recalculate deterministically!
  - Micro Finance EMI drops to **₹2,452 / month**.
  - Presenter notes: *"This calculation happens in pure, auditable JavaScript code. Gemini is not computing these numbers."*
* **Presenter Interaction 2 (Conversational What-If):**
  - Presenter clicks into the docked What-If Assistant at the bottom of the screen.
  - Types: *"What if I repay over 5 years?"*
  - Assistant expands upward smoothly with an plain-language explanation:
    *"Extending tenure to 5 years lowers the monthly installment on Term Loan to ₹2,433. Note that the Micro Finance Scheme has a statutory maximum tenure of 3 years (36 months), so it remains capped at 36 months."*
  - Clear before/after delta badge shown.
  - Presenter clicks **`Apply this scenario`**, then selects **NSFDC Micro Finance Scheme** by clicking **`Select This Scheme`**.

---

### Stage 4: Screen 4 — Hyperlocal Channel Partner Discovery (2:05 - 2:40)
* **What the Judge Sees:**
  - Selected scheme carried forward: *NSFDC Micro Finance Scheme (6.5%)*.
  - Location pre-set to *Kolkata, West Bengal*.
  - Left pane displays authorized local channel partners:
    1. **West Bengal SC, ST & OBC Development & Finance Corp (WBSCSTDFCL)** — SCA, Bikash Bhavan, Salt Lake.
    2. **Punjab National Bank — BBD Bagh Branch** — PSB, Dalhousie.
    3. **Bangiya Gramin Vikash Bank** — RRB, Barasat.
  - Right pane renders interactive Google Map with customized markers.
* **Presenter Interaction:**
  - Presenter clicks the WBSCSTDFCL card $\rightarrow$ map smoothly pans and highlights the Bikash Bhavan pin.
  - Presenter clicks **`Expand Map`** button $\rightarrow$ map smoothly transitions to 80% screen width.
  - Presenter clicks **`Compact Map`** to restore split view.
  - Selects WBSCSTDFCL and clicks **`Continue to Application Guidance`**.

---

### Stage 5: Screen 5 — Guidance, Checklist PDF & Grounded Assistant (2:40 - 3:30)
* **What the Judge Sees:**
  - Application Readiness Summary: Scheme (*Micro Finance*), Partner (*WBSCSTDFCL Bikash Bhavan*), Monthly EMI (*₹3,678*).
  - Categorized Checklist: Identity (Aadhaar/Voter ID), Caste Certificate, Income Certificate issued by SDO/BDO confirming income $\le$ ₹5,00,000, Quotation for sewing machines, Bank passbook copy.
  - Step-by-step physical submission workflow.
* **Presenter Action 1: Dynamic PDF Download:**
  - Presenter clicks **`Download Personalized Checklist PDF`**.
  - Browser instantly downloads `ALIGN-Application-Checklist-MicroFinance.pdf`.
  - Presenter opens it: shows custom ALIGN letterhead, borrower details, exact WBSCSTDFCL nodal officer phone number, step-by-step guidance, and official `nsfdc.nic.in` reference URLs.
* **Presenter Action 2: Grounded Scheme Assistant:**
  - In the embedded chat drawer, presenter asks:
    *"Can I apply without an income certificate?"*
  - **System Execution:**
    - Checks MongoDB structured fields $\rightarrow$ confirms income certificate is mandatory.
    - Synthesizes grounded answer:
      *"No, an official income certificate is mandatory for the NSFDC Micro Finance Scheme. It must be issued by a competent authority (SDO, BDO, or Revenue Officer) certifying that your annual household income is under ₹5,00,000."*
    - Clickable citation link: `NSFDC Lending Policy Circular Clause 4.2`.
* **Presenter Concluding Statement:**
  > *"ALIGN delivers the best of both worlds: the natural language empathy of modern AI, anchored by the rigorous mathematical and statutory truth of deterministic code. Thank you."*

---

## 3. Judge Q&A Anticipation & Strategy

| Judge Question | Winning Architectural Response |
| :--- | :--- |
| **"Why not just let ChatGPT or Gemini answer everything directly?"** | *"Because LLMs are probabilistic token predictors. In microfinance, an LLM hallucinating an interest rate of 12% instead of the subsidized 6.5%, or hallucinating that an income certificate isn't needed, causes real borrowers to be rejected or suffer financial distress. In ALIGN, Gemini only parses text; our deterministic rule engine and financial engine execute all calculations and eligibility checks."* |
| **"Where do you get the scheme data? Is it scraped or hardcoded?"** | *"Our scheme catalog is stored in MongoDB and modeled directly on verified statutory circulars from apex corporations like NSFDC. Every scheme record contains provenance metadata: official circular title, issuing ministry, and direct URL."* |
| **"Can borrowers submit the loan application through ALIGN?"** | *"No, and that is an intentional regulatory boundary. ALIGN is a decision-support and discovery tool. Apex corporations require physical submission and biometric/KYC verification through authorized channel partners (SCAs/Banks). ALIGN prepares the borrower so their physical visit is successful on the very first try."* |
| **"What if the user's family income is ₹6,00,000?"** | *"The Rule Engine flags a violation: family income exceeds the ₹5,00,000 ceiling for NSFDC microfinance. The user is clearly told why they are ineligible and guided toward general MSME schemes like PMEGP or MUDRA."* |
