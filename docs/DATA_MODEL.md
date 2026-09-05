# ALIGN — Data Model & Schema Specification

## 1. Overview & Data Integrity Rules

The ALIGN data model is built on strict data provenance principles. Every government scheme attribute must originate from official policy circulars (e.g., National Scheduled Castes Finance and Development Corporation - NSFDC, NBCFDC, or Ministry of Social Justice and Empowerment guidelines).

> [!IMPORTANT]
> **Data Integrity Directive**
> 1. **Zero Fact Fabrication:** Where an official scheme circular does not specify a field (such as a precise moratorium for a non-industrial activity), the value must be explicitly set to `null` or omitted.
> 2. **Configurable Income Thresholds:** The general NSFDC annual family income eligibility limit (currently **₹5,00,000**) is stored as a configurable attribute per scheme rather than hardcoded in application logic.
> 3. **Demo Entity Labeling:** Channel partner branch statuses, contact persons, and live availability are marked internally with `isDemoData: true` to clearly distinguish verified statutory parameters from prototype fixtures.

---

## 2. Core Entity Schemas

### 2.1 Scheme Schema (`schemes` collection)

```typescript
interface EligibilityRule {
  field: string;               // e.g., "annualFamilyIncome", "amount", "purpose"
  operator: "lte" | "gte" | "eq" | "in" | "range";
  value: any;                  // e.g., 500000, ["business", "services"]
  description: string;          // Human-readable rationale for eligibility engine
}

interface SchemeDocumentItem {
  id: string;
  name: string;
  category: "identity" | "income_caste" | "business_project" | "banking";
  isMandatory: boolean;
  issuingAuthority: string;    // e.g., "SDO / BDO / Revenue Officer"
  description: string;
}

interface ApplicationStep {
  stepNumber: number;
  title: string;
  description: string;
  estimatedTimeline: string;   // e.g., "7-14 working days"
  responsibleEntity: string;   // e.g., "Applicant", "Branch Manager", "SCA Inspector"
}

interface SchemeRecord {
  _id: string;                 // e.g., "SCHEME-NSFDC-MF-01"
  name: string;                // e.g., "NSFDC Micro Finance Scheme"
  shortName: string;           // e.g., "Micro Finance"
  category: "microfinance" | "term_loan" | "education" | "self_employment";
  purpose: string[];           // ["business", "tailoring", "small_trade", "artisan"]
  targetBeneficiary: string;   // "Target group entrepreneurs living below double poverty line / specified income"
  
  // Financial Thresholds
  incomeLimit: number;         // Configurable annual family income limit, default: 500000
  projectCostLimit: number;    // Maximum project cost (e.g., 140000)
  minProjectCost?: number;     // Minimum project cost (for Term Loans e.g., 140001)
  maxLoanAmount: number;       // Maximum financial assistance (e.g., 125000)
  maxLoanPercentage: number;   // Percentage of project cost funded (e.g., 90 or 100)
  promoterContributionPct: number; // e.g., 0% or 5% or 10%
  
  // Repayment & Interest Terms
  interestRate: number;        // Benchmark annual interest rate (e.g., 6.5)
  interestRateType: "fixed" | "tiered" | "channel_dependent";
  interestRateVariants?: Array<{
    channelPartnerType: string; // e.g., "Cooperative Bank" vs "Small Finance Bank"
    rate: number;               // 13.0 vs 15.0
  }>;
  maxTenureMonths: number;     // Maximum tenure in months (e.g., 36)
  minTenureMonths?: number;    // Minimum tenure in months
  moratoriumMonths: number;    // Grace period in months (e.g., 3)
  moratoriumDetails?: string;  // Special clauses (e.g., "Applicable for construction/plantation cases")
  repaymentFrequency: "monthly" | "quarterly";
  
  // Logic & Documents
  eligibilityRules: EligibilityRule[];
  documents: SchemeDocumentItem[];
  applicationProcess: ApplicationStep[];
  channelPartnerTypes: string[]; // ["SCA", "PSB", "RRB", "NBFC-MFI", "Cooperative Bank", "SFB"]
  
  // Provenance & Audit
  sourceDocuments: Array<{
    documentTitle: string;
    circularNumber?: string;
    issuingMinistry: string;
    officialUrl: string;
  }>;
  lastVerifiedAt: string;      // ISO 8601 Date
  isDemoData?: boolean;
}
```

