import { Prisma } from "@prisma/client";
import type { LeadCreateInput } from "@zenkraft/validation";
import { prisma } from "../prisma.js";
import { ApiError } from "../lib/api-error.js";
import { notificationChannel } from "../lib/notifications.js";
import { hashRequestBody, idempotencyExpiryFromNow, idempotencyStorageKey } from "../lib/idempotency.js";

export interface CreateLeadResult {
  status: number;
  body: { leadId: string; status: string; message: string };
}

const ROUTE = "POST:/leads";
const CONFIRMATION_MESSAGE = "Your enquiry has been received.";

/**
 * AC-003/AC-004: creates exactly one Lead per distinct idempotency key,
 * replaying the original response on retry instead of creating a duplicate.
 */
export async function createLead(
  input: LeadCreateInput,
  idempotencyKeyHeader: string,
  attachmentStorageKey?: string
): Promise<CreateLeadResult> {
  const storageKey = idempotencyStorageKey(ROUTE, idempotencyKeyHeader);
  const requestHash = hashRequestBody(input);

  const existing = await prisma.idempotencyKey.findFirst({
    where: { key: storageKey, expiresAt: { gt: new Date() } },
  });

  if (existing) {
    if (existing.requestHash !== requestHash) {
      throw ApiError.conflict(
        "IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_PAYLOAD",
        "This idempotency key was already used for a different enquiry submission."
      );
    }
    return {
      status: existing.responseStatus,
      body: existing.responseBody as CreateLeadResult["body"],
    };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const lead = await tx.lead.create({
        data: {
          name: input.name,
          email: input.email,
          phone: input.phone,
          city: input.city,
          projectType: input.projectType,
          budgetRange: input.budgetRange,
          timeline: input.timeline,
          description: input.description,
          preferredContactMethod: input.preferredContactMethod,
          consentAt: new Date(),
          source: input.source,
          preferredConsultationAt: input.preferredConsultationAt
            ? new Date(input.preferredConsultationAt)
            : undefined,
          attachmentStorageKey,
        },
      });

      const responseBody: CreateLeadResult["body"] = {
        leadId: lead.id,
        status: lead.status,
        message: CONFIRMATION_MESSAGE,
      };

      await tx.idempotencyKey.create({
        data: {
          key: storageKey,
          requestHash,
          responseStatus: 201,
          responseBody,
          leadId: lead.id,
          expiresAt: idempotencyExpiryFromNow(),
        },
      });

      return { lead, responseBody };
    });

    await notificationChannel.notifyNewLead({
      leadId: result.lead.id,
      name: result.lead.name,
      city: result.lead.city,
      projectType: result.lead.projectType,
      preferredContactMethod: result.lead.preferredContactMethod,
      createdAt: result.lead.createdAt,
    });

    return { status: 201, body: result.responseBody };
  } catch (error) {
    // Concurrent duplicate request raced us and inserted the same idempotency
    // key first (unique constraint violation) — treat it as a cache hit
    // rather than a failure (covers double-click / network-retry races).
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const winner = await prisma.idempotencyKey.findUniqueOrThrow({ where: { key: storageKey } });
      return { status: winner.responseStatus, body: winner.responseBody as CreateLeadResult["body"] };
    }
    throw error;
  }
}
