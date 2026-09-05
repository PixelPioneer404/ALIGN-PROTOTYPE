import dataRepository from '../services/dataRepository.js';

export const getPartners = async (req, res, next) => {
  try {
    const { city, state, type, schemeId } = req.query;
    const filter = {};
    if (city) filter.city = city;
    if (state) filter.state = state;
    if (type) filter.type = type;
    if (schemeId) filter.schemeId = schemeId;

    const partners = await dataRepository.getAllPartners(filter);
    res.json({
      success: true,
      count: partners.length,
      data: partners
    });
  } catch (err) {
    next(err);
  }
};

export const getPartnerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const partner = await dataRepository.getPartnerById(id);
    if (!partner) {
      return res.status(404).json({
        success: false,
        error: { code: 'PARTNER_NOT_FOUND', message: `Channel partner with ID ${id} not found.` }
      });
    }
    res.json({
      success: true,
      data: partner
    });
  } catch (err) {
    next(err);
  }
};

export const getPartnersForScheme = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { city } = req.query;
    const partners = await dataRepository.getPartnersForScheme(id, city);
    res.json({
      success: true,
      schemeId: id,
      city: city || 'all',
      count: partners.length,
      data: partners
    });
  } catch (err) {
    next(err);
  }
};
