import { apiClient } from './api.client';
import { ApiResponse } from '@/types/api.types';
import { TaskItem, TaskCategory, TaskPriority } from '@/types/task.types';

export const taskService = {
  /**
   * Get employee tasks from MongoDB
   */
  async getTasks(email?: string) {
    const params = email ? `?email=${encodeURIComponent(email)}` : '';
    return apiClient.get<ApiResponse<TaskItem[]>>(`/tasks${params}`);
  },

  /**
   * Create a new task in MongoDB
   */
  async createTask(data: {
    title: string;
    category?: TaskCategory;
    priority?: TaskPriority;
    dueDateLabel?: string;
    employeeEmail?: string;
    userId?: string;
  }) {
    return apiClient.post<ApiResponse<TaskItem>>('/tasks', data);
  },

  /**
   * Toggle completion state of a task in MongoDB
   */
  async toggleTask(id: string, email?: string) {
    const params = email ? `?email=${encodeURIComponent(email)}` : '';
    return apiClient.patch<ApiResponse<TaskItem>>(`/tasks/${id}/toggle${params}`);
  },

  /**
   * Delete a task from MongoDB
   */
  async deleteTask(id: string, email?: string) {
    const params = email ? `?email=${encodeURIComponent(email)}` : '';
    return apiClient.delete<ApiResponse<null>>(`/tasks/${id}${params}`);
  },

  /**
   * Get task metrics
   */
  async getMetrics(email?: string) {
    const params = email ? `?email=${encodeURIComponent(email)}` : '';
    return apiClient.get<
      ApiResponse<{
        total: number;
        active: number;
        completed: number;
        percentage: number;
      }>
    >(`/tasks/metrics${params}`);
  },
};

export default taskService;
