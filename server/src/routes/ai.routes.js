import { Router } from 'express';
import { analyzeRequirement } from '../controllers/ai.controller.js';

const router = Router();

router.post('/analyze-requirement', analyzeRequirement);

export default router;
