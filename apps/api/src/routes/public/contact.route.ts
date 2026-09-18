import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler.js";
import { getContactConfig } from "../../services/contact.service.js";

export const contactRouter = Router();

contactRouter.get(
  "/contact",
  asyncHandler(async (_req, res) => {
    res.json(await getContactConfig());
  })
);
