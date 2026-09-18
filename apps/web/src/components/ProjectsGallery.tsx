"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import type { ProjectSummary } from "@/lib/api-client";

/**
 * Client-side category filter over the already-fetched project list —
 * presentational only, no new API call and no change to the underlying
 * FR-005 portfolio data contract.
 */
export function ProjectsGallery({ projects }: { projects: ProjectSummary[] }) {
  const categories = useMemo(() => {
    const unique = Array.from(new Set(projects.map((p) => p.category)));
    return ["All", ...unique];
  }, [projects]);

  const [activeCategory, setActiveCategory] = useState("All");

  const visibleProjects =
    activeCategory === "All" ? projects : projects.filter((p) => p.category === activeCategory);

  if (projects.length === 0) {
    return <p className="font-body-md text-body-md text-on-surface-variant">Projects will appear here once published.</p>;
  }

  return (
    <>
      <div className="flex gap-8 overflow-x-auto border-b border-outline-variant pb-4">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            aria-pressed={activeCategory === category}
            className={`whitespace-nowrap font-label-caps text-label-caps uppercase transition-colors ${
              activeCategory === category
                ? "border-b border-primary pb-4 -mb-4 text-primary"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {visibleProjects.length > 0 ? (
        <div className="mt-12 grid grid-cols-1 gap-gutter md:grid-cols-2 md:gap-y-16">
          {visibleProjects.map((project, index) => (
            <div key={project.slug} className={index % 2 === 1 ? "md:mt-24" : ""}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-12 font-body-md text-body-md text-on-surface-variant">
          No projects in this category yet.
        </p>
      )}
    </>
  );
}
