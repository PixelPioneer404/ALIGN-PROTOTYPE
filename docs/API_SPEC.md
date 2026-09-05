# ALIGN — REST API Specification

## 1. Overview & Architectural Conventions

The ALIGN Backend exposes a stateless RESTful JSON API. All mutating endpoints validate payloads against strict schemas before executing business logic.

### Base URL
`/api`

### Global HTTP Status Codes
* `200 OK`: Request succeeded with data.
* `201 Created`: Resource created successfully.
* `400 Bad Request`: Schema validation failed, missing required fields, or unparseable JSON.
* `404 Not Found`: Scheme, partner, or route not found.
* `422 Unprocessable Entity`: Business rule logic constraint violation.
* `500 Internal Server Error`: Unhandled exception or downstream service failure (e.g. Gemini API timeout).

### Standard Error Response Envelope
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Field 'amount' must be a positive number.",
    "details": []
  },
  "timestamp": "2026-09-04T22:15:00.000Z"
}
```

---

## 2. API Endpoints

### 2.1 Natural Language Requirement Extraction
#### `POST /api/analyze-requirement`
* **Purpose:** Takes colloquial user natural language input, invokes Gemini with strict JSON Schema constraints, and returns a verified structured requirement object.
* **Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "prompt": "I need ₹1.2 lakh to start a tailoring business. My family income is around ₹3 lakh and I live in Kolkata."
}
```
* **Validation Rules:**
  - `prompt`: String, required, minimum length 10 characters, maximum length 500 characters.
* **Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "purpose": "business",
    "businessType": "tailoring",
    "amount": 120000,
    "annualFamilyIncome": 300000,
    "location": "Kolkata",
    "educationStatus": null,
    "extractedAt": "2026-09-04T22:15:00.000Z"
  }
}
```
* **Error Response (`400 Bad Request`):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_PROMPT",
    "message": "Prompt is too short to extract meaningful requirements."
  }
}
```

---

### 2.2 Scheme Eligibility Matching & Ranking
#### `POST /api/schemes/match`
* **Purpose:** Executes the deterministic Rule Engine across MongoDB scheme records using the validated user requirements, followed by the deterministic Ranking Engine.
* **Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "purpose": "business",
  "businessType": "tailoring",
  "amount": 120000,
  "annualFamilyIncome": 300000,
  "location": "Kolkata",
  "educationStatus": null
}
```
* **Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "totalEligible": 3,
    "rankedSchemes": [
      {
        "scheme": {
          "_id": "SCHEME-NSFDC-MF-01",
          "name": "NSFDC Micro Finance Scheme",
          "shortName": "Micro Finance Scheme",
          "category": "microfinance",
          "interestRate": 6.5,
          "maxLoanAmount": 125000,
          "maxTenureMonths": 36,
          "moratoriumMonths": 3
        },
        "score": 95,
        "eligible": true,
        "recommendationRationale": "Best match for micro-enterprises with lowest concessional interest rate (6.5%)",
        "reasons": [
          "Annual family income ₹3,00,000 is within ceiling limit of ₹5,00,000",
          "Requested loan ₹1,20,000 is within max limit of ₹1,25,000",
          "Business type (tailoring) is eligible under microfinance guidelines"
        ]
      },
      {
        "scheme": {
          "_id": "SCHEME-NSFDC-AMFY-02",
          "name": "Aajeevika Micro-Finance Yojana",
          "shortName": "Aajeevika MF Yojana",
          "category": "microfinance",
          "interestRate": 15.0,
          "maxLoanAmount": 125000,
          "maxTenureMonths": 36,
          "moratoriumMonths": 3
        },
        "score": 78,
        "eligible": true,
        "recommendationRationale": "Eligible for microfinance, but carries a higher interest rate (15.0%)",
        "reasons": [
          "Annual family income within ceiling",
          "Loan amount within limit"
        ]
      },
      {
        "scheme": {
          "_id": "SCHEME-NSFDC-TL-03",
          "name": "NSFDC Term Loan Scheme",
          "shortName": "Term Loan",
          "category": "term_loan",
          "interestRate": 8.0,
          "maxLoanAmount": 4500000,
          "maxTenureMonths": 84,
          "moratoriumMonths": 6
        },
        "score": 72,
        "eligible": true,
        "recommendationRationale": "Higher loan headroom and longer repayment tenure up to 7 years",
        "reasons": [
          "Covers business enterprise costs",
          "Annual family income within ceiling"
        ]
      }
    ]
  }
}
```

---

