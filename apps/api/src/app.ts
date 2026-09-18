import express from "express";
import cors from "cors";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import { loadEnvironmentConfig } from "@zenkraft/config";
import { env, isProduction } from "./env.js";
import { logger } from "./lib/logger.js";
import { apiV1Router } from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";

const CONFIG_PLACEHOLDER_PATTERN = /^\[CONFIG:.*\]$/;

function resolveCorsOrigin(): string | true {
  const envName = isProduction ? "production" : env.nodeEnv === "staging" ? "staging" : "development";
  const configuredUrl = loadEnvironmentConfig(envName).frontend_url;

  if (!CONFIG_PLACEHOLDER_PATTERN.test(configuredUrl)) {
    return configuredUrl;
  }
  if (isProduction) {
    // Production gate (scripts/validate-production-config.ts) should already
    // have blocked deploy before this branch is reachable.
    throw new Error("environments.yaml production.frontend_url is still a [CONFIG:...] placeholder.");
  }
  return "http://localhost:3000";
}

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: resolveCorsOrigin(), credentials: true }));
  app.use(pinoHttp({ logger }));
  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use("/api/v1", apiV1Router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
