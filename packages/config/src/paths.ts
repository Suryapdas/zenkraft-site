import path from "node:path";
import { fileURLToPath } from "node:url";

const moduleDir = path.dirname(fileURLToPath(import.meta.url));

// packages/config/src -> repo root -> config
const DEFAULT_CONFIG_DIR = path.resolve(moduleDir, "../../../config");

export function getConfigDir(): string {
  return process.env.ZENKRAFT_CONFIG_DIR
    ? path.resolve(process.env.ZENKRAFT_CONFIG_DIR)
    : DEFAULT_CONFIG_DIR;
}

export function getConfigFilePath(fileName: "business.yaml" | "product.yaml" | "environments.yaml"): string {
  return path.join(getConfigDir(), fileName);
}
