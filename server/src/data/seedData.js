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
  }
];

export const demoPartners = [
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
      "SCHEME-NSFDC-ELS-05"
    ],
    address: "Bikash Bhavan, North Block, 5th Floor, DF Block, Sector 1, Bidhannagar",
    city: "Kolkata",
    district: "North 24 Parganas / Kolkata",
    state: "West Bengal",
    pincode: "700091",
    location: {
      type: "Point",
      coordinates: [88.4172, 22.5867]
    },
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
      "SCHEME-NSFDC-ELS-05"
    ],
    address: "AG & Commercial Branch, 8 Council House Street, Dalhousie",
    city: "Kolkata",
    district: "Kolkata",
    state: "West Bengal",
    pincode: "700001",
    location: {
      type: "Point",
      coordinates: [88.3478, 22.5697]
    },
    contact: {
      phone: "+91 33 2248 5678",
      email: "bo4500@pnb.co.in",
      nodalOfficerName: "Priyanka Mukherjee (Chief Manager - MSME Desk)",
      officeHours: "Mon-Sat 10:00 AM - 4:00 PM"
    },
    status: "active",
    verificationStatus: "verified_partner_branch",
    isDemoData: true,
    notes: "Accredited Public Sector Bank for direct term-loan and micro-credit sanction under NSFDC tri-partite MoU."
  },
  {
    _id: "PARTNER-KOL-RRB-03",
    name: "Bangiya Gramin Vikash Bank — Barasat Regional Office",
    shortCode: "BGVB-BRS",
    type: "RRB",
    authorizedSchemes: [
      "SCHEME-NSFDC-MF-01",
      "SCHEME-NSFDC-AMFY-02",
      "SCHEME-NSFDC-TL-03"
    ],
    address: "48/1 Jessore Road, Champadali More, Barasat",
    city: "Kolkata",
    district: "North 24 Parganas",
    state: "West Bengal",
    pincode: "700124",
    location: {
      type: "Point",
      coordinates: [88.4823, 22.7214]
    },
    contact: {
      phone: "+91 33 2584 9012",
      email: "robarasat@bgvb.co.in",
      nodalOfficerName: "Alok Roy (Senior Manager - Priority Lending)",
      officeHours: "Mon-Fri 10:00 AM - 4:30 PM"
    },
    status: "active",
    verificationStatus: "verified_partner_branch",
    isDemoData: true,
    notes: "Regional Rural Bank with dedicated rural and semi-urban micro-enterprise credit windows."
  },
  {
    _id: "PARTNER-KOL-SFB-04",
    name: "Bandhan Bank — Gariahat Micro-Banking Unit",
    shortCode: "BANDHAN-GRH",
    type: "SFB",
    authorizedSchemes: [
      "SCHEME-NSFDC-AMFY-02",
      "SCHEME-NSFDC-UNY-04"
    ],
    address: "128 Rashbehari Avenue, Gariahat Crossing",
    city: "Kolkata",
    district: "South Kolkata",
    state: "West Bengal",
    pincode: "700029",
    location: {
      type: "Point",
      coordinates: [88.3654, 22.5186]
    },
    contact: {
      phone: "+91 33 2460 3344",
      email: "gariahat.branch@bandhanbank.com",
      nodalOfficerName: "Sharmistha Ghosh (Branch Head)",
      officeHours: "Mon-Sat 9:30 AM - 4:30 PM"
    },
    status: "active",
    verificationStatus: "verified_partner_branch",
    isDemoData: true,
    notes: "Small Finance Bank micro-credit unit specializing in retail and artisan livelihood financing."
  }
];
