import { useAuthStore } from '../store/useAuthStore';

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(message: string, status = 500, code?: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export interface RequestOptions extends Omit<RequestInit, 'body' | 'headers'> {
  body?: unknown;
  headers?: Record<string, string>;
  timeoutMs?: number;
  skipAuth?: boolean;
}

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
const DEFAULT_TIMEOUT_MS = 12000;

class ApiClient {
  /** True when a remote backend URL is configured via EXPO_PUBLIC_API_URL. */
  get isConfigured(): boolean {
    return API_BASE_URL.length > 0;
  }

  get baseUrl(): string {
    return API_BASE_URL;
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    if (!this.isConfigured) {
      throw new ApiError(
        'Backend API URL is not configured (set EXPO_PUBLIC_API_URL).',
        503,
        'BACKEND_UNCONFIGURED'
      );
    }

    const {
      body,
      headers = {},
      timeoutMs = DEFAULT_TIMEOUT_MS,
      skipAuth = false,
      ...rest
    } = options;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const requestHeaders: Record<string, string> = {
      Accept: 'application/json',
      ...headers,
    };

    if (body !== undefined && !(body instanceof FormData)) {
      requestHeaders['Content-Type'] = 'application/json';
    }

    if (!skipAuth) {
      const token = useAuthStore.getState().sessionToken;
      if (token) {
        requestHeaders.Authorization = `Bearer ${token}`;
      }
    }

    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const url = `${API_BASE_URL}${normalizedPath}`;

    try {
      const response = await fetch(url, {
        ...rest,
        headers: requestHeaders,
        body:
          body === undefined
            ? undefined
            : body instanceof FormData
            ? body
            : JSON.stringify(body),
        signal: controller.signal,
      });

      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');
      const payload = isJson ? await response.json().catch(() => null) : await response.text();

      if (!response.ok) {
        if (response.status === 401 && !skipAuth) {
          useAuthStore.getState().logout().catch(() => {});
        }
        const message =
          (payload && typeof payload === 'object' && 'message' in payload
            ? String((payload as { message: unknown }).message)
            : null) || `Request failed with status ${response.status}`;
        const code =
          payload && typeof payload === 'object' && 'code' in payload
            ? String((payload as { code: unknown }).code)
            : undefined;
        throw new ApiError(message, response.status, code, payload);
      }

      return payload as T;
    } catch (err: any) {
      if (err instanceof ApiError) {
        throw err;
      }
      if (err?.name === 'AbortError') {
        throw new ApiError('Request timed out. Please try again.', 408, 'TIMEOUT');
      }
      throw new ApiError(
        err?.message || 'Network error. Please check your connection.',
        0,
        'NETWORK_ERROR'
      );
    } finally {
      clearTimeout(timer);
    }
  }

  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'POST', body });
  }

  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'PUT', body });
  }

  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'PATCH', body });
  }

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
