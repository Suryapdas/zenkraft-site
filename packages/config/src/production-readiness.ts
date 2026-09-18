import type { BusinessConfig } from "./schemas.js";

const CONFIG_PLACEHOLDER_PATTERN = /^\[CONFIG:.*\]$/;

export interface ProductionReadinessError {
  field: string;
  reason: "PLACEHOLDER_VALUE" | "NOT_VERIFIED" | "MISSING_SECRET";
  message: string;
}

export interface ProductionReadinessResult {
  ok: boolean;
  errors: ProductionReadinessError[];
}

interface RequiredField {
  path: string;
  value: string | undefined | null;
}

function getRequiredContactFields(business: BusinessConfig): RequiredField[] {
  return [
    { path: "brand.legal_name", value: business.brand.legal_name },
    { path: "brand.tagline", value: business.brand.tagline },
    { path: "brand.description", value: business.brand.description },
    { path: "contact.primary_phone", value: business.contact.primary_phone },
    { path: "contact.whatsapp", value: business.contact.whatsapp },
    { path: "contact.primary_email", value: business.contact.primary_email },
    { path: "contact.enquiry_email", value: business.contact.enquiry_email },
    { path: "address.line_1", value: business.address.line_1 },
    { path: "address.city", value: business.address.city },
    { path: "address.state", value: business.address.state },
    { path: "address.postal_code", value: business.address.postal_code },
    { path: "address.latitude", value: business.address.latitude },
    { path: "address.longitude", value: business.address.longitude },
    { path: "address.google_maps_url", value: business.address.google_maps_url },
    { path: "business_hours.monday", value: business.business_hours.monday },
    { path: "business_hours.tuesday", value: business.business_hours.tuesday },
    { path: "business_hours.wednesday", value: business.business_hours.wednesday },
    { path: "business_hours.thursday", value: business.business_hours.thursday },
    { path: "business_hours.friday", value: business.business_hours.friday },
    { path: "business_hours.saturday", value: business.business_hours.saturday },
    { path: "business_hours.sunday", value: business.business_hours.sunday },
  ];
}

const REQUIRED_VERIFICATION_FLAGS: Array<{
  path: keyof BusinessConfig["verification"];
  label: string;
}> = [
  { path: "address_verified", label: "Physical address" },
  { path: "phone_verified", label: "Phone number" },
  { path: "email_verified", label: "Email address" },
  { path: "map_pin_verified", label: "Map pin / coordinates" },
  { path: "social_profiles_verified", label: "Social profiles" },
];

/**
 * AC-002 / security-spec "Production gate": deployment must be blocked if any
 * required contact field still holds a [CONFIG:...] placeholder, or if any
 * verification flag in config/business.yaml is false.
 */
export function validateBusinessConfigForProduction(
  business: BusinessConfig
): ProductionReadinessResult {
  const errors: ProductionReadinessError[] = [];

  for (const field of getRequiredContactFields(business)) {
    if (!field.value || CONFIG_PLACEHOLDER_PATTERN.test(field.value)) {
      errors.push({
        field: field.path,
        reason: "PLACEHOLDER_VALUE",
        message: `${field.path} still contains an unverified placeholder value ("${field.value}").`,
      });
    }
  }

  for (const flag of REQUIRED_VERIFICATION_FLAGS) {
    if (business.verification[flag.path] !== true) {
      errors.push({
        field: `verification.${flag.path}`,
        reason: "NOT_VERIFIED",
        message: `${flag.label} is not marked verified (verification.${flag.path} is false).`,
      });
    }
  }

  return { ok: errors.length === 0, errors };
}

/**
 * Checks that required runtime secrets are present. Kept separate from the
 * business-config check so callers can report both categories of failure at
 * once with a clear reason code (security-spec: "required secrets missing").
 */
export function validateRequiredSecrets(
  env: NodeJS.ProcessEnv,
  requiredSecretNames: string[]
): ProductionReadinessResult {
  const errors: ProductionReadinessError[] = requiredSecretNames
    .filter((name) => !env[name] || env[name]?.trim() === "")
    .map((name) => ({
      field: name,
      reason: "MISSING_SECRET" as const,
      message: `Required secret "${name}" is not set.`,
    }));

  return { ok: errors.length === 0, errors };
}

export function combineReadinessResults(
  ...results: ProductionReadinessResult[]
): ProductionReadinessResult {
  const errors = results.flatMap((r) => r.errors);
  return { ok: errors.length === 0, errors };
}
