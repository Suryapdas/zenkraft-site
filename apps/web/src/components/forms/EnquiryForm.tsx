"use client";

import { useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useForm, type FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { leadCreateSchema } from "@zenkraft/validation";
import { ApiRequestError, submitLead } from "@/lib/api-client";

const formSchema = leadCreateSchema.omit({ source: true });
type FormValues = z.infer<typeof formSchema>;

function fieldErrorMessage(error: FieldError | undefined): string | undefined {
  return error?.message;
}

function FieldLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block font-label-caps text-label-caps uppercase text-on-surface-variant">
      {children} {required ? <span aria-hidden="true">*</span> : <span className="normal-case text-on-surface-variant">(optional)</span>}
    </label>
  );
}

function ErrorText({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1 font-body-md text-sm text-error">
      {message}
    </p>
  );
}

const underlineInputClasses =
  "w-full border-0 border-b border-outline bg-transparent px-0 py-2 font-body-md text-body-md text-primary transition-colors placeholder:text-outline-variant focus:border-primary";

function CheckIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 12.5l2.5 2.5L16 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.6 10.8c1.2 2.4 3.2 4.4 5.6 5.6l1.9-1.9c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V19c0 .6-.4 1-1 1C10.9 20 4 13.1 4 4.6c0-.6.4-1 1-1h2.3c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.3 0 .7-.2 1L6.6 10.8z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 20l1.5-4.2A8 8 0 1112 20a8 8 0 01-4.2-1.2L4 20z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function EnquiryForm({
  projectTypes,
  budgetRanges,
  timelineOptions,
  whatsappNumber,
  phoneNumber,
}: {
  projectTypes: string[];
  budgetRanges: string[];
  timelineOptions: string[];
  whatsappNumber?: string;
  phoneNumber?: string;
}) {
  const formId = useId();
  const idempotencyKeyRef = useRef<string>(crypto.randomUUID());
  const [submitState, setSubmitState] = useState<"idle" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [leadId, setLeadId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(leadCreateSchema.omit({ source: true })),
    mode: "onTouched",
    defaultValues: {
      preferredContactMethod: "WHATSAPP",
    },
  });

  const errorSummary = useMemo(
    () =>
      Object.entries(errors)
        .map(([field, error]) => ({ field, message: fieldErrorMessage(error as FieldError) }))
        .filter((e) => e.message),
    [errors]
  );

  async function onSubmit(values: FormValues) {
    setSubmitState("idle");
    setSubmitError(null);
    try {
      const response = await submitLead(values, idempotencyKeyRef.current, attachment);
      setLeadId(response.leadId);
      setSubmitState("success");
    } catch (error) {
      // AC-015: on failure, keep entered data (react-hook-form state is untouched) and offer a retry path.
      if (error instanceof ApiRequestError) {
        setSubmitError(error.message);
      } else {
        setSubmitError("Something went wrong sending your enquiry. Please try again.");
      }
      setSubmitState("error");
    }
  }

  if (submitState === "success") {
    return (
      <div role="status" className="space-y-8 py-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-container-high text-primary">
          <CheckIcon />
        </div>
        <div className="space-y-4">
          <h2 className="font-display text-headline-md text-primary">Inquiry Received</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Thank you for reaching out. Your project details have been successfully submitted to our studio.
          </p>
          <p className="font-body-md text-sm text-on-surface-variant">
            Reference ID: <span className="font-body-md">{leadId}</span>
          </p>
          <div className="inline-block border-b border-outline-variant px-8 pb-2">
            <p className="font-label-caps text-label-caps uppercase text-on-surface-variant">
              Expected Response: 24 - 48 Hours
            </p>
          </div>
        </div>
        {(phoneNumber || whatsappNumber) && (
          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            {phoneNumber && (
              <a
                href={`tel:${phoneNumber.replace(/\s+/g, "")}`}
                className="inline-flex w-full items-center justify-center gap-3 bg-primary px-8 py-4 font-label-caps text-label-caps uppercase text-on-primary transition-colors duration-300 hover:bg-inverse-surface sm:w-auto"
              >
                <PhoneIcon /> Call Studio
              </a>
            )}
            {whatsappNumber && (
              <a
                href={`https://wa.me/${whatsappNumber.replace(/[^\d]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-3 border border-primary px-8 py-4 font-label-caps text-label-caps uppercase text-primary transition-colors duration-300 hover:bg-surface-container-high sm:w-auto"
              >
                <ChatIcon /> WhatsApp
              </a>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <form
      id="enquiry-form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8"
      aria-describedby={errorSummary.length ? `${formId}-summary` : undefined}
    >
      {errorSummary.length > 0 && (
        <div id={`${formId}-summary`} role="alert" className="border border-error-container bg-error-container/40 p-4">
          <p className="font-label-caps text-label-caps uppercase text-error">Please fix the following before submitting:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 font-body-md text-body-md text-error">
            {errorSummary.map((e) => (
              <li key={e.field}>{e.message}</li>
            ))}
          </ul>
        </div>
      )}

      {submitState === "error" && submitError && (
        <div role="alert" className="border border-error-container bg-error-container/40 p-4 font-body-md text-body-md text-error">
          {submitError} Your entered information has been kept — please try submitting again.
        </div>
      )}

      <div className="space-y-6">
        <h2 className="border-b border-outline-variant pb-2 font-display text-headline-sm text-primary">Client Details</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <FieldLabel htmlFor="name" required>
              Full Name
            </FieldLabel>
            <input
              id="name"
              className={underlineInputClasses}
              autoComplete="name"
              placeholder="Jane Doe"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              {...register("name")}
            />
            <ErrorText id="name-error" message={fieldErrorMessage(errors.name)} />
          </div>

          <div>
            <FieldLabel htmlFor="email" required>
              Email Address
            </FieldLabel>
            <input
              id="email"
              type="email"
              className={underlineInputClasses}
              autoComplete="email"
              placeholder="jane@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
            />
            <ErrorText id="email-error" message={fieldErrorMessage(errors.email)} />
          </div>

          <div>
            <FieldLabel htmlFor="phone" required>
              Phone Number
            </FieldLabel>
            <input
              id="phone"
              type="tel"
              className={underlineInputClasses}
              autoComplete="tel"
              placeholder="+1 (555) 000-0000"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              {...register("phone")}
            />
            <ErrorText id="phone-error" message={fieldErrorMessage(errors.phone)} />
          </div>

          <div>
            <FieldLabel htmlFor="city" required>
              Project Location
            </FieldLabel>
            <input
              id="city"
              className={underlineInputClasses}
              autoComplete="address-level2"
              placeholder="City, State / Country"
              aria-invalid={!!errors.city}
              aria-describedby={errors.city ? "city-error" : undefined}
              {...register("city")}
            />
            <ErrorText id="city-error" message={fieldErrorMessage(errors.city)} />
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-2">
        <h2 className="border-b border-outline-variant pb-2 font-display text-headline-sm text-primary">Project Scope</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <FieldLabel htmlFor="projectType" required>
              Type of Project
            </FieldLabel>
            <select
              id="projectType"
              className={`${underlineInputClasses} cursor-pointer`}
              defaultValue=""
              aria-invalid={!!errors.projectType}
              aria-describedby={errors.projectType ? "projectType-error" : undefined}
              {...register("projectType")}
            >
              <option value="" disabled>
                Select Type
              </option>
              {projectTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <ErrorText id="projectType-error" message={fieldErrorMessage(errors.projectType)} />
          </div>

          <div>
            <FieldLabel htmlFor="budgetRange" required>
              Estimated Budget
            </FieldLabel>
            <select
              id="budgetRange"
              className={`${underlineInputClasses} cursor-pointer`}
              defaultValue=""
              aria-invalid={!!errors.budgetRange}
              aria-describedby={errors.budgetRange ? "budgetRange-error" : undefined}
              {...register("budgetRange")}
            >
              <option value="" disabled>
                Select Range
              </option>
              {budgetRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
            <ErrorText id="budgetRange-error" message={fieldErrorMessage(errors.budgetRange)} />
          </div>

          <div>
            <FieldLabel htmlFor="timeline" required>
              Desired Timeline
            </FieldLabel>
            <select
              id="timeline"
              className={`${underlineInputClasses} cursor-pointer`}
              defaultValue=""
              aria-invalid={!!errors.timeline}
              aria-describedby={errors.timeline ? "timeline-error" : undefined}
              {...register("timeline")}
            >
              <option value="" disabled>
                Select Timeline
              </option>
              {timelineOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ErrorText id="timeline-error" message={fieldErrorMessage(errors.timeline)} />
          </div>

          <div>
            <FieldLabel htmlFor="preferredConsultationAt">Preferred Consultation Date/Time</FieldLabel>
            <input
              id="preferredConsultationAt"
              type="datetime-local"
              className={underlineInputClasses}
              {...register("preferredConsultationAt")}
            />
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="description" required>
            Project Description
          </FieldLabel>
          <textarea
            id="description"
            rows={4}
            className="w-full resize-none border border-outline bg-transparent p-4 font-body-md text-body-md text-primary transition-colors placeholder:text-outline-variant focus:border-primary"
            placeholder="Tell us about your vision, functional needs, and any specific architectural inspirations..."
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? "description-error" : undefined}
            {...register("description")}
          />
          <ErrorText id="description-error" message={fieldErrorMessage(errors.description)} />
        </div>

        <div>
          <FieldLabel htmlFor="attachment">Attach a Reference File (image or PDF, up to 10MB)</FieldLabel>
          <input
            id="attachment"
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            className="w-full font-body-md text-sm text-on-surface-variant file:mr-4 file:border file:border-outline file:bg-transparent file:px-4 file:py-2 file:font-label-caps file:text-label-caps file:uppercase file:text-primary"
            onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
          />
        </div>

        <fieldset>
          <legend className="mb-2 font-label-caps text-label-caps uppercase text-on-surface-variant">
            How Should We Reach You?
          </legend>
          <div className="flex flex-wrap gap-6">
            {(["WHATSAPP", "PHONE", "EMAIL"] as const).map((method) => (
              <label key={method} className="flex items-center gap-2 font-body-md text-body-md text-primary">
                <input type="radio" value={method} className="accent-black" {...register("preferredContactMethod")} />
                {method === "WHATSAPP" ? "WhatsApp" : method === "PHONE" ? "Phone call" : "Email"}
              </label>
            ))}
          </div>
          <ErrorText id="preferredContactMethod-error" message={fieldErrorMessage(errors.preferredContactMethod)} />
        </fieldset>
      </div>

      <div className="space-y-8 pt-4">
        <div className="flex items-start">
          <div className="flex h-5 items-center">
            <input
              id="consent"
              type="checkbox"
              className="h-4 w-4 border-outline bg-transparent text-primary accent-black"
              aria-invalid={!!errors.consent}
              aria-describedby={errors.consent ? "consent-error" : "consent-help"}
              {...register("consent")}
            />
          </div>
          <div className="ml-3">
            <label htmlFor="consent" className="font-body-md text-body-md text-on-surface-variant">
              I agree that ZENKRAFT Design Studios may contact me about my enquiry using the details above. We only
              use this information to respond to your enquiry and never share it with third parties for marketing.
              You can request deletion of your data at any time by emailing us.{" "}
              <Link href="/contact#privacy" className="text-primary underline hover:text-secondary-fixed-dim">
                Read our Privacy Policy
              </Link>
              .
            </label>
            <p id="consent-help" className="mt-1 font-body-md text-sm text-on-surface-variant">
              Required to submit an enquiry.
            </p>
            <ErrorText id="consent-error" message={fieldErrorMessage(errors.consent)} />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary px-8 py-4 font-label-caps text-label-caps uppercase text-on-primary transition-colors duration-300 hover:bg-inverse-surface disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isSubmitting ? "Submitting…" : "Submit Enquiry"}
        </button>
      </div>
    </form>
  );
}
