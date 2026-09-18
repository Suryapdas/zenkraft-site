import Image from "next/image";
import Link from "next/link";
import type { ServiceSummary } from "@/lib/api-client";
import { mediaUrl } from "@/lib/api-client";

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="transition-transform group-hover:translate-x-1">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ServiceCard({ service }: { service: ServiceSummary }) {
  return (
    <Link href={`/services/${service.slug}`} className="group block">
      {service.coverImageStorageKey && (
        <div className="mb-6 aspect-[4/3] w-full overflow-hidden bg-surface-container">
          <Image
            src={mediaUrl(service.coverImageStorageKey)}
            alt={service.title}
            width={800}
            height={600}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      )}
      <div
        className={
          service.coverImageStorageKey
            ? ""
            : "border border-outline-variant/40 p-8 transition-colors duration-500 group-hover:border-outline-variant"
        }
      >
        <p className="font-label-caps text-label-caps uppercase text-secondary-text">{service.category}</p>
        <h3 className="mt-3 font-display text-headline-sm text-primary">{service.title}</h3>
        <p className="mt-3 font-body-md text-body-md text-on-surface-variant">{service.description}</p>
        <span className="mt-6 inline-flex items-center gap-2 font-label-caps text-label-caps uppercase text-secondary-text transition-colors group-hover:text-primary">
          Explore Service <ArrowIcon />
        </span>
      </div>
    </Link>
  );
}
