import { Router } from 'express';
import { payrollController } from './payroll.controller.js';

const router = Router();

router.get('/my-payslips', payrollController.getMyPayslips);
router.get('/period/:periodKey', payrollController.getPayslipByPeriod);
router.post('/inquiry', payrollController.submitInquiry);
router.get('/admin/all', payrollController.getAllPayroll);

export const payrollRoutes = router;
export default router;
