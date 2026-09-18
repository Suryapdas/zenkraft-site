import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ApiRequestError, api, mediaUrl } from "@/lib/api-client";

async function loadProject(slug: string) {
  try {
    return await api.getProject(slug);
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await loadProject(params.slug);
  if (!project) return {};

  return {
    title: project.seo.title ?? project.title,
    description: project.seo.description ?? project.description,
    alternates: project.seo.canonicalUrl ? { canonical: project.seo.canonicalUrl } : undefined,
    openGraph: {
      title: project.seo.title ?? project.title,
      description: project.seo.description ?? project.description,
      images: project.seo.ogImageUrl ? [project.seo.ogImageUrl] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await loadProject(params.slug);
  if (!project) notFound();

  return (
    <article className="mx-auto max-w-4xl px-margin-mobile py-section-gap md:px-margin-desktop">
      <p className="font-label-caps text-label-caps uppercase text-secondary-text">{project.category}</p>
      <h1 className="mt-3 font-display text-display-lg-mobile text-primary md:text-display-lg">{project.title}</h1>
      <p className="mt-4 font-body-md text-body-md text-on-surface-variant">
        {project.location} &middot; {project.year}
      </p>

      {project.coverImage ? (
        <div className="relative mt-12 aspect-[16/9] w-full overflow-hidden bg-surface-container">
          <Image
            src={mediaUrl(project.coverImage.storageKey)}
            alt={project.coverImage.altText ?? project.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      ) : (
        <div className="mt-12 flex aspect-[16/9] w-full items-center justify-center bg-surface-container font-display text-headline-sm text-primary">
          {project.title}
        </div>
      )}

      <div className="mt-12 grid grid-cols-1 gap-gutter border-t border-outline-variant pt-8 sm:grid-cols-2">
        <div>
          <h2 className="font-display text-headline-sm text-primary">Scope</h2>
          <p className="mt-3 font-body-md text-body-md text-on-surface-variant">{project.scope}</p>
        </div>
        <div>
          <h2 className="font-display text-headline-sm text-primary">Overview</h2>
          <p className="mt-3 font-body-md text-body-md text-on-surface-variant">{project.description}</p>
        </div>
      </div>

      {(project.challenge || project.approach || project.outcome) && (
        <div className="mt-12 grid grid-cols-1 gap-gutter border-t border-outline-variant pt-8 sm:grid-cols-3">
          {project.challenge && (
            <div>
              <h2 className="font-label-caps text-label-caps uppercase text-primary">Challenge</h2>
              <p className="mt-3 font-body-md text-body-md text-on-surface-variant">{project.challenge}</p>
            </div>
          )}
          {project.approach && (
            <div>
              <h2 className="font-label-caps text-label-caps uppercase text-primary">Approach</h2>
              <p className="mt-3 font-body-md text-body-md text-on-surface-variant">{project.approach}</p>
            </div>
          )}
          {project.outcome && (
            <div>
              <h2 className="font-label-caps text-label-caps uppercase text-primary">Outcome</h2>
              <p className="mt-3 font-body-md text-body-md text-on-surface-variant">{project.outcome}</p>
            </div>
          )}
        </div>
      )}

      {project.gallery.length > 0 && (
        <div className="mt-12 grid grid-cols-2 gap-gutter border-t border-outline-variant pt-8 sm:grid-cols-3">
          {project.gallery.map((image) => (
            <div key={image.storageKey} className="relative aspect-square overflow-hidden bg-surface-container">
              <Image
                src={mediaUrl(image.storageKey)}
                alt={image.altText ?? project.title}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 33vw, 50vw"
              />
            </div>
          ))}
        </div>
      )}

      <div className="mt-16">
        <Link
          href="/contact#enquiry-form"
          className="inline-block bg-primary px-8 py-4 font-label-caps text-label-caps uppercase text-on-primary transition-colors duration-300 hover:bg-inverse-surface"
        >
          Start a Project Like This
        </Link>
      </div>
    </article>
  );
}
