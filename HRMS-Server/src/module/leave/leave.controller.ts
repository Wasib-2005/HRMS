import type { Request, Response, NextFunction } from 'express';
import { leaveService } from './leave.service.js';

export const leaveController = {
  /**
   * Get employee's leave balance
   */
  async getBalances(req: Request, res: Response, next: NextFunction) {
    try {
      const email =
        (req.query.email as string) || (req as any).user?.email || 'employee@hrms.com';
      const balance = await leaveService.getBalances(email);

      res.status(200).json({
        success: true,
        message: 'Leave balances retrieved successfully.',
        data: balance,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Apply for leave
   */
  async applyLeave(req: Request, res: Response, next: NextFunction) {
    try {
      const email =
        req.body.employeeEmail || (req as any).user?.email || 'employee@hrms.com';
      const name =
        req.body.employeeName || (req as any).user?.name || 'Rayhan Ahmed';
      const {
        leaveType,
        startDate,
        endDate,
        durationType,
        workingDays,
        reason,
        attachmentName,
        attachmentUrl,
        handoverPeer,
        emergencyContact,
      } = req.body;

      if (!leaveType || !startDate || !endDate || !reason) {
        return res.status(400).json({
          success: false,
          message: 'Missing required leave request fields.',
        });
      }

      const result = await leaveService.createRequest({
        employeeEmail: email,
        employeeName: name,
        leaveType,
        startDate,
        endDate,
        durationType: durationType || 'Full Day',
        workingDays: workingDays || 1,
        reason,
        attachmentName,
        attachmentUrl,
        handoverPeer,
        emergencyContact,
      });

      res.status(201).json({
        success: true,
        message: 'Leave request submitted successfully and queued for approval.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get employee's submitted requests history
   */
  async getMyRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const email =
        (req.query.email as string) || (req as any).user?.email || 'employee@hrms.com';
      const requests = await leaveService.getMyRequests(email);

      res.status(200).json({
        success: true,
        message: 'Leave requests history retrieved.',
        data: requests,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all organization leave requests (for HR review queue)
   */
  async getAllRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const requests = await leaveService.getAllRequests();

      res.status(200).json({
        success: true,
        message: 'All leave requests retrieved.',
        data: requests,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default leaveController;
