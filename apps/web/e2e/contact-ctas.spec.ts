import { test, expect } from "@playwright/test";

test.describe("Contact CTAs", () => {
  test("WhatsApp CTA links to the configured number (AC-007)", async ({ page }) => {
    await page.goto("/contact");

    const whatsappLink = page.getByRole("link", { name: /whatsapp/i }).first();
    const href = await whatsappLink.getAttribute("href");

    expect(href).toContain("https://wa.me/");
    // no non-digit characters (other than the query string) leaked into the number segment
    const numberSegment = href?.split("https://wa.me/")[1]?.split("?")[0] ?? "";
    expect(numberSegment).toMatch(/^\d+$/);
  });

  test("Map CTA opens the configured map destination (AC-008)", async ({ page }) => {
    await page.goto("/contact");

    const mapLink = page.getByRole("link", { name: /open in google maps|view on google maps/i });
    await expect(mapLink).toHaveAttribute("href", /maps\.google\.com|google\.com\/maps/);
  });

  test("Call CTA uses a tel: link", async ({ page }) => {
    await page.goto("/contact");

    const callLink = page.getByRole("link", { name: /^call/i }).first();
    const href = await callLink.getAttribute("href");
    expect(href).toMatch(/^tel:/);
  });
});
