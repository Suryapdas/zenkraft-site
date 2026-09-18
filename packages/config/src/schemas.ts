import { z } from "zod";

/**
 * Mirrors config/business.yaml exactly. Values may legitimately be
 * "[CONFIG:...]" placeholders in non-production environments — that is
 * checked separately by validateProductionReadiness, not by this schema.
 */
export const businessConfigSchema = z.object({
  brand: z.object({
    legal_name: z.string(),
    display_name: z.string(),
    tagline: z.string(),
    description: z.string(),
  }),
  contact: z.object({
    primary_phone: z.string(),
    whatsapp: z.string(),
    primary_email: z.string(),
    enquiry_email: z.string(),
  }),
  address: z.object({
    line_1: z.string(),
    line_2: z.string().nullable().optional(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    postal_code: z.string(),
    latitude: z.string(),
    longitude: z.string(),
    google_maps_url: z.string(),
  }),
  business_hours: z.object({
    timezone: z.string(),
    monday: z.string(),
    tuesday: z.string(),
    wednesday: z.string(),
    thursday: z.string(),
    friday: z.string(),
    saturday: z.string(),
    sunday: z.string(),
  }),
  social: z.object({
    instagram: z.string().nullable().optional(),
    facebook: z.string().nullable().optional(),
    linkedin: z.string().nullable().optional(),
    youtube: z.string().nullable().optional(),
  }),
  verification: z.object({
    address_verified: z.boolean(),
    phone_verified: z.boolean(),
    email_verified: z.boolean(),
    map_pin_verified: z.boolean(),
    social_profiles_verified: z.boolean(),
    verified_by: z.string().nullable().optional(),
    verified_on: z.string().nullable().optional(),
  }),
});

export type BusinessConfig = z.infer<typeof businessConfigSchema>;

/** Mirrors config/product.yaml exactly. */
export const productConfigSchema = z.object({
  product: z.object({
    name: z.string(),
    mode: z.string(),
  }),
  brand: z.object({
    visual_direction: z.string(),
    tone: z.string(),
  }),
  lead_capture: z.object({
    primary_cta: z.string(),
    secondary_cta: z.string(),
    enable_whatsapp: z.boolean(),
    enable_phone_call: z.boolean(),
    enable_email: z.boolean(),
    require_consent: z.boolean(),
  }),
  project_types: z.array(z.string()),
  budget_ranges: z.array(z.string()),
  timeline_options: z.array(z.string()),
  admin: z.object({
    enabled: z.boolean(),
    roles: z.array(z.string()),
  }),
});

export type ProductConfig = z.infer<typeof productConfigSchema>;

const environmentEntrySchema = z.object({
  frontend_url: z.string(),
  api_url: z.string(),
  analytics_enabled: z.boolean(),
});

/** Mirrors config/environments.yaml exactly. */
export const environmentsConfigSchema = z.object({
  development: environmentEntrySchema,
  staging: environmentEntrySchema,
  production: environmentEntrySchema,
});

export type EnvironmentsConfig = z.infer<typeof environmentsConfigSchema>;
export type EnvironmentName = keyof EnvironmentsConfig;
