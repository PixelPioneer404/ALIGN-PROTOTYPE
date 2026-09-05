import { Router } from 'express';
import { getPartners, getPartnerById } from '../controllers/partner.controller.js';

const router = Router();

router.get('/', getPartners);
router.get('/:id', getPartnerById);

export default router;