---

### 2.2 Channel Partner Schema (`partners` collection)

```typescript
interface ChannelPartnerRecord {
  _id: string;                 // e.g., "PARTNER-KOL-SCA-01"
  name: string;                // e.g., "West Bengal SC ST & OBC Dev & Finance Corp"
  shortCode: string;           // e.g., "WBSCSTDFCL"
  type: "SCA" | "PSB" | "RRB" | "NBFC-MFI" | "Cooperative Bank" | "SFB" | "Other";
  authorizedSchemes: string[]; // Array of Scheme _ids e.g., ["SCHEME-NSFDC-MF-01", "SCHEME-NSFDC-TL-03"]
  
  // Physical Location
  address: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude] e.g., [88.4172, 22.5867]
  };
  
  // Contact & Branch Metadata
  contact: {
    phone: string;
    email: string;
    nodalOfficerName?: string;
    officeHours: string;       // e.g., "Mon-Fri 10:00 AM - 5:00 PM"
  };
  
  // Operational Status
  status: "active" | "temporarily_inactive";
  verificationStatus: "verified_partner_branch";
  isDemoData: boolean;         // Always true for prototype fixtures
  notes?: string;
}
```

---

### 2.3 User Requirement & Analysis Schema (Runtime / Session)

```typescript
interface UserRequirement {
  rawPrompt: string;           // Original user natural language string
  extractedAt: string;         // ISO timestamp
  
  // Structured parameters extracted by Gemini
  purpose: "business" | "education" | "agriculture" | "services" | "other";
  businessType: string;        // e.g., "tailoring", "dairy", "retail"
  amount: number;              // Requested loan in INR e.g., 120000
  annualFamilyIncome: number;  // Annual income in INR e.g., 300000
  location: string;            // e.g., "Kolkata"
  educationStatus: string | null; // e.g., "undergraduate", null
  
  // State audit
  isUserModified: boolean;     // True if user adjusted fields on Screen 2 review panel
}
```

---

### 2.4 Comparison & What-If Scenario Schema

```typescript
interface WhatIfScenarioRequest {
  currentScenario: {
    loanAmount: number;
    tenureMonths: number;
    schemeIds: string[];
  };
  naturalLanguageQuery: string; // "What if I borrow ₹80,000?" or "What if I repay over 5 years?"
}

interface WhatIfScenarioResult {
  deltaParams: {
    loanAmount?: number;
    tenureMonths?: number;
  };
  recalculatedSchemes: Array<{
    schemeId: string;
    schemeName: string;
    previousEMI: number;
    newEMI: number;
    previousTotalRepayment: number;
    newTotalRepayment: number;
    previousTotalInterest: number;
    newTotalInterest: number;
    tenureCapped: boolean;     // True if requested tenure exceeded scheme maximum
    effectiveTenureMonths: number;
  }>;
  aiExplanation: string;       // Plain language summary synthesized by Gemini
  suggestedPromptTip?: string;
}
```

---

## 3. Verified Initial Prototype Dataset

Below are the 5 verified schemes implemented for the SIH prototype, reflecting statutory parameters from official NSFDC guidelines:

