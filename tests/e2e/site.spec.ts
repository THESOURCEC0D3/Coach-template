import { expect, test } from "@playwright/test";

test("home shows the supplied portrait, real publication and KES price", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Speak with");
  await expect(page.getByRole("img", { name: /Trophy Kiprono/ }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Book a Consultation/ }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Shop Books", exact: true }).first()).toBeVisible();
  await expect(page.locator("#books")).toContainText("Mastering Office Politics");
  await expect(page.locator("#books")).toContainText("2,550");
  await expect(page.locator("body")).not.toContainText("Rachel Rios");
  await expect(page.locator("body")).not.toContainText("12,000+");
});

test("all public modules and six services are reachable", async ({ page }) => {
  const paths = ["/about", "/services", "/services/public-speaking", "/services/corporate-training", "/services/executive-coaching", "/services/life-coaching", "/services/etiquette-soft-skills", "/services/english-tutoring", "/resources", "/events", "/media", "/the-brand-experts-kenya", "/contact", "/privacy", "/terms", "/refunds", "/delivery"];
  for (const path of paths) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await expect(page.getByRole("heading", { level: 1 }), path).toBeVisible();
    await expect(page.locator("#main-content"), path).toHaveCount(1);
  }
  await page.goto("/services/public-speaking");
  await page.getByRole("link", { name: /Enquire about this service/ }).click();
  await expect(page).toHaveURL(/service=public-speaking/);
  await expect(page.getByLabel(/I am interested in/i)).toHaveValue("public-speaking");
});

test("book can be added, updated and removed with server-calculated KES totals", async ({ page }) => {
  await page.goto("/books");
  await page.getByLabel("Search books", { exact: true }).fill("Mastering Office Politics");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await page.getByRole("link", { name: /Mastering Office Politics/ }).first().click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Mastering Office Politics");
  await expect(page.getByRole("img", { name: /cover/ }).first()).toBeVisible();
  await page.getByRole("button", { name: "Add to Cart", exact: true }).click();
  await expect(page.getByText("Added to your book bag.", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "View your bag" }).click();
  await expect(page.locator("main")).toContainText("2,550");
  await page.getByRole("spinbutton").fill("2");
  await page.getByRole("spinbutton").press("Tab");
  await expect(page.getByRole("spinbutton")).toHaveValue("2");
  await page.getByRole("button", { name: "Update", exact: true }).click();
  await expect(page.locator("main")).toContainText("5,100");
  await page.getByRole("link", { name: "Continue to checkout" }).click();
  await expect(page.getByText("Delivery address · Kenya", { exact: true })).toBeVisible();
  await expect(page.getByText(/Online payments are not open yet/)).toBeVisible();
  await page.goto("/cart");
  await page.getByRole("button", { name: "Remove", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Your book bag is empty" })).toBeVisible();
});

test("mobile menu supports navigation and Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Open menu", exact: true });
  await toggle.click();
  await expect(page.getByRole("navigation", { name: "Mobile navigation", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.getByRole("navigation", { name: "Mobile navigation", exact: true }).getByRole("link", { name: "Books", exact: true }).click();
  await expect(page).toHaveURL(/\/books$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("unknown products and unauthorized orders reveal no private details", async ({ page }) => {
  const missing = await page.goto("/books/not-a-real-title");
  expect(missing?.status()).toBe(404);
  const protectedOrder = await page.goto("/orders/order_notowned");
  expect(protectedOrder?.status()).toBe(404);
  await page.goto("/account");
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
});
