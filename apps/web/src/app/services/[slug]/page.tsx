import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ApiRequestError, api } from "@/lib/api-client";

async function loadService(slug: string) {
  try {
    return await api.getService(slug);
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = await loadService(params.slug);
  if (!service) return {};

  return {
    title: service.seo.title ?? service.title,
    description: service.seo.description ?? service.description,
    alternates: service.seo.canonicalUrl ? { canonical: service.seo.canonicalUrl } : undefined,
    openGraph: {
      title: service.seo.title ?? service.title,
      description: service.seo.description ?? service.description,
    },
  };
}

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = await loadService(params.slug);
  if (!service) notFound();

  return (
    <div className="mx-auto max-w-3xl px-margin-mobile py-section-gap md:px-margin-desktop">
      <p className="font-label-caps text-label-caps uppercase text-secondary-text">{service.category}</p>
      <h1 className="mt-3 font-display text-display-lg-mobile text-primary md:text-display-lg">{service.title}</h1>
      <p className="mt-6 font-body-lg text-body-lg text-on-surface-variant">{service.description}</p>
      <div className="mt-10 max-w-none whitespace-pre-line border-t border-outline-variant pt-8 font-body-md text-body-md text-on-surface-variant">
        {service.body}
      </div>

      {service.deliverables && service.deliverables.length > 0 && (
        <section className="mt-12 border-t border-outline-variant pt-8">
          <h2 className="font-display text-headline-sm text-primary">What&apos;s Included</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 font-body-md text-body-md text-on-surface-variant">
            {service.deliverables.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {service.process && service.process.length > 0 && (
        <section className="mt-12 border-t border-outline-variant pt-8">
          <h2 className="font-display text-headline-sm text-primary">Our Process For This Service</h2>
          <ol className="mt-6 space-y-4">
            {service.process.map((step) => (
              <li key={step.step}>
                <p className="font-label-caps text-label-caps uppercase text-primary">{step.step}</p>
                <p className="mt-1 font-body-md text-body-md text-on-surface-variant">{step.description}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      <div className="mt-16">
        <Link
          href={service.cta?.url ?? "/contact#enquiry-form"}
          className="inline-block bg-primary px-8 py-4 font-label-caps text-label-caps uppercase text-on-primary transition-colors duration-300 hover:bg-inverse-surface"
        >
          {service.cta?.label ?? "Book a Consultation"}
        </Link>
      </div>
    </div>
  );
}
