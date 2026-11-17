import type { Request, Response, NextFunction } from 'express';
import { taskService } from './task.service.js';

export const taskController = {
  /**
   * Get employee's tasks
   */
  async getTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const email =
        (req.query.email as string) || (req as any).user?.email || 'employee@hrms.com';
      const tasks = await taskService.getEmployeeTasks(email);

      res.status(200).json({
        success: true,
        message: 'Tasks retrieved successfully.',
        data: tasks,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create task
   */
  async createTask(req: Request, res: Response, next: NextFunction) {
    try {
      const email =
        req.body.employeeEmail || (req as any).user?.email || 'employee@hrms.com';
      const { title, category, priority, dueDateLabel, userId } = req.body;

      if (!title || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Task title is required.',
        });
      }

      const task = await taskService.createTask({
        title,
        category,
        priority,
        dueDateLabel,
        employeeEmail: email,
        userId,
      });

      res.status(201).json({
        success: true,
        message: 'Task created successfully.',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Toggle task completion
   */
  async toggleTask(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      if (!id) {
        return res.status(400).json({ success: false, message: 'Task ID is required' });
      }

      const email =
        (req.query.email as string) || (req as any).user?.email || undefined;
      const updated = await taskService.toggleTask(id, email);

      res.status(200).json({
        success: true,
        message: 'Task status updated.',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete task
   */
  async deleteTask(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      if (!id) {
        return res.status(400).json({ success: false, message: 'Task ID is required' });
      }

      const email =
        (req.query.email as string) || (req as any).user?.email || undefined;
      await taskService.deleteTask(id, email);

      res.status(200).json({
        success: true,
        message: 'Task deleted.',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get task metrics
   */
  async getMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const email =
        (req.query.email as string) || (req as any).user?.email || 'employee@hrms.com';
      const metrics = await taskService.getMetrics(email);

      res.status(200).json({
        success: true,
        message: 'Task metrics calculated.',
        data: metrics,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default taskController;
