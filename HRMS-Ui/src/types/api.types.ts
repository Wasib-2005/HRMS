export interface ApiResponse<T = any> {
  success: boolean;
  status?: number;
  message?: string;
  data?: T;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  total?: number;
  page?: number;
  limit?: number;
}
