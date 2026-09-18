import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler.js";
import { storageAdapter } from "../../lib/storage.js";

export const mediaRouter = Router();

/**
 * Non-breaking addition beyond api-contracts.md's literal endpoint list:
 * ProjectMedia/Service cover images only store an object-storage key
 * (architecture.md's "S3-compatible object storage"), so something has to
 * resolve that key to a fetchable URL. Redirects to a short-lived presigned
 * MinIO URL rather than proxying bytes through the API.
 */
mediaRouter.get(
  "/media/*",
  asyncHandler(async (req, res) => {
    const storageKey = req.params[0];
    const url = await storageAdapter.getUrl(storageKey);
    res.redirect(302, url);
  })
);
