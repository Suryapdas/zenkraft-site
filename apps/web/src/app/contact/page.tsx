import type { Metadata } from "next";
import { api } from "@/lib/api-client";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { WhatsAppCta } from "@/components/contact/WhatsAppCta";
import { CallCta } from "@/components/contact/CallCta";
import { MapEmbed } from "@/components/contact/MapEmbed";

export const metadata: Metadata = {
  title: "Contact",
  description: "Book a consultation, chat on WhatsApp, call us, or send a project enquiry.",
};

const DAY_LABELS: [key: string, label: string][] = [
  ["monday", "Monday"],
  ["tuesday", "Tuesday"],
  ["wednesday", "Wednesday"],
  ["thursday", "Thursday"],
  ["friday", "Friday"],
  ["saturday", "Saturday"],
  ["sunday", "Sunday"],
];

export default async function ContactPage() {
  const [home, contact] = await Promise.all([api.getHomeContent(), api.getContact()]);

  return (
    <div className="mx-auto max-w-container-max px-margin-mobile py-section-gap md:px-margin-desktop">
      <div className="grid grid-cols-1 gap-gutter lg:grid-cols-2">
        {/* Left: context + real contact/hours/map content (required by FR-002/010/011) */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="max-w-lg font-display text-display-lg-mobile text-primary md:text-display-lg">
              Begin a Conversation
            </h1>
            <p className="mt-6 max-w-md font-body-lg text-body-lg text-on-surface-variant">
              Every exceptional space begins with an understanding of intent. Share the details of your vision, and
              our studio will connect with you to explore the possibilities.
            </p>

            {/* UX spec: three clear contact actions */}
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#enquiry-form"
                className="bg-primary px-6 py-3 font-label-caps text-label-caps uppercase text-on-primary transition-colors duration-300 hover:bg-inverse-surface"
              >
                Book a Consultation
              </a>
              {contact.actions.whatsappEnabled && (
                <WhatsAppCta
                  whatsappNumber={contact.whatsapp}
                  className="border border-primary px-6 py-3 font-label-caps text-label-caps uppercase text-primary transition-colors duration-300 hover:bg-surface-container-high"
                />
              )}
              {contact.actions.phoneCallEnabled && (
                <CallCta
                  phoneNumber={contact.phone}
                  className="border border-primary px-6 py-3 font-label-caps text-label-caps uppercase text-primary transition-colors duration-300 hover:bg-surface-container-high"
                >
                  Call {contact.phone}
                </CallCta>
              )}
            </div>
          </div>

          <div className="mt-16 space-y-10 border-t border-outline-variant pt-10">
            <div>
              <h2 className="font-label-caps text-label-caps uppercase text-on-surface-variant">Visit Or Reach Us</h2>
              {contact.verified.address ? (
                <address className="mt-3 max-w-sm font-body-md text-body-md not-italic text-on-surface-variant">
                  {contact.address.line1}
                  {contact.address.line2 ? <>, {contact.address.line2}</> : null}
                  <br />
                  {contact.address.city}, {contact.address.state} {contact.address.postalCode}
                  <br />
                  {contact.address.country}
                </address>
              ) : (
                <p className="mt-3 font-body-md text-body-md text-on-surface-variant">
                  Our address will be published here once verified.
                </p>
              )}

              <dl className="mt-6 max-w-sm space-y-1 font-body-md text-body-md text-on-surface-variant">
                <div className="flex justify-between gap-4">
                  <dt>Phone</dt>
                  <dd>{contact.phone}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${contact.email}`} className="underline hover:text-secondary-fixed-dim">
                      {contact.email}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h2 className="font-label-caps text-label-caps uppercase text-on-surface-variant">Business Hours</h2>
              <dl className="mt-3 max-w-sm space-y-1 font-body-md text-body-md text-on-surface-variant">
                {DAY_LABELS.map(([key, label]) => (
                  <div key={key} className="flex justify-between gap-4">
                    <dt>{label}</dt>
                    <dd>{contact.businessHours[key] ?? "—"}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <MapEmbed
              latitude={contact.latitude}
              longitude={contact.longitude}
              mapUrl={contact.mapUrl}
              verified={contact.verified.mapPin}
            />
          </div>
        </div>

        {/* Right: the form */}
        <div id="enquiry-form" className="scroll-mt-24">
          <div className="border border-outline-variant bg-surface-container-lowest p-8 md:p-12">
            <EnquiryForm
              projectTypes={home.projectTypes}
              budgetRanges={home.budgetRanges}
              timelineOptions={home.timelineOptions}
              whatsappNumber={contact.actions.whatsappEnabled ? contact.whatsapp : undefined}
              phoneNumber={contact.actions.phoneCallEnabled ? contact.phone : undefined}
            />
          </div>
        </div>
      </div>

      <section
        id="privacy"
        className="mt-section-gap scroll-mt-24 border-t border-outline-variant pt-10 font-body-md text-body-md text-on-surface-variant"
      >
        <h2 className="font-display text-headline-sm text-primary">How We Use Your Information</h2>
        <p className="mt-4 max-w-2xl">
          We collect the details in this form to respond to your enquiry and, if you choose to proceed, to plan
          and deliver your project. We do not sell or share your information with third parties for marketing.
        </p>
        <p className="mt-4 max-w-2xl">
          We retain enquiry information for as long as needed to respond to you and, where a project proceeds,
          for the duration of our engagement plus applicable record-keeping requirements. You can request
          deletion of your data at any time by emailing{" "}
          <a href={`mailto:${contact.email}`} className="underline hover:text-secondary-fixed-dim">
            {contact.email}
          </a>
          .
        </p>
      </section>
    </div>
  );
}
