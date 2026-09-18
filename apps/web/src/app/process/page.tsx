import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Process",
  description: "How we take a project from first consultation to handover.",
};

const STEPS = [
  {
    step: "01",
    title: "Consultation",
    body: "We start with a conversation about your space, how you use it, your budget and your timeline.",
  },
  {
    step: "02",
    title: "Design & Proposal",
    body: "We translate the brief into a concept, drawings and a clear, itemised scope of work.",
  },
  {
    step: "03",
    title: "Approval & Planning",
    body: "Once you approve the design, we plan materials, vendors and a realistic execution schedule.",
  },
  {
    step: "04",
    title: "Execution",
    body: "Our team manages construction and installation, with regular updates at each milestone.",
  },
  {
    step: "05",
    title: "Handover",
    body: "A final walkthrough, documentation and support after handover.",
  },
];

export default function ProcessPage() {
  return (
    <div className="mx-auto max-w-container-max px-margin-mobile py-section-gap md:px-margin-desktop">
      <div className="max-w-2xl">
        <h1 className="font-display text-display-lg-mobile text-primary md:text-display-lg">Our Process</h1>
        <p className="mt-6 font-body-lg text-body-lg text-on-surface-variant">
          A structured path from first conversation to final handover.
        </p>
      </div>

      <ol className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-5">
        {STEPS.map((item) => (
          <li key={item.step} className="relative border-t border-outline-variant pt-6">
            <span className="absolute -mt-3 right-0 top-0 bg-background px-2 font-label-caps text-label-caps text-on-surface-variant">
              {item.step}
            </span>
            <h2 className="font-display text-headline-sm text-primary">{item.title}</h2>
            <p className="mt-3 font-body-md text-body-md text-on-surface-variant">{item.body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-16">
        <Link
          href="/contact#enquiry-form"
          className="inline-block bg-primary px-8 py-4 font-label-caps text-label-caps uppercase text-on-primary transition-colors duration-300 hover:bg-inverse-surface"
        >
          Book a Consultation
        </Link>
      </div>
    </div>
  );
}
