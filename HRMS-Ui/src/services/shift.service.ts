import apiClient from "./api.client";
import { ShiftInterface } from "@/types/shift.types";
import { ApiResponse } from "@/types/api.types";

export const shiftService = {
  getAll: () =>
    apiClient.get<ApiResponse<ShiftInterface[]>>("/shifts"),

  getById: (id: string) =>
    apiClient.get<ApiResponse<ShiftInterface>>(`/shifts/${id}`),

  create: (data: Partial<ShiftInterface>) =>
    apiClient.post<ApiResponse<ShiftInterface>>("/shifts", data),

  createMany: (data: Partial<ShiftInterface>[]) =>
    apiClient.post<ApiResponse<ShiftInterface[]>>("/shifts/many", data),

  update: (id: string, data: Partial<ShiftInterface>) =>
    apiClient.put<ApiResponse<ShiftInterface>>(`/shifts/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<ShiftInterface>>(`/shifts/${id}`),

  getRecycleBin: () =>
    apiClient.get<ApiResponse<ShiftInterface[]>>("/shifts/recycle-bin"),

  restore: (id: string) =>
    apiClient.patch<ApiResponse<ShiftInterface>>(`/shifts/${id}/restore`),
};

export default shiftService;
