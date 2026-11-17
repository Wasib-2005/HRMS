import type { Request, Response, NextFunction } from 'express';
import { dashboardService } from './dashboard.service.js';

export const dashboardController = {
  /**
   * Get dynamic employee dashboard metrics
   */
  async getEmployeeMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const email =
        (req.query.email as string) || (req as any).user?.email || 'employee@hrms.com';
      const metrics = await dashboardService.getEmployeeDashboardMetrics(email);

      res.status(200).json({
        success: true,
        message: 'Employee metrics computed successfully.',
        data: metrics,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default dashboardController;
