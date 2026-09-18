import { loadEnvironmentConfig } from "@zenkraft/config";

const CONFIG_PLACEHOLDER_PATTERN = /^\[CONFIG:.*\]$/;
const nodeEnv = process.env.NODE_ENV === "production" ? "production" : "development";

// architecture.md's config rule, applied at the frontend build boundary:
// this is the ONLY place apps/web is allowed to import @zenkraft/config, and
// only for environments.yaml (build-time wiring), never business/product data.
const envConfig = loadEnvironmentConfig(nodeEnv);

const apiBaseUrl = CONFIG_PLACEHOLDER_PATTERN.test(envConfig.api_url)
  ? "http://localhost:4000"
  : envConfig.api_url;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Production Docker image (apps/web/Dockerfile) runs the traced
  // .next/standalone server rather than `next start` against full node_modules.
  output: "standalone",
  env: {
    NEXT_PUBLIC_API_BASE_URL: `${apiBaseUrl}/api/v1`,
    NEXT_PUBLIC_ANALYTICS_ENABLED: String(envConfig.analytics_enabled),
  },
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
