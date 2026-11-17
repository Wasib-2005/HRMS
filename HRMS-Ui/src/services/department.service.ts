import apiClient from "./api.client";
import { DepartmentInterface, DepartmentAssignInterface } from "@/types/department.types";
import { ApiResponse } from "@/types/api.types";

export const departmentService = {
  getAll: (page = 1, limit = 50) =>
    apiClient.get<ApiResponse<DepartmentInterface[]>>("/departments", {
      params: { page, limit },
    }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<DepartmentInterface>>(`/departments/${id}`),

  create: (data: { name: string; description?: string }) =>
    apiClient.post<ApiResponse<DepartmentInterface>>("/departments", data),

  update: (id: string, data: Partial<DepartmentInterface>) =>
    apiClient.put<ApiResponse<DepartmentInterface>>(`/departments/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<DepartmentInterface>>(`/departments/${id}`),

  getRecycleBin: () =>
    apiClient.get<ApiResponse<DepartmentInterface[]>>("/departments/recycle_bin"),

  restore: (id: string) =>
    apiClient.patch<ApiResponse<DepartmentInterface>>(`/departments/${id}/restore`),

  // Assignments
  assign: (data: { user: string; department: string }) =>
    apiClient.post<ApiResponse<DepartmentAssignInterface>>("/department-assign", data),

  transfer: (data: { user: string; newDepartment: string }) =>
    apiClient.post<ApiResponse<DepartmentAssignInterface>>("/department-assign/transfer", data),

  getAllAssignments: () =>
    apiClient.get<ApiResponse<DepartmentAssignInterface[]>>("/department-assign"),

  getAssignmentsByUser: (userId: string) =>
    apiClient.get<ApiResponse<DepartmentAssignInterface[]>>(`/department-assign/user/${userId}`),

  getAssignmentsByDept: (deptId: string) =>
    apiClient.get<ApiResponse<DepartmentAssignInterface[]>>(`/department-assign/department/${deptId}`),
};

export default departmentService;
