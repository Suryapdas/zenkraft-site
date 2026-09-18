import type { ZodError } from "zod";

/** Machine-readable field error, per api-contracts.md's "machine-readable error codes" rule. */
export interface FieldError {
  field: string;
  code: string;
  message: string;
}

export interface ApiErrorBody {
  code: string;
  message: string;
  fieldErrors?: FieldError[];
}

export function zodErrorToFieldErrors(error: ZodError): FieldError[] {
  return error.issues.map((issue) => ({
    field: issue.path.join(".") || "root",
    code: issue.code.toUpperCase(),
    message: issue.message,
  }));
}