### 2.3 Scheme Catalog
#### `GET /api/schemes`
* **Purpose:** Retrieve all active scheme records.
* **Query Params:** `category` (optional), `limit` (optional, default 10).
* **Success Response (`200 OK`):**
```json
{
  "success": true,
  "count": 5,
  "data": [ /* Array of Scheme objects */ ]
}
```

#### `GET /api/schemes/:id`
* **Purpose:** Fetch full details of a specific scheme.
* **Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "_id": "SCHEME-NSFDC-MF-01",
    "name": "NSFDC Micro Finance Scheme",
    "interestRate": 6.5,
    "maxLoanAmount": 125000,
    "documents": [ /* ... */ ],
    "applicationProcess": [ /* ... */ ]
  }
}
```
* **Error Response (`404 Not Found`):** Scheme ID does not exist.

---

### 2.4 Deterministic Financial Engine
#### `POST /api/financial/calculate`
* **Purpose:** Pure deterministic financial calculation of monthly EMI, total repayment, and total interest for one or more schemes simultaneously.
* **Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "loanAmount": 120000,
  "tenureMonths": 36,
  "schemeIds": ["SCHEME-NSFDC-MF-01", "SCHEME-NSFDC-AMFY-02", "SCHEME-NSFDC-TL-03"]
}
```
* **Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "loanAmount": 120000,
    "requestedTenureMonths": 36,
    "calculations": [
      {
        "schemeId": "SCHEME-NSFDC-MF-01",
        "schemeName": "NSFDC Micro Finance Scheme",
        "interestRate": 6.5,
        "effectiveTenureMonths": 36,
        "monthlyEMI": 3678.38,
        "totalRepayment": 132421.68,
        "totalInterest": 12421.68,
        "moratoriumMonths": 3,
        "tenureCapped": false
      },
      {
        "schemeId": "SCHEME-NSFDC-AMFY-02",
        "schemeName": "Aajeevika Micro-Finance Yojana",
        "interestRate": 15.0,
        "effectiveTenureMonths": 36,
        "monthlyEMI": 4159.84,
        "totalRepayment": 149754.24,
        "totalInterest": 29754.24,
        "moratoriumMonths": 3,
        "tenureCapped": false
      },
      {
        "schemeId": "SCHEME-NSFDC-TL-03",
        "schemeName": "NSFDC Term Loan Scheme",
        "interestRate": 8.0,
        "effectiveTenureMonths": 36,
        "monthlyEMI": 3760.36,
        "totalRepayment": 135372.96,
        "totalInterest": 15372.96,
        "moratoriumMonths": 6,
        "tenureCapped": false
      }
    ]
  }
}
```

---

### 2.5 What-If AI Simulation Engine
#### `POST /api/financial/what-if`
* **Purpose:** Takes a natural language scenario query (e.g., *"What if I borrow ₹80,000?"* or *"What if I repay over 5 years?"*), parses the modified parameters using Gemini, recalculates values via the Financial Engine, and synthesizes a concise human explanation.
* **Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "currentScenario": {
    "loanAmount": 120000,
    "tenureMonths": 36,
    "schemeIds": ["SCHEME-NSFDC-MF-01", "SCHEME-NSFDC-AMFY-02", "SCHEME-NSFDC-TL-03"]
  },
  "query": "What if I reduce my loan to ₹80,000?"
}
```
* **Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "parsedDelta": {
      "loanAmount": 80000,
      "tenureMonths": 36
    },
    "calculations": [
      {
        "schemeId": "SCHEME-NSFDC-MF-01",
        "schemeName": "NSFDC Micro Finance Scheme",
        "previousEMI": 3678.38,
        "newEMI": 2452.25,
        "emiDelta": -1226.13,
        "previousTotalInterest": 12421.68,
        "newTotalInterest": 8281.00,
        "interestDelta": -4140.68,
        "tenureCapped": false
      },
      {
        "schemeId": "SCHEME-NSFDC-AMFY-02",
        "schemeName": "Aajeevika Micro-Finance Yojana",
        "previousEMI": 4159.84,
        "newEMI": 2773.23,
        "emiDelta": -1386.61,
        "previousTotalInterest": 29754.24,
        "newTotalInterest": 19836.28,
        "interestDelta": -9917.96,
        "tenureCapped": false
      }
    ],
    "explanation": "Reducing your loan amount to ₹80,000 lowers your monthly EMI across all options by approximately ₹1,226 to ₹1,386 and cuts your total interest burden by over ₹4,000 on the Micro Finance Scheme.",
    "applyPayload": {
      "loanAmount": 80000,
      "tenureMonths": 36
    }
  }
}
```

---

### 2.6 Channel Partner Discovery
#### `GET /api/partners`
* **Purpose:** List verified channel partners.
* **Query Params:** `city` (string), `state` (string), `type` (SCA, PSB, RRB, NBFC-MFI, etc.), `schemeId` (string).
* **Success Response (`200 OK`):** Returns array of matching channel partners with geo-coordinates.

#### `GET /api/schemes/:id/partners`
* **Purpose:** Fetch channel partners authorized specifically for the selected scheme, optionally filtered by user location.
* **Query Params:** `city` (e.g. `Kolkata`).
* **Success Response (`200 OK`):**
```json
{
  "success": true,
  "schemeId": "SCHEME-NSFDC-MF-01",
  "location": "Kolkata",
  "count": 3,
  "data": [
    {
      "_id": "PARTNER-KOL-SCA-01",
      "name": "West Bengal SC, ST & OBC Development & Finance Corporation",
      "type": "SCA",
      "address": "Bikash Bhavan, Sector 1, Bidhannagar, Kolkata 700091",
      "location": { "type": "Point", "coordinates": [88.4172, 22.5867] },
      "contact": { "phone": "+91 33 2334 1234", "nodalOfficerName": "Debabrata Sen" },
      "status": "active"
    },
    {
      "_id": "PARTNER-KOL-PSB-02",
      "name": "Punjab National Bank — BBD Bagh Branch",
      "type": "PSB",
      "address": "8 Council House Street, Dalhousie, Kolkata 700001",
      "location": { "type": "Point", "coordinates": [88.3478, 22.5697] },
      "contact": { "phone": "+91 33 2248 5678", "nodalOfficerName": "Priyanka Mukherjee" },
      "status": "active"
    }
  ]
}
```

---

### 2.7 Documents & Application Guidance
#### `GET /api/schemes/:id/documents`
* **Purpose:** Get structured document checklist required for the scheme.
* **Success Response (`200 OK`):** Returns categorized list of mandatory and supporting documents.

#### `GET /api/schemes/:id/application-guidance`
* **Purpose:** Get official step-by-step roadmap for taking the application forward.
* **Success Response (`200 OK`):** Returns sequence of steps, issuing authority tips, and timeline guidance.

---

### 2.8 Dynamic PDF Checklist Generation
#### `POST /api/pdf/application-checklist`
* **Purpose:** Generates a personalized, publication-grade PDF checklist dynamically on the server and streams it back to the client.
* **Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "schemeId": "SCHEME-NSFDC-MF-01",
  "partnerId": "PARTNER-KOL-SCA-01",
  "userRequirement": {
    "purpose": "business",
    "businessType": "tailoring",
    "amount": 120000,
    "annualFamilyIncome": 300000,
    "location": "Kolkata"
  },
  "financialSummary": {
    "loanAmount": 120000,
    "tenureMonths": 36,
    "monthlyEMI": 3678.38,
    "interestRate": 6.5
  }
}
```
* **Response:**
  - `Content-Type: application/pdf`
  - `Content-Disposition: attachment; filename="ALIGN-Application-Checklist-MicroFinance.pdf"`
  - Binary stream of the dynamically generated PDF.

