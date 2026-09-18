import type { Metadata } from "next";
import { api } from "@/lib/api-client";
import { ProjectsGallery } from "@/components/ProjectsGallery";

export const metadata: Metadata = {
  title: "Projects",
  description: "A selection of projects across interior design, architecture and construction.",
};

export default async function ProjectsPage() {
  const projects = await api.listProjects();

  return (
    <div className="mx-auto max-w-container-max px-margin-mobile pb-section-gap pt-24 md:px-margin-desktop">
      <section className="pb-12">
        <h1 className="font-display text-display-lg-mobile text-primary md:text-display-lg">Selected Works</h1>
        <p className="mt-6 max-w-2xl font-body-lg text-body-lg text-on-surface-variant">
          A curated selection of our recent architectural and interior design projects, reflecting our commitment
          to elevated minimalism and structural serenity.
        </p>
      </section>

      <ProjectsGallery projects={projects} />
    </div>
  );
}
