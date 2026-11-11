# 10LONAZ Admin Panel — Implementation Plan

This plan is for a later build. The public website was not modified, and no dashboard code was added.

The plan follows the source as it is: a Vite React SPA whose content is static TypeScript, whose forms send `mailto:` links, and whose Firebase SDK is initialized but unused.

## 1. Goal

Give editors one authenticated dashboard that can change every piece of content the public site already shows, then persist submissions the site currently drops on the floor.

The public site must keep its routes, slugs, and behavior. The dashboard must not become a second copy of the marketing pages. It edits the same records the pages render.

## 2. Constraint that drives the architecture

Pages import constants (`companyData`, `servicesData`, `products`, `jobVacancies`, `faqData`, `testimonialsData`, `articles`). Writing Firestore or `localStorage` from an admin screen will not change the website until those pages read through a loader.

Recommended loader, introduced only when implementation starts:

```text
getContent(section)
  1. If a local override bundle exists (localStorage key `10lonaz.content.v1`), use it.
  2. Else if Firebase is configured and the collection has documents, use those.
  3. Else return the current TypeScript module (seed and fallback).
```

Step 3 is what prevents a blank site and prevents a duplicated dataset. The first admin save copies the seed into the bundle and edits that copy. Source modules stay in git as the seed and as the fallback if the bundle is cleared.

Submissions (inquiries, applications) are not part of that bundle. They are append-only and have no seed.

Do not point the public site at the mock Firebase config in `src/lib/firebase.ts`. `isFirebaseConfigured()` is the gate that already exists. When it is false, stay on the seed or on `localStorage`.

## 3. Navigation structure

Route group under `/admin`, separate from `/login`. `/login` stays the public “client portal coming soon” page. It is not the admin login.

```text
/admin/login
/admin                     Dashboard
/admin/homepage            Hero, previews, why-us, homepage FAQ chrome
/admin/about
/admin/services
/admin/services/:id
/admin/portfolio
/admin/portfolio/:slug
/admin/reviews
/admin/articles
/admin/articles/:id
/admin/authors
/admin/faq
/admin/careers
/admin/careers/:id
/admin/careers/culture     cultureBenefits block
/admin/applications        Inbox (empty until persistence exists)
/admin/inquiries           Inbox
/admin/navigation
/admin/translations
/admin/seo
/admin/settings            Company, contact, social, stats
/admin/media               URL library now; uploads when Storage is real
/admin/chat                Welcome line and suggested prompts only
```

Sidebar groups:

1. **Overview** — Dashboard
2. **Website content** — Homepage, About, Services, Portfolio, Reviews, FAQ, Articles, Authors
3. **People** — Careers, Applications, Inquiries
4. **Site setup** — Navigation, Translations, SEO, Media, Chat snippets, Company settings

Dashboard cards should show counts taken from the live bundle: services (12), products (8), open jobs, FAQs, testimonials, articles, unread inquiries, unread applications. Plus the known content defects from the audit so editors see them: missing homepage product slug, sitemap portfolio URLs that do not match slugs, hero stats that differ from company stats, translation keys that no component reads.

## 4. Modules and CRUD

| Module | Create | Read | Update | Delete | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Company settings | no (singleton) | yes | yes | no | Includes contact, social list (add/remove rows), stats |
| SEO defaults and page SEO | no for known routes | yes | yes | no | Do not let an editor invent routes the router does not have |
| Navigation | reorder, toggle visible, edit label and badge | yes | yes | hide rather than delete a route the app still ships | Paths stay aligned with `App.tsx` |
| Translations | add key only if a component will read it | grid of 9 locales | edit cell | do not delete `en` keys the hook falls back to | |
| Services | yes | list + editor | yes | yes, with warning that `/services#slug` and homepage slice depend on order | Slug unique |
| Portfolio | yes | list + editor | yes | yes | Slug unique. `iconName` picker limited to icons the case-study page will map |
| Reviews | yes | list | yes | yes | Category field feeds filters |
| Client names | yes | list | yes | yes | Names today, optional image URL |
| Authors | yes | list | yes | block delete if an article references the id | |
| Articles | yes | list | yes | yes | Block editor for content blocks. Slug unique |
| FAQ | yes | list, filter by category | yes | yes | `featured` flag controls the homepage block |
| Jobs | yes | list | yes | yes, or set `isOpen` false | Closed jobs disappear from the public list |
| Custom questions | nested in the job | yes | yes | yes | Types text, textarea, select |
| Culture benefits | fixed section | yes | yes | add/remove rows | |
| Applications | created by the public form only | inbox, detail | status only (`new`, `reviewed`, `archived`) | archive | Not editable marketing content |
| Inquiries | created by the public form only | inbox, detail | status only | archive | |
| Page copy | seeded sections | yes | yes | no | |
| Media | register a URL | library | replace URL | remove if unused | |
| Chat snippets | singleton | yes | welcome + prompts | no | Keyword reply logic stays in code |