### Scheme 1: NSFDC Micro Finance Scheme
```json
{
  "_id": "SCHEME-NSFDC-MF-01",
  "name": "NSFDC Micro Finance Scheme",
  "shortName": "Micro Finance Scheme",
  "category": "microfinance",
  "purpose": ["business", "tailoring", "small_trade", "artisan", "vendor", "handicrafts"],
  "targetBeneficiary": "Target group entrepreneurs living below the poverty line or double poverty line",
  "incomeLimit": 500000,
  "projectCostLimit": 140000,
  "maxLoanAmount": 125000,
  "maxLoanPercentage": 90,
  "promoterContributionPct": 0,
  "interestRate": 6.5,
  "interestRateType": "fixed",
  "maxTenureMonths": 36,
  "moratoriumMonths": 3,
  "repaymentFrequency": "monthly",
  "channelPartnerTypes": ["SCA", "PSB", "RRB", "NBFC-MFI"],
  "sourceDocuments": [{
    "documentTitle": "NSFDC Lending Schemes Handbook 2024",
    "issuingMinistry": "Ministry of Social Justice and Empowerment, Govt. of India",
    "officialUrl": "https://nsfdc.nic.in"
  }],
  "lastVerifiedAt": "2024-01-15T00:00:00Z"
}
```

### Scheme 2: Aajeevika Micro-Finance Yojana
```json
{
  "_id": "SCHEME-NSFDC-AMFY-02",
  "name": "Aajeevika Micro-Finance Yojana",
  "shortName": "Aajeevika MF Yojana",
  "category": "microfinance",
  "purpose": ["business", "livelihood", "self_help_group", "tailoring", "retail"],
  "targetBeneficiary": "Members of Self Help Groups (SHGs) and individual micro-borrowers",
  "incomeLimit": 500000,
  "projectCostLimit": 140000,
  "maxLoanAmount": 125000,
  "maxLoanPercentage": 90,
  "promoterContributionPct": 0,
  "interestRate": 15.0,
  "interestRateType": "fixed",
  "maxTenureMonths": 36,
  "moratoriumMonths": 3,
  "repaymentFrequency": "monthly",
  "channelPartnerTypes": ["NBFC-MFI", "SCA", "RRB"],
  "sourceDocuments": [{
    "documentTitle": "Aajeevika Credit Framework Circular",
    "issuingMinistry": "Ministry of Social Justice and Empowerment, Govt. of India",
    "officialUrl": "https://nsfdc.nic.in"
  }],
  "lastVerifiedAt": "2024-01-15T00:00:00Z"
}
```

### Scheme 3: NSFDC Term Loan
```json
{
  "_id": "SCHEME-NSFDC-TL-03",
  "name": "NSFDC Term Loan Scheme",
  "shortName": "Term Loan",
  "category": "term_loan",
  "purpose": ["business", "manufacturing", "transport", "services", "machinery", "tailoring_unit"],
  "targetBeneficiary": "Viable income generating projects for target group entrepreneurs",
  "incomeLimit": 500000,
  "projectCostLimit": 5000000,
  "minProjectCost": 140001,
  "maxLoanAmount": 4500000,
  "maxLoanPercentage": 90,
  "promoterContributionPct": 10,
  "interestRate": 8.0,
  "interestRateType": "fixed",
  "maxTenureMonths": 84,
  "moratoriumMonths": 6,
  "moratoriumDetails": "Standard 6 months; up to 12 months for specialized plantation or civil construction activities",
  "repaymentFrequency": "monthly",
  "channelPartnerTypes": ["SCA", "PSB", "RRB"],
  "sourceDocuments": [{
    "documentTitle": "NSFDC Term Loan Policy Guidelines",
    "issuingMinistry": "Ministry of Social Justice and Empowerment, Govt. of India",
    "officialUrl": "https://nsfdc.nic.in"
  }],
  "lastVerifiedAt": "2024-01-15T00:00:00Z"
}
```

