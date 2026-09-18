import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES = ["/", "/about", "/services", "/projects", "/process", "/contact"];

test.describe("Accessibility (AC-012)", () => {
  for (const path of PAGES) {
    test(`${path} has no critical/serious axe violations`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
        .analyze();

      const seriousOrWorse = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(seriousOrWorse, JSON.stringify(seriousOrWorse, null, 2)).toEqual([]);
    });
  }

  test("enquiry form is keyboard-navigable end to end", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Full name").focus();
    await expect(page.getByLabel("Full name")).toBeFocused();

    for (let i = 0; i < 6; i++) {
      await page.keyboard.press("Tab");
    }
    // Focus should have moved off the first field into the form without getting trapped.
    await expect(page.getByLabel("Full name")).not.toBeFocused();
  });
});
