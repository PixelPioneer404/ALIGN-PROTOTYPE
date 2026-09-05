import { Router } from 'express';
import {
  getSchemes,
  getSchemeById,
  getSchemeDocuments,
  getSchemeApplicationGuidance,
  matchSchemes
} from '../controllers/scheme.controller.js';
import { getPartnersForScheme } from '../controllers/partner.controller.js';

const router = Router();

router.post('/match', matchSchemes);
router.get('/', getSchemes);
router.get('/:id', getSchemeById);
router.get('/:id/documents', getSchemeDocuments);
router.get('/:id/application-guidance', getSchemeApplicationGuidance);
router.get('/:id/partners', getPartnersForScheme);

export default router;
