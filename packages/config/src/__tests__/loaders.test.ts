import { describe, expect, it, beforeEach } from "vitest";
import {
  loadBusinessConfig,
  loadProductConfig,
  loadEnvironmentsConfig,
  loadEnvironmentConfig,
  __resetConfigCacheForTests,
} from "../loaders.js";

beforeEach(() => {
  __resetConfigCacheForTests();
});

describe("config loaders", () => {
  it("loads and validates the real config/business.yaml against the schema", () => {
    const business = loadBusinessConfig();
    expect(business.brand.display_name).toBe("ZENKRAFT Design Studios");
    expect(business.address.country).toBe("India");
    expect(business.business_hours.timezone).toBe("Asia/Kolkata");
  });

  it("loads and validates the real config/product.yaml against the schema", () => {
    const product = loadProductConfig();
    expect(product.lead_capture.primary_cta).toBe("Book a Consultation");
    expect(product.project_types).toContain("Residential Interior");
    expect(product.admin.roles).toEqual(["Admin", "Sales/Client Engagement", "Content Manager"]);
  });

  it("loads and validates the real config/environments.yaml against the schema", () => {
    const environments = loadEnvironmentsConfig();
    expect(environments.development.analytics_enabled).toBe(false);
    expect(environments.production.analytics_enabled).toBe(true);
  });

  it("loadEnvironmentConfig returns a single environment entry", () => {
    const dev = loadEnvironmentConfig("development");
    expect(dev).toHaveProperty("frontend_url");
    expect(dev).toHaveProperty("api_url");
  });

  it("caches parsed config across calls (same object reference)", () => {
    const first = loadBusinessConfig();
    const second = loadBusinessConfig();
    expect(first).toBe(second);
  });
});