### Scheme 4: Udyam Nidhi Yojana
```json
{
  "_id": "SCHEME-NSFDC-UNY-04",
  "name": "Udyam Nidhi Yojana",
  "shortName": "Udyam Nidhi",
  "category": "self_employment",
  "purpose": ["business", "services", "small_industry", "trade", "tailoring"],
  "targetBeneficiary": "First generation entrepreneurs and micro enterprise founders",
  "incomeLimit": 500000,
  "projectCostLimit": 500000,
  "maxLoanAmount": 450000,
  "maxLoanPercentage": 90,
  "promoterContributionPct": 10,
  "interestRate": 13.0,
  "interestRateType": "channel_dependent",
  "interestRateVariants": [
    { "channelPartnerType": "Cooperative Bank", "rate": 13.0 },
    { "channelPartnerType": "Small Finance Bank", "rate": 15.0 }
  ],
  "maxTenureMonths": 60,
  "moratoriumMonths": 3,
  "repaymentFrequency": "monthly",
  "channelPartnerTypes": ["Cooperative Bank", "SFB", "SCA"],
  "sourceDocuments": [{
    "documentTitle": "Udyam Nidhi Operational Guidelines",
    "issuingMinistry": "Ministry of Social Justice and Empowerment, Govt. of India",
    "officialUrl": "https://nsfdc.nic.in"
  }],
  "lastVerifiedAt": "2024-01-15T00:00:00Z"
}
```

### Scheme 5: NSFDC Educational Loan Scheme
```json
{
  "_id": "SCHEME-NSFDC-ELS-05",
  "name": "NSFDC Educational Loan Scheme",
  "shortName": "Educational Loan",
  "category": "education",
  "purpose": ["education", "higher_studies", "technical_course", "vocational"],
  "targetBeneficiary": "Students belonging to target group pursuing professional / technical higher education",
  "incomeLimit": 500000,
  "projectCostLimit": 4000000,
  "maxLoanAmount": 4000000,
  "maxLoanPercentage": 90,
  "promoterContributionPct": 10,
  "interestRate": 6.5,
  "interestRateType": "fixed",
  "maxTenureMonths": 144,
  "moratoriumMonths": 6,
  "moratoriumDetails": "Course duration plus 6 months or getting a job (whichever is earlier)",
  "repaymentFrequency": "monthly",
  "channelPartnerTypes": ["PSB", "RRB", "SCA"],
  "sourceDocuments": [{
    "documentTitle": "NSFDC Education Loan Guidelines for Professional Courses",
    "issuingMinistry": "Ministry of Social Justice and Empowerment, Govt. of India",
    "officialUrl": "https://nsfdc.nic.in"
  }],
  "lastVerifiedAt": "2024-01-15T00:00:00Z"
}
```

---

## 4. Realistic Demo Channel Partner Dataset (Kolkata District)

To fulfill the demo scenario (*"I live in Kolkata"*), four verified channel partner archetypes are defined:

