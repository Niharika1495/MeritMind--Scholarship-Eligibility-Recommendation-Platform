/**
 * Production API transport connecting to the FastAPI backend.
 */

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "https://meritmind-backend.onrender.com"
).replace(/\/$/, "");

export const API_URL = API_BASE_URL.endsWith("/api")
  ? API_BASE_URL
  : `${API_BASE_URL}/api`;

export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_URL}${cleanPath}`;
}

export async function apiRequest<T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  body?: any,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Attach JWT Authorization header if available
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("meritmind_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(getApiUrl(path), options);
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({ detail: "API Error occurred" }));
      throw new ApiError(errBody.detail || "Request failed", res.status);
    }
    return (await res.json()) as T;
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(err.message || "Network connection failure", 500);
  }
}

export async function apiUpload<T>(path: string, formData: FormData): Promise<T> {
  const headers: Record<string, string> = {};

  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("meritmind_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  try {
    const res = await fetch(getApiUrl(path), {
      method: "POST",
      headers,
      body: formData,
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({ detail: "Upload failed" }));
      throw new ApiError(errBody.detail || "Upload failed", res.status);
    }
    return (await res.json()) as T;
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(err.message || "Network upload error", 500);
  }
}
