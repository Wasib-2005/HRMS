export type TaskPriority = 'High' | 'Normal';
export type TaskCategory = 'overdue' | 'today' | 'upcoming';

export interface ITask {
  _id?: string | undefined;
  title: string;
  category: TaskCategory;
  dueDateLabel: string;
  priority: TaskPriority;
  isCompleted: boolean;
  completedAt?: Date | string | undefined;
  employeeEmail: string;
  userId?: string | undefined;
  order?: number | undefined;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
}
