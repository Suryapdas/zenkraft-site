import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler.js";
import { getPublishedServiceBySlug, listPublishedServices } from "../../services/catalog.service.js";

export const servicesRouter = Router();

servicesRouter.get(
  "/services",
  asyncHandler(async (_req, res) => {
    res.json(await listPublishedServices());
  })
);

servicesRouter.get(
  "/services/:slug",
  asyncHandler(async (req, res) => {
    res.json(await getPublishedServiceBySlug(req.params.slug));
  })
);
