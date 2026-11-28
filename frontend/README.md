# India’s Next Dancer 2027 — website

Marketing website for **India’s Next Dancer 2027**, a nationwide freestyle dance competition presented by **KGIL Productions**.

- Live domain: `https://indiasnextdancer.com`
- Stack: React 18 + Vite 5, Three.js via `@react-three/fiber` (3D hero), plain CSS
- Rendering: every page is **prerendered to static HTML at build time**, then hydrated by React. Search engines and AI crawlers receive full content without running JavaScript.

---

## Quick start

Requires Node.js 18+.

```bash
npm install
npm run dev            # local dev server at http://localhost:5173
npm run build          # production build into dist/ (prerendered)
npm run preview        # serve dist/ locally
npm run build:staging  # staging build: noindex everywhere, robots.txt blocks all
```

Deploy the contents of **`dist/`**.

> `npm run dev` renders on the client only. Meta tags, JSON-LD and prerendered HTML exist only in the build output, so test SEO output with `npm run build`.

---

## Pages

| URL | File | Notes |
|---|---|---|
| `/` | `src/pages/Home.jsx` | Hero, Manifesto, Categories, Prizes, Journey, Notify sections |
| `/about/` | `src/pages/About.jsx` | Story, values, organiser details |
| `/privacy-policy/` | `src/pages/Legal.jsx` (`Privacy`) | Legal draft — needs legal review |
| `/terms-and-conditions/` | `src/pages/Legal.jsx` (`Terms`) | Legal draft — needs legal review |
| any other path | `src/pages/NotFound.jsx` → `dist/404.html` | `noindex`, served with HTTP 404 |

All URLs are lowercase, hyphenated and end in a slash; that is the canonical form.

---

## Project structure

```
index.html              HTML template (<!--head--> and <!--app--> are filled by the prerenderer)
vite.config.js
vercel.json             Vercel: trailing slashes, 301 redirects, headers
scripts/
  prerender.mjs         Build step: writes per-page HTML, 404.html, sitemap.xml
public/
  robots.txt            Crawler rules (search + AI crawlers)
  llms.txt              Short summary for AI assistants
  llms-full.txt         Full fact sheet for AI assistants (full-llms.txt is a copy)
  _headers, _redirects  Netlify / Cloudflare Pages: caching, security headers, 301s
  images/               Optimised, descriptively named images (WebP + JPG/PNG)
src/
  main.jsx              Client entry (hydrates prerendered HTML)
  entry-server.jsx      Server entry used by the prerenderer
  App.jsx               Routes + head-tag sync on client navigation
  router.jsx            Tiny dependency-free router (real <a href> links)
  content.js            ← ALL event & company data (edit here)
  seo.js                ← ALL SEO: titles, descriptions, canonical, OG, JSON-LD
  hooks.js              useInView, useScrolled, useCountdown
  components/           Nav, Footer, GoldStage (Three.js ring), Glyphs
  sections/             Home page sections
  pages/                About, Legal, NotFound, PageShell (shared inner-page layout)
  styles/global.css     All styles, grouped by section
```

---

## Editing content

**Event and company details** live in one place, `src/content.js`:

- `EVENT`: name, year, number of cities, prize pool
- `CATEGORIES`: Kids / Teens / Adults / Group
- `PRIZES`: 1st and 2nd place amounts
- `STEPS`: the three competition rounds
- `COMPANY`: phone, email, address, social links

Changing a value there updates every page that shows it.

**Remember to update these by hand too** if facts change, because they are plain text files:
`public/llms.txt`, `public/llms-full.txt`, `public/full-llms.txt`, and the dates in `src/pages/Legal.jsx`.

**SEO text** (page titles, meta descriptions) lives in `src/seo.js` → `PAGES`.

### Adding a new page

1. Create the component in `src/pages/`.
2. Add it to `ROUTES` in `src/App.jsx` (path with a trailing slash, e.g. `'/faq/'`).
3. Add its title, description and breadcrumbs to `PAGES` in `src/seo.js`.
4. Link to it with `<Link to="/faq/">` from `src/router.jsx`.

The prerenderer and sitemap pick it up automatically.

---

## Registration (/register/) and backend

`/register/` is a 2-step registration: details (live camera photo, personal, contact, audition) → ₹590 (incl. GST) payment through Razorpay → confirmation with a Registration ID. Code: `src/pages/Register.jsx` and `src/register/`.

The API lives in **`backend/`** (Node + Express):

```bash
cd backend && npm install && cp .env.example .env   # once
npm run api      # from the project root: API on http://localhost:4000 (Vite proxies /api and /uploads to it)
npm run dev      # in another terminal: website on http://localhost:5173
```

