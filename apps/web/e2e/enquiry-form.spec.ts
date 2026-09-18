import { test, expect } from "@playwright/test";

test.describe("Enquiry form", () => {
  test("submits successfully and shows a confirmation (AC-003)", async ({ page }) => {
    await page.goto("/contact");

    await page.locator("#name").fill("Playwright Test User");
    await page.locator("#email").fill(`pw-${Date.now()}@example.com`);
    await page.locator("#phone").fill("+91 90000 00001");
    await page.locator("#city").fill("Bengaluru");
    await page.locator("#projectType").selectOption({ index: 1 });
    await page.locator("#budgetRange").selectOption({ index: 1 });
    await page.locator("#timeline").selectOption({ index: 1 });
    await page.locator("#description").fill("Playwright end-to-end test submission.");
    await page.locator("#consent").check();

    await page.getByRole("button", { name: /submit enquiry/i }).click();

    await expect(page.getByRole("status")).toContainText("Thank you");
    await expect(page.getByText(/Reference ID/)).toBeVisible();
  });

  test("blocks submission on invalid data and preserves entered values (AC-005/AC-015)", async ({ page }) => {
    await page.goto("/contact");

    await page.locator("#name").fill("Invalid Email User");
    await page.locator("#email").fill("not-an-email");
    await page.locator("#phone").fill("+91 90000 00002");
    await page.locator("#city").fill("Mumbai");
    await page.locator("#description").fill("This value must not be lost after a validation error.");

    await page.getByRole("button", { name: /submit enquiry/i }).click();

    // Blocked: still on the form, not the confirmation state, and the invalid field is identified.
    await expect(page.getByRole("button", { name: /submit enquiry/i })).toBeVisible();
    await expect(page.getByRole("alert").first()).toBeVisible();
    await expect(page.getByText(/valid email/i).first()).toBeVisible();

    // Entered data preserved.
    await expect(page.locator("#name")).toHaveValue("Invalid Email User");
    await expect(page.locator("#city")).toHaveValue("Mumbai");
    await expect(page.locator("#description")).toHaveValue(
      "This value must not be lost after a validation error."
    );
  });

  test("blocks submission without consent", async ({ page }) => {
    await page.goto("/contact");

    await page.locator("#name").fill("No Consent User");
    await page.locator("#email").fill(`no-consent-${Date.now()}@example.com`);
    await page.locator("#phone").fill("+91 90000 00003");
    await page.locator("#city").fill("Pune");
    await page.locator("#description").fill("Should be blocked without consent.");

    await page.getByRole("button", { name: /submit enquiry/i }).click();

    await expect(page.getByText(/Consent is required/i).first()).toBeVisible();
  });
});
