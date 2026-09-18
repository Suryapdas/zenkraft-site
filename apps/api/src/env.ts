import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

// apps/api/src -> apps/api -> apps -> repo root -> .env
// Resolved explicitly (not "dotenv/config") because CWD differs between
// `npm run dev` (repo root) and `vitest`/`tsx` invoked from apps/api.
const moduleDir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(moduleDir, "../../../.env") });

function getEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: getEnv("NODE_ENV", "development"),
  port: Number(getEnv("PORT", "4000")),
  databaseUrl: getEnv("DATABASE_URL"),
  storage: {
    endpoint: getEnv("STORAGE_ENDPOINT", "localhost"),
    port: Number(getEnv("STORAGE_PORT", "9000")),
    useSSL: getEnv("STORAGE_USE_SSL", "false") === "true",
    accessKey: getEnv("STORAGE_ACCESS_KEY", "zenkraft"),
    secretKey: getEnv("STORAGE_SECRET_KEY", "zenkraft_dev_password"),
    bucket: getEnv("STORAGE_BUCKET", "zenkraft-media"),
  },
};

export const isProduction = env.nodeEnv === "production";
