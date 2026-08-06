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

const BASE_URL = "http://127.0.0.1:8000/api";

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
    const res = await fetch(`${BASE_URL}${path}`, options);
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
