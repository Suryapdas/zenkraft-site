import { loadProductConfig } from "@zenkraft/config";
import { prisma } from "../prisma.js";
import { ApiError } from "../lib/api-error.js";

/**
 * FR-002/FR-010/FR-011: GET /contact always serves the DB row (seeded from
 * config/business.yaml, admin-editable later) so there is exactly one live
 * runtime source — never re-reads the YAML file per-request.
 */
export async function getContactConfig() {
  const config = await prisma.siteContactConfig.findFirst();
  if (!config) {
    throw new ApiError(
      500,
      "CONTACT_CONFIG_NOT_SEEDED",
      "Site contact configuration has not been seeded. Run `npm run seed:contact-config`."
    );
  }

  const product = loadProductConfig();

  return {
    phone: config.phone,
    whatsapp: config.whatsapp,
    email: config.email,
    address: {
      line1: config.addressLine1,
      line2: config.addressLine2,
      city: config.city,
      state: config.state,
      country: config.country,
      postalCode: config.postalCode,
    },
    latitude: Number(config.latitude),
    longitude: Number(config.longitude),
    mapUrl: config.mapUrl,
    businessHours: config.businessHours,
    verified: {
      address: config.addressVerified,
      phone: config.phoneVerified,
      email: config.emailVerified,
      mapPin: config.mapPinVerified,
      socialProfiles: config.socialProfilesVerified,
    },
    actions: {
      whatsappEnabled: product.lead_capture.enable_whatsapp,
      phoneCallEnabled: product.lead_capture.enable_phone_call,
      emailEnabled: product.lead_capture.enable_email,
    },
  };
}
