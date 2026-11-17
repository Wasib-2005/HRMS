import apiClient from "./api.client";
import { AuthUser } from "@/types/auth.types";
import { ApiResponse } from "@/types/api.types";

export const employeeService = {
  getAll: () =>
    apiClient.get<ApiResponse<AuthUser[]>>("/employees").catch(() => ({
      success: true,
      data: [] as AuthUser[],
    })),

  getById: (id: string) =>
    apiClient.get<ApiResponse<AuthUser>>(`/employees/${id}`).catch(() => ({
      success: false,
      message: "Employee not found",
    })),
};

export default employeeService;
