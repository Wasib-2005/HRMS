import { Task } from './task.model.js';
import type { ITask, TaskCategory, TaskPriority } from './task.interface.js';

const SEED_TASKS: Omit<ITask, 'employeeEmail'>[] = [
  // Overdue (2 tasks)
  {
    title: 'Update leave request design specs',
    category: 'overdue',
    dueDateLabel: 'Overdue · 20 Oct',
    priority: 'Normal',
    isCompleted: false,
    order: 1,
  },
  {
    title: 'Review payroll handoff comments',
    category: 'overdue',
    dueDateLabel: 'Overdue · 21 Oct',
    priority: 'High',
    isCompleted: false,
    order: 2,
  },
  // Today (4 tasks)
  {
    title: 'Review HRMS dashboard handoff',
    category: 'today',
    dueDateLabel: 'Today',
    priority: 'High',
    isCompleted: false,
    order: 3,
  },
  {
    title: 'Submit weekly timesheet',
    category: 'today',
    dueDateLabel: 'Today',
    priority: 'Normal',
    isCompleted: false,
    order: 4,
  },
  {
    title: 'Complete data privacy training',
    category: 'today',
    dueDateLabel: 'Today',
    priority: 'Normal',
    isCompleted: false,
    order: 5,
  },
  {
    title: 'Share attendance flow feedback',
    category: 'today',
    dueDateLabel: 'Today',
    priority: 'Normal',
    isCompleted: false,
    order: 6,
  },
  // Upcoming (6 tasks)
  {
    title: 'Prepare onboarding usability script',
    category: 'upcoming',
    dueDateLabel: '23 Oct',
    priority: 'Normal',
    isCompleted: false,
    order: 7,
  },
  {
    title: 'Update employee profile components',
    category: 'upcoming',
    dueDateLabel: '26 Oct',
    priority: 'Normal',
    isCompleted: false,
    order: 8,
  },
  {
    title: 'Check payslip accessibility fixes',
    category: 'upcoming',
    dueDateLabel: '27 Oct',
    priority: 'Normal',
    isCompleted: false,
    order: 9,
  },
  {
    title: 'Document leave balance edge cases',
    category: 'upcoming',
    dueDateLabel: '28 Oct',
    priority: 'Normal',
    isCompleted: false,
    order: 10,
  },
  {
    title: 'Review mobile attendance prototype',
    category: 'upcoming',
    dueDateLabel: '29 Oct',
    priority: 'Normal',
    isCompleted: false,
    order: 11,
  },
  {
    title: 'Publish design system release notes',
    category: 'upcoming',
    dueDateLabel: '30 Oct',
    priority: 'Normal',
    isCompleted: false,
    order: 12,
  },
];

export const taskService = {
  /**
   * Get all tasks for an employee, automatically seeding standard tasks if none exist
   */
  async getEmployeeTasks(employeeEmail: string) {
    const existingCount = await Task.countDocuments({ employeeEmail });

    if (existingCount === 0) {
      const docsToInsert = SEED_TASKS.map((t) => ({
        ...t,
        employeeEmail,
      }));
      await Task.insertMany(docsToInsert);
    }

    return Task.find({ employeeEmail }).sort({ order: 1, createdAt: -1 });
  },

  /**
   * Create a new task
   */
  async createTask(data: {
    title: string;
    category?: TaskCategory;
    priority?: TaskPriority;
    dueDateLabel?: string;
    employeeEmail: string;
    userId?: string;
  }) {
    const count = await Task.countDocuments({ employeeEmail: data.employeeEmail });
    const newTask = new Task({
      title: data.title,
      category: data.category || 'today',
      priority: data.priority || 'Normal',
      dueDateLabel:
        data.dueDateLabel ||
        (data.category === 'upcoming'
          ? '24 Oct'
          : data.category === 'overdue'
          ? 'Overdue · 21 Oct'
          : 'Today'),
      employeeEmail: data.employeeEmail,
      userId: data.userId,
      order: count + 1,
      isCompleted: false,
    });
    return newTask.save();
  },

  /**
   * Toggle completion state of a task
   */
  async toggleTask(taskId: string, employeeEmail?: string) {
    const query: any = { _id: taskId };
    if (employeeEmail) {
      query.employeeEmail = employeeEmail;
    }

    const task = await Task.findOne(query);
    if (!task) {
      throw new Error('Task not found.');
    }

    task.isCompleted = !task.isCompleted;
    task.completedAt = task.isCompleted ? new Date() : undefined;
    return task.save();
  },

  /**
   * Delete a task
   */
  async deleteTask(taskId: string, employeeEmail?: string) {
    const query: any = { _id: taskId };
    if (employeeEmail) {
      query.employeeEmail = employeeEmail;
    }
    return Task.findOneAndDelete(query);
  },

  /**
   * Get task metrics summary (active vs completed count)
   */
  async getMetrics(employeeEmail: string) {
    const all = await this.getEmployeeTasks(employeeEmail);
    const active = all.filter((t) => !t.isCompleted).length;
    const completed = all.filter((t) => t.isCompleted).length;
    return {
      total: all.length,
      active,
      completed,
      percentage: all.length > 0 ? Math.round((completed / all.length) * 100) : 0,
    };
  },
};

export default taskService;
