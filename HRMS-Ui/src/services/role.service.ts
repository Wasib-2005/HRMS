import apiClient from "./api.client";
import { RoleInterface } from "@/types/role.types";
import { ApiResponse } from "@/types/api.types";

export const roleService = {
  getAll: (page = 1, limit = 50) =>
    apiClient.get<ApiResponse<RoleInterface[]>>("/roles", {
      params: { page, limit },
    }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<RoleInterface>>(`/roles/${id}`),

  create: (data: { name: string; description?: string; permissions?: Record<string, boolean> }) =>
    apiClient.post<ApiResponse<RoleInterface>>("/roles", data),

  update: (id: string, data: Partial<RoleInterface>) =>
    apiClient.put<ApiResponse<RoleInterface>>(`/roles/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<RoleInterface>>(`/roles/${id}`),

  getRecycleBin: () =>
    apiClient.get<ApiResponse<RoleInterface[]>>("/roles/recycle_bin"),

  restore: (id: string) =>
    apiClient.patch<ApiResponse<RoleInterface>>(`/roles/${id}/restore`),
};

export default roleService;
