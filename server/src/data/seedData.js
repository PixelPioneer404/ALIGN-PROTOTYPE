export const verifiedSchemes = [
  {
    _id: "SCHEME-NSFDC-MF-01",
    name: "NSFDC Micro Finance Scheme",
    shortName: "Micro Finance Scheme",
    category: "microfinance",
    purpose: ["business", "tailoring", "small_trade", "artisan", "vendor", "handicrafts", "retail"],
    targetBeneficiary: "Target group entrepreneurs living below double poverty line / specified income ceiling",
    incomeLimit: 500000,
    projectCostLimit: 140000,
    minProjectCost: 10000,
    maxLoanAmount: 125000,
    maxLoanPercentage: 90,
    promoterContributionPct: 0,
    interestRate: 6.5,
    interestRateType: "fixed",
    maxTenureMonths: 36,
    minTenureMonths: 12,
    moratoriumMonths: 3,
    moratoriumDetails: "3 months grace period on principal repayment",
    repaymentFrequency: "monthly",
    channelPartnerTypes: ["SCA", "PSB", "RRB", "NBFC-MFI"],
    eligibilityRules: [
      {
        field: "annualFamilyIncome",
        operator: "lte",
        value: 500000,
        description: "Annual family income must not exceed ₹5,00,000"
      },
      {
        field: "amount",
        operator: "lte",
        value: 125000,
        description: "Requested loan must not exceed scheme limit of ₹1,25,000"
      },
      {
        field: "purpose",
        operator: "in",
        value: ["business", "tailoring", "small_trade", "artisan", "vendor", "handicrafts", "retail", "services"],
        description: "Enterprise must be an eligible micro-enterprise or vocation"
      }
    ],
    documents: [
      {
        id: "DOC-ID-01",
        name: "Identity & Address Proof (Aadhaar / Voter ID / Ration Card)",
        category: "identity",
        isMandatory: true,
        issuingAuthority: "UIDAI / Election Commission of India / Food & Supplies Dept",
        description: "Government-issued photo identification confirming address in applicant district"
      },
      {
        id: "DOC-INC-02",
        name: "Family Income Certificate (Annual Household Income <= ₹5,00,000)",
        category: "income_caste",
        isMandatory: true,
        issuingAuthority: "SDO / BDO / Revenue Officer / Competent Executive Magistrate",
        description: "Official statutory certificate certifying annual family income"
      },
      {
        id: "DOC-CST-03",
        name: "Community / Target Group Certificate",
        category: "income_caste",
        isMandatory: true,
        issuingAuthority: "SDO / District Welfare Officer",
        description: "Certificate validating applicant's eligibility under designated corporation mandate"
      },
      {
        id: "DOC-PRJ-04",
        name: "Equipment / Machinery Quotation (e.g. Sewing Machine vendor bill)",
        category: "business_project",
        isMandatory: true,
        issuingAuthority: "Registered Equipment Vendor / Supplier",
        description: "Valid GST invoice or price quotation for tailoring machines, fabrics, and working capital"
      },
      {
        id: "DOC-BNK-05",
        name: "Bank Passbook Copy / Cancelled Cheque",
        category: "banking",
        isMandatory: true,
        issuingAuthority: "Any Scheduled Commercial / Rural Bank Branch",
        description: "Active savings bank account passbook showing IFSC code and recent transactions"
      }
    ],
    applicationProcess: [
      {
        stepNumber: 1,
        title: "Dossier Preparation",
        description: "Collect statutory income certificate, equipment quotation from vendor, and identity proofs.",
        estimatedTimeline: "3-5 days",
        responsibleEntity: "Applicant"
      },
      {
        stepNumber: 2,
        title: "Branch Submission & Receipt",
        description: "Submit physical application dossier at the designated Channel Partner office (e.g. WBSCSTDFCL district office or PNB branch). Obtain official receipt acknowledgement.",
        estimatedTimeline: "1 day",
        responsibleEntity: "Applicant & Channel Partner Desk"
      },
      {
        stepNumber: 3,
        title: "Field Appraisal & Scrutiny",
        description: "Nodal officer verifies residence, business feasibility, and statutory documents.",
        estimatedTimeline: "7-10 working days",
        responsibleEntity: "Channel Partner Field Officer"
      },
      {
        stepNumber: 4,
        title: "Sanction & Direct Vendor Release",
        description: "Formal sanction letter issued; loan proceeds directly disbursed to equipment vendor or applicant account.",
        estimatedTimeline: "5-7 working days",
        responsibleEntity: "Apex Corporation & Channel Partner"
      }
    ],
    sourceDocuments: [
      {
        documentTitle: "NSFDC Lending Schemes Handbook 2024-25",
        circularNumber: "NSFDC/OPS/MC-01/2024",
        issuingMinistry: "Ministry of Social Justice and Empowerment, Govt. of India",
        officialUrl: "https://nsfdc.nic.in"
      }
    ],
    lastVerifiedAt: new Date("2024-01-15T00:00:00Z"),
    isDemoData: false
  },
  {
    _id: "SCHEME-NSFDC-AMFY-02",
    name: "Aajeevika Micro-Finance Yojana",
    shortName: "Aajeevika MF Yojana",
    category: "microfinance",
    purpose: ["business", "livelihood", "self_help_group", "tailoring", "retail", "small_trade"],
    targetBeneficiary: "Members of Self Help Groups (SHGs) and individual micro-borrowers in target group",
    incomeLimit: 500000,
    projectCostLimit: 140000,
    minProjectCost: 10000,
    maxLoanAmount: 125000,
    maxLoanPercentage: 90,
    promoterContributionPct: 0,
    interestRate: 15.0,
    interestRateType: "fixed",
    maxTenureMonths: 36,
    minTenureMonths: 12,
    moratoriumMonths: 3,
    moratoriumDetails: "3 months grace period on principal repayment",
    repaymentFrequency: "monthly",
    channelPartnerTypes: ["NBFC-MFI", "SCA", "RRB"],
    eligibilityRules: [
      {
        field: "annualFamilyIncome",
        operator: "lte",
        value: 500000,
        description: "Annual family income must not exceed ₹5,00,000"
      },
      {
        field: "amount",
        operator: "lte",
        value: 125000,
        description: "Requested loan must not exceed scheme limit of ₹1,25,000"
      },
      {
        field: "purpose",
        operator: "in",
        value: ["business", "livelihood", "self_help_group", "tailoring", "retail", "small_trade", "services"],
        description: "Enterprise must be an approved livelihood activity"
      }
    ],
    documents: [
      {
        id: "DOC-ID-01",
        name: "Identity & Address Proof (Aadhaar / Voter ID)",
        category: "identity",
        isMandatory: true,
        issuingAuthority: "UIDAI / Election Commission of India",
        description: "Identity and residence verification"
      },
      {
        id: "DOC-INC-02",
        name: "Family Income Certificate",
        category: "income_caste",
        isMandatory: true,
        issuingAuthority: "BDO / SDO / Competent Authority",
        description: "Income certificate or validated SHG BPL membership roster"
      },
      {
        id: "DOC-PRJ-04",
        name: "Enterprise Activity / Quotation Plan",
        category: "business_project",
        isMandatory: true,
        issuingAuthority: "Self-Declaration / Vendor Quotation",
        description: "Estimate of tools, materials, and expected monthly turnover"
      }
    ],
    applicationProcess: [
      {
        stepNumber: 1,
        title: "Group / Individual Verification",
        description: "Borrower details verified by SHG federation or NBFC-MFI field desk.",
        estimatedTimeline: "2-4 days",
        responsibleEntity: "Channel Partner MFI"
      },
      {
        stepNumber: 2,
        title: "Application Assessment & Sanction",
        description: "Fast-track credit assessment under micro-finance guidelines.",
        estimatedTimeline: "5-7 days",
        responsibleEntity: "MFI Credit Committee"
      },
      {
        stepNumber: 3,
        title: "Disbursement",
        description: "Credit credited to applicant savings bank account.",
        estimatedTimeline: "3 days",
        responsibleEntity: "Lending Bank / MFI"
      }
    ],
    sourceDocuments: [
      {
        documentTitle: "Aajeevika Credit Framework Operational Circular",
        circularNumber: "NSFDC/AMFY/2024",
        issuingMinistry: "Ministry of Social Justice and Empowerment, Govt. of India",
        officialUrl: "https://nsfdc.nic.in"
      }
    ],
    lastVerifiedAt: new Date("2024-01-15T00:00:00Z"),
    isDemoData: false
  },
  {
    _id: "SCHEME-NSFDC-TL-03",
    name: "NSFDC Term Loan Scheme",
    shortName: "Term Loan",
    category: "term_loan",
    purpose: ["business", "manufacturing", "transport", "services", "machinery", "tailoring_unit", "small_industry"],
    targetBeneficiary: "Viable income generating projects for target group individual entrepreneurs",
    incomeLimit: 500000,
    projectCostLimit: 5000000,
    minProjectCost: 140001,
    maxLoanAmount: 4500000,
    maxLoanPercentage: 90,
    promoterContributionPct: 10,
    interestRate: 8.0,
    interestRateType: "fixed",
    maxTenureMonths: 84,
    minTenureMonths: 12,
    moratoriumMonths: 6,
    moratoriumDetails: "6 months standard grace period; up to 12 months for civil works / plantation projects",
    repaymentFrequency: "monthly",
    channelPartnerTypes: ["SCA", "PSB", "RRB"],
    eligibilityRules: [
      {
        field: "annualFamilyIncome",
        operator: "lte",
        value: 500000,
        description: "Annual family income must not exceed ₹5,00,000"
      },
      {
        field: "amount",
        operator: "lte",
        value: 4500000,
        description: "Requested loan must not exceed ₹45,00,000"
      },
      {
        field: "purpose",
        operator: "in",
        value: ["business", "manufacturing", "transport", "services", "machinery", "tailoring_unit", "small_industry"],
        description: "Project must be a viable income-generating enterprise"
      }
    ],
    documents: [
      {
        id: "DOC-ID-01",
        name: "KYC & Identity Proof (Aadhaar, PAN Card, Voter ID)",
        category: "identity",
        isMandatory: true,
        issuingAuthority: "UIDAI / Income Tax Dept",
        description: "Mandatory PAN and Aadhaar identity verification"
      },
      {
        id: "DOC-INC-02",
        name: "Family Income Certificate",
        category: "income_caste",
        isMandatory: true,
        issuingAuthority: "SDO / BDO",
        description: "Statutory income verification certificate"
      },
      {
        id: "DOC-DPR-06",
        name: "Detailed Project Report (DPR) / Project Cost Estimate",
        category: "business_project",
        isMandatory: true,
        issuingAuthority: "Chartered Accountant / Technical Consultant / Self (for small units)",
        description: "Cash flow projection, equipment quotation, and profitability forecast"
      },
      {
        id: "DOC-PRM-07",
        name: "Promoter Margin Money Proof (10% of Project Cost)",
        category: "banking",
        isMandatory: true,
        issuingAuthority: "Bank Statement",
        description: "Evidence of borrower equity contribution"
      }
    ],
    applicationProcess: [
      {
        stepNumber: 1,
        title: "DPR Formulation & Quotations",
        description: "Prepare project appraisal report, cost breakdown, and vendor quotes.",
        estimatedTimeline: "7 days",
        responsibleEntity: "Applicant"
      },
      {
        stepNumber: 2,
        title: "SCA / Bank Appraisal",
        description: "Technical and financial viability vetting by bank credit desk.",
        estimatedTimeline: "14 working days",
        responsibleEntity: "Branch Manager & Technical Officer"
      },
      {
        stepNumber: 3,
        title: "Sanction & Security Execution",
        description: "Hypothecation of machinery / assets and loan agreement signing.",
        estimatedTimeline: "5 days",
        responsibleEntity: "Channel Partner & Applicant"
      },
      {
        stepNumber: 4,
        title: "Disbursement Against Machinery Invoice",
        description: "Direct payment released to machine suppliers.",
        estimatedTimeline: "7 days",
        responsibleEntity: "Bank Disbursal Desk"
      }
    ],
    sourceDocuments: [
      {
        documentTitle: "NSFDC Term Loan Policy Guidelines",
        circularNumber: "NSFDC/TL-POL/2024",
        issuingMinistry: "Ministry of Social Justice and Empowerment, Govt. of India",
        officialUrl: "https://nsfdc.nic.in"
      }
    ],
    lastVerifiedAt: new Date("2024-01-15T00:00:00Z"),
    isDemoData: false
  },
  {
    _id: "SCHEME-NSFDC-UNY-04",
    name: "Udyam Nidhi Yojana",
    shortName: "Udyam Nidhi",
    category: "self_employment",
    purpose: ["business", "services", "small_industry", "trade", "tailoring", "retail"],
    targetBeneficiary: "First-generation entrepreneurs and micro enterprise founders in target group",
    incomeLimit: 500000,
    projectCostLimit: 500000,
    minProjectCost: 50000,
    maxLoanAmount: 450000,
    maxLoanPercentage: 90,
    promoterContributionPct: 10,
    interestRate: 13.0,
    interestRateType: "channel_dependent",
    interestRateVariants: [
      { channelPartnerType: "Cooperative Bank", rate: 13.0 },
      { channelPartnerType: "Small Finance Bank", rate: 15.0 }
    ],
    maxTenureMonths: 60,
    minTenureMonths: 12,
    moratoriumMonths: 3,
    moratoriumDetails: "3 months grace period on principal repayment",
    repaymentFrequency: "monthly",
    channelPartnerTypes: ["Cooperative Bank", "SFB", "SCA"],
    eligibilityRules: [
      {
        field: "annualFamilyIncome",
        operator: "lte",
        value: 500000,
        description: "Annual family income must not exceed ₹5,00,000"
      },
      {
        field: "amount",
        operator: "lte",
        value: 450000,
        description: "Requested loan must not exceed ₹4,50,000"
      },
      {
        field: "purpose",
        operator: "in",
        value: ["business", "services", "small_industry", "trade", "tailoring", "retail"],
        description: "Enterprise must be an approved self-employment unit"
      }
    ],
    documents: [
      {
        id: "DOC-ID-01",
        name: "Identity & Address Proof",
        category: "identity",
        isMandatory: true,
        issuingAuthority: "UIDAI",
        description: "Aadhaar Card and address proof"
      },
      {
        id: "DOC-INC-02",
        name: "Family Income Certificate",
        category: "income_caste",
        isMandatory: true,
        issuingAuthority: "Competent Revenue Authority",
        description: "Income under ₹5,00,000"
      },
      {
        id: "DOC-PRJ-04",
        name: "Business Proposal & Cost Quotation",
        category: "business_project",
        isMandatory: true,
        issuingAuthority: "Registered Suppliers",
        description: "Machinery and working capital breakdown"
      }
    ],
    applicationProcess: [
      {
        stepNumber: 1,
        title: "Application Filing",
        description: "Submit at participating Cooperative Bank or Small Finance Bank branch.",
        estimatedTimeline: "1-2 days",
        responsibleEntity: "Applicant"
      },
      {
        stepNumber: 2,
        title: "Credit Evaluation",
        description: "Branch checks credit background and business viability.",
        estimatedTimeline: "7-10 days",
        responsibleEntity: "Credit Officer"
      },
      {
        stepNumber: 3,
        title: "Sanction and Disbursal",
        description: "Disbursement into designated business current/savings account.",
        estimatedTimeline: "5 days",
        responsibleEntity: "Branch Manager"
      }
    ],
    sourceDocuments: [
      {
        documentTitle: "Udyam Nidhi Operational Guidelines",
        circularNumber: "NSFDC/UNY-2024",
        issuingMinistry: "Ministry of Social Justice and Empowerment, Govt. of India",
        officialUrl: "https://nsfdc.nic.in"
      }
    ],
    lastVerifiedAt: new Date("2024-01-15T00:00:00Z"),
    isDemoData: false
  },
  {
    _id: "SCHEME-NSFDC-ELS-05",
    name: "NSFDC Educational Loan Scheme",
    shortName: "Educational Loan",
    category: "education",
    purpose: ["education", "higher_studies", "technical_course", "vocational", "degree"],
    targetBeneficiary: "Students belonging to target group pursuing professional / technical higher education in India or abroad",
    incomeLimit: 500000,
    projectCostLimit: 4000000,
    minProjectCost: 50000,
    maxLoanAmount: 4000000,
    maxLoanPercentage: 90,
    promoterContributionPct: 10,
    interestRate: 6.5,
    interestRateType: "fixed",
    maxTenureMonths: 144,
    minTenureMonths: 36,
    moratoriumMonths: 6,
    moratoriumDetails: "Course duration plus 6 months or 6 months after getting a job, whichever is earlier",
    repaymentFrequency: "monthly",
    channelPartnerTypes: ["PSB", "RRB", "SCA"],
    eligibilityRules: [
      {
        field: "annualFamilyIncome",
        operator: "lte",
        value: 500000,
        description: "Annual family income must not exceed ₹5,00,000"
      },
      {
        field: "purpose",
        operator: "eq",
        value: "education",
        description: "Assistance is strictly for approved professional/technical academic courses"
      }
    ],
    documents: [
      {
        id: "DOC-ID-01",
        name: "Identity & Age Proof (Student & Co-borrower Parent)",
        category: "identity",
        isMandatory: true,
        issuingAuthority: "UIDAI / School Board",
        description: "Aadhaar and 10th standard certificate"
      },
      {
        id: "DOC-INC-02",
        name: "Family Income Certificate",
        category: "income_caste",
        isMandatory: true,
        issuingAuthority: "SDO / BDO",
        description: "Annual family income under ₹5,00,000"
      },
      {
        id: "DOC-EDU-08",
        name: "College Admission Letter & Approved Fee Structure",
        category: "business_project",
        isMandatory: true,
        issuingAuthority: "Recognized University / Technical Institute",
        description: "Official fee schedule and merit rank letter"
      }
    ],
    applicationProcess: [
      {
        stepNumber: 1,
        title: "Admission Verification",
        description: "Submit confirmed admission slip and institutional bank details.",
        estimatedTimeline: "2 days",
        responsibleEntity: "Student Applicant"
      },
      {
        stepNumber: 2,
        title: "Sponsorship & Sanction",
        description: "Bank issues in-principle sanction letter for tuition fees.",
        estimatedTimeline: "10-14 days",
        responsibleEntity: "Bank Education Loan Cell"
      },
      {
        stepNumber: 3,
        title: "Direct Tuition Fee Release",
        description: "Semester fees directly wired to college/university account.",
        estimatedTimeline: "3 days",
        responsibleEntity: "Bank Disbursal Desk"
      }
    ],
    sourceDocuments: [
      {
        documentTitle: "NSFDC Education Loan Guidelines for Professional Courses",
        circularNumber: "NSFDC/EDU/2024",
        issuingMinistry: "Ministry of Social Justice and Empowerment, Govt. of India",
        officialUrl: "https://nsfdc.nic.in"
      }
    ],
    lastVerifiedAt: new Date("2024-01-15T00:00:00Z"),
    isDemoData: false
  },
  {
    _id: "SCHEME-MUDRA-SHISHU-06",
    name: "Pradhan Mantri MUDRA Yojana — Shishu",
    shortName: "PMMY Shishu",
    category: "microfinance",
    purpose: ["business", "vendor", "retail", "tailoring", "artisan", "small_trade", "repair_shop", "services", "street_vendor"],
    targetBeneficiary: "Micro-entrepreneurs and street vendors requiring seed working capital up to ₹50,000 without collateral",
    incomeLimit: 0,
    projectCostLimit: 50000,
    minProjectCost: 5000,
    maxLoanAmount: 50000,
    maxLoanPercentage: 100,
    promoterContributionPct: 0,
    interestRate: 8.5,
    interestRateType: "fixed",
    maxTenureMonths: 36,
    minTenureMonths: 12,
    moratoriumMonths: 3,
    moratoriumDetails: "Up to 3 months initial repayment moratorium",
    repaymentFrequency: "monthly",
    channelPartnerTypes: ["PSB", "RRB", "SFB", "NBFC-MFI"],
    eligibilityRules: [
      {
        field: "amount",
        operator: "lte",
        value: 50000,
        description: "Requested loan must not exceed Shishu ceiling of ₹50,000"
      },
      {
        field: "purpose",
        operator: "in",
        value: ["business", "vendor", "retail", "tailoring", "artisan", "small_trade", "repair_shop", "services", "street_vendor"],
        description: "Must be a non-farm income generating micro-enterprise"
      }
    ],
    documents: [
      { id: "DOC-ID-01", name: "Aadhaar Card / Voter ID Card", category: "identity", isMandatory: true, issuingAuthority: "UIDAI", description: "Identity & proof of residence" },
      { id: "DOC-BNK-05", name: "Savings Bank Account Statement (6 Months)", category: "banking", isMandatory: true, issuingAuthority: "Any Bank Branch", description: "Operational savings account" },
      { id: "DOC-PRJ-04", name: "Estimated Quotation of Tools / Goods", category: "business_project", isMandatory: false, issuingAuthority: "Vendor / Self", description: "Estimate of micro tools or inventory" }
    ],
    applicationProcess: [
      { stepNumber: 1, title: "Simple Form Filing", description: "Fill 1-page MUDRA Shishu application at any participating bank branch or Udyamimitra portal.", estimatedTimeline: "1 day", responsibleEntity: "Applicant" },
      { stepNumber: 2, title: "Collateral-Free Appraisal", description: "Bank verifies identity and enterprise location without requiring any third-party collateral.", estimatedTimeline: "3-5 days", responsibleEntity: "Branch Credit Officer" },
      { stepNumber: 3, title: "MUDRA Card Issuance & Disbursal", description: "Credit disbursed via Mudra RuPay debit card for easy working capital withdrawal.", estimatedTimeline: "2 days", responsibleEntity: "Lending Bank" }
    ],
    sourceDocuments: [
      { documentTitle: "Pradhan Mantri Mudra Yojana Operational Guidelines", circularNumber: "DFS/MUDRA/2024/01", issuingMinistry: "Department of Financial Services, Ministry of Finance, Govt of India", officialUrl: "https://www.mudra.org.in" }
    ],
    lastVerifiedAt: new Date("2024-02-01T00:00:00Z"),
    isDemoData: false
  },
  {
    _id: "SCHEME-MUDRA-KISHORE-07",
    name: "Pradhan Mantri MUDRA Yojana — Kishore",
    shortName: "PMMY Kishore",
    category: "msme",
    purpose: ["business", "retail", "tailoring", "manufacturing", "small_industry", "dairy", "food_processing", "services", "transport"],
    targetBeneficiary: "Established micro-enterprises purchasing machinery, vehicles, or expanding working capital up to ₹5 Lakh",
    incomeLimit: 0,
    projectCostLimit: 600000,
    minProjectCost: 50001,
    maxLoanAmount: 500000,
    maxLoanPercentage: 85,
    promoterContributionPct: 15,
    interestRate: 9.5,
    interestRateType: "fixed",
    maxTenureMonths: 60,
    minTenureMonths: 12,
    moratoriumMonths: 6,
    moratoriumDetails: "6 months grace period on principal repayment",
    repaymentFrequency: "monthly",
    channelPartnerTypes: ["PSB", "RRB", "SFB", "Cooperative Bank"],
    eligibilityRules: [
      {
        field: "amount",
        operator: "lte",
        value: 500000,
        description: "Requested assistance must be between ₹50,001 and ₹5,00,000"
      },
      {
        field: "purpose",
        operator: "in",
        value: ["business", "retail", "tailoring", "manufacturing", "small_industry", "dairy", "food_processing", "services", "transport"],
        description: "Enterprise must be an ongoing or new viable micro unit"
      }
    ],
    documents: [
      { id: "DOC-ID-01", name: "Aadhaar & PAN Card", category: "identity", isMandatory: true, issuingAuthority: "UIDAI & Income Tax Dept", description: "Mandatory KYC" },
      { id: "DOC-UDYAM-09", name: "Udyam Registration Certificate", category: "business_project", isMandatory: true, issuingAuthority: "Ministry of MSME", description: "Free MSME online registration" },
      { id: "DOC-PRJ-04", name: "Machinery / Equipment Tax Invoice Quotations", category: "business_project", isMandatory: true, issuingAuthority: "Registered Suppliers", description: "Proforma invoice for machinery" },
      { id: "DOC-BNK-05", name: "Last 6 Months Bank Statement", category: "banking", isMandatory: true, issuingAuthority: "Bank Branch", description: "Account turnover" }
    ],
    applicationProcess: [
      { stepNumber: 1, title: "Udyam & Document Filing", description: "Submit proposal with equipment quotation and Udyam MSME number.", estimatedTimeline: "2 days", responsibleEntity: "Applicant" },
      { stepNumber: 2, title: "Technical Viability Review", description: "Bank checks enterprise viability and credit score via CGFMU guarantee pool.", estimatedTimeline: "5-7 days", responsibleEntity: "Bank Branch Manager" },
      { stepNumber: 3, title: "Direct Machinery Disbursal", description: "Funds disbursed directly to equipment suppliers with working capital limit activated.", estimatedTimeline: "3 days", responsibleEntity: "Bank Disbursal Desk" }
    ],
    sourceDocuments: [
      { documentTitle: "PMMY Kishore Credit Guidelines 2024", circularNumber: "MUDRA/CIR/KISHORE/24", issuingMinistry: "Ministry of Finance, Govt of India", officialUrl: "https://www.mudra.org.in" }
    ],
    lastVerifiedAt: new Date("2024-02-01T00:00:00Z"),
    isDemoData: false
  },
  {
    _id: "SCHEME-MUDRA-TARUN-08",
    name: "Pradhan Mantri MUDRA Yojana — Tarun",
    shortName: "PMMY Tarun",
    category: "msme",
    purpose: ["business", "manufacturing", "expansion", "food_processing", "transport", "tech", "retail", "small_industry"],
    targetBeneficiary: "Growing micro-enterprises and small manufacturing units scaling operations up to ₹10 Lakh",
    incomeLimit: 0,
    projectCostLimit: 1200000,
    minProjectCost: 500001,
    maxLoanAmount: 1000000,
    maxLoanPercentage: 85,
    promoterContributionPct: 15,
    interestRate: 10.0,
    interestRateType: "fixed",
    maxTenureMonths: 84,
    minTenureMonths: 24,
    moratoriumMonths: 6,
    moratoriumDetails: "6 months grace period during equipment installation",
    repaymentFrequency: "monthly",
    channelPartnerTypes: ["PSB", "RRB", "Commercial Bank"],
    eligibilityRules: [
      {
        field: "amount",
        operator: "lte",
        value: 1000000,
        description: "Requested loan must be between ₹5,00,001 and ₹10,00,000"
      },
      {
        field: "purpose",
        operator: "in",
        value: ["business", "manufacturing", "expansion", "food_processing", "transport", "tech", "retail", "small_industry"],
        description: "Eligible commercial or industrial expansion"
      }
    ],
    documents: [
      { id: "DOC-ID-01", name: "KYC Dossier (PAN & Aadhaar)", category: "identity", isMandatory: true, issuingAuthority: "UIDAI & IT Dept", description: "Identity check" },
      { id: "DOC-DPR-06", name: "Detailed Project Report (DPR)", category: "business_project", isMandatory: true, issuingAuthority: "Chartered Accountant / Consultant", description: "Revenue projections and asset breakdown" },
      { id: "DOC-UDYAM-09", name: "Udyam Registration Certificate", category: "business_project", isMandatory: true, issuingAuthority: "Ministry of MSME", description: "MSME registration" },
      { id: "DOC-BNK-05", name: "12 Months Audited / Bank Statement", category: "banking", isMandatory: true, issuingAuthority: "Bank Branch", description: "Cash flow statement" }
    ],
    applicationProcess: [
      { stepNumber: 1, title: "DPR & Sanction Request", description: "Submit detailed project report and equipment quotes via PSBLoansIn59Minutes or branch.", estimatedTimeline: "3 days", responsibleEntity: "Applicant" },
      { stepNumber: 2, title: "Credit Appraisal & Scrutiny", description: "Bank assesses debt-service coverage ratio (DSCR) and approves collateral-free coverage under CGFMU.", estimatedTimeline: "7-10 days", responsibleEntity: "MSME Credit Desk" },
      { stepNumber: 3, title: "Term Loan & Cash Credit Release", description: "Disbursement in phases aligned with asset procurement schedule.", estimatedTimeline: "4 days", responsibleEntity: "Branch Manager" }
    ],
    sourceDocuments: [
      { documentTitle: "PMMY Tarun Scheme Operational Handbook", circularNumber: "DFS/TARUN/2024", issuingMinistry: "Department of Financial Services, Govt of India", officialUrl: "https://www.mudra.org.in" }
    ],
    lastVerifiedAt: new Date("2024-02-01T00:00:00Z"),
    isDemoData: false
  },
  {
    _id: "SCHEME-PM-VISHWAKARMA-09",
    name: "PM Vishwakarma Yojana",
    shortName: "PM Vishwakarma",
    category: "artisan",
    purpose: ["business", "artisan", "pottery", "craft", "tailoring", "carpentry", "blacksmith", "weaver", "handicrafts", "artisan_crafts", "sculptor"],
    targetBeneficiary: "Traditional artisans and craftspersons engaged in 18 recognized family trades working with hands and tools",
    incomeLimit: 0,
    projectCostLimit: 300000,
    minProjectCost: 15000,
    maxLoanAmount: 300000,
    maxLoanPercentage: 95,
    promoterContributionPct: 5,
    interestRate: 5.0,
    interestRateType: "subsidized",
    maxTenureMonths: 48,
    minTenureMonths: 18,
    moratoriumMonths: 3,
    moratoriumDetails: "3 months moratorium; 1st tranche ₹1L over 18 mo, 2nd tranche ₹2L over 30 mo",
    repaymentFrequency: "monthly",
    channelPartnerTypes: ["PSB", "RRB", "District MSME Centre"],
    eligibilityRules: [
      {
        field: "amount",
        operator: "lte",
        value: 300000,
        description: "Assistance up to ₹3,00,000 (Tranche 1: ₹1L, Tranche 2: ₹2L)"
      },
      {
        field: "purpose",
        operator: "in",
        value: ["business", "artisan", "pottery", "craft", "tailoring", "carpentry", "blacksmith", "weaver", "handicrafts", "artisan_crafts", "sculptor"],
        description: "Must practice one of 18 designated traditional artisan trades"
      }
    ],
    documents: [
      { id: "DOC-ID-01", name: "Aadhaar Card Linked to Mobile", category: "identity", isMandatory: true, issuingAuthority: "UIDAI", description: "Biometric identity verification" },
      { id: "DOC-VSH-10", name: "PM Vishwakarma Certificate & Digital ID", category: "business_project", isMandatory: true, issuingAuthority: "Ministry of MSME / Gram Panchayat", description: "Verification by Gram Panchayat / ULB" },
      { id: "DOC-BNK-05", name: "Bank Passbook Copy", category: "banking", isMandatory: true, issuingAuthority: "Scheduled Bank", description: "Account for ₹15,000 toolkit e-voucher" }
    ],
    applicationProcess: [
      { stepNumber: 1, title: "CSC Biometric Registration", description: "Free enrollment at nearest Common Services Centre (CSC) with trade declaration.", estimatedTimeline: "1 day", responsibleEntity: "Applicant & CSC" },
      { stepNumber: 2, title: "Panchayat / ULB Verification", description: "Local authority verifies artisan vocation and issues PM Vishwakarma ID.", estimatedTimeline: "5 days", responsibleEntity: "Gram Pradhan / Ward Officer" },
      { stepNumber: 3, title: "Basic Skill Training & Toolkit", description: "5-7 days basic training with ₹500/day stipend and ₹15,000 toolkit e-voucher.", estimatedTimeline: "7 days", responsibleEntity: "Skill Development Centre" },
      { stepNumber: 4, title: "Concessional 5% Loan Sanction", description: "Collateral-free credit sanctioned at highly subsidized 5.0% interest rate.", estimatedTimeline: "3 days", responsibleEntity: "Partner Bank Branch" }
    ],
    sourceDocuments: [
      { documentTitle: "PM Vishwakarma Central Sector Scheme Guidelines", circularNumber: "MSME/VISHWAKARMA/2023-24", issuingMinistry: "Ministry of Micro, Small and Medium Enterprises, Govt. of India", officialUrl: "https://pmvishwakarma.gov.in" }
    ],
    lastVerifiedAt: new Date("2024-03-01T00:00:00Z"),
    isDemoData: false
  },
  {
    _id: "SCHEME-PMEGP-10",
    name: "Prime Minister's Employment Generation Programme",
    shortName: "PMEGP",
    category: "subsidy",
    purpose: ["business", "manufacturing", "services", "food_processing", "tailoring_unit", "solar", "small_industry", "retail"],
    targetBeneficiary: "New micro-enterprises in manufacturing (up to ₹50L) and service sector (up to ₹20L) generating local employment",
    incomeLimit: 0,
    projectCostLimit: 5000000,
    minProjectCost: 100000,
    maxLoanAmount: 4750000,
    maxLoanPercentage: 95,
    promoterContributionPct: 5,
    interestRate: 9.0,
    interestRateType: "fixed",
    maxTenureMonths: 84,
    minTenureMonths: 36,
    moratoriumMonths: 6,
    moratoriumDetails: "6 months grace period on principal repayment during project setup",
    repaymentFrequency: "monthly",
    channelPartnerTypes: ["KVIC", "KVIB", "DIC", "PSB"],
    eligibilityRules: [
      {
        field: "amount",
        operator: "lte",
        value: 4750000,
        description: "Assistance eligible for projects up to ₹50 Lakh (Manufacturing) or ₹20 Lakh (Services)"
      },
      {
        field: "purpose",
        operator: "in",
        value: ["business", "manufacturing", "services", "food_processing", "tailoring_unit", "solar", "small_industry", "retail"],
        description: "Must establish a viable new non-farm enterprise"
      }
    ],
    documents: [
      { id: "DOC-ID-01", name: "Aadhaar Card, PAN Card, Photo", category: "identity", isMandatory: true, issuingAuthority: "UIDAI & IT Dept", description: "Identity proofs" },
      { id: "DOC-DPR-06", name: "Project Cost Report / Financial Model", category: "business_project", isMandatory: true, issuingAuthority: "KVIC / CA / DIC", description: "Cost breakdown of machinery and working capital" },
      { id: "DOC-EDP-11", name: "EDP Training Certificate", category: "business_project", isMandatory: true, issuingAuthority: "KVIC / RSETI", description: "Entrepreneurship Development training" },
      { id: "DOC-CST-03", name: "Special Category Certificate (if claiming 35% subsidy)", category: "income_caste", isMandatory: false, issuingAuthority: "Competent Authority", description: "SC/ST/OBC/Women/Rural certificate for higher subsidy" }
    ],
    applicationProcess: [
      { stepNumber: 1, title: "Online e-Portal Submission", description: "Apply online at kviconline.gov.in with project report and preferred bank branch.", estimatedTimeline: "2 days", responsibleEntity: "Applicant" },
      { stepNumber: 2, title: "Task Force Committee Review", description: "District Task Force Committee vets project viability and forwards to bank.", estimatedTimeline: "10-14 days", responsibleEntity: "DIC / KVIC Task Force" },
      { stepNumber: 3, title: "Sanction & Margin Money Subsidy", description: "Bank sanctions loan; government deposits 15% - 35% margin money subsidy in lock-in TDR.", estimatedTimeline: "14 days", responsibleEntity: "Lending Bank Branch" }
    ],
    sourceDocuments: [
      { documentTitle: "PMEGP Scheme Guidelines 2024-25", circularNumber: "PMEGP/KVIC/2024-02", issuingMinistry: "Ministry of MSME, Govt. of India", officialUrl: "https://www.kviconline.gov.in" }
    ],
    lastVerifiedAt: new Date("2024-02-15T00:00:00Z"),
    isDemoData: false
  },
  {
    _id: "SCHEME-STANDUP-INDIA-11",
    name: "Stand-Up India Scheme for SC, ST & Women Entrepreneurs",
    shortName: "Stand-Up India",
    category: "term_loan",
    purpose: ["business", "manufacturing", "services", "trading", "tech", "solar", "food_processing", "dairy"],
    targetBeneficiary: "At least one SC or ST borrower and at least one woman borrower per bank branch for greenfield enterprises",
    incomeLimit: 0,
    projectCostLimit: 12000000,
    minProjectCost: 1000000,
    maxLoanAmount: 10000000,
    maxLoanPercentage: 85,
    promoterContributionPct: 15,
    interestRate: 8.25,
    interestRateType: "floating",
    maxTenureMonths: 84,
    minTenureMonths: 24,
    moratoriumMonths: 18,
    moratoriumDetails: "Up to 18 months extended moratorium on principal repayment",
    repaymentFrequency: "monthly",
    channelPartnerTypes: ["PSB", "SIDBI", "Commercial Bank"],
    eligibilityRules: [
      {
        field: "amount",
        operator: "lte",
        value: 10000000,
        description: "Composite loan between ₹10 Lakh and ₹100 Lakh (1 Crore)"
      },
      {
        field: "purpose",
        operator: "in",
        value: ["business", "manufacturing", "services", "trading", "tech", "solar", "food_processing", "dairy"],
        description: "Must be a first-time greenfield enterprise"
      }
    ],
    documents: [
      { id: "DOC-ID-01", name: "KYC of Promoters (PAN, Aadhaar, Passport)", category: "identity", isMandatory: true, issuingAuthority: "UIDAI & IT Dept", description: "Identity verification" },
      { id: "DOC-CST-03", name: "SC/ST Certificate or Proof of Woman Entrepreneurship", category: "income_caste", isMandatory: true, issuingAuthority: "SDO / District Magistrate", description: "Target group verification (51%+ female or SC/ST holding)" },
      { id: "DOC-DPR-06", name: "Techno-Economic Feasibility Report (DPR)", category: "business_project", isMandatory: true, issuingAuthority: "Accredited Financial Consultant / CA", description: "Comprehensive cash flow, breakeven, and vendor quotes" },
      { id: "DOC-PRM-07", name: "Margin Money Proof (15% Equity)", category: "banking", isMandatory: true, issuingAuthority: "Bank Statement", description: "Proof of promoter margin contribution" }
    ],
    applicationProcess: [
      { stepNumber: 1, title: "Portal Registration & SIDBI Connect", description: "Register on standupmitra.in and connect with local Lead District Manager.", estimatedTimeline: "3 days", responsibleEntity: "Applicant & StandUp Mitra" },
      { stepNumber: 2, title: "Appraisal by Scheduled Bank Branch", description: "Branch evaluates greenfield project, term loan, and working capital component.", estimatedTimeline: "15-20 days", responsibleEntity: "Bank Chief Manager" },
      { stepNumber: 3, title: "Composite Sanction & Staged Disbursal", description: "Execution of loan agreement and staged release against capital machinery bills.", estimatedTimeline: "7 days", responsibleEntity: "Bank Lending Desk" }
    ],
    sourceDocuments: [
      { documentTitle: "Stand-Up India Scheme Operational Circular", circularNumber: "DFS/SUI/2024/05", issuingMinistry: "Department of Financial Services, Ministry of Finance, Govt of India", officialUrl: "https://www.standupmitra.in" }
    ],
    lastVerifiedAt: new Date("2024-01-20T00:00:00Z"),
    isDemoData: false
  },
  {
    _id: "SCHEME-NABARD-DAIRY-12",
    name: "NABARD Dairy Entrepreneurship & Animal Husbandry Scheme",
    shortName: "NABARD Dairy Scheme",
    category: "agriculture",
    purpose: ["agriculture", "dairy", "dairy_farming", "cattle", "cow", "buffalo", "milk", "vermicompost", "animal_husbandry", "food_processing"],
    targetBeneficiary: "Dairy farmers, individual rural entrepreneurs, and self-help groups setting up modern small dairy units",
    incomeLimit: 0,
    projectCostLimit: 1000000,
    minProjectCost: 50000,
    maxLoanAmount: 700000,
    maxLoanPercentage: 85,
    promoterContributionPct: 15,
    interestRate: 7.0,
    interestRateType: "subsidized",
    maxTenureMonths: 60,
    minTenureMonths: 24,
    moratoriumMonths: 6,
    moratoriumDetails: "6 months grace period for livestock acclimatization and milk production ramp-up",
    repaymentFrequency: "monthly",
    channelPartnerTypes: ["RRB", "Cooperative Bank", "PSB", "NABARD"],
    eligibilityRules: [
      {
        field: "amount",
        operator: "lte",
        value: 700000,
        description: "Assistance up to ₹7,00,000 for 2 to 10 milch animals, milking machines & sheds"
      },
      {
        field: "purpose",
        operator: "in",
        value: ["agriculture", "dairy", "dairy_farming", "cattle", "cow", "buffalo", "milk", "vermicompost", "animal_husbandry", "food_processing"],
        description: "Must be a recognized dairy or livestock enterprise"
      }
    ],
    documents: [
      { id: "DOC-ID-01", name: "Aadhaar Card & Land/Lease Record", category: "identity", isMandatory: true, issuingAuthority: "UIDAI & Land Revenue Dept", description: "Address and shed location proof" },
      { id: "DOC-VET-12", name: "Veterinary Health Certificate of Cattle", category: "business_project", isMandatory: true, issuingAuthority: "Government Veterinary Officer", description: "Health and yield certification of animals" },
      { id: "DOC-PRJ-04", name: "Dairy Unit Cost Quotation", category: "business_project", isMandatory: true, issuingAuthority: "Livestock Vendor / Dairy Cooperative", description: "Cost of milch animals, cattle insurance, and shed construction" }
    ],
    applicationProcess: [
      { stepNumber: 1, title: "Project Proposal Submission", description: "Submit dairy project plan to nearest Regional Rural Bank (RRB) or Cooperative Bank.", estimatedTimeline: "2 days", responsibleEntity: "Applicant" },
      { stepNumber: 2, title: "Field Inspection & Technical Approval", description: "Veterinary officer and bank manager inspect fodder availability and shed location.", estimatedTimeline: "7 days", responsibleEntity: "Field Officer & Vet Doctor" },
      { stepNumber: 3, title: "Disbursal & NABARD Capital Subsidy", description: "Loan disbursed; NABARD deposits back-ended capital subsidy (25% Gen / 33.33% SC/ST).", estimatedTimeline: "10 days", responsibleEntity: "Financing Bank & NABARD" }
    ],
    sourceDocuments: [
      { documentTitle: "NABARD Animal Husbandry Infrastructure Development Circular", circularNumber: "NABARD/AHIDF/2024", issuingMinistry: "Ministry of Fisheries, Animal Husbandry & Dairying, Govt of India", officialUrl: "https://www.nabard.org" }
    ],
    lastVerifiedAt: new Date("2024-02-10T00:00:00Z"),
    isDemoData: false
  },
  {
    _id: "SCHEME-PM-SVANIDHI-13",
    name: "PM SVANidhi — Scheme for Street Vendors",
    shortName: "PM SVANidhi",
    category: "microfinance",
    purpose: ["business", "vendor", "street_vendor", "retail", "hawker", "food_cart", "tea_stall", "small_trade"],
    targetBeneficiary: "Urban street vendors, mobile food hawkers, and small sidewalk traders resuming or scaling livelihoods",
    incomeLimit: 0,
    projectCostLimit: 50000,
    minProjectCost: 5000,
    maxLoanAmount: 50000,
    maxLoanPercentage: 100,
    promoterContributionPct: 0,
    interestRate: 7.0,
    interestRateType: "subsidized",
    maxTenureMonths: 12,
    minTenureMonths: 12,
    moratoriumMonths: 0,
    moratoriumDetails: "Zero moratorium; 1st tranche ₹10,000, 2nd tranche ₹20,000, 3rd tranche ₹50,000 with 7% interest subsidy",
    repaymentFrequency: "monthly",
    channelPartnerTypes: ["PSB", "RRB", "Urban Local Body (ULB)", "SFB"],
    eligibilityRules: [
      {
        field: "amount",
        operator: "lte",
        value: 50000,
        description: "Micro working capital tranche from ₹10,000 up to ₹50,000"
      },
      {
        field: "purpose",
        operator: "in",
        value: ["business", "vendor", "street_vendor", "retail", "hawker", "food_cart", "tea_stall", "small_trade"],
        description: "Applicant must be an active urban street vendor"
      }
    ],
    documents: [
      { id: "DOC-ID-01", name: "Aadhaar Card Linked to Bank Account", category: "identity", isMandatory: true, issuingAuthority: "UIDAI", description: "Direct benefit transfer verification" },
      { id: "DOC-VND-13", name: "Certificate of Vending / LOR from Urban Local Body", category: "business_project", isMandatory: true, issuingAuthority: "Municipal Corporation / Town Vending Committee", description: "Official Letter of Recommendation (LOR) or vending ID" }
    ],
    applicationProcess: [
      { stepNumber: 1, title: "Direct Mobile / Portal Filing", description: "Apply on pmsvanidhi.mohua.gov.in using Aadhaar mobile OTP.", estimatedTimeline: "10 minutes", responsibleEntity: "Vendor / Banking Correspondent" },
      { stepNumber: 2, title: "Municipal ULB Authentication", description: "Automated LOR / Vending certificate validation with Town Vending Committee.", estimatedTimeline: "2-3 days", responsibleEntity: "Municipal Nodal Officer" },
      { stepNumber: 3, title: "Instant Bank Credit & QR Code Setup", description: "Loan credited directly to account with UPI QR code provided for digital transaction cashback.", estimatedTimeline: "1-2 days", responsibleEntity: "Designated Lending Bank" }
    ],
    sourceDocuments: [
      { documentTitle: "PM SVANidhi Operational Guidelines 2024", circularNumber: "MOHUA/SVANIDHI/2024/01", issuingMinistry: "Ministry of Housing and Urban Affairs, Govt of India", officialUrl: "https://pmsvanidhi.mohua.gov.in" }
    ],
    lastVerifiedAt: new Date("2024-03-01T00:00:00Z"),
    isDemoData: false
  },
  {
    _id: "SCHEME-STARTUP-INDIA-SEED-14",
    name: "Startup India Seed Fund Scheme (SISFS)",
    shortName: "Startup India Seed Fund",
    category: "startup",
    purpose: ["business", "startup", "tech", "tech_startup", "software", "innovation", "ai", "biotech", "solar"],
    targetBeneficiary: "Early-stage innovative startups recognized by DPIIT requiring seed capital for prototype validation, field trials, and market entry",
    incomeLimit: 0,
    projectCostLimit: 5000000,
    minProjectCost: 200000,
    maxLoanAmount: 5000000,
    maxLoanPercentage: 90,
    promoterContributionPct: 10,
    interestRate: 5.5,
    interestRateType: "concessional",
    maxTenureMonths: 60,
    minTenureMonths: 24,
    moratoriumMonths: 12,
    moratoriumDetails: "Up to 12 months moratorium on debt repayment; grants of up to ₹20L require zero debt repayment",
    repaymentFrequency: "monthly",
    channelPartnerTypes: ["DPIIT Incubator", "SIDBI", "Scheduled Commercial Bank"],
    eligibilityRules: [
      {
        field: "amount",
        operator: "lte",
        value: 5000000,
        description: "Up to ₹20 Lakh grant for PoC / prototype and up to ₹50 Lakh convertible debentures / debt"
      },
      {
        field: "purpose",
        operator: "in",
        value: ["business", "startup", "tech", "tech_startup", "software", "innovation", "ai", "biotech", "solar"],
        description: "Must be an innovative technology or scalable product enterprise"
      }
    ],
    documents: [
      { id: "DOC-DPIIT-14", name: "DPIIT Startup Recognition Certificate", category: "business_project", isMandatory: true, issuingAuthority: "DPIIT, Ministry of Commerce & Industry", description: "Official startup recognition number" },
      { id: "DOC-DPR-06", name: "Product Roadmap, Tech Architecture & Pitch Deck", category: "business_project", isMandatory: true, issuingAuthority: "Founding Team", description: "Technology overview, market size, and milestones" },
      { id: "DOC-BNK-05", name: "Company Current Bank Account Details", category: "banking", isMandatory: true, issuingAuthority: "Any Scheduled Bank", description: "Incorporated entity bank details" }
    ],
    applicationProcess: [
      { stepNumber: 1, title: "Online Incubator Selection", description: "Apply via seedfund.startupindia.gov.in and select up to 3 accredited incubators.", estimatedTimeline: "2 days", responsibleEntity: "Startup Founder" },
      { stepNumber: 2, title: "Incubator Pitch Presentation", description: "Present prototype and business plan before the Incubator Seed Management Committee (ISMC).", estimatedTimeline: "14-21 days", responsibleEntity: "ISMC Evaluation Board" },
      { stepNumber: 3, title: "Milestone-Based Grant / Debt Release", description: "Funds disbursed in tranches tied to technical development and validation milestones.", estimatedTimeline: "7 days", responsibleEntity: "Partner Incubator & DPIIT" }
    ],
    sourceDocuments: [
      { documentTitle: "Startup India Seed Fund Scheme Guidelines", circularNumber: "DPIIT/SISFS/2024", issuingMinistry: "Ministry of Commerce and Industry, Govt of India", officialUrl: "https://seedfund.startupindia.gov.in" }
    ],
    lastVerifiedAt: new Date("2024-01-30T00:00:00Z"),
    isDemoData: false
  }
];

