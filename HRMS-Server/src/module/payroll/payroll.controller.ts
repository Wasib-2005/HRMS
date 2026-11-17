import type { Request, Response, NextFunction } from 'express';
import { payrollService } from './payroll.service.js';

export const payrollController = {
  /**
   * Get authenticated employee's payslips
   */
  async getMyPayslips(req: Request, res: Response, next: NextFunction) {
    try {
      const email =
        (req.query.email as string) || (req as any).user?.email || 'employee@hrms.com';
      const payslips = await payrollService.getEmployeePayslips(email);

      res.status(200).json({
        success: true,
        message: 'Payslips retrieved successfully.',
        data: payslips,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get specific period payslip
   */
  async getPayslipByPeriod(req: Request, res: Response, next: NextFunction) {
    try {
      const email =
        (req.query.email as string) || (req as any).user?.email || 'employee@hrms.com';
      const periodKey = req.params.periodKey as string;

      if (!periodKey) {
        return res
          .status(400)
          .json({ success: false, message: 'Period key is required.' });
      }

      const payslip = await payrollService.getPayslipByPeriod(email, periodKey);
      if (!payslip) {
        return res.status(404).json({
          success: false,
          message: `Payslip for period ${periodKey} not found.`,
        });
      }

      res.status(200).json({
        success: true,
        message: 'Payslip details retrieved.',
        data: payslip,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Submit inquiry to payroll
   */
  async submitInquiry(req: Request, res: Response, next: NextFunction) {
    try {
      const email =
        req.body.employeeEmail || (req as any).user?.email || 'employee@hrms.com';
      const { periodKey, category, message } = req.body;

      if (!periodKey || !category || !message) {
        return res.status(400).json({
          success: false,
          message: 'Missing periodKey, category or message in inquiry payload.',
        });
      }

      const updated = await payrollService.submitInquiry(
        email,
        periodKey,
        category,
        message
      );

      res.status(200).json({
        success: true,
        message: 'Inquiry submitted to HR/Payroll successfully.',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin / HR list of all payrolls
   */
  async getAllPayroll(req: Request, res: Response, next: NextFunction) {
    try {
      const records = await payrollService.getAllRecords();

      res.status(200).json({
        success: true,
        message: 'All payroll records retrieved.',
        data: records,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default payrollController;
