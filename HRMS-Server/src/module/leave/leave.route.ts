import { Router } from 'express';
import { leaveController } from './leave.controller.js';

const router = Router();

router.get('/balances', leaveController.getBalances);
router.get('/my-requests', leaveController.getMyRequests);
router.post('/apply', leaveController.applyLeave);
router.get('/all', leaveController.getAllRequests);

export const leaveRoutes = router;
export default router;
