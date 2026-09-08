import { parseRequirementDetails } from '../src/services/gemini.service.js';
import dataRepository from '../src/services/dataRepository.js';
import ruleEngineService from '../src/services/ruleEngine.service.js';
import rankingService from '../src/services/ranking.service.js';
import financialService from '../src/services/financial.service.js';
import ragService from '../src/services/rag.service.js';
import pdfService from '../src/services/pdf.service.js';
import fs from 'fs';
import os from 'os';
import path from 'path';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✕ FAILED: ${message}`);
  }
}

async function runComprehensiveTests() {
  console.log('================================================================');
  console.log('STARTING ALIGN EXTENSIVE TEST SUITE: 25+ REAL-WORLD TEST CASES');
  console.log('================================================================\n');

  // --- SECTION 1: PROMPT CLARIFICATION & INTENT PARSING ---
  console.log('--- SECTION 1: Prompt Intent & Underspecified Prompt Detection ---');

  // Test 1: Single-word vague prompt "business"
  const t1 = parseRequirementDetails("business");
  assert(t1.isComplete === false, 'Test 1: "business" must have isComplete: false');
  assert(t1.missingFields.includes('businessType'), 'Test 1: Identifies missing businessType');
  assert(t1.missingFields.includes('amount'), 'Test 1: Identifies missing amount');
  assert(t1.missingFields.includes('annualFamilyIncome'), 'Test 1: Identifies missing annualFamilyIncome');
  assert(t1.missingFields.includes('location'), 'Test 1: Identifies missing location');
  assert(t1.clarificationSuggestions.businessTypes.length > 0, 'Test 1: Provides rich clarification suggestions');

  // Test 2: Single-word vague prompt "loan"
  const t2 = parseRequirementDetails("I need a loan");
  assert(t2.isComplete === false, 'Test 2: "I need a loan" must have isComplete: false');
  assert(t2.missingFields.includes('amount'), 'Test 2: Missing amount flagged');

  // Test 3: Business type only (e.g. "pottery craft workshop")
  const t3 = parseRequirementDetails("I want to open a pottery craft workshop");
  assert(t3.isComplete === false, 'Test 3: Pottery workshop without amount/location is incomplete');
  assert(t3.detected.businessType === 'artisan_crafts', 'Test 3: Correctly extracts artisan_crafts trade');
  assert(t3.missingFields.includes('amount') && t3.missingFields.includes('location'), 'Test 3: Flags missing amount and location');

  // Test 4: Amount only (e.g. "I need ₹2.5 lakh")
  const t4 = parseRequirementDetails("I need ₹2.5 lakh");
  assert(t4.isComplete === false, 'Test 4: Amount only is incomplete');
  assert(t4.detected.amount === 250000, 'Test 4: Extracted ₹2,50,000 correctly');
  assert(t4.missingFields.includes('businessType'), 'Test 4: Flags missing businessType');

  // Test 5: Business and Location but no Amount/Income (e.g. "dairy farm in Barasat")
  const t5 = parseRequirementDetails("I want to start a dairy farm in Barasat with 5 cows");
  assert(t5.isComplete === false, 'Test 5: Dairy in Barasat without funding is incomplete');
  assert(t5.detected.businessType === 'dairy_farming', 'Test 5: Extracted dairy_farming');
  assert(t5.detected.location === 'Barasat', 'Test 5: Extracted location Barasat');
  assert(t5.missingFields.includes('amount'), 'Test 5: Flags missing amount');

  // Test 6: Fully specified prompt - Micro Tailoring
  const t6 = parseRequirementDetails("I need ₹1.2 lakh to start a tailoring business in Kolkata with annual family income of ₹3 lakh");
  assert(t6.isComplete === true, 'Test 6: Full tailoring prompt is complete (no prompt pop-up required)');
  assert(t6.extracted.amount === 120000, 'Test 6: Extracted amount ₹1,20,000');
  assert(t6.extracted.businessType === 'tailoring', 'Test 6: Extracted businessType tailoring');
  assert(t6.extracted.annualFamilyIncome === 300000, 'Test 6: Extracted income ₹3,00,000');
  assert(t6.extracted.location === 'Kolkata', 'Test 6: Extracted location Kolkata');

  // Test 7: Fully specified prompt - Traditional Artisan in Varanasi
  const t7 = parseRequirementDetails("I am an artisan wood craftsman in Varanasi seeking ₹1.5 lakh loan with household income around ₹2 lakh");
  assert(t7.isComplete === true, 'Test 7: Full artisan prompt is complete');
  assert(t7.extracted.businessType === 'artisan_crafts', 'Test 7: Extracted artisan_crafts');
  assert(t7.extracted.location === 'Varanasi', 'Test 7: Extracted Varanasi');

  // Test 8: Fully specified prompt - Urban Street Vendor in Delhi
  const t8 = parseRequirementDetails("I am a street vendor in Delhi needing ₹20,000 working capital for my food cart with family income ₹1.5 lakh");
  assert(t8.isComplete === true, 'Test 8: Full street vendor prompt is complete');
  assert(t8.extracted.amount === 20000, 'Test 8: Extracted ₹20,000');
  assert(t8.extracted.businessType === 'street_vendor', 'Test 8: Extracted street_vendor');

  // Test 9: Fully specified prompt - Women Entrepreneur Greenfield Enterprise
  const t9 = parseRequirementDetails("I am a woman entrepreneur in Jaipur needing ₹25 lakh for establishing a solar equipment manufacturing unit with family income of ₹8 lakh");
  assert(t9.isComplete === true, 'Test 9: Women entrepreneur solar unit is complete');
  assert(t9.extracted.amount === 2500000, 'Test 9: Extracted ₹25,00,000');
  assert(t9.extracted.category === 'women', 'Test 9: Extracted woman category');

  // --- SECTION 2: STATUTORY RULE ENGINE EVALUATION ACROSS SCHEMES ---
  console.log('\n--- SECTION 2: Statutory Rule Engine & Scheme Matching ---');
  const allSchemes = await dataRepository.getAllSchemes();
  assert(allSchemes.length === 14, `Test 10: Verified scheme database contains 14 schemes (Found: ${allSchemes.length})`);

  // Test 11: Street Vendor Evaluation (₹20,000)
  const vendorEval = ruleEngineService.evaluateSchemes(allSchemes, {
    amount: 20000,
    annualFamilyIncome: 150000,
    businessType: 'street_vendor',
    purpose: 'business'
  });
  const vendorEligible = vendorEval.filter(e => e.eligible).map(e => e.schemeId);
  assert(vendorEligible.includes('SCHEME-PM-SVANIDHI-13'), 'Test 11: PM SVANidhi is eligible for street vendor');
  assert(vendorEligible.includes('SCHEME-MUDRA-SHISHU-06'), 'Test 11: MUDRA Shishu is eligible for street vendor');

  // Test 12: Artisan Wood Craftsman / Potter (₹1.5 Lakh)
  const artisanEval = ruleEngineService.evaluateSchemes(allSchemes, {
    amount: 150000,
    annualFamilyIncome: 200000,
    businessType: 'artisan_crafts',
    purpose: 'business'
  });
  const artisanEligible = artisanEval.filter(e => e.eligible).map(e => e.schemeId);
  assert(artisanEligible.includes('SCHEME-PM-VISHWAKARMA-09'), 'Test 12: PM Vishwakarma is eligible for artisan crafts');
  assert(artisanEligible.includes('SCHEME-MUDRA-KISHORE-07'), 'Test 12: MUDRA Kishore is eligible for artisan crafts');

  // Test 13: Dairy Farming in Rural/Semi-Urban (₹4.5 Lakh)
  const dairyEval = ruleEngineService.evaluateSchemes(allSchemes, {
    amount: 450000,
    annualFamilyIncome: 250000,
    businessType: 'dairy_farming',
    purpose: 'agriculture'
  });
  const dairyEligible = dairyEval.filter(e => e.eligible).map(e => e.schemeId);
  assert(dairyEligible.includes('SCHEME-NABARD-DAIRY-12'), 'Test 13: NABARD Dairy scheme is eligible for dairy farming');
  assert(dairyEligible.includes('SCHEME-MUDRA-KISHORE-07'), 'Test 13: MUDRA Kishore is eligible for dairy');

  // Test 14: Tech Startup Innovation Grant / Debt (₹15 Lakh)
  const startupEval = ruleEngineService.evaluateSchemes(allSchemes, {
    amount: 1500000,
    annualFamilyIncome: 600000,
    businessType: 'tech_startup',
    purpose: 'business'
  });
  const startupEligible = startupEval.filter(e => e.eligible).map(e => e.schemeId);
  assert(startupEligible.includes('SCHEME-STARTUP-INDIA-SEED-14'), 'Test 14: Startup India Seed Fund is eligible for tech startup');

  // Test 15: Women Greenfield Enterprise (₹25 Lakh)
  const womenEval = ruleEngineService.evaluateSchemes(allSchemes, {
    amount: 2500000,
    annualFamilyIncome: 800000,
    businessType: 'solar_energy',
    category: 'women',
    purpose: 'business'
  });
  const womenEligible = womenEval.filter(e => e.eligible).map(e => e.schemeId);
  assert(womenEligible.includes('SCHEME-STANDUP-INDIA-11'), 'Test 15: Stand-Up India is eligible for ₹25L greenfield enterprise');
  assert(womenEligible.includes('SCHEME-PMEGP-10'), 'Test 15: PMEGP is eligible for ₹25L project');

  // Test 16: Higher Education Degree (₹8 Lakh)
  const eduEval = ruleEngineService.evaluateSchemes(allSchemes, {
    amount: 800000,
    annualFamilyIncome: 350000,
    businessType: 'higher_education',
    purpose: 'education'
  });
  const eduEligible = eduEval.filter(e => e.eligible).map(e => e.schemeId);
  assert(eduEligible.includes('SCHEME-NSFDC-ELS-05'), 'Test 16: NSFDC Educational Loan is eligible for higher education');
  assert(!eduEligible.includes('SCHEME-NSFDC-MF-01'), 'Test 16: Micro Finance correctly rejects academic education loan');

  // --- SECTION 3: DETERMINISTIC RANKING & EXPLAINABLE RATIONALES ---
  console.log('\n--- SECTION 3: Deterministic Ranking & Rationales ---');
  const rankedArtisan = rankingService.rankSchemes(artisanEval, { amount: 150000 });
  assert(rankedArtisan.length > 0, 'Test 17: Ranked recommendations produced');
  assert(rankedArtisan[0].isTopRecommendation === true, 'Test 17: Top recommendation flag marked');
  assert(rankedArtisan[0].recommendationRationale.length > 20, 'Test 17: Rationale has informative text');

  // --- SECTION 4: FINANCIAL CALCULATOR & WHAT-IF SIMULATIONS ---
  console.log('\n--- SECTION 4: Actuarial Financial Calculations & What-If ---');
  const sampleSchemes = [allSchemes[0], allSchemes[8]]; // NSFDC MF (6.5%) & PM Vishwakarma (5.0%)
  const calcs = financialService.calculateMultiple(100000, 36, sampleSchemes);
  assert(calcs.length === 2, 'Test 18: Calculations generated for multiple schemes');
  assert(calcs[1].monthlyEMI < calcs[0].monthlyEMI, 'Test 19: 5.0% Vishwakarma rate has lower EMI than 6.5% NSFDC rate');
  assert(calcs[0].totalRepayment > 100000, 'Test 20: Total repayment includes principal + interest');

  // What-If Simulation
  const whatIfCalcs = financialService.calculateMultiple(100000, 24, sampleSchemes);
  const deltas = financialService.computeDeltas(calcs, whatIfCalcs);
  assert(deltas[0].monthlyEMI > calcs[0].monthlyEMI, 'Test 21: Shorter tenure increases monthly EMI');
  assert(deltas[0].totalRepayment < calcs[0].totalRepayment, 'Test 22: Shorter tenure decreases total interest repayment');

  // --- SECTION 5: REGIONAL CHANNEL PARTNERS ACROSS STATES ---
  console.log('\n--- SECTION 5: Multi-Region Channel Partners ---');
  const allPartners = await dataRepository.getAllPartners();
  assert(allPartners.length >= 10, `Test 23: Multi-region channel partners present (Found: ${allPartners.length})`);

  const kolPartners = await dataRepository.getAllPartners({ city: 'Kolkata' });
  const delPartners = await dataRepository.getAllPartners({ city: 'Delhi' });
  const varPartners = await dataRepository.getAllPartners({ city: 'Varanasi' });
  assert(kolPartners.length >= 3, 'Test 24: Kolkata partner hub verified');
  assert(delPartners.length >= 2, 'Test 25: Delhi partner hub verified');
  assert(varPartners.length >= 2, 'Test 26: Varanasi partner hub verified');

  // --- SECTION 6: APPLICATION GUIDANCE & RAG ASSISTANT ---
  console.log('\n--- SECTION 6: Application Guidance & RAG Verification ---');
  const vishwakarma = allSchemes.find(s => s._id === 'SCHEME-PM-VISHWAKARMA-09');
  assert(vishwakarma.documents.length >= 3, 'Test 27: PM Vishwakarma has verified statutory document checklist');
  assert(vishwakarma.applicationProcess.length >= 4, 'Test 28: PM Vishwakarma has detailed step-by-step process stages');

  const vishwakarmaAnswer = await ragService.answerQuestion({
    scheme: vishwakarma,
    partner: delPartners[0],
    question: "What toolkit incentive is provided under PM Vishwakarma?"
  });
  assert(vishwakarmaAnswer.answer.includes('15,000'), 'Test 29: RAG correctly answers ₹15,000 toolkit incentive');

  // Checklist PDF Generation Test
  const testPdf = path.join(os.tmpdir(), 'comprehensive_checklist_test.pdf');
  const pdfOut = fs.createWriteStream(testPdf);
  pdfService.generateChecklistPDF({
    scheme: vishwakarma,
    partner: delPartners[0],
    userRequirement: { businessType: 'artisan_crafts', amount: 100000, annualFamilyIncome: 200000, location: 'Delhi' },
    financialSummary: { loanAmount: 100000, tenureMonths: 18, monthlyEMI: 5778, interestRate: 5.0 }
  }, pdfOut);
  await new Promise((resolve) => pdfOut.on('finish', resolve));
  const pdfSize = fs.statSync(testPdf).size;
  assert(pdfSize > 3000, `Test 30: Application Checklist PDF generated successfully (${pdfSize} bytes)`);

  console.log('\n================================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED (TOTAL: ${passed + failed})`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runComprehensiveTests().catch(err => {
  console.error('[TEST SUITE FAILED]:', err);
  process.exit(1);
});
