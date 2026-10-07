# Site Architecture Document - HT Calculator

Per the Tool Website SEO Master Prompt, Phase 3. This is the reference developers and editors work from.

## 1. Page inventory

| URL                                    | Page type                   | Cluster / primary keyword             | Intent            | Parent   | Click depth | Index                 | Release |
| -------------------------------------- | --------------------------- | ------------------------------------- | ----------------- | -------- | ----------- | --------------------- | ------- |
| `/`                                    | Home (brand + category hub) | harvest town calculator               | Do / Navigational | -        | 0           | index                 | v1      |
| `/tools/`                              | Category hub                | harvest town tools                    | Do (comparison)   | Home     | 1           | index                 | v1      |
| `/tools/crop-profit-calculator/`       | Tool                        | harvest town crop calculator          | Do                | /tools/  | 2           | index                 | v1      |
| `/tools/animal-profit-calculator/`     | Tool                        | harvest town animal profit calculator | Do                | /tools/  | 2           | index                 | v1      |
| `/tools/fishing-price-guide/`          | Tool                        | harvest town fish prices              | Do / Know         | /tools/  | 2           | index                 | v1      |
| `/tools/gift-planner/`                 | Tool                        | harvest town gift guide               | Do / Know         | /tools/  | 2           | index                 | v1      |
| `/guides/`                             | Category hub                | harvest town guides                   | Know              | Home     | 1           | index                 | v1      |
| `/guides/best-crops-per-season/`       | Guide (Article)             | harvest town best crops               | Know / Compare    | /guides/ | 2           | index                 | v1      |
| `/guides/money-making-guide/`          | Guide (Article)             | harvest town money making             | Know              | /guides/ | 2           | index                 | v1      |
| `/about/`                              | Trust                       | -                                     | Know              | Home     | 1           | index                 | v1      |
| `/methodology/`                        | Trust                       | -                                     | Know              | Home     | 1           | index                 | v1      |
| `/contact/`                            | Trust                       | -                                     | Do                | Home     | 1           | index                 | v1      |
| `/changelog/`                          | Trust                       | -                                     | Know              | Home     | 1           | index                 | v1      |
| `/privacy/` ` /terms/` ` /disclaimer/` | Legal                       | -                                     | Know              | Home     | 1           | index (never blocked) | v1      |
| `/sitemap/`                            | HTML sitemap                | -                                     | Utility           | Footer   | 1           | index, no XML entry   | v1      |
| `/404.html`                            | 404                         | -                                     | Utility           | -        | -           | noindex               | v1      |

Every tool ≤ 2 clicks from home; nothing deeper than 2. No orphans: every page is linked from the HTML sitemap, the footer, and its hub.

## 2. URL rules

- Lowercase, hyphenated, static, no parameters, trailing slash everywhere (`trailingSlash: 'always'`, `build.format: 'directory'`).
- Scheme: `/tools/[tool-slug]/`, `/guides/[guide-slug]/`, flat trust pages.
- Final before launch - changing slugs later requires 301s.

## 3. Navigation

- Header: brand → `/` (never `/index.html`); Tools, Guides, About, Methodology - real `<a href>` in initial HTML.
- Breadcrumbs on every page below home, matching URL hierarchy, marked up with `BreadcrumbList`.
- Footer: tools, guides, legal, HTML sitemap, fan-site disclaimer.
- In-page: tool pages end with Related tools (3 cards) and contextual links in copy; guides link to tools at the point of need.

## 4. Index-control matrix

| URL type                                    | Robots meta                     | Canonical      | XML sitemap                           |
| ------------------------------------------- | ------------------------------- | -------------- | ------------------------------------- |
| All content pages                           | `index, follow`                 | self, absolute | yes (`@astrojs/sitemap`)              |
| `/404.html`                                 | `noindex, follow`               | self           | no (not generated as page in sitemap) |
| Tool result states (client-side re-renders) | not URL states                  | -              | -                                     |
| Query/filter states                         | none exist (no URL params used) | -              | -                                     |

`robots.txt` allows everything, references `sitemap-index.xml`. No `Noindex:` directive in robots.txt. Tool interactions never change the URL - result states are not landing pages by design.

## 5. Structured data per template

- Home: `Organization` + `WebSite`.
- All subpages: `BreadcrumbList`.
- Tool pages: `WebApplication` (name, url, description, `applicationCategory: GameApplication`, `operatingSystem: Any`, `offers.price: 0`). No `aggregateRating` - none is real; adding one would be structured-data abuse.
- Guides: `Article` with author Person, dates.
- Validate before launch with the Rich Results Test (per prompt Section 7).

## 6. Rendering & performance

- Astro static output: every indexable page's full content (H1, tables, FAQs, links, JSON-LD) is in the initial server HTML - verified by build-output inspection.
- Client JS is small, bundled, deferred; no framework runtime, no webfonts (system stack), icons are self-hosted WebP (~700 KB total, lazy-loaded below the fold).
- Budget targets: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 (all images carry width/height).

## 7. International

English-only at launch. If localized later: language subfolders (`/es/`…), native-speaker review, reciprocal hreflang with `x-default`, per the prompt Phase 3 Step 10. No `?lang=` parameters.

## 8. Variant Page Test - results

No variant pages exist at launch. Candidate variants considered and **rejected** (handled as options/sections instead):

- "Crop calculator for spring/summer/…/greenhouse" - one page with a season selector; no evidence of distinct SERPs yet (`[NEEDS DATA]`).
- "Fish prices for [location]" - filterable column in one guide.
- "[NPC name] gifts" pages - one planner with per-NPC deep links possible later if demand data appears.
