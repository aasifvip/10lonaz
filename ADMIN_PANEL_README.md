# 10LONAZ Admin Panel

The admin panel is part of the existing React/Vite website and is available at `/admin`. Public pages continue to use their existing TypeScript content as defaults, with browser-stored overrides applied when present. This keeps the public site working when no admin content has been saved.

## Features

- Dashboard with live content and submission counts. Visitor, page-view, popular-page, and traffic-source reports are marked unavailable unless a reporting integration exists; no analytics figures are fabricated.
- Editors for homepage content, About copy, services, portfolio products, job vacancies, FAQs/contact options, reviews, articles, page SEO, and website settings.
- Job application and contact inquiry inboxes with status tracking. FAQ management is inside Contact & FAQ.
- Translation editor for the nine existing site languages, including enable/disable, fallback-language selection, searchable keys, and missing-translation indicators.
- Reordering, publishing/visibility controls, and record add/edit/delete where applicable.
- Public content integration for the existing home, About, Services, Portfolio, Careers, Contact, FAQ, reviews, articles, navigation, footer, and SEO surfaces.
- JSON export of the website content bundle in Settings.

## Run locally

From the project directory:

```powershell
npm install
npm run dev
```

Open the Vite URL and go to `/admin`. The access screen is only an acknowledgement for local editing. It is **not authentication** and must not be treated as a security boundary or deployed publicly without backend authorization.

## Storage and public synchronization

`src/admin/contentRepository.ts` defines the `ContentRepository` boundary and the current `BrowserStorageContentRepository` implementation.

| Key | Contents |
| --- | --- |
| `10lonaz.content.v1` | Versioned website content bundle (`version`, `updatedAt`, and per-section values). |
| `10lonaz.submissions.v1` | Contact inquiries and job applications, including submitted details and status. |
| `10lonaz.admin.local-session` | Temporary session acknowledgement only; no password or credential. |

Saved content is browser-local. The public data modules use the stored section when present and otherwise fall back to their existing TypeScript data. Changes saved by the admin reload the editor; same-origin public tabs reload when they receive the content storage event. This does not publish to a server, another browser, or another device.

Image and logo fields currently accept URLs; there is no upload pipeline. Product icon component references are serialized by name for browser storage.

## Submissions and email

Contact inquiries and applications are saved locally and can be marked new, reviewed, or archived. The email action is a clearly identified `mailto:` draft fallback; opening a draft does not mean an email was sent. No backend email provider is connected, and no credentials are included in frontend code. Resume files are not uploaded or stored as bytes; the browser submission record can only retain the available form details/metadata.

Browser storage is neither private nor durable enough for sensitive applicant information. Do not use this mode for production hiring or private customer data.

## Analytics

Settings can hold a Google Analytics measurement ID. The public tracker sends page-view events only when a valid ID is configured. The dashboard does not query GA reporting data; visitors, page views, popular pages, and traffic sources remain unavailable until a secure server-side Data API integration is built.

## Known limitations

- No real admin authentication, authorization, roles, or server-side access control.
- Data is isolated to the current browser profile and can be read or changed by anyone with access to that browser.
- No shared publishing, backend database, image/CV upload, private attachment delivery, or email sending service.
- Analytics reporting and date-filtered charts are not available without a server-side provider integration.
- Translation editing covers the languages already shipped with the public site. It does not add new locale runtimes or automatically translate job descriptions.
- The repository interface is synchronous for the browser-storage implementation. A remote Firestore provider will require async repository/UI handling as part of migration.
