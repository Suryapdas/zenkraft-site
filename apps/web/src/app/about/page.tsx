import type { Metadata } from "next";
import { api } from "@/lib/api-client";

export const metadata: Metadata = {
  title: "About",
  description: "Our studio story, philosophy and how we work.",
};

export default async function AboutPage() {
  const home = await api.getHomeContent();

  return (
    <div className="mx-auto max-w-3xl px-margin-mobile py-section-gap md:px-margin-desktop">
      <h1 className="font-display text-display-lg-mobile text-primary md:text-display-lg">
        About {home.brand.displayName}
      </h1>
      <p className="mt-6 font-body-lg text-body-lg text-on-surface-variant">{home.brand.description}</p>

      <section className="mt-12 border-t border-outline-variant pt-8">
        <h2 className="font-display text-headline-sm text-primary">Our Philosophy</h2>
        <p className="mt-4 font-body-md text-body-md text-on-surface-variant">
          We believe a well-designed space is measured by how it is lived in, not only by how it photographs.
          Every brief starts with how you and the people around you actually use a space day to day.
        </p>
      </section>

      <section className="mt-12 border-t border-outline-variant pt-8">
        <h2 className="font-display text-headline-sm text-primary">What Sets Us Apart</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 font-body-md text-body-md text-on-surface-variant">
          <li>Design, architecture and execution coordinated by one accountable team.</li>
          <li>A structured, transparent process from consultation to handover.</li>
          <li>Direct communication throughout your project — no unexplained gaps.</li>
        </ul>
      </section>

      {/* content-model.md: credentials/awards/certifications only appear once independently verified. None are published yet. */}
    </div>
  );
}
