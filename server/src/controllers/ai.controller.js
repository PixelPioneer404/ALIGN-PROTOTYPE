import geminiService from '../services/gemini.service.js';

export const analyzeRequirement = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_PROMPT',
          message: 'The prompt field is required and must be a string.'
        }
      });
    }

    if (prompt.trim().length < 5) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'PROMPT_TOO_SHORT',
          message: 'Please provide at least a short sentence describing your financial requirement.'
        }
      });
    }

    // Call AI service
    const extracted = await geminiService.extractRequirement(prompt.trim());

    // Defensive server-side sanity checks
    if (!extracted.amount || extracted.amount <= 0) {
      extracted.amount = 120000;
    }
    if (extracted.annualFamilyIncome === undefined || extracted.annualFamilyIncome < 0) {
      extracted.annualFamilyIncome = 300000;
    }
    if (!extracted.location) {
      extracted.location = 'Kolkata';
    }

    res.json({
      success: true,
      data: extracted
    });
  } catch (err) {
    next(err);
  }
};
