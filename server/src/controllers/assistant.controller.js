import ragService from '../services/rag.service.js';
import dataRepository from '../services/dataRepository.js';

export const askAssistant = async (req, res, next) => {
  try {
    const { schemeId, partnerId, question } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_QUESTION', message: 'Question string is required.' }
      });
    }

    let scheme = null;
    if (schemeId) {
      scheme = await dataRepository.getSchemeById(schemeId);
    }
    if (!scheme) {
      const all = await dataRepository.getAllSchemes();
      scheme = all[0];
    }

    let partner = null;
    if (partnerId) {
      partner = await dataRepository.getPartnerById(partnerId);
    }
    if (!partner) {
      const allPartners = await dataRepository.getAllPartners();
      partner = allPartners[0];
    }

    const response = await ragService.answerQuestion({ scheme, partner, question });

    res.json({
      success: true,
      data: response
    });
  } catch (err) {
    next(err);
  }
};
