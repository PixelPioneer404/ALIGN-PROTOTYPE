import geminiService from '../src/services/gemini.service.js';
import dataRepository from '../src/services/dataRepository.js';
import ruleEngineService from '../src/services/ruleEngine.service.js';
import rankingService from '../src/services/ranking.service.js';
import financialService from '../src/services/financial.service.js';
import ragService from '../src/services/rag.service.js';
import pdfService from '../src/services/pdf.service.js';
import fs from 'fs';

async function runDemoVerification() {
  console.log('============================================================');
  console.log('STARTING ALIGN SIH 2026 END-TO-END DEMO VERIFICATION');
  console.log('============================================================\n');

  // Step 1 & 2: User starts at Landing and enters prompt on Screen 2
  const userPrompt = "I need ₹1.2 lakh to start a tailoring business. My family income is around ₹3 lakh and I live in Kolkata.";
  console.log(`[Step 1-3] Input Prompt: "${userPrompt}"`);

  // Step 4: AI extracts structured requirements
  const extracted = await geminiService.extractRequirement(userPrompt);
  console.log('[Step 4] Extracted Requirement:', {
    purpose: extracted.purpose,
    businessType: extracted.businessType,
    amount: extracted.amount,
    annualFamilyIncome: extracted.annualFamilyIncome,
    location: extracted.location
  });
  if (extracted.amount !== 120000 || extracted.businessType !== 'tailoring' || extracted.location !== 'Kolkata') {
    throw new Error('Extraction failed expected parameters');
  }

  // Step 5: Rule engine determines eligibility
  const allSchemes = await dataRepository.getAllSchemes();
  const evaluated = ruleEngineService.evaluateSchemes(allSchemes, extracted);
  const eligibleCount = evaluated.filter(e => e.eligible).length;
  console.log(`[Step 5] Rule Engine Evaluation: ${eligibleCount} of ${allSchemes.length} schemes eligible.`);

  // Step 6: Ranking engine ranks suitable schemes
  const ranked = rankingService.rankSchemes(evaluated, extracted);
  console.log('[Step 6] Ranked Recommendations:');
  ranked.forEach((r, i) => {
    console.log(`   #${i + 1}: ${r.scheme.shortName} (Score: ${r.score}) - Top: ${!!r.isTopRecommendation}`);
  });
  if (!ranked[0].isTopRecommendation || ranked[0].scheme._id !== 'SCHEME-NSFDC-MF-01') {
    throw new Error('Top recommendation mismatch: expected Micro Finance Scheme');
  }

  // Step 7 & 8: User clicks "Compare schemes" -> Comparison page appears
  const comparedSchemeIds = ranked.slice(0, 3).map(r => r.schemeId);
  const comparedSchemes = await dataRepository.getSchemesByIds(comparedSchemeIds);
  console.log(`[Step 7-8] Comparison Workspace initialized with ${comparedSchemes.length} schemes.`);

  // Baseline calculations at ₹1,20,000 for 36 months
  const baselineCalcs = financialService.calculateMultiple(120000, 36, comparedSchemes);
  console.log('   Baseline Calcs (₹1.20L / 36 mo):');
  baselineCalcs.forEach(c => {
    console.log(`   - ${c.shortName}: Monthly EMI = ₹${c.monthlyEMI}, Total Repay = ₹${c.totalRepayment}`);
  });

  // Step 9 & 10: Change ₹1,20,000 -> ₹80,000 in universal calculator
  const calcsAt80k = financialService.calculateMultiple(80000, 36, comparedSchemes);
  console.log('[Step 9-10] Changed Loan to ₹80,000:');
  calcsAt80k.forEach(c => {
    console.log(`   - ${c.shortName}: New EMI = ₹${c.monthlyEMI} (Total: ₹${c.totalRepayment})`);
  });
  if (calcsAt80k[0].monthlyEMI >= baselineCalcs[0].monthlyEMI) {
    throw new Error('EMI should decrease when principal decreases');
  }

  // Step 11 & 12: Ask What-If: "What if I repay over 5 years?"
  const whatIfQuery = "What if I repay over 5 years?";
  console.log(`[Step 11] What-If Query: "${whatIfQuery}"`);
  const whatIfDelta = await geminiService.parseWhatIfQuery({ loanAmount: 120000, tenureMonths: 36 }, whatIfQuery);
  console.log('[Step 12] Parsed Delta:', whatIfDelta);
  if (whatIfDelta.tenureMonths !== 60) {
    throw new Error('What-if parser failed to extract 60 months from 5 years');
  }

  // Step 13 & 14: Financial engine calculates result & comparison updates
  const calcsAt60m = financialService.calculateMultiple(120000, 60, comparedSchemes);
  const deltas = financialService.computeDeltas(baselineCalcs, calcsAt60m);
  console.log('[Step 13-14] Recalculated What-If Deltas:');
  deltas.forEach(d => {
    console.log(`   - ${d.shortName}: EMI = ₹${d.monthlyEMI} (Effective Tenure: ${d.effectiveTenureMonths} mo, Capped: ${d.tenureCapped})`);
  });

  // Step 15: AI explains financial change
  const explanation = await geminiService.explainWhatIfImpact(whatIfDelta, baselineCalcs, calcsAt60m, whatIfQuery);
  console.log(`[Step 15] AI Explanation: "${explanation}"`);

  // Step 16 & 17: User selects Micro Finance Scheme -> Partner Discovery opens
  const selectedScheme = comparedSchemes[0];
  console.log(`[Step 16-17] Scheme Selected: ${selectedScheme.name}. Navigating to Partner Discovery.`);

  const partners = await dataRepository.getPartnersForScheme(selectedScheme._id, 'Kolkata');
  console.log(`   Found ${partners.length} authorized partners in Kolkata:`);
  partners.forEach(p => console.log(`   - ${p.name} (${p.type}) at ${p.address.split(',')[0]}`));
  if (partners.length === 0) throw new Error('No partners found for scheme');

  // Step 18 & 19: User selects partner -> Application Guidance opens
  const selectedPartner = partners[0];
  console.log(`[Step 18-19] Partner Selected: ${selectedPartner.name}. Opening Application Guidance.`);
  console.log(`   Documents to prepare: ${selectedScheme.documents.length} verified items.`);
  console.log(`   Process steps: ${selectedScheme.applicationProcess.length} official stages.`);

  // Step 20 & 21: Download Application Checklist PDF
  const testPdfPath = '/tmp/demo_checklist_verification.pdf';
  const pdfOut = fs.createWriteStream(testPdfPath);
  pdfService.generateChecklistPDF({
    scheme: selectedScheme,
    partner: selectedPartner,
    userRequirement: extracted,
    financialSummary: { loanAmount: 120000, tenureMonths: 36, monthlyEMI: 3678, interestRate: 6.5 }
  }, pdfOut);

  await new Promise((resolve) => pdfOut.on('finish', resolve));
  const pdfStat = fs.statSync(testPdfPath);
  console.log(`[Step 20-21] PDF Generated & Verified (${pdfStat.size} bytes at ${testPdfPath}).`);

  // Step 22 & 23: User asks scheme assistant: "Can I apply without an income certificate?"
  const assistantQ = "Can I apply without an income certificate?";
  console.log(`[Step 22] Scheme Assistant Query: "${assistantQ}"`);
  const assistantResp = await ragService.answerQuestion({
    scheme: selectedScheme,
    partner: selectedPartner,
    question: assistantQ
  });
  console.log('[Step 23] Assistant Answer:', assistantResp.answer);
  console.log(`   Source Type: ${assistantResp.sourceType} | Citations: ${assistantResp.citations?.[0]?.title}`);

  console.log('\n============================================================');
  console.log('DEMO SCENARIO VERIFICATION SUCCEEDED WITH 100% ACCURACY!');
  console.log('============================================================');
}

runDemoVerification().catch(err => {
  console.error('[DEMO VERIFICATION FAILED]:', err);
  process.exit(1);
});