| Endpoint | Purpose |
|---|---|
| `GET /api/config` | Fee, deadline, closed flag |
| `POST /api/registrations` | Validate + save (status `PENDING_PAYMENT`), photo saved to `backend/uploads/` |
| `GET /api/registrations/:id` | Registration status (personal details masked) |
| `GET /api/registrations` | Admin list — header `x-admin-token: ADMIN_TOKEN`; UI at `/register/?admin` |
| `POST /api/payments/order` | Creates a Razorpay order (or a mock order with no keys) |
| `POST /api/payments/verify` | Verifies the HMAC signature, marks `COMPLETED`, sends the email |
| `POST /api/instagram/check` | Best-effort public/private check |

- **Payments:** with `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET` empty the site runs in **mock mode** (test button, no money). Set both keys for real payments; mock payments are then refused.
- **Email:** set `SMTP_*` and `MAIL_FROM`; without SMTP the email is only printed to the console.
- **Data:** `backend/data/registrations.json` (JSON file DB). `backend/schema.sql` is the MySQL table for later.
- **Deadline/fee:** `REGISTRATION_DEADLINE` and `REGISTRATION_FEE` in `backend/.env` (keep `src/register/config.js` defaults in sync).
- **Production:** `npm run build` then `npm start` — Express serves `dist/` with gzip, 1-year caching for hashed assets, `no-cache` HTML, `no-store` API and 30-day photo caching. The camera needs HTTPS. A static-only host (Vercel/Netlify) cannot run the API; host the backend on a Node server (or point `/api` to one).

## Registration form

The “Notify me” form in `src/sections/Notify.jsx` validates input and shows a confirmation, but **does not send data anywhere yet**. Connect it at the `TODO` in `onSubmit` (API endpoint, Google Sheet, CRM). Also update the Privacy Policy if data goes to a new third party.

---

## SEO, AEO & GEO

| Area | Implementation |
|---|---|
| Server-rendered HTML | `scripts/prerender.mjs` renders each route with `react-dom/server` |
| Metadata | `title`, `description`, `canonical`, `robots`, Open Graph, Twitter card per page (`src/seo.js`) |
| Structured data | `Organization`, `WebSite`, `WebPage` on all pages; `BreadcrumbList` on inner pages |
| Sitemap | Generated at build: canonical, indexable 200-status URLs only |
| robots.txt | Allows search + AI crawlers; blocks `/admin/`, `/login/`, `/dashboard/`, `/api/`, `/staging/`, `/private/` and `?` parameter URLs |
| AI files | `llms.txt`, `llms-full.txt`, `full-llms.txt` |
| 404 | Custom page, `noindex`, real HTTP 404 (no redirect to home) |
| Redirects | Single-hop 301s in `vercel.json` / `public/_redirects` |
| Images | WebP + fallback, `width`/`height` set, LCP logo preloaded and not lazy-loaded, others lazy |
| Staging | `npm run build:staging` → every page `noindex, nofollow`, robots.txt `Disallow: /`, no sitemap |

Change the domain in **`src/seo.js` (`SITE.url`)**, `public/robots.txt` and the `public/llms*.txt` files.

---

## Deployment

Upload `dist/` to any static host. Host settings that matter:

- **No SPA fallback.** Do not rewrite unknown URLs to `index.html` with status 200, or missing pages will return 200 instead of 404. Pages already exist as real files (`about/index.html`, …).
- Serve `404.html` for missing paths with status **404** (Netlify, Vercel and Cloudflare Pages do this automatically).
- Force **HTTPS** and choose **one** preferred domain (redirect `www` ↔ apex with a 301).

**Vercel:** `vercel.json` is included (trailing slashes, redirects, headers). Build command `npm run build`, output directory `dist`.
**Netlify / Cloudflare Pages:** `public/_redirects` and `public/_headers` are copied into `dist/`. Build command `npm run build`, publish directory `dist`.

---

## Accessibility & motion

- All animations respect `prefers-reduced-motion`.
- 3D tilt effects only run with a mouse (`pointer: fine`).
- The 3D hero (`GoldStage`) is lazy-loaded so it doesn’t delay first paint.

---

## Before launch — checklist

- [ ] Confirm the domain (`indiasnextdancer.com`) and support email (`support@indiasnextdancer.com`)
- [ ] Legal review of Privacy Policy and Terms & Conditions
- [ ] Connect the registration form to a backend
- [ ] Configure HTTPS, preferred domain and no SPA fallback on the host
- [ ] Submit `https://indiasnextdancer.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools
- [ ] Test pages in Google’s Rich Results Test and PageSpeed Insights

---

© 2026 KGIL Productions. All rights reserved.
