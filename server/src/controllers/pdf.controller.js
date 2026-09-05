import pdfService from '../services/pdf.service.js';
import dataRepository from '../services/dataRepository.js';

export const generateApplicationChecklist = async (req, res, next) => {
  try {
    const {
      schemeId,
      partnerId,
      userRequirement = {},
      financialSummary = {},
      scheme: rawScheme,
      partner: rawPartner
    } = req.body;

    let scheme = rawScheme;
    if (!scheme && schemeId) {
      scheme = await dataRepository.getSchemeById(schemeId);
    }
    if (!scheme) {
      const all = await dataRepository.getAllSchemes();
      scheme = all[0];
    }

    let partner = rawPartner;
    if (!partner && partnerId) {
      partner = await dataRepository.getPartnerById(partnerId);
    }
    if (!partner) {
      const partners = await dataRepository.getAllPartners();
      partner = partners[0];
    }

    const filename = `ALIGN-Checklist-${(scheme.shortName || 'Scheme').replace(/\s+/g, '_')}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    pdfService.generateChecklistPDF(
      { scheme, partner, userRequirement, financialSummary },
      res
    );
  } catch (err) {
    next(err);
  }
};
