import apiClient from "./api.client";
import { AssetInterface, AssetAssignInterface } from "@/types/asset.types";
import { ApiResponse } from "@/types/api.types";

export const assetService = {
  getAll: (page = 1, limit = 50) =>
    apiClient.get<ApiResponse<AssetInterface[]>>("/assets", {
      params: { page, limit },
    }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<AssetInterface>>(`/assets/${id}`),

  create: (data: Partial<AssetInterface>) =>
    apiClient.post<ApiResponse<AssetInterface>>("/assets", data),

  update: (id: string, data: Partial<AssetInterface>) =>
    apiClient.put<ApiResponse<AssetInterface>>(`/assets/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<AssetInterface>>(`/assets/${id}`),

  getRecycleBin: () =>
    apiClient.get<ApiResponse<AssetInterface[]>>("/assets/recycle_bin"),

  restore: (id: string) =>
    apiClient.patch<ApiResponse<AssetInterface>>(`/assets/${id}/restore`),

  // Assigned to me (mock / future endpoint)
  getMyAssets: () =>
    apiClient.get<ApiResponse<AssetAssignInterface[]>>("/assets/my-assets").catch(() => ({
      success: true,
      data: [] as AssetAssignInterface[],
    })),
};

export default assetService;
