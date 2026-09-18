import "dotenv/config";
import {
  loadBusinessConfig,
  loadEnvironmentConfig,
  validateBusinessConfigForProduction,
  validateRequiredSecrets,
  combineReadinessResults,
} from "@zenkraft/config";

const REQUIRED_PRODUCTION_SECRETS = ["DATABASE_URL", "STORAGE_ACCESS_KEY", "STORAGE_SECRET_KEY"];

const CONFIG_PLACEHOLDER_PATTERN = /^\[CONFIG:.*\]$/;

/**
 * AC-002 / security-spec production gate: "Production deployment is blocked
 * if contact verification flags are false or required secrets are missing."
 * Run before any production build/deploy (wired into CI in Phase 4).
 */
function main(): void {
  const business = loadBusinessConfig();
  const businessResult = validateBusinessConfigForProduction(business);
  const secretsResult = validateRequiredSecrets(process.env, REQUIRED_PRODUCTION_SECRETS);

  const productionEnv = loadEnvironmentConfig("production");
  const envErrors = Object.entries(productionEnv)
    .filter(([, value]) => typeof value === "string" && CONFIG_PLACEHOLDER_PATTERN.test(value))
    .map(([key]) => ({
      field: `environments.yaml production.${key}`,
      reason: "PLACEHOLDER_VALUE" as const,
      message: `production.${key} still contains an unverified placeholder value.`,
    }));

  const combined = combineReadinessResults(businessResult, secretsResult, { ok: envErrors.length === 0, errors: envErrors });

  if (combined.ok) {
    console.log("Production readiness check passed: all contact fields verified, all required secrets present.");
    process.exit(0);
  }

  console.error(`Production readiness check FAILED with ${combined.errors.length} error(s):\n`);
  for (const error of combined.errors) {
    console.error(`  [${error.reason}] ${error.field}: ${error.message}`);
  }
  console.error("\nDeployment blocked. Fix config/business.yaml, environments.yaml, and/or environment secrets, then re-run.");
  process.exit(1);
}

main();