Publish model: one “Save” writes the document into the bundle. There is no draft/publish workflow in the current site, so do not add one in the first version. `isOpen` on jobs and `featured` flags are the only visibility switches the site already understands.

Ordering: persist `order` because several lists are array order (services homepage slice, FAQ, milestones).

## 5. Image and file management

Current state: images are absolute URLs. The only local asset reference in the UI is `/favicon.ico`. Firebase Storage is constructed in `src/lib/firebase.ts` and unused.

Phase A (no Storage):

- Text fields for every current image: testimonial `avatar`, article `coverImage`, author `avatar`, product `screenshots[]`, about team photo, `defaultOgImage`, `logoUrl`.
- Preview the URL in the editor.
- Validate `https` URLs. Do not upload.

Phase B (after a real Firebase project is configured):

- Upload to `images/{collection}/{id}/{filename}`.
- Store the download URL back into the same string field the components already render.
- Resume uploads from job applications go to `resumes/{applicationId}/{filename}`. Keep the existing client checks: pdf/doc/docx, 5 MB.
- Do not accept resume upload as “submitted” until the mailto limitation is replaced. Today the file never leaves the browser, and the UI tells the user to attach it themselves.

Favicon and `index.html` social images are build-time files. The dashboard can edit the URL used by the React `SEO` component. Replacing `index.html` and `public/favicon.ico` still needs a deploy.

## 6. Language management

Editor is a table: rows are the existing keys, columns are `en`, `zh`, `ja`, `si`, `ta`, `ar`, `es`, `ml`, `hi`.

Show a “used by” column from the field map. Keys under `services.*`, `portfolio.*`, `testimonials.*`, `why.*`, `faq.*`, `footer.*`, and `contact.*` are stored and currently unread. Editing them does nothing on the public site until the matching component calls `t()`. The implementation step that wires `t()` is a public-site change and should be a separate, explicit task. Until then, the dashboard should label those keys as unused.

`ar` must keep RTL. The hook already sets `dir`.

Do not machine-translate services, jobs, or articles in the first release. The site has no fields for that.

## 7. Careers and applications

Job editor sections, matching `JobVacancy`: overview, taxonomy (department, type, experience, location), salary string, dates, open/featured flags, four bullet lists, tech stack, custom questions.

Public list behavior to preserve:

- `isOpen === false` is excluded.
- Department, type, and experience filters are the distinct values of open jobs, plus “All”.
- Search includes title, overview, department, location, tech stack.
- There is no location dropdown. Do not add one unless the public page is updated to call the unused `location` argument on `filterJobs`.

Application inbox appears only after the public submit handler is changed to also write `JobApplication`. Until that change, the inbox module should explain that applications open the visitor’s email client and are not stored. That change is a public-site behavior change and must be scheduled on purpose, not slipped into a content-only patch.

Suggested status values for the inbox: `new`, `reviewed`, `archived`. The public site has no status field.

## 8. Contact and inquiries

Same rule as applications. The inbox schema matches `ContactInquiry`. Options editor manages `projectTypes` and `budgetRanges` because those arrays are content. They are not the services catalog; keep them separate so renaming a service does not silently change the form.

The hardcoded WhatsApp URL in the contact success path (`https://wa.me/94754833270`) should, when the public file is next edited, read `companyData.contact.whatsappLink` or `whatsapp`. That is a one-line site fix, tracked here so settings and that button do not diverge. It is out of scope for this audit.

## 9. Website settings

Single settings screen bound to `CompanySettings`:

- Identity and `siteUrl` (warn that canonical URLs and JSON-LD all use `siteUrl`)
- Three mailboxes: hello, careers, support (support is unused in the UI; show that)
- Phone display vs `tel:` value
- WhatsApp number and full `whatsappLink`
- Structured address and the `formatted` line the footer prints
- Working hours, headquarters, working model, founding year
- Stats strings
- Social rows
- `knowsAbout` list used only by Organization schema

Theme, cursor, and toaster configuration stay out of this screen.

## 10. Firebase integration (future)

What already exists:

- `initializeApp` / `getFirestore` / `getStorage` in `src/lib/firebase.ts`
- Env var names `VITE_FIREBASE_*`
- `isFirebaseConfigured()`
- Hosting rewrite in `firebase.json`
- A commented `job_vacancies` read in `fetchJobsFromFirestore`
- Package `firebase` 12.17

