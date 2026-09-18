import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { loadBusinessConfig } from "@zenkraft/config";

const prisma = new PrismaClient();

const CONFIG_PLACEHOLDER_PATTERN = /^\[CONFIG:.*\]$/;

/** Dev-safe stand-in so local development never displays a raw [CONFIG:...] string in the UI. */
function devSafe(value: string, fallback: string): string {
  return CONFIG_PLACEHOLDER_PATTERN.test(value) ? fallback : value;
}

async function main() {
  const existing = await prisma.siteContactConfig.findFirst();
  if (existing) {
    console.log("SiteContactConfig already seeded (id=%s) — skipping. Delete the row to reseed.", existing.id);
    return;
  }

  const business = loadBusinessConfig();

  const created = await prisma.siteContactConfig.create({
    data: {
      phone: devSafe(business.contact.primary_phone, "+91 90000 00000"),
      whatsapp: devSafe(business.contact.whatsapp, "+91 90000 00000"),
      email: devSafe(business.contact.primary_email, "hello@zenkraft.example"),
      addressLine1: devSafe(business.address.line_1, "TBD — address pending verification"),
      addressLine2:
        business.address.line_2 && !CONFIG_PLACEHOLDER_PATTERN.test(business.address.line_2)
          ? business.address.line_2
          : null,
      city: devSafe(business.address.city, "TBD"),
      state: devSafe(business.address.state, "TBD"),
      country: business.address.country || "India",
      postalCode: devSafe(business.address.postal_code, "000000"),
      latitude: Number.isFinite(Number(business.address.latitude)) ? business.address.latitude : "0",
      longitude: Number.isFinite(Number(business.address.longitude)) ? business.address.longitude : "0",
      mapUrl: devSafe(business.address.google_maps_url, "https://maps.google.com/"),
      businessHours: {
        timezone: business.business_hours.timezone,
        monday: devSafe(business.business_hours.monday, "10:00-19:00"),
        tuesday: devSafe(business.business_hours.tuesday, "10:00-19:00"),
        wednesday: devSafe(business.business_hours.wednesday, "10:00-19:00"),
        thursday: devSafe(business.business_hours.thursday, "10:00-19:00"),
        friday: devSafe(business.business_hours.friday, "10:00-19:00"),
        saturday: devSafe(business.business_hours.saturday, "10:00-17:00"),
        sunday: devSafe(business.business_hours.sunday, "Closed"),
      },
      // Mirrors config/business.yaml's verification flags exactly — dev data
      // stays visibly "unverified" so the AC-002 production gate is honest.
      addressVerified: business.verification.address_verified,
      phoneVerified: business.verification.phone_verified,
      emailVerified: business.verification.email_verified,
      mapPinVerified: business.verification.map_pin_verified,
      socialProfilesVerified: business.verification.social_profiles_verified,
    },
  });

  console.log("Seeded SiteContactConfig id=%s", created.id);
}

main()
  .catch((error) => {
    console.error("Failed to seed SiteContactConfig:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
