import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler.js";
import { getPublishedProjectBySlug, listPublishedProjects } from "../../services/catalog.service.js";

export const projectsRouter = Router();

projectsRouter.get(
  "/projects",
  asyncHandler(async (_req, res) => {
    res.json(await listPublishedProjects());
  })
);

projectsRouter.get(
  "/projects/:slug",
  asyncHandler(async (req, res) => {
    res.json(await getPublishedProjectBySlug(req.params.slug));
  })
);
