
const API_URL = process.env.NEXT_PUBLIC_API_PUBLIC_URL?.replace(/\/+$/, "");

const DEFAULT_TIMEOUT = 30_000;

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

export interface ApiRequestConfig {
  headers?: HeadersInit;
  params?: QueryParams;
  timeout?: number;
  signal?: AbortSignal;
  credentials?: RequestCredentials;
  skipAuthRefresh?: boolean;
}

export class ApiError extends Error {
  status: number;
  data: unknown;
  code?: string;

  constructor(
    message: string,
    status: number,
    data?: unknown,
    code?: string
  ) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.code = code;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/* -------------------------------------------------------------------------- */
/* Access token management                                                     */
/* -------------------------------------------------------------------------- */

let accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

/* -------------------------------------------------------------------------- */
/* Refresh token handler                                                       */
/* -------------------------------------------------------------------------- */

let refreshHandler: (() => Promise<string>) | null = null;

export function setAccessTokenRefreshHandler(
  handler: (() => Promise<string>) | null
): void {
  refreshHandler = handler;
}

/* -------------------------------------------------------------------------- */
/* Build API URL                                                               */
/* -------------------------------------------------------------------------- */

function buildUrl(
  endpoint: string,
  params?: QueryParams
): string {
  if (!API_URL) {
    throw new ApiError(
      "NEXT_PUBLIC_API_PUBLIC_URL environment variable is not configured.",
      0,
      null,
      "CONFIG_ERROR"
    );
  }

  const path = endpoint.replace(/^\/+/, "");

  const url = new URL(`${API_URL}/${path}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

/* -------------------------------------------------------------------------- */
/* Extract backend error message                                               */
/* -------------------------------------------------------------------------- */

function getErrorMessage(data: unknown): string {
  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data && typeof data === "object") {
    const response = data as Record<string, unknown>;

    const message =
      response.message ??
      response.error ??
      response.detail;

    if (typeof message === "string" && message.trim()) {
      return message;
    }

    if (
      message &&
      typeof message === "object" &&
      "message" in message &&
      typeof message.message === "string"
    ) {
      return message.message;
    }
  }

  return "Something went wrong. Please try again.";
}

/* -------------------------------------------------------------------------- */
/* Parse response                                                              */
/* -------------------------------------------------------------------------- */

async function parseResponse<T>(
  response: Response
): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const contentType =
    response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      return (await response.json()) as T;
    } catch {
      throw new ApiError(
        "Invalid JSON response received from server.",
        response.status,
        null,
        "INVALID_JSON"
      );
    }
  }

  return (await response.text()) as T;
}

/* -------------------------------------------------------------------------- */
/* Prepare request body                                                        */
/* -------------------------------------------------------------------------- */

function prepareBody(
  body: unknown,
  headers: Headers
): BodyInit | undefined {
  if (body === undefined || body === null) {
    return undefined;
  }

  if (
    typeof body === "string" ||
    (typeof FormData !== "undefined" && body instanceof FormData) ||
    (typeof Blob !== "undefined" && body instanceof Blob) ||
    (typeof URLSearchParams !== "undefined" &&
      body instanceof URLSearchParams) ||
    (typeof ArrayBuffer !== "undefined" &&
      body instanceof ArrayBuffer)
  ) {
    return body as BodyInit;
  }

  headers.set("Content-Type", "application/json");

  return JSON.stringify(body);
}

/* -------------------------------------------------------------------------- */
/* Execute HTTP request                                                        */
/* -------------------------------------------------------------------------- */

async function execute<T>(
  method: HttpMethod,
  endpoint: string,
  body: unknown,
  config: ApiRequestConfig,
  retryAfterRefresh: boolean
): Promise<T> {
  const {
    headers: customHeaders,
    params,
    timeout = DEFAULT_TIMEOUT,
    signal: externalSignal,
    credentials = "include",
    skipAuthRefresh = false,
  } = config;

  const headers = new Headers(customHeaders);

  headers.set("Accept", "application/json");

  if (accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const requestBody = prepareBody(body, headers);

  const controller = new AbortController();

  let timedOut = false;

  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeout);

  const abortExternal = () => controller.abort();

  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort();
    } else {
      externalSignal.addEventListener(
        "abort",
        abortExternal,
        { once: true }
      );
    }
  }

  try {
    const response = await fetch(buildUrl(endpoint, params), {
      method,
      headers,
      body: requestBody,
      signal: controller.signal,
      credentials,
      cache: "no-store",
    });

    const data = await parseResponse<unknown>(response);

    /* ---------------------------------------------------------------------- */
    /* Automatic access-token refresh                                          */
    /* ---------------------------------------------------------------------- */

    if (
      response.status === 401 &&
      retryAfterRefresh &&
      !skipAuthRefresh &&
      refreshHandler
    ) {
      let newToken: string;

      try {
        newToken = await refreshHandler();
      } catch {
        setAccessToken(null);

        throw new ApiError(
          "Your session has expired. Please login again.",
          401,
          data,
          "SESSION_EXPIRED"
        );
      }

      setAccessToken(newToken);

      // Retry the original request only once. Errors from the retry are
      // real errors of that request and must not be reported as an
      // expired session.
      return await execute<T>(
        method,
        endpoint,
        body,
        config,
        false
      );
    }

    if (!response.ok) {
      throw new ApiError(
        getErrorMessage(data),
        response.status,
        data,
        `HTTP_${response.status}`
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (timedOut) {
      throw new ApiError(
        "Request timed out. Please try again.",
        0,
        null,
        "TIMEOUT"
      );
    }

    if (externalSignal?.aborted) {
      throw new ApiError(
        "Request was cancelled.",
        0,
        null,
        "ABORTED"
      );
    }

    if (error instanceof TypeError) {
      throw new ApiError(
        "Unable to connect to the server. Please check your network connection.",
        0,
        null,
        "NETWORK_ERROR"
      );
    }

    throw new ApiError(
      error instanceof Error
        ? error.message
        : "An unexpected error occurred.",
      0,
      error,
      "UNKNOWN_ERROR"
    );
  } finally {
    clearTimeout(timeoutId);

    externalSignal?.removeEventListener(
      "abort",
      abortExternal
    );
  }
}

/* -------------------------------------------------------------------------- */
/* Global API request handler                                                  */
/* -------------------------------------------------------------------------- */

async function request<T>(
  method: HttpMethod,
  endpoint: string,
  body?: unknown,
  config: ApiRequestConfig = {}
): Promise<T> {
  return execute<T>(
    method,
    endpoint,
    body,
    config,
    true
  );
}

/* -------------------------------------------------------------------------- */
/* Centralized API service                                                     */
/* -------------------------------------------------------------------------- */

export const api = {
  get<T>(
    endpoint: string,
    config?: ApiRequestConfig
  ): Promise<T> {
    return request<T>(
      "GET",
      endpoint,
      undefined,
      config
    );
  },

  post<T>(
    endpoint: string,
    body?: unknown,
    config?: ApiRequestConfig
  ): Promise<T> {
    return request<T>(
      "POST",
      endpoint,
      body,
      config
    );
  },

  put<T>(
    endpoint: string,
    body?: unknown,
    config?: ApiRequestConfig
  ): Promise<T> {
    return request<T>(
      "PUT",
      endpoint,
      body,
      config
    );
  },

  delete<T>(
    endpoint: string,
    config?: ApiRequestConfig & {
      body?: unknown;
    }
  ): Promise<T> {
    const { body, ...requestConfig } = config ?? {};

    return request<T>(
      "DELETE",
      endpoint,
      body,
      requestConfig
    );
  },
};

export default api;
