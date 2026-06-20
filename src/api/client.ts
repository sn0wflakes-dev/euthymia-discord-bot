import { env } from "../config/env";
import { log } from "../config/logging";
import { WebResponse } from "../types/api.types";


interface RequestOption {
  method?: "GET" | "POST" | "DELETE" | "PATCH";
  body?: unknown;
  headers?: Record<string, string>;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown
  ) {
    super(message);
    this.name = "API_ERROR";
  }
}

export async function apiClient<T>(path: string, options: RequestOption = {}): Promise<T> {
  const {method = "GET", body, headers = {}} = options;

  log.debug(`DEBUG METHOD ${method}`);
  log.debug(`DEBUG BODY ${JSON.stringify(body)}`);
  log.debug(`DEBUG ENDPOINT : ${env.API_BASE_URL}${path}`);

  const response = await fetch(`${env.API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json", 
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let errorBody: unknown;
    try {
      errorBody = await response.json();
    } catch {
      errorBody = null;
    }

    throw new ApiError(response.status, `API ERROR : ${response.status} ${response.statusText}`, errorBody);
  }

  const json = await response.json() as WebResponse<T>;

  return json.data;

}
