import assert from "node:assert/strict";
import { test } from "node:test";

const backend = process.env.MEDUSA_TEST_URL;
const key = process.env.MEDUSA_PUBLISHABLE_KEY;
test("approved book, server cart totals, quantity changes and protected downloads", { skip: !backend || !key, timeout: 120_000 }, async () => {
  const request = async (path: string, method = "GET", data?: unknown) => {
    const response = await fetch(`${backend}${path}`, {
      method, headers: { "Content-Type": "application/json", "x-publishable-api-key": key! },
      body: data === undefined ? undefined : JSON.stringify(data), signal: AbortSignal.timeout(30_000),
    });
    const result = await response.json();
    assert.equal(response.ok, true, `${method} ${path}: ${response.status}`);
    return result;
  };
  const { regions } = await request("/store/regions");
  const region = regions.find((entry: { currency_code: string }) => entry.currency_code === "kes");
  assert.ok(region);
  const { products } = await request(`/store/products?handle=mastering-office-politics&region_id=${region.id}&fields=*variants.calculated_price`);
  const book = products[0];
  assert.equal(book.title, "Mastering Office Politics");
  assert.equal(book.variants[0].calculated_price.calculated_amount, 2550);
  let { cart } = await request("/store/carts", "POST", { region_id: region.id });
  ({ cart } = await request(`/store/carts/${cart.id}/line-items`, "POST", { variant_id: book.variants[0].id, quantity: 1 }));
  assert.equal(cart.items[0].quantity, 1);
  assert.equal(cart.total, 2550);
  ({ cart } = await request(`/store/carts/${cart.id}/line-items/${cart.items[0].id}`, "POST", { quantity: 2 }));
  assert.equal(cart.items[0].quantity, 2);
  assert.equal(cart.total, 5100);
  await request(`/store/carts/${cart.id}/line-items/${cart.items[0].id}`, "DELETE");
  ({ cart } = await request(`/store/carts/${cart.id}`));
  assert.equal(cart.items.length, 0);
  for (const path of ["/store/downloads", "/store/orders/order_unknown", "/admin/book-reports"]) {
    const response = await fetch(`${backend}${path}`, { headers: { "x-publishable-api-key": key! }, signal: AbortSignal.timeout(30_000) });
    assert.equal(response.status, 401, path);
  }
});