export const demoPartners = [
  // Kolkata / West Bengal Partners
  {
    _id: "PARTNER-KOL-SCA-01",
    name: "West Bengal SC, ST & OBC Development & Finance Corporation",
    shortCode: "WBSCSTDFCL",
    type: "SCA",
    authorizedSchemes: [
      "SCHEME-NSFDC-MF-01",
      "SCHEME-NSFDC-AMFY-02",
      "SCHEME-NSFDC-TL-03",
      "SCHEME-NSFDC-UNY-04",
      "SCHEME-NSFDC-ELS-05",
      "SCHEME-PM-VISHWAKARMA-09",
      "SCHEME-STANDUP-INDIA-11"
    ],
    address: "Bikash Bhavan, North Block, 5th Floor, DF Block, Sector 1, Bidhannagar",
    city: "Kolkata",
    district: "North 24 Parganas / Kolkata",
    state: "West Bengal",
    pincode: "700091",
    location: { type: "Point", coordinates: [88.4172, 22.5867] },
    contact: {
      phone: "+91 33 2334 1234",
      email: "contact@wbscstdfcl.gov.in",
      nodalOfficerName: "Debabrata Sen (District Nodal Officer)",
      officeHours: "Mon-Fri 10:00 AM - 5:30 PM"
    },
    status: "active",
    verificationStatus: "verified_partner_branch",
    isDemoData: true,
    notes: "Nodal State Channelising Agency for West Bengal. Accredited for direct subsidy and concessional micro-credit release."
  },
  {
    _id: "PARTNER-KOL-PSB-02",
    name: "Punjab National Bank — BBD Bagh Commercial Branch",
    shortCode: "PNB-BBD",
    type: "PSB",
    authorizedSchemes: [
      "SCHEME-NSFDC-MF-01",
      "SCHEME-NSFDC-TL-03",
      "SCHEME-NSFDC-ELS-05",
      "SCHEME-MUDRA-SHISHU-06",
      "SCHEME-MUDRA-KISHORE-07",
      "SCHEME-MUDRA-TARUN-08",
      "SCHEME-PM-VISHWAKARMA-09",
      "SCHEME-PMEGP-10",
      "SCHEME-STANDUP-INDIA-11",
      "SCHEME-PM-SVANIDHI-13"
    ],
    address: "AG & Commercial Branch, 8 Council House Street, Dalhousie",
    city: "Kolkata",
    district: "Kolkata",
    state: "West Bengal",
    pincode: "700001",
    location: { type: "Point", coordinates: [88.3478, 22.5697] },
    contact: {
      phone: "+91 33 2248 5678",
      email: "bo4500@pnb.co.in",
      nodalOfficerName: "Priyanka Mukherjee (Chief Manager - MSME Desk)",
      officeHours: "Mon-Sat 10:00 AM - 4:00 PM"
    },
    status: "active",
    verificationStatus: "verified_partner_branch",
    isDemoData: true,
    notes: "Accredited Public Sector Bank for direct term-loan, MUDRA, and PM Vishwakarma disbursement."
  },
  {
    _id: "PARTNER-KOL-RRB-03",
    name: "Bangiya Gramin Vikash Bank — Barasat Regional Office",
    shortCode: "BGVB-BRS",
    type: "RRB",
    authorizedSchemes: [
      "SCHEME-NSFDC-MF-01",
      "SCHEME-NSFDC-AMFY-02",
      "SCHEME-NSFDC-TL-03",
      "SCHEME-MUDRA-SHISHU-06",
      "SCHEME-MUDRA-KISHORE-07",
      "SCHEME-PM-VISHWAKARMA-09",
      "SCHEME-NABARD-DAIRY-12",
      "SCHEME-PM-SVANIDHI-13"
    ],
    address: "48/1 Jessore Road, Champadali More, Barasat",
    city: "Kolkata",
    district: "North 24 Parganas",
    state: "West Bengal",
    pincode: "700124",
    location: { type: "Point", coordinates: [88.4823, 22.7214] },
    contact: {
      phone: "+91 33 2584 9012",
      email: "robarasat@bgvb.co.in",
      nodalOfficerName: "Alok Roy (Senior Manager - Priority Lending)",
      officeHours: "Mon-Fri 10:00 AM - 4:30 PM"
    },
    status: "active",
    verificationStatus: "verified_partner_branch",
    isDemoData: true,
    notes: "Regional Rural Bank with dedicated rural and semi-urban micro-enterprise and dairy credit windows."
  },
  {
    _id: "PARTNER-KOL-SFB-04",
    name: "Bandhan Bank — Gariahat Micro-Banking Unit",
    shortCode: "BANDHAN-GRH",
    type: "SFB",
    authorizedSchemes: [
      "SCHEME-NSFDC-AMFY-02",
      "SCHEME-NSFDC-UNY-04",
      "SCHEME-MUDRA-SHISHU-06",
      "SCHEME-MUDRA-KISHORE-07",
      "SCHEME-PM-SVANIDHI-13"
    ],
    address: "128 Rashbehari Avenue, Gariahat Crossing",
    city: "Kolkata",
    district: "South Kolkata",
    state: "West Bengal",
    pincode: "700029",
    location: { type: "Point", coordinates: [88.3654, 22.5186] },
    contact: {
      phone: "+91 33 2460 3344",
      email: "gariahat.branch@bandhanbank.com",
      nodalOfficerName: "Sharmistha Ghosh (Branch Head)",
      officeHours: "Mon-Sat 9:30 AM - 4:30 PM"
    },
    status: "active",
    verificationStatus: "verified_partner_branch",
    isDemoData: true,
    notes: "Small Finance Bank micro-credit unit specializing in retail, street vendor and artisan livelihood financing."
  },

  // Delhi NCR Partners
  {
    _id: "PARTNER-DEL-SCA-05",
    name: "Delhi SC/ST/OBC/Minorities Financial & Development Corp (DSFDC)",
    shortCode: "DSFDC-DEL",
    type: "SCA",
    authorizedSchemes: [
      "SCHEME-NSFDC-MF-01",
      "SCHEME-NSFDC-TL-03",
      "SCHEME-NSFDC-ELS-05",
      "SCHEME-PM-VISHWAKARMA-09",
      "SCHEME-STANDUP-INDIA-11"
    ],
    address: "Ambedkar Bhawan, Sector 16, Rohini, New Delhi",
    city: "Delhi",
    district: "North West Delhi",
    state: "Delhi",
    pincode: "110089",
    location: { type: "Point", coordinates: [77.1245, 28.7154] },
    contact: {
      phone: "+91 11 2788 4500",
      email: "dsfdc.delhi@gov.in",
      nodalOfficerName: "Rajeev Mehra (Zonal Officer)",
      officeHours: "Mon-Fri 9:30 AM - 5:30 PM"
    },
    status: "active",
    verificationStatus: "verified_partner_branch",
    isDemoData: true,
    notes: "State Apex Corporation for Delhi National Capital Territory."
  },
  {
    _id: "PARTNER-DEL-PSB-06",
    name: "State Bank of India — Parliament Street MSME Centre",
    shortCode: "SBI-DEL-MSME",
    type: "PSB",
    authorizedSchemes: [
      "SCHEME-MUDRA-SHISHU-06",
      "SCHEME-MUDRA-KISHORE-07",
      "SCHEME-MUDRA-TARUN-08",
      "SCHEME-PM-VISHWAKARMA-09",
      "SCHEME-PMEGP-10",
      "SCHEME-STANDUP-INDIA-11",
      "SCHEME-STARTUP-INDIA-SEED-14"
    ],
    address: "11 Parliament Street, Connaught Place",
    city: "Delhi",
    district: "New Delhi",
    state: "Delhi",
    pincode: "110001",
    location: { type: "Point", coordinates: [77.2144, 28.6271] },
    contact: {
      phone: "+91 11 2337 4000",
      email: "sbi.00691@sbi.co.in",
      nodalOfficerName: "Ananya Sharma (Assistant General Manager - MSME)",
      officeHours: "Mon-Sat 10:00 AM - 4:00 PM"
    },
    status: "active",
    verificationStatus: "verified_partner_branch",
    isDemoData: true,
    notes: "Premier SBI Commercial and MSME Hub handling Stand-Up India and Startup credit."
  },

  // Varanasi / Uttar Pradesh Partners
  {
    _id: "PARTNER-VAR-SCA-07",
    name: "UP Scheduled Castes Finance & Development Corp — Varanasi",
    shortCode: "UPSCFDC-VAR",
    type: "SCA",
    authorizedSchemes: [
      "SCHEME-NSFDC-MF-01",
      "SCHEME-NSFDC-AMFY-02",
      "SCHEME-NSFDC-TL-03",
      "SCHEME-PM-VISHWAKARMA-09",
      "SCHEME-PMEGP-10"
    ],
    address: "Vikas Bhawan, Kachhari, Varanasi",
    city: "Varanasi",
    district: "Varanasi",
    state: "Uttar Pradesh",
    pincode: "221002",
    location: { type: "Point", coordinates: [82.9739, 25.3176] },
    contact: {
      phone: "+91 542 250 8890",
      email: "dwo.varanasi@up.gov.in",
      nodalOfficerName: "Sanjay Kumar Verma (District Welfare Officer)",
      officeHours: "Mon-Fri 10:00 AM - 5:00 PM"
    },
    status: "active",
    verificationStatus: "verified_partner_branch",
    isDemoData: true,
    notes: "Nodal body for Varanasi silk weavers, pottery artisans, and micro-entrepreneurs."
  },
  {
    _id: "PARTNER-VAR-RRB-08",
    name: "Baroda UP Bank — Maldahiya Regional Hub",
    shortCode: "BUPB-VAR",
    type: "RRB",
    authorizedSchemes: [
      "SCHEME-MUDRA-SHISHU-06",
      "SCHEME-MUDRA-KISHORE-07",
      "SCHEME-PM-VISHWAKARMA-09",
      "SCHEME-NABARD-DAIRY-12",
      "SCHEME-PM-SVANIDHI-13"
    ],
    address: "C-27/274 Maldahiya Crossing, Varanasi",
    city: "Varanasi",
    district: "Varanasi",
    state: "Uttar Pradesh",
    pincode: "221001",
    location: { type: "Point", coordinates: [82.9882, 25.3216] },
    contact: {
      phone: "+91 542 222 1450",
      email: "maldahiya@barodauprrb.co.in",
      nodalOfficerName: "Rakesh Tripathi (Chief Manager)",
      officeHours: "Mon-Sat 10:00 AM - 4:30 PM"
    },
    status: "active",
    verificationStatus: "verified_partner_branch",
    isDemoData: true,
    notes: "Primary Regional Rural Bank financing dairy units, weavers and local street vendors."
  },

  // Jaipur / Rajasthan Partners
  {
    _id: "PARTNER-JAI-PSB-09",
    name: "Bank of Baroda — MI Road SME Branch",
    shortCode: "BOB-JAI",
    type: "PSB",
    authorizedSchemes: [
      "SCHEME-MUDRA-SHISHU-06",
      "SCHEME-MUDRA-KISHORE-07",
      "SCHEME-MUDRA-TARUN-08",
      "SCHEME-PM-VISHWAKARMA-09",
      "SCHEME-PMEGP-10",
      "SCHEME-STANDUP-INDIA-11"
    ],
    address: "Anand Bhawan, Sansar Chandra Road, MI Road",
    city: "Jaipur",
    district: "Jaipur",
    state: "Rajasthan",
    pincode: "302001",
    location: { type: "Point", coordinates: [75.8056, 26.9196] },
    contact: {
      phone: "+91 141 237 8900",
      email: "sme.jaipur@bankofbaroda.com",
      nodalOfficerName: "Sunita Rathore (Lead District Manager)",
      officeHours: "Mon-Sat 10:00 AM - 4:00 PM"
    },
    status: "active",
    verificationStatus: "verified_partner_branch",
    isDemoData: true,
    notes: "Key hub for handicraft artisans, gem cutting units, and textile micro-enterprises."
  },

  // Bengaluru / Karnataka Partners
  {
    _id: "PARTNER-BLR-PSB-10",
    name: "Canara Bank — SME Specialised Branch Gandhinagar",
    shortCode: "CANARA-BLR",
    type: "PSB",
    authorizedSchemes: [
      "SCHEME-MUDRA-KISHORE-07",
      "SCHEME-MUDRA-TARUN-08",
      "SCHEME-PMEGP-10",
      "SCHEME-STANDUP-INDIA-11",
      "SCHEME-STARTUP-INDIA-SEED-14"
    ],
    address: "Canara Bank Building, 5th Main Road, Gandhinagar",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    state: "Karnataka",
    pincode: "560009",
    location: { type: "Point", coordinates: [77.5786, 12.9774] },
    contact: {
      phone: "+91 80 2226 7800",
      email: "cb0402@canarabank.com",
      nodalOfficerName: "Venkat Ramanathan (Senior Manager - Startup Desk)",
      officeHours: "Mon-Sat 10:00 AM - 4:00 PM"
    },
    status: "active",
    verificationStatus: "verified_partner_branch",
    isDemoData: true,
    notes: "Specialised tech startup and MSME financing branch."
  }
];
