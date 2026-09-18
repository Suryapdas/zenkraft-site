import type { FieldError } from "@zenkraft/validation";

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fieldErrors?: FieldError[];

  constructor(status: number, code: string, message: string, fieldErrors?: FieldError[]) {
    super(message);
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }

  static badRequest(code: string, message: string, fieldErrors?: FieldError[]): ApiError {
    return new ApiError(400, code, message, fieldErrors);
  }

  static notFound(entity: string): ApiError {
    return new ApiError(404, "NOT_FOUND", `${entity} not found.`);
  }

  static conflict(code: string, message: string): ApiError {
    return new ApiError(409, code, message);
  }

  static forbidden(message = "You do not have access to this resource."): ApiError {
    return new ApiError(403, "FORBIDDEN", message);
  }

  static unauthorized(message = "Authentication is required."): ApiError {
    return new ApiError(401, "UNAUTHORIZED", message);
  }
}
