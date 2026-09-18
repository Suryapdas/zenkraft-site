import { test, expect } from "@playwright/test";

const PAGES = ["/", "/services", "/projects", "/contact"];

test.describe("Responsive — 320px (AC-011)", () => {
  test.use({ viewport: { width: 320, height: 720 } });

  for (const path of PAGES) {
    test(`${path} has no horizontal scroll at 320px`, async ({ page }) => {
      await page.goto(path);

      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // 1px tolerance for sub-pixel rounding
    });
  }

  test("critical visitor journey: home -> contact -> enquiry form is usable at 320px", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /book a consultation/i }).first().click();
    await expect(page).toHaveURL(/\/contact/);
    await expect(page.getByLabel("Full name")).toBeVisible();
  });
});
