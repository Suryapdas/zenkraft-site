import { describe, expect, it } from "vitest";
import { loadBusinessConfig } from "../loaders.js";
import {
  validateBusinessConfigForProduction,
  validateRequiredSecrets,
  combineReadinessResults,
} from "../production-readiness.js";
import type { BusinessConfig } from "../schemas.js";

describe("validateBusinessConfigForProduction", () => {
  it("fails against the current real config/business.yaml, which still holds placeholders (AC-002 smoke test)", () => {
    const business = loadBusinessConfig();
    const result = validateBusinessConfigForProduction(business);

    expect(result.ok).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors.some((e) => e.field === "contact.primary_phone")).toBe(true);
    expect(result.errors.some((e) => e.field === "verification.phone_verified")).toBe(true);
  });

  it("passes once every required field is filled in and every verification flag is true", () => {
    const verifiedBusiness: BusinessConfig = {
      brand: {
        legal_name: "Zenkraft Design Studios Pvt Ltd",
        display_name: "ZENKRAFT Design Studios",
        tagline: "Spaces, considered.",
        description: "Premium interior design and turnkey execution studio.",
      },
      contact: {
        primary_phone: "+91 90000 00000",
        whatsapp: "+91 90000 00000",
        primary_email: "hello@zenkraft.example",
        enquiry_email: "projects@zenkraft.example",
      },
      address: {
        line_1: "12 Studio Lane",
        line_2: null,
        city: "Bengaluru",
        state: "Karnataka",
        country: "India",
        postal_code: "560001",
        latitude: "12.9716",
        longitude: "77.5946",
        google_maps_url: "https://maps.google.com/?q=12.9716,77.5946",
      },
      business_hours: {
        timezone: "Asia/Kolkata",
        monday: "10:00-19:00",
        tuesday: "10:00-19:00",
        wednesday: "10:00-19:00",
        thursday: "10:00-19:00",
        friday: "10:00-19:00",
        saturday: "10:00-17:00",
        sunday: "Closed",
      },
      social: {
        instagram: null,
        facebook: null,
        linkedin: null,
        youtube: null,
      },
      verification: {
        address_verified: true,
        phone_verified: true,
        email_verified: true,
        map_pin_verified: true,
        social_profiles_verified: true,
        verified_by: "Studio Principal",
        verified_on: "2026-01-01",
      },
    };

    const result = validateBusinessConfigForProduction(verifiedBusiness);
    expect(result).toEqual({ ok: true, errors: [] });
  });
});

describe("validateRequiredSecrets", () => {
  it("reports missing secrets by name", () => {
    const result = validateRequiredSecrets({ FOO: "bar" } as NodeJS.ProcessEnv, ["FOO", "MISSING_ONE"]);
    expect(result.ok).toBe(false);
    expect(result.errors).toEqual([
      { field: "MISSING_ONE", reason: "MISSING_SECRET", message: 'Required secret "MISSING_ONE" is not set.' },
    ]);
  });

  it("passes when all required secrets are present and non-empty", () => {
    const result = validateRequiredSecrets({ FOO: "bar", BAZ: "qux" } as NodeJS.ProcessEnv, ["FOO", "BAZ"]);
    expect(result).toEqual({ ok: true, errors: [] });
  });
});

describe("combineReadinessResults", () => {
  it("merges errors from multiple results", () => {
    const combined = combineReadinessResults(
      { ok: false, errors: [{ field: "a", reason: "PLACEHOLDER_VALUE", message: "a" }] },
      { ok: false, errors: [{ field: "b", reason: "MISSING_SECRET", message: "b" }] }
    );
    expect(combined.ok).toBe(false);
    expect(combined.errors).toHaveLength(2);
  });
});
