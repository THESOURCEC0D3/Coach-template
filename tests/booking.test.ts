import assert from "node:assert/strict";
import { test } from "node:test";
import { emailRateKey, hashToken, publicProgress, secretMatches, trackingToken, transitionAllowed, validPreferredDate } from "../backend/src/modules/inquiries/policy";

test("preferred dates are real calendar dates and respect the date in Kenya", () => {
  const now = new Date("2026-11-01T22:30:00Z");
  assert.equal(validPreferredDate("2026-11-01", now), false);
  assert.equal(validPreferredDate("2026-11-02", now), true);
  assert.equal(validPreferredDate("2027-02-29", now), false);
  assert.equal(validPreferredDate("2028-02-29", now), true);
  assert.equal(validPreferredDate("not-a-date", now), false);
});

test("requests cannot skip review or confirm without verified calendar details", () => {
  const future = "2099-12-01";
  assert.equal(transitionAllowed("received", "confirmed", { date: future, reference: "Checked", availability_verified: true }), false);
  assert.equal(transitionAllowed("received", "reviewing"), true);
  assert.equal(transitionAllowed("reviewing", "proposed"), true);
  assert.equal(transitionAllowed("proposed", "confirmed"), false);
  assert.equal(transitionAllowed("proposed", "confirmed", { date: future, reference: "Checked", availability_verified: false }), false);
  assert.equal(transitionAllowed("proposed", "confirmed", { date: future, reference: " ", availability_verified: true }), false);
  assert.equal(transitionAllowed("proposed", "confirmed", { date: future, reference: "Calendar checked by staff", availability_verified: true }), true);
  assert.equal(transitionAllowed("closed", "reviewing"), false);
});

test("tracking capabilities are unguessable, deterministic per submission, and stored as hashes", () => {
  const secret = "a".repeat(64);
  const token = trackingToken("b2d34ad3-5212-4a86-a4ae-416fa5a6e03e", secret);
  assert.match(token, /^[A-Za-z0-9_-]{43}$/);
  assert.equal(token, trackingToken("b2d34ad3-5212-4a86-a4ae-416fa5a6e03e", secret));
  assert.notEqual(token, trackingToken("different-submission", secret));
  assert.notEqual(token, trackingToken("b2d34ad3-5212-4a86-a4ae-416fa5a6e03e", "b".repeat(64)));
  assert.notEqual(hashToken(token), token);
  assert.equal(emailRateKey(" PERSON@EXAMPLE.COM ", secret), emailRateKey("person@example.com", secret));
});

test("backend inquiry routes require a configured proxy secret", () => {
  const secret = "c".repeat(64);
  assert.equal(secretMatches(secret, secret), true);
  assert.equal(secretMatches("short", secret), false);
  assert.equal(secretMatches([secret], secret), false);
  assert.equal(secretMatches(undefined, secret), false);
  assert.equal(secretMatches("", undefined), false);
  assert.equal(secretMatches("short", "short"), false);
});

test("public status returns no contact details, messages, review notes or secrets", () => {
  const stored = { id: "inq_example", status: "reviewing", service: "public-speaking", preferred_date: null, confirmed_date: null, updated_at: "2026-11-01", email: "private@example.test", phone: "+254700000000", full_name: "Private", message: "Private message", tracking_token_hash: "secret", status_history: [{ note: "Internal" }] };
  assert.deepEqual(Object.keys(publicProgress(stored)).sort(), ["confirmed_date", "id", "preferred_date", "service", "status", "updated_at"]);
  assert.equal(JSON.stringify(publicProgress(stored)).includes("private@example.test"), false);
});
