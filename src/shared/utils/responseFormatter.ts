export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export function formatSuccess<T>(data: T, message = "Operation successful", meta?: ApiResponse["meta"]): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    ...(meta ? { meta } : {}),
  };
}

export function formatError(message: string, code = "ERROR", details?: any) {
  return {
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
  };
}
