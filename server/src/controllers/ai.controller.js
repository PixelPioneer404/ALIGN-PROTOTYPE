import geminiService from '../services/gemini.service.js';

export const analyzeRequirement = async (req, res, next) => {
  try {
    const { prompt, messages } = req.body;

    let conversation = [];
    if (messages && Array.isArray(messages)) {
      conversation = messages;
    } else if (prompt && typeof prompt === 'string') {
      conversation = [{ role: 'user', content: prompt }];
    } else {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_PROMPT',
          message: 'A prompt or messages array is required.'
        }
      });
    }

    if (conversation.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'PROMPT_TOO_SHORT',
          message: 'Please provide at least a short sentence describing your financial requirement.'
        }
      });
    }

    // Call AI service
    const response = await geminiService.extractRequirementConversational(conversation);

    if (response.isComplete && response.extracted) {
      // Defensive server-side sanity checks
      if (!response.extracted.amount || response.extracted.amount <= 0) {
        response.extracted.amount = 120000;
      }
      if (response.extracted.annualFamilyIncome === undefined || response.extracted.annualFamilyIncome < 0) {
        response.extracted.annualFamilyIncome = 300000;
      }
      if (!response.extracted.location) {
        response.extracted.location = 'Kolkata';
      }
    }

    res.json({
      success: true,
      data: response
    });
  } catch (err) {
    next(err);
  }
};
