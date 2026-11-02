import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";

const backend = process.env.MEDUSA_TEST_URL;
const secret = process.env.INQUIRY_PROXY_SECRET;
const publishable = process.env.MEDUSA_PUBLISHABLE_KEY;
const enabled = Boolean(backend && secret && publishable);

test("inquiry API persists requests, deduplicates retries, protects tracking and enforces durable quotas", { skip: !enabled }, async () => {
  const headers = { "Content-Type": "application/json", "x-publishable-api-key": publishable!, "x-inquiry-proxy-secret": secret! };
  const send = (path: string, body: unknown, extraHeaders = headers) => fetch(`${backend}${path}`, { method: "POST", headers: extraHeaders, body: JSON.stringify(body) });
  const input = { request_id: randomUUID(), full_name: "Integration Test", email: `inquiry-${randomUUID()}@example.test`, phone: "+254700000000", organization: "Automated test fixture", service: "public-speaking", preferred_date: "", delivery_format: "online", message: "Automated inquiry integration test. Not a real booking.", consent: true, website: "" };
  const created = await send("/store/inquiries", input);
  assert.equal(created.status, 201);
  const { inquiry } = await created.json();
  assert.equal(inquiry.status, "received");
  assert.match(inquiry.tracking_token, /^[A-Za-z0-9_-]{43}$/);
  const replay = await send("/store/inquiries", input);
  assert.equal(replay.status, 200);
  assert.equal((await replay.json()).inquiry.id, inquiry.id);
  const status = await send("/store/inquiries/status", { tracking_token: inquiry.tracking_token });
  assert.equal(status.status, 200);
  assert.deepEqual(Object.keys((await status.json()).inquiry).sort(), ["confirmed_date", "id", "preferred_date", "service", "status", "updated_at"]);
  assert.equal((await send("/store/inquiries/status", { tracking_token: "invalid" })).status, 404);
  assert.equal((await send("/store/inquiries", { ...input, request_id: randomUUID(), consent: false })).status, 422);
  assert.equal((await send("/store/inquiries", { ...input, request_id: randomUUID(), website: "https://spam.example" })).status, 422);
  assert.equal((await send("/store/inquiries", input, { ...headers, "x-inquiry-proxy-secret": "incorrect" })).status, 401);
  for (let index = 0; index < 2; index++) assert.equal((await send("/store/inquiries", { ...input, request_id: randomUUID() })).status, 201);
  assert.equal((await send("/store/inquiries", { ...input, request_id: randomUUID() })).status, 429);
  const admin = await fetch(`${backend}/admin/inquiries`);
  assert.equal(admin.status, 401);
});
