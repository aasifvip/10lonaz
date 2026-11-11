# Firebase Migration Guide

Firebase is **not connected** in this phase. This document describes a future migration path; it does not claim that authentication, Firestore, Storage, or email delivery is active.

## Current boundary

`src/admin/contentRepository.ts` defines `ContentRepository`, currently backed by `BrowserStorageContentRepository`. Its synchronous API is suitable for localStorage but not for network persistence. Before introducing Firestore, evolve repository operations to return promises and update the admin editors, dashboard, public content loading, and submission inbox to handle loading, errors, and retries explicitly. Keep components dependent on the repository boundary rather than Firestore SDK calls.

Current browser storage:

- `10lonaz.content.v1`: versioned content sections, including company, services, products, jobs, FAQs, testimonials, articles, settings, translations, homepage/About copy, contact options, and page SEO.
- `10lonaz.submissions.v1`: contact inquiries and applications.
- `10lonaz.admin.local-session`: an acknowledgement flag only; it is not an identity.

Local data exists independently in each browser profile. Collect and reconcile the content and submissions from every editing device before migration. Settings' **Export content JSON** exports the content bundle; it does not export the submissions key, so submissions need a separate, controlled migration/export procedure.

## Suggested Firestore layout

Use an explicit schema version and stable IDs:

```text
siteContent/current
  schemaVersion
  updatedAt
  sections: { company, services, products, jobs, faqs, ... }

submissions/{submissionId}
  kind: "inquiry" | "application"
  status: "new" | "reviewed" | "archived"
  submittedAt
  details
  summaryText

users/{uid}
  role: "admin" | "editor" | "viewer"
  enabled
```

The single content document is a simple initial mapping, but it may exceed Firestore document limits as catalogs, translations, or uploaded asset metadata grow. Split high-volume collections such as services, products, jobs, FAQs, and articles into their own collections before that becomes a constraint. Preserve the current ordering fields and stable record IDs.

## Authentication and authorization

1. Add Firebase Authentication and require authenticated identity for every `/admin` route.
2. Resolve a user's role from a trusted source (custom claims or a server-controlled user record); never accept role claims supplied by the browser.
3. Enforce access in Firestore and Storage Security Rules, not just in React route guards.
4. Default-deny public writes. Allow public clients only the narrowly scoped application/contact submission operation, with server-side validation and abuse protection.
5. Restrict application details and attachments to authorized roles. Add audit logging for content changes, role changes, and application access.
6. Remove the local acknowledgement gate once the real auth flow is ready; never use the current session flag as authorization.

## Storage and email

- Upload images and resumes to Firebase Storage only after deciding file size/type limits, malware scanning, retention, access rules, and deletion policy.
- Store object paths and safe metadata in Firestore, not base64 file contents.
- Serve private application attachments through authenticated access or short-lived signed URLs.
- Send notifications through a trusted Cloud Function or other backend email service. Store provider credentials in server-managed secrets, validate all inputs server-side, and return an explicit success/failure result to the UI.
- Keep the current `mailto:` fallback clearly labeled until backend delivery is connected.

## Analytics

Keep the measurement ID public configuration-only. Fetch reporting data through a trusted backend using the Google Analytics Data API and least-privilege credentials. Add loading, empty, unavailable, and error states; do not substitute estimates or fabricated values.

## Migration and rollout

1. Export each browser's content bundle and separately collect submissions through a controlled process.
2. Back up the input JSON and validate it against a versioned schema before import.
3. Deduplicate records, preserve IDs/order/status/timestamps, and migrate files separately after storage security is ready.
4. Run an idempotent import script against a staging Firebase project; verify section counts, translations, published states, and public page rendering.
5. Implement repository operations with typed async results and explicit error reporting.
6. Deploy Authentication, Firestore rules, Storage rules, and server-side email before exposing production admin access.
7. Test authorization with allowed and denied roles, public submission abuse cases, attachment access, migration rollback, and backup restoration.
8. Switch the repository provider only after staging parity checks pass; retain a recoverable export and a rollback plan.

Do not treat the browser data or local session acknowledgement as secure authentication or production persistence.
