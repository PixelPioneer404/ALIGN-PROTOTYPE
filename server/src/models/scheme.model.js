import mongoose from 'mongoose';

const eligibilityRuleSchema = new mongoose.Schema({
  field: { type: String, required: true },
  operator: { type: String, enum: ['lte', 'gte', 'eq', 'in', 'range'], required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  description: { type: String, required: true }
}, { _id: false });

const documentItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['identity', 'income_caste', 'business_project', 'banking'],
    required: true 
  },
  isMandatory: { type: Boolean, default: true },
  issuingAuthority: { type: String, required: true },
  description: { type: String, required: true }
}, { _id: false });

const applicationStepSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  estimatedTimeline: { type: String, required: true },
  responsibleEntity: { type: String, required: true }
}, { _id: false });

const sourceDocumentSchema = new mongoose.Schema({
  documentTitle: { type: String, required: true },
  circularNumber: { type: String },
  issuingMinistry: { type: String, required: true },
  officialUrl: { type: String, required: true }
}, { _id: false });

const interestRateVariantSchema = new mongoose.Schema({
  channelPartnerType: { type: String, required: true },
  rate: { type: Number, required: true }
}, { _id: false });

const schemeSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // e.g. 'SCHEME-NSFDC-MF-01'
  name: { type: String, required: true },
  shortName: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['microfinance', 'term_loan', 'education', 'self_employment'],
    required: true 
  },
  purpose: [{ type: String, required: true }],
  targetBeneficiary: { type: String, required: true },
  
  // Financial parameters
  incomeLimit: { type: Number, default: 500000 },
  projectCostLimit: { type: Number, required: true },
  minProjectCost: { type: Number, default: 0 },
  maxLoanAmount: { type: Number, required: true },
  maxLoanPercentage: { type: Number, default: 90 },
  promoterContributionPct: { type: Number, default: 0 },
  
  // Interest & Tenure
  interestRate: { type: Number, required: true },
  interestRateType: { 
    type: String, 
    enum: ['fixed', 'tiered', 'channel_dependent'],
    default: 'fixed'
  },
  interestRateVariants: [interestRateVariantSchema],
  maxTenureMonths: { type: Number, required: true },
  minTenureMonths: { type: Number, default: 12 },
  moratoriumMonths: { type: Number, default: 0 },
  moratoriumDetails: { type: String },
  repaymentFrequency: { 
    type: String, 
    enum: ['monthly', 'quarterly'],
    default: 'monthly' 
  },
  
  // Logic, Docs & Process
  eligibilityRules: [eligibilityRuleSchema],
  documents: [documentItemSchema],
  applicationProcess: [applicationStepSchema],
  channelPartnerTypes: [{ type: String, required: true }],
  
  // Provenance & Audit
  sourceDocuments: [sourceDocumentSchema],
  lastVerifiedAt: { type: Date, default: Date.now },
  isDemoData: { type: Boolean, default: false }
}, {
  timestamps: true,
  _id: false
});

export const Scheme = mongoose.model('Scheme', schemeSchema);
export default Scheme;
