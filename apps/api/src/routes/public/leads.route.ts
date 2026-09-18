import { Router } from "express";
import multer from "multer";
import rateLimit from "express-rate-limit";
import { leadCreateSchema, zodErrorToFieldErrors } from "@zenkraft/validation";
import { asyncHandler } from "../../lib/async-handler.js";
import { ApiError } from "../../lib/api-error.js";
import { assertUploadIsSafe, storageAdapter } from "../../lib/storage.js";
import { createLead } from "../../services/lead.service.js";

export const leadsRouter = Router();

// security-spec: rate-limit public lead submission.
const leadSubmissionRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { code: "RATE_LIMITED", message: "Too many enquiries submitted. Please try again later." },
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

/**
 * multipart/form-data fields all arrive as strings; JSON submissions (the
 * common case, no attachment) are already correctly typed by express.json().
 * Only coerce when the request was actually multipart.
 */
function normalizeIfMultipart(req: import("express").Request): unknown {
  if (!req.is("multipart/form-data")) {
    return req.body;
  }
  const raw = req.body as Record<string, string>;
  return {
    ...raw,
    consent: raw.consent === "true" || raw.consent === "on",
  };
}

leadsRouter.post(
  "/leads",
  leadSubmissionRateLimit,
  upload.single("attachment"),
  asyncHandler(async (req, res) => {
    const idempotencyKeyHeader = req.header("Idempotency-Key");
    if (!idempotencyKeyHeader) {
      throw ApiError.badRequest("IDEMPOTENCY_KEY_REQUIRED", "Idempotency-Key header is required.");
    }

    const parsed = leadCreateSchema.safeParse(normalizeIfMultipart(req));
    if (!parsed.success) {
      throw ApiError.badRequest(
        "VALIDATION_ERROR",
        "One or more fields are invalid.",
        zodErrorToFieldErrors(parsed.error)
      );
    }

    let attachmentStorageKey: string | undefined;
    if (req.file) {
      assertUploadIsSafe(req.file);
      attachmentStorageKey = await storageAdapter.put({
        buffer: req.file.buffer,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
      });
    }

    const result = await createLead(parsed.data, idempotencyKeyHeader, attachmentStorageKey);
    res.status(result.status).json(result.body);
  })
);
