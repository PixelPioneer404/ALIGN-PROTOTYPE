import Scheme from '../models/scheme.model.js';
import Partner from '../models/partner.model.js';
import { verifiedSchemes, demoPartners } from '../data/seedData.js';
import { isDbConnected } from '../config/db.js';

class DataRepository {
  async getAllSchemes(filter = {}) {
    if (isDbConnected()) {
      try {
        return await Scheme.find(filter).lean();
      } catch (err) {
        console.warn('[DataRepository] MongoDB read error, using in-memory fallback:', err.message);
      }
    }
    // In-memory fallback
    return verifiedSchemes.filter(s => {
      if (filter.category && s.category !== filter.category) return false;
      return true;
    });
  }

  async getSchemeById(id) {
    if (isDbConnected()) {
      try {
        const found = await Scheme.findById(id).lean();
        if (found) return found;
      } catch (err) {
        console.warn('[DataRepository] MongoDB read error, using in-memory fallback:', err.message);
      }
    }
    return verifiedSchemes.find(s => s._id === id) || null;
  }

  async getSchemesByIds(ids) {
    if (isDbConnected()) {
      try {
        return await Scheme.find({ _id: { $in: ids } }).lean();
      } catch (err) {
        console.warn('[DataRepository] MongoDB read error, using in-memory fallback:', err.message);
      }
    }
    return verifiedSchemes.filter(s => ids.includes(s._id));
  }

  async getAllPartners(filter = {}) {
    if (isDbConnected()) {
      try {
        return await Partner.find(filter).lean();
      } catch (err) {
        console.warn('[DataRepository] MongoDB read error, using in-memory fallback:', err.message);
      }
    }
    return demoPartners.filter(p => {
      if (filter.city && p.city.toLowerCase() !== filter.city.toLowerCase()) return false;
      if (filter.type && p.type !== filter.type) return false;
      if (filter.schemeId && !p.authorizedSchemes.includes(filter.schemeId)) return false;
      return true;
    });
  }

  async getPartnerById(id) {
    if (isDbConnected()) {
      try {
        const found = await Partner.findById(id).lean();
        if (found) return found;
      } catch (err) {
        console.warn('[DataRepository] MongoDB read error, using in-memory fallback:', err.message);
      }
    }
    return demoPartners.find(p => p._id === id) || null;
  }

  async getPartnersForScheme(schemeId, city = null) {
    if (isDbConnected()) {
      try {
        const query = { authorizedSchemes: schemeId };
        if (city) query.city = new RegExp(city, 'i');
        const partners = await Partner.find(query).lean();
        if (partners && partners.length > 0) return partners;
      } catch (err) {
        console.warn('[DataRepository] MongoDB read error, using in-memory fallback:', err.message);
      }
    }
    return demoPartners.filter(p => {
      const matchScheme = p.authorizedSchemes.includes(schemeId);
      if (!matchScheme) return false;
      if (city) {
        return p.city.toLowerCase().includes(city.toLowerCase());
      }
      return true;
    });
  }
}

export const dataRepository = new DataRepository();
export default dataRepository;
