import { prisma } from "../prisma.js";
import { ApiError } from "../lib/api-error.js";
import { toProjectSummary, toServiceSummary } from "./content.service.js";

export async function listPublishedProjects() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: { year: "desc" },
    include: { coverMedia: true },
  });
  return projects.map(toProjectSummary);
}

export async function getPublishedProjectBySlug(slug: string) {
  const project = await prisma.project.findFirst({
    where: { slug, published: true },
    include: { coverMedia: true, media: { orderBy: { sortOrder: "asc" } } },
  });
  if (!project) {
    throw ApiError.notFound("Project");
  }
  return {
    slug: project.slug,
    title: project.title,
    category: project.category,
    location: project.location,
    year: project.year,
    description: project.description,
    scope: project.scope,
    challenge: project.challenge,
    approach: project.approach,
    outcome: project.outcome,
    coverImage: project.coverMedia
      ? { storageKey: project.coverMedia.storageKey, altText: project.coverMedia.altText }
      : null,
    gallery: project.media.map((m) => ({ storageKey: m.storageKey, altText: m.altText })),
    seo: {
      title: project.seoTitle,
      description: project.seoDescription,
      canonicalUrl: project.seoCanonicalUrl,
      ogImageUrl: project.ogImageUrl,
      structuredData: project.structuredData,
    },
  };
}

export async function listPublishedServices() {
  const services = await prisma.service.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
  return services.map(toServiceSummary);
}

export async function getPublishedServiceBySlug(slug: string) {
  const service = await prisma.service.findFirst({ where: { slug, published: true } });
  if (!service) {
    throw ApiError.notFound("Service");
  }
  return {
    slug: service.slug,
    title: service.title,
    category: service.category,
    description: service.description,
    body: service.body,
    deliverables: service.deliverables,
    process: service.process,
    cta: service.ctaLabel ? { label: service.ctaLabel, url: service.ctaUrl } : null,
    coverImageStorageKey: service.coverImageStorageKey,
    seo: {
      title: service.seoTitle,
      description: service.seoDescription,
      canonicalUrl: service.seoCanonicalUrl,
    },
  };
}
