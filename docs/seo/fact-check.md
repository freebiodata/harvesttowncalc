# Fact-Check Table - Game Data

Per the Tool Website SEO Master Prompt (Sections 3.3 and 6.7): every number on the site is either transcribed from the cited source or marked as a gap. Verified against the Harvest Town Wiki on **2026-10-07** via the MediaWiki API (page wikitext, not screenshots).

## Sources

| Source page                                                   | What it provides                                                                                                                                     | Retrieved  |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| https://harvest-town.fandom.com/wiki/Crops                    | 32 crops: season, type, unlock level, growth days, multi flag, base + Good/Great/Best sell prices; community "order" (gold/day) and lifespan columns | 2026-10-07 |
| Per-crop item pages (e.g. `/wiki/Bean`)                       | grow days, regrow interval, max harvests ("up to 5 times"), sell tier overrides                                                                      | 2026-10-07 |
| https://harvest-town.fandom.com/wiki/Grocery                  | 35 seed prices + unlock levels                                                                                                                       | 2026-10-07 |
| https://harvest-town.fandom.com/wiki/Livestock                | 9 animals: price, building, feed, products, descriptions                                                                                             | 2026-10-07 |
| Item pages (Egg, Milk, Duck Egg, Goose Egg, Ewes' Milk, Wool) | product sell prices, per-day production rate                                                                                                         | 2026-10-07 |
| https://harvest-town.fandom.com/wiki/Fish                     | 76 fish: location, seasons, time, weather, bait, level, price, exp                                                                                   | 2026-10-07 |
| https://harvest-town.fandom.com/wiki/NPC_Gifts_Table          | 39 NPCs: favorites (+87~92), likes (+43~47), dislikes (-10), quest items                                                                             | 2026-10-07 |
| https://harvest-town.fandom.com/wiki/Birthdays                | 31 NPC birthdays by season/day                                                                                                                       | 2026-10-07 |

## Verified claims sample (full data lives in `src/data/*.ts`)

| Claim                                                                          | Evidence                           | Status                       |
| ------------------------------------------------------------------------------ | ---------------------------------- | ---------------------------- |
| Jinjunmei is the best winter crop (wiki ranking 21.64 gold/day)                | Crops page "Selling value" section | verified                     |
| Biluochun: 4 days grow, regrow 2 d, ≤5 harvests, Best 72, seed 25, Manor Lv 19 | Biluochun page + Grocery           | verified                     |
| Multi-harvest crops regrow "up to 5 times" (typical)                           | each crop page intro               | verified                     |
| Chicken 500 coins, Egg 20/24 (basic/good), ~1 egg/day when fed                 | Livestock + Egg pages              | verified                     |
| River Fish King 5,732 coins, Manor River, summer, 17:00-03:00 rainy, Lv 40     | Fish page                          | verified                     |
| Birthday gifts ×2 fondness; favorites +87~92                                   | NPC Gifts Table preamble           | verified                     |
| Seasons are 28 days                                                            | Crops page raw-data note           | verified                     |
| Crop death from no watering disabled by developers                             | Crops page Watering section        | verified (as wiki statement) |

## Known conflicts (flagged, not hidden)

| Item             | Conflict                              | Resolution                                                                                                                          |
| ---------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Bean growth days | Detail page says 3; crop table says 2 | Detail page used (3); noted in `crops.ts` and changelog. Detail page is also consistent with the wiki's own lifespan (3 + 4×2 = 11) |

## Known gaps (shown as "?" in tools, user-editable - never invented)

| Gap                                                                                      | Affected tool                                               |
| ---------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Seed prices: Wheat, Tomato, Sunflower, Napa Cabbage                                      | Crop calculator (override inputs)                           |
| Sell prices: Duck Feather, Goose Feather, Peacock Feather, Alpaca Hair                   | Animal calculator (override inputs)                         |
| Some Good/Great price tiers (e.g. Jinjunmei Good, Cotton Good/Great, Pumpkin Good/Great) | Crop calculator falls back to base price                    |
| Unlock levels marked "TBA" on wiki (Napa Cabbage, Tomato, Sunflower, Jinjunmei, Pu'er)   | Filters treat as unknown                                    |
| Star-quality fish prices                                                                 | Fishing guide states base-only                              |
| Catch rate per cast                                                                      | Not computable from published data; explicitly not modelled |

## Computed values (our formulas, documented on /methodology/)

- Gold/day, harvests, plantings, profit - crop simulation over the user's window (formula on `/methodology/`).
- Coins per XP = price ÷ exp.
- Payback = price ÷ daily profit; net over window = profit×days - buy price.
- Wiki's own "order" column values are displayed as reference where noted (best-crops guide), with the difference explained.

## Icon licensing

159 crop/animal/fish icons and NPC portraits downloaded from the Harvest Town Wiki (Fandom CDN, WebP derivatives). Used for identification under fair use, credited in the footer and on `/disclaimer/`, with a takedown path via `/contact/`. Not affiliated with the rights holder.
