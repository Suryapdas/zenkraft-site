import { loadBusinessConfig, loadProductConfig } from "@zenkraft/config";
import { prisma } from "../prisma.js";

/**
 * FR-003 homepage content. There is no CMS "hero copy" table in
 * data-model.md yet, so Phase 1 composes the home payload from
 * config/business.yaml + config/product.yaml (brand/CTA copy, which is
 * exactly what those files exist to own) plus published Projects/Services
 * from the DB. A dedicated content table can be added later without
 * changing this response shape.
 */
export async function getHomeContent() {
  const business = loadBusinessConfig();
  const product = loadProductConfig();

  const [selectedProjects, services] = await Promise.all([
    prisma.project.findMany({
      where: { published: true },
      orderBy: { year: "desc" },
      take: 6,
      include: { coverMedia: true },
    }),
    prisma.service.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return {
    brand: {
      displayName: business.brand.display_name,
      tagline: business.brand.tagline,
      description: business.brand.description,
    },
    hero: {
      eyebrow: product.product.name,
      headline: business.brand.tagline,
      supportingCopy: business.brand.description,
      primaryCta: product.lead_capture.primary_cta,
      secondaryCta: product.lead_capture.secondary_cta,
    },
    selectedProjects: selectedProjects.map(toProjectSummary),
    services: services.map(toServiceSummary),
    projectTypes: product.project_types,
    budgetRanges: product.budget_ranges,
    timelineOptions: product.timeline_options,
  };
}

export function toProjectSummary(project: {
  slug: string;
  title: string;
  category: string;
  location: string;
  year: number;
  coverMedia: { storageKey: string; altText: string | null } | null;
}) {
  return {
    slug: project.slug,
    title: project.title,
    category: project.category,
    location: project.location,
    year: project.year,
    coverImage: project.coverMedia
      ? { storageKey: project.coverMedia.storageKey, altText: project.coverMedia.altText }
      : null,
  };
}

export function toServiceSummary(service: {
  slug: string;
  title: string;
  category: string;
  description: string;
  coverImageStorageKey: string | null;
}) {
  return {
    slug: service.slug,
    title: service.title,
    category: service.category,
    description: service.description,
    coverImageStorageKey: service.coverImageStorageKey,
  };
}
