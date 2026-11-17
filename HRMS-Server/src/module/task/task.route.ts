import { Router } from 'express';
import { taskController } from './task.controller.js';

const router = Router();

router.get('/metrics', taskController.getMetrics);
router.get('/', taskController.getTasks);
router.post('/', taskController.createTask);
router.patch('/:id/toggle', taskController.toggleTask);
router.delete('/:id', taskController.deleteTask);

export const taskRoutes = router;
export default router;
