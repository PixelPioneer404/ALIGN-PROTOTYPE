import dataRepository from '../services/dataRepository.js';
import ruleEngineService from '../services/ruleEngine.service.js';
import rankingService from '../services/ranking.service.js';

export const matchSchemes = async (req, res, next) => {
  try {
    const requirement = req.body;
    if (!requirement || typeof requirement !== 'object') {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_REQUIREMENT', message: 'Requirement payload must be a JSON object.' }
      });
    }

    const allSchemes = await dataRepository.getAllSchemes();
    const evaluated = ruleEngineService.evaluateSchemes(allSchemes, requirement);
    const ranked = rankingService.rankSchemes(evaluated, requirement);

    res.json({
      success: true,
      data: {
        totalEvaluated: evaluated.length,
        totalEligible: ranked.length,
        rankedSchemes: ranked,
        allEvaluated: evaluated
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getSchemes = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) filter.category = category;

    const schemes = await dataRepository.getAllSchemes(filter);
    res.json({
      success: true,
      count: schemes.length,
      data: schemes
    });
  } catch (err) {
    next(err);
  }
};

export const getSchemeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const scheme = await dataRepository.getSchemeById(id);
    if (!scheme) {
      return res.status(404).json({
        success: false,
        error: { code: 'SCHEME_NOT_FOUND', message: `Scheme with ID ${id} not found.` }
      });
    }
    res.json({
      success: true,
      data: scheme
    });
  } catch (err) {
    next(err);
  }
};

export const getSchemeDocuments = async (req, res, next) => {
  try {
    const { id } = req.params;
    const scheme = await dataRepository.getSchemeById(id);
    if (!scheme) {
      return res.status(404).json({
        success: false,
        error: { code: 'SCHEME_NOT_FOUND', message: `Scheme with ID ${id} not found.` }
      });
    }
    res.json({
      success: true,
      schemeId: scheme._id,
      schemeName: scheme.name,
      documents: scheme.documents || []
    });
  } catch (err) {
    next(err);
  }
};

export const getSchemeApplicationGuidance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const scheme = await dataRepository.getSchemeById(id);
    if (!scheme) {
      return res.status(404).json({
        success: false,
        error: { code: 'SCHEME_NOT_FOUND', message: `Scheme with ID ${id} not found.` }
      });
    }
    res.json({
      success: true,
      schemeId: scheme._id,
      schemeName: scheme.name,
      applicationProcess: scheme.applicationProcess || [],
      channelPartnerTypes: scheme.channelPartnerTypes || [],
      moratoriumDetails: scheme.moratoriumDetails || null,
      sourceDocuments: scheme.sourceDocuments || []
    });
  } catch (err) {
    next(err);
  }
};
