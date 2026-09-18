import { z } from "zod";

export const PREFERRED_CONTACT_METHODS = ["PHONE", "WHATSAPP", "EMAIL"] as const;
export type PreferredContactMethod = (typeof PREFERRED_CONTACT_METHODS)[number];

export const LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "CONSULTATION",
  "PROPOSAL",
  "WON",
  "LOST",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

// Permissive international phone pattern: digits, spaces, hyphens, parens, optional leading +.
const PHONE_PATTERN = /^[+]?[0-9\s\-()]{7,20}$/;

/**
 * Mirrors api-contracts.md's POST /leads request body exactly (FR-006).
 * Shared between the Express controller (server-side validation) and the
 * Next.js EnquiryForm (client-side inline validation) so both layers can
 * never drift apart.
 */
export const leadCreateSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name.").max(120),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .regex(PHONE_PATTERN, "Enter a valid phone number."),
  city: z.string().trim().min(2, "Enter your city.").max(120),
  projectType: z.string().trim().min(1, "Select a project type."),
  budgetRange: z.string().trim().min(1, "Select a budget range."),
  timeline: z.string().trim().min(1, "Select a timeline."),
  description: z
    .string()
    .trim()
    .min(10, "Tell us a little more about your project (at least 10 characters).")
    .max(4000),
  preferredContactMethod: z.enum(PREFERRED_CONTACT_METHODS, {
    errorMap: () => ({ message: "Select how you'd like to be contacted." }),
  }),
  consent: z.boolean().refine((value) => value === true, {
    message: "Consent is required to submit an enquiry.",
  }),
  source: z.string().trim().min(1).default("WEBSITE"),
  // Optional per FR-006. Preprocessed because an untouched HTML
  // datetime-local input submits "" rather than omitting the field.
  preferredConsultationAt: z.preprocess(
    (value) => (value === "" || value === undefined ? undefined : value),
    z.string().optional()
  ),
});

export type LeadCreateInput = z.infer<typeof leadCreateSchema>;

export const leadNoteCreateSchema = z.object({
  note: z.string().trim().min(1, "Note cannot be empty.").max(2000),
});
export type LeadNoteCreateInput = z.infer<typeof leadNoteCreateSchema>;
