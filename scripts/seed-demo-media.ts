import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Client as MinioClient } from "minio";

const prisma = new PrismaClient();

const STORAGE_BUCKET = process.env.STORAGE_BUCKET ?? "zenkraft-media";

const minio = new MinioClient({
  endPoint: process.env.STORAGE_ENDPOINT ?? "localhost",
  port: Number(process.env.STORAGE_PORT ?? "9002"),
  useSSL: (process.env.STORAGE_USE_SSL ?? "false") === "true",
  accessKey: process.env.STORAGE_ACCESS_KEY ?? "zenkraft",
  secretKey: process.env.STORAGE_SECRET_KEY ?? "zenkraft_dev_password",
});

/**
 * Reference photography sourced from Unsplash (free license, no attribution
 * required) purely to make the restyled demo pages visually reviewable —
 * every project/service these attach to is already labeled "(Demo)" /
 * "Sample ... (Demo Project)", so this never reads as verified real studio
 * work. Swap for real, verified photography via the admin CMS (Phase 2)
 * before any production deployment — see content-model.md's editorial rule.
 */
const PROJECT_IMAGES: Record<string, { url: string; alt: string }> = {
  "sample-residence-demo": {
    url: "https://images.unsplash.com/photo-1774200981075-a728eaaa3824?fm=jpg&q=80&w=1600&auto=format&fit=crop",
    alt: "Modern living room and kitchen with natural wood accents (reference photo)",
  },
  "sample-office-demo": {
    url: "https://images.unsplash.com/photo-1758448500688-3ababa93fd67?fm=jpg&q=80&w=1600&auto=format&fit=crop",
    alt: "Modern office lobby with marble reception desk (reference photo)",
  },
};

const SERVICE_IMAGES: Record<string, { url: string; alt: string }> = {
  "interior-design": {
    url: "https://images.unsplash.com/photo-1749930206000-179d0b85aa7e?fm=jpg&q=80&w=1600&auto=format&fit=crop",
    alt: "Sleek modern living room (reference photo)",
  },
  architecture: {
    url: "https://images.unsplash.com/photo-1759167582278-b3a5179487de?fm=jpg&q=80&w=1600&auto=format&fit=crop",
    alt: "Modern building facade with sunset reflections (reference photo)",
  },
  construction: {
    url: "https://images.unsplash.com/photo-1777919393730-463e2c0b7f4c?fm=jpg&q=80&w=1600&auto=format&fit=crop",
    alt: "Construction site with concrete structure (reference photo)",
  },
};

async function ensureBucket(): Promise<void> {
  const exists = await minio.bucketExists(STORAGE_BUCKET).catch(() => false);
  if (!exists) {
    await minio.makeBucket(STORAGE_BUCKET);
  }
}

async function downloadImage(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download ${url}: ${res.status} ${res.statusText}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

async function uploadImage(storageKey: string, buffer: Buffer): Promise<void> {
  await minio.putObject(STORAGE_BUCKET, storageKey, buffer, buffer.length, {
    "Content-Type": "image/jpeg",
  });
}

async function seedProjectImages() {
  for (const [slug, image] of Object.entries(PROJECT_IMAGES)) {
    const project = await prisma.project.findUnique({ where: { slug } });
    if (!project) {
      console.log(`Project "${slug}" not found — skipping.`);
      continue;
    }
    if (project.coverMediaId) {
      console.log(`Project "${slug}" already has a cover image — skipping.`);
      continue;
    }

    const storageKey = `demo/projects/${slug}.jpg`;
    const buffer = await downloadImage(image.url);
    await uploadImage(storageKey, buffer);

    const media = await prisma.projectMedia.create({
      data: {
        projectId: project.id,
        storageKey,
        altText: image.alt,
        sortOrder: 0,
      },
    });

    await prisma.project.update({
      where: { id: project.id },
      data: { coverMediaId: media.id },
    });

    console.log(`Seeded cover image for project "${slug}".`);
  }
}

async function seedServiceImages() {
  for (const [slug, image] of Object.entries(SERVICE_IMAGES)) {
    const service = await prisma.service.findUnique({ where: { slug } });
    if (!service) {
      console.log(`Service "${slug}" not found — skipping.`);
      continue;
    }
    if (service.coverImageStorageKey) {
      console.log(`Service "${slug}" already has a cover image — skipping.`);
      continue;
    }

    const storageKey = `demo/services/${slug}.jpg`;
    const buffer = await downloadImage(image.url);
    await uploadImage(storageKey, buffer);

    await prisma.service.update({
      where: { id: service.id },
      data: { coverImageStorageKey: storageKey },
    });

    console.log(`Seeded cover image for service "${slug}".`);
  }
}

async function main() {
  await ensureBucket();
  await seedProjectImages();
  await seedServiceImages();
}

main()
  .catch((error) => {
    console.error("Failed to seed demo media:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
