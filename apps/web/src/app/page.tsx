import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { api, mediaUrl } from "@/lib/api-client";
import { ServiceCard } from "@/components/ServiceCard";

export const metadata: Metadata = {
  title: "Premium Interior Design, Architecture & Turnkey Execution",
  description: "ZENKRAFT Design Studios — considered spaces from concept to handover.",
};

const WHY_ZENKRAFT = [
  {
    title: "Considered design",
    body: "Every project starts with how a space will actually be lived in, not just how it photographs.",
  },
  {
    title: "One accountable team",
    body: "Design, architecture and execution under one roof — fewer handoffs, fewer surprises.",
  },
  {
    title: "Transparent process",
    body: "You always know what stage your project is at and what happens next.",
  },
];

const PROCESS_STEPS = [
  { step: "01", title: "Consultation", body: "We understand your brief, site and budget." },
  { step: "02", title: "Design & proposal", body: "Concept, drawings and a clear scope of work." },
  { step: "03", title: "Execution", body: "Managed construction and installation, on schedule." },
  { step: "04", title: "Handover", body: "A walkthrough, documentation and post-handover support." },
];

// Reference photo (Unsplash, free license) standing in for verified hero
// photography — swap for a real studio/project photo via the admin CMS
// (Phase 2) before any production deployment.
const HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1759167582278-b3a5179487de?fm=jpg&q=80&w=2400&auto=format&fit=crop";

