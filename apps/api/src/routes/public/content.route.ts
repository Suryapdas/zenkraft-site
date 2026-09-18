import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler.js";
import { getHomeContent } from "../../services/content.service.js";

export const contentRouter = Router();

contentRouter.get(
  "/content/home",
  asyncHandler(async (_req, res) => {
    const home = await getHomeContent();
    res.json(home);
  })
);
