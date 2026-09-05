import { Router } from 'express';
import { calculateFinances, simulateWhatIf } from '../controllers/financial.controller.js';

const router = Router();

router.post('/calculate', calculateFinances);
router.post('/what-if', simulateWhatIf);

export default router;
