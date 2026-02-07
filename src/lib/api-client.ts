import type { ApiSuccessResponse, ApiErrorResponse } from "@/types/api";

// API Configuration
const API_BASE_URL =
    import.meta.env.VITE_API_URL ||  "https://api.predika.app";

export const CDN_BASE_URL = "https://cdn.predika.app/";

// Custom error class for API errors
export class ApiError extends Error {
    constructor(
        public status: number,
        public message: string,
        public response?: Response
    ) {
        super(message);
        this.name = "ApiError";
    }
}

// Type for fetch options
interface FetchOptions extends RequestInit {
    params?: Record<string, string | number | boolean | undefined>;
}

/**
 * Build a full URL from endpoint + query params
 */
function buildUrl(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>
): string {
    let url = `${API_BASE_URL}${endpoint}`;
    if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                searchParams.append(key, String(value));
            }
        });
        const queryString = searchParams.toString();
        if (queryString) {
            url += `?${queryString}`;
        }
    }
    return url;
}

/**
 * Low-level fetch wrapper with shared auth, URL building, and error handling.
 * Returns the raw Response so callers can handle blobs, headers, etc.
 * Automatically skips Content-Type and JSON.stringify for FormData bodies.
 */
export async function apiFetch(
    endpoint: string,
    options: FetchOptions = {}
): Promise<Response> {
    const { params, ...fetchOptions } = options;
    const url = buildUrl(endpoint, params);

    const isFormData = fetchOptions.body instanceof FormData;

    const headers: HeadersInit = isFormData
        ? { ...fetchOptions.headers as Record<string, string> }
        : { "Content-Type": "application/json", ...fetchOptions.headers as Record<string, string> };

    const config: RequestInit = {
        credentials: "include",
        ...fetchOptions,
        headers,
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            // Try to parse error message from JSON body
            let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            try {
                const contentType = response.headers.get("content-type");
                if (contentType?.includes("application/json")) {
                    const errorData = await response.json() as ApiErrorResponse;
                    if (errorData?.message) {
                        errorMessage = errorData.message;
                    }
                }
            } catch {
                // Ignore parse errors, use default message
            }
            throw new ApiError(response.status, errorMessage, response);
        }

        return response;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        if (error instanceof TypeError) {
            throw new ApiError(0, "Erè rezo. Tanpri verifye koneksyon w.");
        }
        throw new ApiError(
            500,
            error instanceof Error ? error.message : "Yon erè ki pa prevwa fèt"
        );
    }
}

/**
 * High-level API client that returns parsed JSON data.
 * Unwraps the { data: T } response envelope automatically.
 */
export async function apiClient<T = unknown>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T> {
    const response = await apiFetch(endpoint, options);

    // Handle non-JSON responses or empty bodies
    const contentType = response.headers.get("content-type");
    const hasJsonContent = contentType?.includes("application/json");

    let data: ApiSuccessResponse<T> | ApiErrorResponse | null = null;
    if (hasJsonContent) {
        data = await response.json();
    }

    // Return the data property for successful responses
    return (data as ApiSuccessResponse<T>)?.data ?? (null as T);
}

/**
 * Helper function to construct CDN audio URLs
 */
export function getAudioUrl(filename: string | null | undefined): string | null {
    if (!filename) return null;
    // If already a full URL, return as-is
    if (filename.startsWith("http://") || filename.startsWith("https://")) {
        return filename;
    }
    return `${CDN_BASE_URL}${filename}`;
}

/**
 * Helper to get the best available audio URL from AudioFiles object
 * Priority: conteuse > presentateur > narrateur
 */
export function getBestAudioUrl(audio: {
    conteuse?: string | null;
    presentateur?: string | null;
    narrateur?: string | null;
} | null): string | null {
    if (!audio) return null;

    const filename = audio.conteuse || audio.presentateur || audio.narrateur;
    return getAudioUrl(filename);
}

/**
 * Check if error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError;
}

/**
 * Get user-friendly error message from error
 */
export function getErrorMessage(error: unknown): string {
    if (isApiError(error)) {
        return error.message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return "Yon erè ki pa prevwa fèt";
}

/**
 * Convenience methods for different HTTP methods
 */
async function get<T = unknown>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
    return apiClient<T>(endpoint, params ? { method: "GET", params } : { method: "GET" });
}

async function post<T = unknown>(
    endpoint: string,
    body?: unknown,
    params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
    const options: FetchOptions = { method: "POST" };
    if (body) options.body = body instanceof FormData ? body : JSON.stringify(body);
    if (params) options.params = params;
    return apiClient<T>(endpoint, options);
}

async function put<T = unknown>(
    endpoint: string,
    body?: unknown,
    params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
    const options: FetchOptions = { method: "PUT" };
    if (body) options.body = body instanceof FormData ? body : JSON.stringify(body);
    if (params) options.params = params;
    return apiClient<T>(endpoint, options);
}

async function patch<T = unknown>(
    endpoint: string,
    body?: unknown,
    params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
    const options: FetchOptions = { method: "PATCH" };
    if (body) options.body = body instanceof FormData ? body : JSON.stringify(body);
    if (params) options.params = params;
    return apiClient<T>(endpoint, options);
}

async function deleteRequest<T = unknown>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
    return apiClient<T>(endpoint, params ? { method: "DELETE", params } : { method: "DELETE" });
}

export const api = {
    fetch: apiFetch,
    get,
    post,
    put,
    patch,
    delete: deleteRequest,
    getAudioUrl,
    getBestAudioUrl,
    ApiError,
    isApiError,
    getErrorMessage,
};
