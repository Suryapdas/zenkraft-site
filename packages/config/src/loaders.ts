import { readFileSync } from "node:fs";
import yaml from "js-yaml";
import { getConfigFilePath } from "./paths.js";
import {
  businessConfigSchema,
  productConfigSchema,
  environmentsConfigSchema,
  type BusinessConfig,
  type ProductConfig,
  type EnvironmentsConfig,
  type EnvironmentName,
} from "./schemas.js";

function readYamlFile(filePath: string): unknown {
  const raw = readFileSync(filePath, "utf-8");
  return yaml.load(raw);
}

let businessConfigCache: BusinessConfig | undefined;
let productConfigCache: ProductConfig | undefined;
let environmentsConfigCache: EnvironmentsConfig | undefined;

export function loadBusinessConfig(): BusinessConfig {
  if (!businessConfigCache) {
    const raw = readYamlFile(getConfigFilePath("business.yaml"));
    businessConfigCache = businessConfigSchema.parse(raw);
  }
  return businessConfigCache;
}

export function loadProductConfig(): ProductConfig {
  if (!productConfigCache) {
    const raw = readYamlFile(getConfigFilePath("product.yaml"));
    productConfigCache = productConfigSchema.parse(raw);
  }
  return productConfigCache;
}

export function loadEnvironmentsConfig(): EnvironmentsConfig {
  if (!environmentsConfigCache) {
    const raw = readYamlFile(getConfigFilePath("environments.yaml"));
    environmentsConfigCache = environmentsConfigSchema.parse(raw);
  }
  return environmentsConfigCache;
}

export function loadEnvironmentConfig(env: EnvironmentName) {
  return loadEnvironmentsConfig()[env];
}

/** Test-only: clears in-memory caches so fixtures can be reloaded. */
export function __resetConfigCacheForTests(): void {
  businessConfigCache = undefined;
  productConfigCache = undefined;
  environmentsConfigCache = undefined;
}
