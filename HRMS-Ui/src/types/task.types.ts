export type TaskPriority = "High" | "Normal";
export type TaskCategory = "overdue" | "today" | "upcoming";

export interface TaskItem {
  id: string;
  _id?: string;
  title: string;
  category: TaskCategory;
  dueDateLabel: string;
  priority: TaskPriority;
  isCompleted: boolean;
  completedAt?: string;
  employeeEmail?: string;
  userId?: string;
  order?: number;
}
