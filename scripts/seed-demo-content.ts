import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * content-model.md forbids fabricating client names, project values, awards,
 * or testimonials. This seed exists only so Phase 1's public pages have
 * something to render locally — every record is labeled "Demo" / "Sample"
 * so it can never be mistaken for real, verified studio content. Replace
 * via the admin CMS (Phase 2) before any real deployment.
 */
async function main() {
  const existingServices = await prisma.service.count();
  if (existingServices === 0) {
    await prisma.service.createMany({
      data: [
        {
          slug: "interior-design",
          title: "Interior Design (Demo)",
          category: "Interior Design",
          description: "Sample short description for demo purposes only — replace via admin CMS.",
          body: "Sample detailed description for local development only. Not verified studio content.",
          published: true,
          sortOrder: 1,
        },
        {
          slug: "architecture",
          title: "Architecture (Demo)",
          category: "Architecture",
          description: "Sample short description for demo purposes only — replace via admin CMS.",
          body: "Sample detailed description for local development only. Not verified studio content.",
          published: true,
          sortOrder: 2,
        },
        {
          slug: "construction",
          title: "Construction (Demo)",
          category: "Construction",
          description: "Sample short description for demo purposes only — replace via admin CMS.",
          body: "Sample detailed description for local development only. Not verified studio content.",
          published: true,
          sortOrder: 3,
        },
      ],
    });
    console.log("Seeded 3 demo Service rows.");
  } else {
    console.log("Services already exist — skipping demo service seed.");
  }

  const existingProjects = await prisma.project.count();
  if (existingProjects === 0) {
    await prisma.project.createMany({
      data: [
        {
          slug: "sample-residence-demo",
          title: "Sample Residence (Demo Project)",
          category: "Residential Interior",
          location: "Sample City",
          year: 2025,
          description: "Placeholder project description for local development. Not a real client project.",
          scope: "Demo scope text.",
          published: true,
        },
        {
          slug: "sample-office-demo",
          title: "Sample Office Fit-Out (Demo Project)",
          category: "Commercial Interior",
          location: "Sample City",
          year: 2024,
          description: "Placeholder project description for local development. Not a real client project.",
          scope: "Demo scope text.",
          published: true,
        },
      ],
    });
    console.log("Seeded 2 demo Project rows.");
  } else {
    console.log("Projects already exist — skipping demo project seed.");
  }
}

main()
  .catch((error) => {
    console.error("Failed to seed demo content:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
