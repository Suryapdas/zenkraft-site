import { createHash } from "node:crypto";

const IDEMPOTENCY_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours, per plan

export function idempotencyStorageKey(route: string, headerValue: string): string {
  return `${route}:${headerValue}`;
}

export function hashRequestBody(body: unknown): string {
  const normalized = JSON.stringify(body, Object.keys(body as object).sort());
  return createHash("sha256").update(normalized).digest("hex");
}

export function idempotencyExpiryFromNow(): Date {
  return new Date(Date.now() + IDEMPOTENCY_TTL_MS);
}
