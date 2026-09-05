import { Router } from 'express';
import schemeRoutes from './scheme.routes.js';
import partnerRoutes from './partner.routes.js';
import aiRoutes from './ai.routes.js';
import financialRoutes from './financial.routes.js';
import pdfRoutes from './pdf.routes.js';
import assistantRoutes from './assistant.routes.js';

const router = Router();

// Information root
router.get('/', (req, res) => {
  res.json({
    name: 'ALIGN API',
    version: '1.0.0',
    description: 'AI-assisted financial scheme discovery & decision-support platform for marginalized entrepreneurs'
  });
});

// Resource routes
router.use('/', aiRoutes); // Mounts /analyze-requirement directly at /api/analyze-requirement
router.use('/schemes', schemeRoutes);
router.use('/partners', partnerRoutes);
router.use('/financial', financialRoutes);
router.use('/pdf', pdfRoutes);
router.use('/assistant', assistantRoutes);

export default router;
