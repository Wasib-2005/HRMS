import apiClient from "./api.client";
import { HolidayInterface } from "@/types/holiday.types";
import { ApiResponse } from "@/types/api.types";

export const holidayService = {
  getAll: (year?: number, month?: number) =>
    apiClient.get<ApiResponse<HolidayInterface[]>>("/holidays", {
      params: { year, month },
    }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<HolidayInterface>>(`/holidays/${id}`),

  create: (data: Partial<HolidayInterface>) =>
    apiClient.post<ApiResponse<HolidayInterface>>("/holidays", data),

  createMany: (data: Partial<HolidayInterface>[]) =>
    apiClient.post<ApiResponse<HolidayInterface[]>>("/holidays/many", data),

  update: (id: string, data: Partial<HolidayInterface>) =>
    apiClient.put<ApiResponse<HolidayInterface>>(`/holidays/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<HolidayInterface>>(`/holidays/${id}`),
};

export default holidayService;
