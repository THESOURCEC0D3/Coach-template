# Coaching inquiries

The contact form persists requests in a Medusa custom module before reporting
success. It never confirms an appointment automatically. A private tracking
capability reveals status and dates only; contact details, messages, internal
notes and the stored token hash are never included in public status responses.

## Configuration

Set the same random, server-only `INQUIRY_PROXY_SECRET` (at least 32 characters)
in Next.js and Medusa. Next also needs `MEDUSA_BACKEND_URL` and
`MEDUSA_PUBLISHABLE_KEY`. The public browser never receives the proxy secret.
Missing configuration returns an honest unavailable state and the direct contact
options remain visible.

Optional transactional email uses `RESEND_API_KEY`, `EMAIL_FROM` (a verified
sender) and `INQUIRY_NOTIFICATION_EMAIL`. Without them requests are saved and
marked `unconfigured`; the interface does not claim that an email was delivered.
With them, a receipt and staff notification are attempted after persistence.
The scheduled job retries pending or failed notifications every five minutes,
up to five attempts, using stable provider idempotency keys. Staff can explicitly
retry in Admin after fixing configuration.

## Administrative review

The Medusa Admin **Coaching inquiries** page requires an authenticated staff
user. Customer credentials and anonymous requests do not grant staff access.
The initial role boundary is Medusa staff versus customer/visitor; granular
permissions among staff members are not yet implemented.

Requests progress from received to reviewing, then to needs-information,
proposed, declined or closed. Only a proposed request can become confirmed.
Confirmation requires a date, verification reference, review note and a staff
declaration that actual calendar availability was checked. There is no connected
calendar provider, so this verification is a manual staff responsibility.
Every status change records the actor, timestamp and internal note.

Submission retries use a UUID and payload digest to return the same request.
PostgreSQL advisory locks serialize duplicate submissions and enforce a maximum
of three new inquiries per normalized email address per hour across instances.
Honeypot, schema validation, body limits and same-origin checks supplement this
quota. A production challenge provider may be added if rotating-email spam
requires stronger protection. Do not interpret the quota as identity verification.

## Checks

`tests/booking.test.ts` covers date/timezone boundaries, confirmation transitions,
capability/secret handling and public response minimization. The integration
test requires `MEDUSA_TEST_URL`, `INQUIRY_PROXY_SECRET` and
`MEDUSA_PUBLISHABLE_KEY`; without them it is explicitly skipped. It writes
clearly labelled fixture inquiries using reserved `example.test` addresses.
Only run it against a development/test database. It exercises actual persistence,
replay handling, validation, tracking, quota and anonymous Admin rejection.
