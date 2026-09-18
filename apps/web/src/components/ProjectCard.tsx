import Image from "next/image";
import Link from "next/link";
import type { ProjectSummary } from "@/lib/api-client";
import { mediaUrl } from "@/lib/api-client";

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block cursor-pointer">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-container">
        {project.coverImage ? (
          <Image
            src={mediaUrl(project.coverImage.storageKey)}
            alt={project.coverImage.altText ?? project.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-body-md text-body-md text-on-surface-variant">
            {project.category}
          </div>
        )}
        <div className="absolute inset-0 flex flex-col justify-between bg-primary/80 p-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex w-full items-start justify-between">
            <span className="font-label-caps text-label-caps uppercase text-on-primary">{project.year}</span>
            <span className="font-label-caps text-label-caps uppercase text-on-primary">{project.category}</span>
          </div>
          <ArrowIcon className="self-end text-on-primary" />
        </div>
      </div>
      <div className="mt-4 flex items-start justify-between">
        <div>
          <h3 className="font-display text-headline-sm text-primary">{project.title}</h3>
          <p className="font-body-md text-body-md text-on-surface-variant">{project.category}</p>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant text-right">{project.location}</p>
      </div>
    </Link>
  );
}