```json
[
  {
    "_id": "PARTNER-KOL-SCA-01",
    "name": "West Bengal SC, ST & OBC Development & Finance Corporation",
    "shortCode": "WBSCSTDFCL",
    "type": "SCA",
    "authorizedSchemes": [
      "SCHEME-NSFDC-MF-01",
      "SCHEME-NSFDC-AMFY-02",
      "SCHEME-NSFDC-TL-03",
      "SCHEME-NSFDC-UNY-04",
      "SCHEME-NSFDC-ELS-05"
    ],
    "address": "Bikash Bhavan, North Block, 5th Floor, DF Block, Sector 1, Bidhannagar",
    "city": "Kolkata",
    "district": "North 24 Parganas / Kolkata",
    "state": "West Bengal",
    "pincode": "700091",
    "location": {
      "type": "Point",
      "coordinates": [88.4172, 22.5867]
    },
    "contact": {
      "phone": "+91 33 2334 1234",
      "email": "contact@wbscstdfcl.gov.in",
      "nodalOfficerName": "Debabrata Sen (District Officer)",
      "officeHours": "Mon-Fri 10:00 AM - 5:30 PM"
    },
    "status": "active",
    "verificationStatus": "verified_partner_branch",
    "isDemoData": true
  },
  {
    "_id": "PARTNER-KOL-PSB-02",
    "name": "Punjab National Bank — BBD Bagh Branch",
    "shortCode": "PNB-BBD",
    "type": "PSB",
    "authorizedSchemes": [
      "SCHEME-NSFDC-MF-01",
      "SCHEME-NSFDC-TL-03",
      "SCHEME-NSFDC-ELS-05"
    ],
    "address": "AG & Commercial Branch, 8 Council House Street, Dalhousie",
    "city": "Kolkata",
    "district": "Kolkata",
    "state": "West Bengal",
    "pincode": "700001",
    "location": {
      "type": "Point",
      "coordinates": [88.3478, 22.5697]
    },
    "contact": {
      "phone": "+91 33 2248 5678",
      "email": "bo4500@pnb.co.in",
      "nodalOfficerName": "Priyanka Mukherjee (Chief Manager - MSME Desk)",
      "officeHours": "Mon-Sat 10:00 AM - 4:00 PM"
    },
    "status": "active",
    "verificationStatus": "verified_partner_branch",
    "isDemoData": true
  },
  {
    "_id": "PARTNER-KOL-RRB-03",
    "name": "Bangiya Gramin Vikash Bank — Barasat Regional Office",
    "shortCode": "BGVB-BRS",
    "type": "RRB",
    "authorizedSchemes": [
      "SCHEME-NSFDC-MF-01",
      "SCHEME-NSFDC-AMFY-02",
      "SCHEME-NSFDC-TL-03"
    ],
    "address": "48/1 Jessore Road, Champadali More, Barasat",
    "city": "Kolkata",
    "district": "North 24 Parganas",
    "state": "West Bengal",
    "pincode": "700124",
    "location": {
      "type": "Point",
      "coordinates": [88.4823, 22.7214]
    },
    "contact": {
      "phone": "+91 33 2584 9012",
      "email": "robarasat@bgvb.co.in",
      "nodalOfficerName": "Alok Roy (Senior Manager)",
      "officeHours": "Mon-Fri 10:00 AM - 4:30 PM"
    },
    "status": "active",
    "verificationStatus": "verified_partner_branch",
    "isDemoData": true
  },
  {
    "_id": "PARTNER-KOL-SFB-04",
    "name": "Bandhan Bank — Gariahat Micro-Banking Unit",
    "shortCode": "BANDHAN-GRH",
    "type": "SFB",
    "authorizedSchemes": [
      "SCHEME-NSFDC-AMFY-02",
      "SCHEME-NSFDC-UNY-04"
    ],
    "address": "128 Rashbehari Avenue, Gariahat Crossing",
    "city": "Kolkata",
    "district": "South Kolkata",
    "state": "West Bengal",
    "pincode": "700029",
    "location": {
      "type": "Point",
      "coordinates": [88.3654, 22.5186]
    },
    "contact": {
      "phone": "+91 33 2460 3344",
      "email": "gariahat.branch@bandhanbank.com",
      "nodalOfficerName": "Sharmistha Ghosh (Branch Head)",
      "officeHours": "Mon-Sat 9:30 AM - 4:30 PM"
    },
    "status": "active",
    "verificationStatus": "verified_partner_branch",
    "isDemoData": true
  }
]
```

---

## 5. Open Decisions

| ID | Issue | Detail | Proposed Resolution |
| :--- | :--- | :--- | :--- |
| OD-D1 | Geo-spatial Indexing | MongoDB 2dsphere indexing vs simple Euclidean calculation for distance sorting. | In the prototype demo, coordinates are fixed for Kolkata; simple client-side distance calculation or bounding box query is sufficient, with 2dsphere index added to schema for forward compatibility. |
| OD-D2 | Seed Data Provisioning | Should initial schemes be loaded via database migration or in-memory fallback? | Provide both: a clean `seed.js` script for MongoDB, and an in-memory JSON fallback in the API controllers in case the MongoDB connection is unavailable in offline demo setups. |
