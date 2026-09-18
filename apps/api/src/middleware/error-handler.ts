import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { zodErrorToFieldErrors } from "@zenkraft/validation";
import { ApiError } from "../lib/api-error.js";
import { logger } from "../lib/logger.js";

// api-contracts.md: "Return machine-readable error codes."
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ApiError) {
    if (err.status >= 500) {
      logger.error({ err, path: req.path }, "Unhandled API error");
    }
    res.status(err.status).json({
      code: err.code,
      message: err.message,
      ...(err.fieldErrors ? { fieldErrors: err.fieldErrors } : {}),
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      code: "VALIDATION_ERROR",
      message: "One or more fields are invalid.",
      fieldErrors: zodErrorToFieldErrors(err),
    });
    return;
  }

  logger.error({ err, path: req.path }, "Unexpected server error");
  res.status(500).json({ code: "INTERNAL_SERVER_ERROR", message: "Something went wrong. Please try again." });
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ code: "NOT_FOUND", message: `No route matches ${req.method} ${req.path}` });
}
