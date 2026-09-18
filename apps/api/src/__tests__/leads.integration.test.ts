import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../app.js";
import { prisma } from "../prisma.js";

const app = createApp();

const validPayload = {
  name: "Asha Rao",
  email: "asha@example.com",
  phone: "+91 90000 00000",
  city: "Bengaluru",
  projectType: "Residential Interior",
  budgetRange: "Test Range",
  timeline: "Immediate",
  description: "Integration test enquiry — please ignore.",
  preferredContactMethod: "WHATSAPP",
  consent: true,
  source: "WEBSITE",
};

beforeAll(async () => {
  await prisma.lead.deleteMany({ where: { email: validPayload.email } });
});

afterAll(async () => {
  await prisma.lead.deleteMany({ where: { email: validPayload.email } });
  await prisma.$disconnect();
});

describe("POST /api/v1/leads", () => {
  it("requires an Idempotency-Key header", async () => {
    const res = await request(app).post("/api/v1/leads").send(validPayload);
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("IDEMPOTENCY_KEY_REQUIRED");
  });

  it("creates exactly one lead and returns a confirmation (AC-003)", async () => {
    const key = randomUUID();
    const res = await request(app).post("/api/v1/leads").set("Idempotency-Key", key).send(validPayload);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("NEW");
    expect(res.body.message).toBe("Your enquiry has been received.");
    expect(res.body.leadId).toBeTruthy();

    const count = await prisma.lead.count({ where: { id: res.body.leadId } });
    expect(count).toBe(1);
  });

  it("does not create a duplicate lead when the same idempotency key is retried (AC-004)", async () => {
    const key = randomUUID();

    const first = await request(app).post("/api/v1/leads").set("Idempotency-Key", key).send(validPayload);
    const second = await request(app).post("/api/v1/leads").set("Idempotency-Key", key).send(validPayload);

    expect(first.status).toBe(201);
    expect(second.status).toBe(201);
    expect(second.body.leadId).toBe(first.body.leadId);

    const count = await prisma.lead.count({ where: { id: first.body.leadId } });
    expect(count).toBe(1);
  });

  it("rejects a different payload reusing the same idempotency key", async () => {
    const key = randomUUID();
    await request(app).post("/api/v1/leads").set("Idempotency-Key", key).send(validPayload);

    const res = await request(app)
      .post("/api/v1/leads")
      .set("Idempotency-Key", key)
      .send({ ...validPayload, name: "Different Person" });

    expect(res.status).toBe(409);
    expect(res.body.code).toBe("IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_PAYLOAD");
  });

  it("blocks submission and identifies the invalid field (AC-005)", async () => {
    const res = await request(app)
      .post("/api/v1/leads")
      .set("Idempotency-Key", randomUUID())
      .send({ ...validPayload, email: "not-an-email" });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe("VALIDATION_ERROR");
    expect(res.body.fieldErrors.some((e: { field: string }) => e.field === "email")).toBe(true);
  });

  it("blocks submission when consent is false", async () => {
    const res = await request(app)
      .post("/api/v1/leads")
      .set("Idempotency-Key", randomUUID())
      .send({ ...validPayload, consent: false });

    expect(res.status).toBe(400);
    expect(res.body.fieldErrors.some((e: { field: string }) => e.field === "consent")).toBe(true);
  });
});