export default async function HomePage() {
  const home = await api.getHomeContent();
  const bentoProjects = home.selectedProjects.slice(0, 3);
  const [heroProject, ...stackProjects] = bentoProjects;

  return (
    <>
      <section className="relative flex min-h-[600px] w-full items-center justify-center overflow-hidden bg-primary md:h-[720px]">
        <Image
          src={HERO_IMAGE_URL}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
        <div className="relative z-10 mx-auto flex max-w-container-max flex-col items-center px-margin-mobile text-center md:px-margin-desktop">
          <p className="font-label-caps text-label-caps uppercase text-secondary-fixed-dim">{home.hero.eyebrow}</p>
          <h1 className="mt-6 max-w-4xl font-display text-display-lg-mobile text-on-primary md:text-display-lg">
            {home.hero.headline}
          </h1>
          <p className="mt-6 max-w-2xl font-body-lg text-body-lg text-surface-container-high/90">
            {home.hero.supportingCopy}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact#enquiry-form"
              className="bg-surface px-8 py-4 font-label-caps text-label-caps uppercase text-primary transition-colors duration-300 hover:bg-secondary-fixed-dim"
            >
              {home.hero.primaryCta}
            </Link>
            <Link
              href="/contact#enquiry-form"
              className="border border-on-primary px-8 py-4 font-label-caps text-label-caps uppercase text-on-primary transition-colors duration-300 hover:bg-on-primary/10"
            >
              {home.hero.secondaryCta}
            </Link>
          </div>
        </div>
      </section>

      {/* The ZENKRAFT Standard */}
      <section className="mx-auto max-w-container-max px-margin-mobile py-section-gap md:px-margin-desktop">
        <div className="mb-16 text-center">
          <h2 className="font-display text-headline-md text-primary">The {home.brand.displayName.split(" ")[0]} Standard</h2>
          <div className="mx-auto mt-4 h-px w-24 bg-outline-variant" />
        </div>
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
          {WHY_ZENKRAFT.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center border border-outline-variant/30 p-8 text-center transition-colors duration-500 hover:border-outline-variant"
            >
              <h3 className="font-display text-headline-sm text-primary">{item.title}</h3>
              <p className="mt-3 font-body-md text-body-md text-on-surface-variant">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Expertise — real, API-driven selected projects in a bento layout */}
      <section className="mx-auto max-w-container-max border-t border-outline-variant/20 px-margin-mobile py-section-gap md:px-margin-desktop">
        <div className="mb-16 flex flex-col items-end justify-between gap-6 md:flex-row">
          <div>
            <h2 className="font-display text-headline-md text-primary">Our Expertise</h2>
            <p className="mt-4 max-w-xl font-body-lg text-body-lg text-on-surface-variant">
              Curated disciplines defining modern spaces.
            </p>
          </div>
          <Link
            href="/projects"
            className="group flex items-center gap-2 font-label-caps text-label-caps uppercase text-secondary-text transition-colors hover:text-primary"
          >
            View Portfolio
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="transition-transform group-hover:translate-x-1">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {heroProject ? (
          <div className="grid grid-cols-1 gap-gutter md:grid-cols-12">
            <Link
              href={`/projects/${heroProject.slug}`}
              className="group relative h-[500px] overflow-hidden bg-surface-container md:col-span-8"
            >
              {heroProject.coverImage ? (
                <>
                  <Image
                    src={mediaUrl(heroProject.coverImage.storageKey)}
                    alt={heroProject.coverImage.altText ?? heroProject.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(min-width: 768px) 66vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
                  <div className="absolute bottom-0 left-0 w-full p-8">
                    <h3 className="font-display text-headline-sm text-on-primary">{heroProject.category}</h3>
                    <p className="mt-2 max-w-md font-body-md text-body-md text-on-primary/80">{heroProject.title}</p>
                  </div>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 font-body-md text-body-md text-on-surface-variant">
                  <span className="font-display text-headline-sm text-primary">{heroProject.category}</span>
                  <span>{heroProject.title}</span>
                </div>
              )}
            </Link>

            {stackProjects.length > 0 && (
              <div className="flex flex-col gap-gutter md:col-span-4">
                {stackProjects.map((project) => (
                  <Link
                    key={project.slug}
                    href={`/projects/${project.slug}`}
                    className="group relative h-[238px] overflow-hidden bg-surface-container"
                  >
                    {project.coverImage ? (
                      <>
                        <Image
                          src={mediaUrl(project.coverImage.storageKey)}
                          alt={project.coverImage.altText ?? project.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(min-width: 768px) 33vw, 100vw"
                        />
                        <div className="absolute inset-0 bg-primary/20 transition-colors duration-500 group-hover:bg-primary/40" />
                        <div className="absolute inset-0 flex flex-col justify-end p-6">
                          <h3 className="font-display text-headline-sm text-on-primary">{project.category}</h3>
                        </div>
                      </>
                    ) : (
                      <div className="flex h-full items-center justify-center font-display text-headline-sm text-primary">
                        {project.category}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="font-body-md text-body-md text-on-surface-variant">Projects will appear here once published.</p>
        )}
      </section>

      {/* Services teaser */}
      <section className="bg-surface-container-lowest py-section-gap">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <h2 className="font-display text-headline-md text-primary">Services</h2>
          {home.services.length > 0 ? (
            <div className="mt-10 grid grid-cols-1 gap-gutter md:grid-cols-3">
              {home.services.map((service) => (
                <ServiceCard key={service.slug} service={service} />
              ))}
            </div>
          ) : (
            <p className="mt-10 font-body-md text-body-md text-on-surface-variant">
              Services will appear here once published.
            </p>
          )}
        </div>
      </section>

      {/* Process */}
      <section className="border-t border-outline-variant/20 bg-surface-container-low py-section-gap">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <h2 className="font-display text-headline-md text-primary">Our Process</h2>
          <ol className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((item) => (
              <li key={item.step} className="relative border-t border-outline-variant pt-6">
                <span className="absolute -mt-3 right-0 top-0 bg-surface-container-low px-2 font-label-caps text-label-caps text-on-surface-variant">
                  {item.step}
                </span>
                <h3 className="font-display text-headline-sm text-primary">{item.title}</h3>
                <p className="mt-3 font-body-md text-body-md text-on-surface-variant">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-surface-container-highest px-margin-mobile py-section-gap text-center md:px-margin-desktop">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-display-lg-mobile text-primary md:text-display-lg">
            Ready to realize your vision?
          </h2>
          <p className="mx-auto mt-6 font-body-lg text-body-lg text-on-surface-variant">
            Consult with our lead architects to discuss your upcoming project.
          </p>
          <Link
            href="/contact#enquiry-form"
            className="mt-10 inline-block bg-primary px-10 py-5 font-label-caps text-label-caps uppercase text-on-primary transition-colors duration-300 hover:bg-inverse-surface"
          >
            {home.hero.primaryCta}
          </Link>
        </div>
      </section>
    </>
  );
}
