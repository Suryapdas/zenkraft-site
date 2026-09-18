import pino from "pino";
import { env } from "../env.js";

// security-spec: never log passwords, auth tokens, full uploaded documents, or unnecessary PII.
export const logger = pino({
  level: env.nodeEnv === "production" ? "info" : "debug",
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "*.password",
      "*.passwordHash",
      "*.token",
      "*.sessionId",
      "*.description", // free-text lead description: PII-adjacent, not needed in logs
      "*.attachmentBuffer",
    ],
    censor: "[REDACTED]",
  },
});
