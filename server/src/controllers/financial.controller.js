import financialService from '../services/financial.service.js';
import geminiService from '../services/gemini.service.js';
import dataRepository from '../services/dataRepository.js';

export const calculateFinances = async (req, res, next) => {
  try {
    const { loanAmount = 120000, tenureMonths = 36, schemeIds = [] } = req.body;

    let schemes = [];
    if (schemeIds && schemeIds.length > 0) {
      schemes = await dataRepository.getSchemesByIds(schemeIds);
    }

    // If no schemes specified, calculate across all active schemes
    if (schemes.length === 0) {
      schemes = await dataRepository.getAllSchemes();
    }

    const calculations = financialService.calculateMultiple(
      Number(loanAmount),
      Number(tenureMonths),
      schemes
    );

    res.json({
      success: true,
      data: {
        loanAmount: Number(loanAmount),
        requestedTenureMonths: Number(tenureMonths),
        calculations
      }
    });
  } catch (err) {
    next(err);
  }
};

export const simulateWhatIf = async (req, res, next) => {
  try {
    const { currentScenario, query } = req.body;

    if (!currentScenario || !query) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_PARAMS', message: 'currentScenario and query are required.' }
      });
    }

    const { loanAmount = 120000, tenureMonths = 36, schemeIds = [] } = currentScenario;

    // 1. Fetch relevant schemes
    const schemes = await dataRepository.getSchemesByIds(schemeIds);
    const targetSchemes = schemes.length > 0 ? schemes : await dataRepository.getAllSchemes();

    // 2. Compute baseline calculations
    const baselineCalcs = financialService.calculateMultiple(
      Number(loanAmount),
      Number(tenureMonths),
      targetSchemes
    );

    // 3. AI interprets user intent into parameter modifications
    const parsedDelta = await geminiService.parseWhatIfQuery(currentScenario, query);

    const newLoanAmount = parsedDelta.loanAmount !== undefined ? parsedDelta.loanAmount : Number(loanAmount);
    const newTenureMonths = parsedDelta.tenureMonths !== undefined ? parsedDelta.tenureMonths : Number(tenureMonths);

    // 4. Pure deterministic recalculation with financial engine
    const newCalcs = financialService.calculateMultiple(
      newLoanAmount,
      newTenureMonths,
      targetSchemes
    );

    // 5. Compute deltas
    const calculationsWithDeltas = financialService.computeDeltas(baselineCalcs, newCalcs);

    // 6. Synthesize plain language explanation
    const explanation = await geminiService.explainWhatIfImpact(
      parsedDelta,
      baselineCalcs,
      newCalcs,
      query
    );

    res.json({
      success: true,
      data: {
        parsedDelta: {
          loanAmount: newLoanAmount,
          tenureMonths: newTenureMonths
        },
        calculations: calculationsWithDeltas,
        explanation,
        applyPayload: {
          loanAmount: newLoanAmount,
          tenureMonths: newTenureMonths
        }
      }
    });
  } catch (err) {
    next(err);
  }
};
