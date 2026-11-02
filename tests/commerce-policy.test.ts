import test from "node:test";
import assert from "node:assert/strict";
import { needsShipping, validQuantity, safeInternalPath, money } from "../lib/commerce/helpers";
import { canGrant, hasConfirmedPayment, validPrivateKey } from "../backend/src/modules/digital/policy";

test("KES amounts are major units, not divided by 100", () => {
  assert.match(money(2550), /2,550/);
  assert.match(money(2550), /KES/);
  assert.match(money(2550.5), /2,550\.5\b/);
});

test("physical, digital and mixed bags follow server shipping flags", () => {
  assert.equal(needsShipping([{ requires_shipping: true }]), true);
  assert.equal(needsShipping([{ requires_shipping: false }]), false);
  assert.equal(needsShipping([{ requires_shipping: false }, { requires_shipping: true }]), true);
  assert.equal(needsShipping([{ requires_shipping: true, variant: { metadata: { format: "pdf" } } }]), true);
  assert.equal(needsShipping([]), false);
});

test("cart quantities reject fractional, unbounded and invalid values", () => {
  assert.equal(validQuantity("2"), 2);
  for (const value of [0, -1, 1.5, "abc", "", 21, Infinity, NaN, null, undefined]) assert.throws(() => validQuantity(value));
});

test("internal redirects cannot leave the site", () => {
  assert.equal(safeInternalPath("/account"), "/account");
  for (const path of ["//example.com", "https://example.com", "/\\example.com"]) assert.equal(safeInternalPath(path), "/account");
});

test("digital access requires captured unrefunded payment", () => {
  const paid = { total: 2550, status: "pending", payment_collections: [{ status: "completed", captured_amount: 2550, refunded_amount: 0 }] };
  assert.equal(hasConfirmedPayment(paid), true);
  assert.equal(hasConfirmedPayment({ ...paid, payment_collections: [{ status: "authorized", captured_amount: 0 }] }), false);
  assert.equal(hasConfirmedPayment({ ...paid, payment_collections: [{ status: "completed", captured_amount: 2500 }] }), false);
  assert.equal(hasConfirmedPayment({ ...paid, payment_collections: [{ status: "completed", captured_amount: 2550, refunded_amount: 1 }] }), false);
  assert.equal(hasConfirmedPayment({ ...paid, status: "canceled" }), false);
  assert.equal(hasConfirmedPayment({ total: 0, payment_collections: [] }), false);
});

test("entitlements deny cross-customer, revoked and exhausted grants", () => {
  const entitlement = { customer_id: "cus_owner", revoked_at: null, grant_count: 0, download_limit: 5 };
  assert.equal(canGrant(entitlement, "cus_owner"), true);
  assert.equal(canGrant(entitlement, "cus_other"), false);
  assert.equal(canGrant(entitlement, ""), false);
  assert.equal(canGrant({ ...entitlement, grant_count: 5 }, "cus_owner"), false);
  assert.equal(canGrant({ ...entitlement, revoked_at: new Date() }, "cus_owner"), false);
});

test("private assets accept only bounded PDF/ePub object keys", () => {
  assert.equal(validPrivateKey("books/book.pdf"), true);
  assert.equal(validPrivateKey("books/book.epub"), true);
  for (const key of ["../book.pdf", "/book.pdf", "https://example.com/book.pdf", "book.exe", ""]) assert.equal(validPrivateKey(key), false);
});
