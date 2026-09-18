import { describe, expect, it } from "vitest";
import { leadCreateSchema } from "../lead.js";
import { zodErrorToFieldErrors } from "../errors.js";

const validLead = {
  name: "Asha Rao",
  email: "asha@example.com",
  phone: "+91 90000 00000",
  city: "Bengaluru",
  projectType: "Residential Interior",
  budgetRange: "10L-25L",
  timeline: "Within 1–3 months",
  description: "Looking to redo a 3BHK apartment, open kitchen concept.",
  preferredContactMethod: "WHATSAPP",
  consent: true,
  source: "WEBSITE",
};

describe("leadCreateSchema", () => {
  it("accepts a fully valid enquiry payload", () => {
    const result = leadCreateSchema.safeParse(validLead);
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email and identifies the field (AC-005)", () => {
    const result = leadCreateSchema.safeParse({ ...validLead, email: "not-an-email" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fieldErrors = zodErrorToFieldErrors(result.error);
      expect(fieldErrors.some((e) => e.field === "email")).toBe(true);
    }
  });

  it("rejects an invalid phone number", () => {
    const result = leadCreateSchema.safeParse({ ...validLead, phone: "abc" });
    expect(result.success).toBe(false);
  });

  it("rejects consent:false — consent is mandatory", () => {
    const result = leadCreateSchema.safeParse({ ...validLead, consent: false });
    expect(result.success).toBe(false);
  });

  it("rejects a missing required field and reports it by name", () => {
    const { description, ...withoutDescription } = validLead;
    const result = leadCreateSchema.safeParse(withoutDescription);
    expect(result.success).toBe(false);
    if (!result.success) {
      const fieldErrors = zodErrorToFieldErrors(result.error);
      expect(fieldErrors.some((e) => e.field === "description")).toBe(true);
    }
  });

  it("defaults source to WEBSITE when omitted", () => {
    const { source, ...withoutSource } = validLead;
    const result = leadCreateSchema.safeParse(withoutSource);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.source).toBe("WEBSITE");
    }
  });
});
