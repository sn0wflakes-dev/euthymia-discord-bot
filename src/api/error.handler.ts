import type { WebResponse } from "../types/api.types";
import { ApiError } from "./client";

export class AppError extends Error {
  constructor(
    public errorCode: string,
    message: string,
    public details?: {Field: string, Message: string}[]
  ) {
    super(message);
    this.name = "APP_ERROR";
  }
}

export function handleApiError(err: unknown): Error {
  if (err instanceof ApiError) {
    const body = err.body as WebResponse<null> | null;
    const serverError = body?.errors;

    if (serverError?.errorMessage) {
      return new AppError(serverError.errorCode, serverError.errorMessage, serverError.details);
    }

    return new AppError(String(err.status), err.message);
  }

  if (err instanceof Error) {
    return err;
  }

  return new Error("Unknown Error");
}
