import { Router } from 'express';
import { dashboardController } from './dashboard.controller.js';

const router = Router();

router.get('/employee-metrics', dashboardController.getEmployeeMetrics);

export const dashboardRoutes = router;
export default router;
