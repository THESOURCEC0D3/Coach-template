import { randomUUID } from "node:crypto";
import { expect, test } from "@playwright/test";

test("a service inquiry is saved and its private tracking code shows review status", async ({ page }) => {
  await page.goto("/contact?service=public-speaking");
  await expect(page.getByLabel(/I am interested in/)).toHaveValue("public-speaking");
  await page.getByLabel("Full name *", { exact: true }).fill("Automated preview inquiry");
  await page.getByLabel("Email address *", { exact: true }).fill(`preview-${randomUUID()}@example.test`);
  await page.getByLabel("Phone number *", { exact: true }).fill("+254700000000");
  await page.getByLabel("Organization", { exact: true }).fill("Automated test fixture");
  await page.getByLabel(/Preferred format/).selectOption("online");
  await page.getByLabel("Your message *", { exact: true }).fill("Automated preview test of the inquiry journey. This is not a real appointment request.");
  await page.getByLabel(/I agree that these details/).check();
  const submitted = page.waitForResponse(response => response.url().endsWith("/api/inquiries") && response.request().method() === "POST");
  await page.getByRole("button", { name: "Send inquiry", exact: true }).click();
  const response = await submitted;
  expect(response.status()).toBe(201);
  const { inquiry } = await response.json();
  expect(inquiry.status).toBe("received");
  await expect(page.getByRole("heading", { name: "Your conversation starts here." })).toBeVisible();
  await expect(page.getByText(inquiry.tracking_token, { exact: true })).toBeVisible();
  await page.getByLabel("Tracking code", { exact: true }).fill(inquiry.tracking_token);
  await page.getByRole("button", { name: "Check request status", exact: true }).click();
  await expect(page.getByText("Request received", { exact: true })).toBeVisible();
  await expect(page.getByText("Your appointment is not yet confirmed.", { exact: true })).toBeVisible();
});

test("inquiry proxy rejects cross-site submission and invalid private tracking codes", async ({ request, baseURL }) => {
  const rejected = await request.post("/api/inquiries", { headers: { origin: "https://unrelated.example" }, data: {} });
  expect(rejected.status()).toBe(403);
  const unknown = await request.post("/api/inquiries/status", { headers: { origin: baseURL! }, data: { tracking_token: "not-a-private-tracking-code" } });
  expect(unknown.status()).toBe(404);
});
