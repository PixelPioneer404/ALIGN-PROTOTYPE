import { Router } from 'express';
import { generateApplicationChecklist } from '../controllers/pdf.controller.js';

const router = Router();

router.post('/application-checklist', generateApplicationChecklist);

export default router;