---

### 2.9 Scheme-Specific AI Assistant (Hierarchical RAG)
#### `POST /api/assistant/question`
* **Purpose:** Answers user questions regarding scheme rules, documents, and procedures. Checks structured MongoDB data first; if absent, invokes Pinecone RAG over official circulars.
* **Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "schemeId": "SCHEME-NSFDC-MF-01",
  "partnerId": "PARTNER-KOL-SCA-01",
  "question": "Can I apply without an income certificate?"
}
```
* **Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "answer": "No, an income certificate is a mandatory requirement for the NSFDC Micro Finance Scheme. You must obtain an official family income certificate issued by a competent state authority (such as an SDO, BDO, or Revenue Officer) certifying that your annual family income is within ₹5,00,000. If you are a member of a self-help group with pre-verified BPL records, you may present that documentation to your channel partner for initial screening.",
    "sourceType": "structured_rules_and_rag",
    "citations": [
      {
        "title": "NSFDC Eligibility & Documentation Circular 2024",
        "section": "Clause 4.2 - Proof of Income Ceiling",
        "url": "https://nsfdc.nic.in/en/schemes/micro-credit"
      }
    ],
    "disclaimer": "Procedures may vary across channel partner branches. Please confirm with your branch officer at WBSCSTDFCL Bikash Bhavan."
  }
}
```

---

## 3. Open Decisions

| ID | Issue | Detail | Proposed Resolution |
| :--- | :--- | :--- | :--- |
| OD-API1 | Session ID in Requests | Should we attach a demo session header e.g. `x-align-session-id`? | Yes, pass a lightweight client-generated UUID `x-align-session-id` to enable request logging and future analytics without requiring full authentication. |
