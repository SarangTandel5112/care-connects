export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: Record<string, unknown>;
  response?: {
    data?: unknown;
    status?: number;
  };
}

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
