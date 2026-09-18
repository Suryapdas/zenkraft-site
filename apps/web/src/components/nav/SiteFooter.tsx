import Link from "next/link";
import type { ContactConfig } from "@/lib/api-client";
import { WhatsAppCta } from "@/components/contact/WhatsAppCta";
import { CallCta } from "@/components/contact/CallCta";

const DAY_LABELS: Record<string, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

export function SiteFooter({
  contact,
  displayName,
  tagline,
}: {
  contact: ContactConfig;
  displayName: string;
  tagline: string;
}) {
  return (
    <footer className="mt-section-gap w-full border-t border-outline-variant bg-surface-container-low">
      <div className="mx-auto grid max-w-container-max grid-cols-1 gap-gutter px-margin-mobile py-20 md:grid-cols-3 md:px-margin-desktop">
        <div>
          <p className="font-display text-headline-sm text-primary">{displayName}</p>
          <p className="mt-2 font-body-md text-body-md text-on-surface-variant">{tagline}</p>
        </div>

        <div>
          <h2 className="font-label-caps text-label-caps uppercase text-on-surface-variant">Contact</h2>
          <ul className="mt-4 space-y-2 font-body-md text-body-md text-on-surface-variant">
            <li>
              <CallCta phoneNumber={contact.phone} className="transition-colors hover:text-secondary-fixed-dim">
                {contact.phone}
              </CallCta>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className="transition-colors hover:text-secondary-fixed-dim">
                {contact.email}
              </a>
            </li>
            <li>
              <WhatsAppCta whatsappNumber={contact.whatsapp} className="transition-colors hover:text-secondary-fixed-dim" />
            </li>
            {contact.verified.address && (
              <li>
                {contact.address.line1}
                {contact.address.line2 ? `, ${contact.address.line2}` : ""}, {contact.address.city},{" "}
                {contact.address.state} {contact.address.postalCode}
              </li>
            )}
          </ul>
        </div>

        <div>
          <h2 className="font-label-caps text-label-caps uppercase text-on-surface-variant">Business Hours</h2>
          <ul className="mt-4 space-y-1 font-body-md text-body-md text-on-surface-variant">
            {Object.entries(DAY_LABELS).map(([key, label]) => (
              <li key={key} className="flex justify-between gap-4">
                <span>{label}</span>
                <span>{contact.businessHours[key] ?? "—"}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-outline-variant px-margin-mobile py-6 text-center font-body-md text-body-md text-on-surface-variant md:px-margin-desktop">
        <p>
          &copy; {new Date().getFullYear()} {displayName.toUpperCase()}.{" "}
          <Link href="/contact#privacy" className="underline transition-colors hover:text-secondary-fixed-dim">
            Privacy &amp; data use
          </Link>
        </p>
      </div>
    </footer>
  );
}
