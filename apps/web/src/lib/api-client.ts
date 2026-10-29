import { ApiErrorResponse, ApiErrorResponseSchema } from '@mvp/shared';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

export class ApiClientError extends Error {
  public readonly code: string;
  public readonly details?: unknown;
  public readonly status: number;

  constructor(message: string, code = 'API_ERROR', status = 500, details?: unknown) {
    super(message);
    this.name = 'ApiClientError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorData: ApiErrorResponse | null = null;
    try {
      const json = await response.json();
      const parsed = ApiErrorResponseSchema.safeParse(json);
      if (parsed.success) {
        errorData = parsed.data;
      }
    } catch {
      // Falha ao parsear JSON
    }

    throw new ApiClientError(
      errorData?.message || `Erro HTTP ${response.status}: ${response.statusText}`,
      errorData?.code || 'HTTP_ERROR',
      response.status,
      errorData?.details
    );
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