What does not exist: Auth, security rules, Functions, a Firestore database block in `firebase.json`, any `getDocs` call that runs, EmailJS usage.

Target, when implementation is approved:

1. **Auth.** Email/password or Google, restricted to an allow-list in Firestore `admins/{uid}`. Initialize `getAuth` only inside the admin route. Do not reuse `/login`.
2. **Rules.** Public read on marketing collections if the site reads them from the client. No public write. `inquiries` and `job_applications` and `resumes`: public create with field validation, admin read/update, no public read (applications contain personal data).
3. **Seed script.** One-shot import from the TypeScript modules into the collections named in `ADMIN_PANEL_DATA_SCHEMA.md`. Skip if documents already exist.
4. **Repository.** `ContentRepository` with two drivers: `LocalStorageContentRepository` and `FirestoreContentRepository`. The UI calls the interface. Switching drivers does not change forms.
5. **Public loader.** Replace direct constant reads with `useContent()` backed by the repository, falling back to the seed modules. TanStack Query is already mounted and can cache this; it currently has no queries.
6. **Submissions.** After the repository exists, extend Contact and JobDetails submit handlers to write inquiries and applications, then keep the mailto fallback when Firebase is not configured so the current behavior remains.
7. **Storage.** Only after rules exist. Image and resume paths from the schema doc.
8. **Sitemap.** Optional build script that writes `public/sitemap.xml` from slugs. Fix the four portfolio URLs that do not match `products` when that script is introduced.
9. **Email.** Either keep mailto, or add a Cloud Function / a real EmailJS template. The dependency is installed and unused; do not pretend it is wired. A function is the better place for resumes because EmailJS is not a file store.

Environment: real values only in `.env` (not committed). Remove reliance on the mock api key before any production admin deploy. Hosting stays `dist` → `/index.html`.

Admin UI stack should reuse the existing Tailwind and Radix components so the dashboard matches the site. No new design system.

## 11. Implementation sequence

Each step is future work. Stop points are explicit so the public site is not half-migrated.

1. **Repository and seed types** — Add the bundle types and a seed function that reads the current modules. No UI. Public pages still import modules.
2. **Local driver** — `localStorage` read/write with version `1`. Export/import JSON for backup.
3. **Admin shell** — `/admin/login` placeholder gate (even a single shared password in local dev is temporary; replace with Firebase Auth before any deploy). Layout and navigation from section 3.
4. **Editors for data modules** — Settings, services, products, jobs, FAQs, testimonials, articles, authors, translations. These map 1:1 onto files that already exist.
5. **Page-copy editors** — About, homepage sections, careers culture, contact options, chat snippets. Saving page copy does nothing publicly until step 6 extracts those strings.
6. **Public read path** — Switch pages to the repository with seed fallback. This is the first public-site change. Verify every route against the seed with an empty `localStorage` so the site looks the same.
7. **Visibility and order** — Honor `order`, `featuredOnHome`, and existing flags. Fix the dead `healthcare-management-system` slug by leaving it unfeatured.
8. **Inboxes** — Persist inquiries and applications when configured; otherwise keep mailto.
9. **Firebase driver** — Same repository methods. Rules and allow-listed Auth.
10. **Media uploads and sitemap generator** — After Storage and a real project id exist.
11. **Wire unused translation keys** — Only if the product owner wants the homepage and footer to follow the language switcher. That is a visible behavior change.

## 12. Out of scope for the dashboard

- Rebuilding pages or replacing React Router
- The client portal described on `/login`
- Connecting the chat modal to an LLM
- Analytics, until a tracker is actually added to the site
- Translating the bodies of services, jobs, and articles
- Editing Prisma/Tailwind/theme tokens
- EmailJS templates that do not exist in the repo

## 13. Acceptance checks before any future UI is called done

- With no admin data saved, every public route matches the current site.
- Editing a service title in the dashboard changes `/services` and the homepage card after the public loader is on, and does not require a second copy of the paragraph.
- Adding a job with `isOpen: true` shows it on `/careers` and `/careers/:slug`, including its custom questions.
- Setting `isOpen: false` removes it from the list without deleting the document.
- Featuring an FAQ adds it to the homepage accordion.
- Contact and job forms still open the mail client when Firebase is off.
- When Firebase is on, an inquiry is readable in `/admin/inquiries` and still contains the same fields the mailto body contains.
- Unknown portfolio and job slugs still fail the same way they do now.
- Translation edits to `nav.*` and `hero.*` show on the site; unused keys are labeled unused.
- No secrets from `firebase.ts` fallbacks are written into the content bundle.
