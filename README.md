# Harvest Town Calculator (HT Calculator)

Unofficial, player-made calculators for the mobile game [Harvest Town](https://play.google.com/store/apps/details?id=com.harvest.android.gr): crop profits, animal payback, fish prices and NPC gifts - built with [Astro](https://astro.build), fully static, no client framework.

## Tools

| Tool                               | What it does                                                                                                                  |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `/tools/crop-profit-calculator/`   | Ranks all 32 crops by gold/day for your season, quality tier, window, plots and Manor level - models regrowth and replanting. |
| `/tools/animal-profit-calculator/` | Daily product income, feed economics and payback time for all 9 ranch animals; editable product prices.                       |
| `/tools/fishing-price-guide/`      | All 76 fish: price, location, season, time, weather, bait, level, fishing exp and coins-per-XP; filterable/sortable.          |
| `/tools/gift-planner/`             | Per-NPC gift preferences (favorites/likes/dislikes/quest items), reverse item search, and the full birthday calendar.         |

Plus guides (`/guides/`), trust pages (about, methodology, contact, changelog) and legal pages. 18 pages total, all server-rendered.

## Data

All game values come from the community [Harvest Town Wiki](https://harvest-town.fandom.com) (see `docs/seo/fact-check.md` for every source, conflict and gap). The dataset lives in typed modules:

- `src/data/crops.ts` - 32 crops (prices ×4 quality tiers, growth, regrow, harvest caps, seeds, unlocks)
- `src/data/animals.ts` - 9 animals
- `src/data/fish.ts` - 76 fish
- `src/data/npcs.ts` - 39 NPCs + birthdays

Known gaps (feather prices, a few seed prices and price tiers) are surfaced as "?" with user-editable inputs - never invented.

Game icons (159 WebP files) are in `public/icons/`, sourced from the wiki for identification; see the footer credit and `/disclaimer/`.

## Develop

```bash
npm install
npm run dev # http://localhost:4321
npm run build # static output in dist/
npm run preview # serve dist/
```

## Deploy checklist (before going live)

Domain is set to `https://harvesttowncalc.top` in `astro.config.mjs`, `src/config.ts`, `public/robots.txt` and the contact email (`src/utils/seo.ts`, contact/privacy pages). To change it later, update those spots and rebuild.

1. Register `harvesttowncalc.top` and create the `hello@harvesttowncalc.top` mailbox (it is published on the contact, privacy and Organization JSON-LD).
2. `npm run build`, deploy `dist/` to any static host (Netlify/Vercel/Cloudflare Pages); force HTTPS and pick one canonical host (non-www), 301-redirecting www and http.
3. Verify: 404 returns real 404, `robots.txt` reachable, `sitemap-index.xml` valid, canonicals show the final URL.
4. Validate JSON-LD (Rich Results Test) on home, one tool page, one guide.
5. Submit the sitemap in Google Search Console and Bing Webmaster Tools; request indexing for `/`, `/tools/` and the four tool pages.
6. Optional: wire `window.htq` (see the inline stub in `src/layouts/Base.astro`) to GA4/Plausible using the event plan below. Events already fire on tool usage.

## Analytics event plan (already instrumented)

`tool_start` (first interaction per tool), `tool_complete` (with `tool_name`, inputs and top result). Extend with `result_copy`, `share`, `tool_error` as those actions are added.

## Project layout

```
src/
 config.ts site + tool registry (change domain here)
 data/ generated game-data modules (from wiki exports)
 utils/ crop-math.ts (shared by build & client), seo.ts (meta/JSON-LD)
 layouts/Base.astro full SEO head, header/footer, analytics stub
 components/ Breadcrumbs, FAQ, RelatedTools, TrustBlock, …
 pages/ all 18 routes
 scripts/ per-tool client logic (vanilla TS)
docs/seo/ site architecture, keyword map, fact-check table
```

## Updating game data

Re-extract from the wiki (MediaWiki API), regenerate `src/data/*.ts`, bump `dataVersion` in `src/config.ts`, and log the change in `/changelog/`. Dates only change with substantive updates.
