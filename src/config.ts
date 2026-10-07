/**
 * Central site configuration. Change the values here once and every
 * title, canonical, JSON-LD node and footer picks them up.
 */
export const SITE = {
  name: "Harvest Town Calculator",
  shortName: "HT Calculator",
  tagline:
    "Free calculators for Harvest Town: crops, animals, fishing and gifts",
  description:
    "Free Harvest Town profit calculators. Compare crop gold per day, animal payback times, fish prices and NPC favorite gifts - all data verified against the community wiki.",
  url: "https://harvesttowncalc.top",
  dataVersion: "2026-10-07",
  dataSources: [
    { label: "Crops", url: "https://harvest-town.fandom.com/wiki/Crops" },
    {
      label: "Livestock",
      url: "https://harvest-town.fandom.com/wiki/Livestock",
    },
    { label: "Fish", url: "https://harvest-town.fandom.com/wiki/Fish" },
    {
      label: "NPC Gifts Table",
      url: "https://harvest-town.fandom.com/wiki/NPC_Gifts_Table",
    },
    {
      label: "Birthdays",
      url: "https://harvest-town.fandom.com/wiki/Birthdays",
    },
    {
      label: "Grocery (seed prices)",
      url: "https://harvest-town.fandom.com/wiki/Grocery",
    },
  ],
} as const;

export const TOOLS = [
  {
    slug: "crop-profit-calculator",
    name: "Crop Profit Calculator",
    short: "Crop profits",
    oneLiner:
      "Rank every crop by gold per day for your season, quality and field size.",
    icon: "Biluochun.webp",
  },
  {
    slug: "animal-profit-calculator",
    name: "Animal Profit Calculator",
    short: "Animal profits",
    oneLiner:
      "See daily product income per animal and how many days until it pays for itself.",
    icon: "Chicken.webp",
  },
  {
    slug: "fishing-price-guide",
    name: "Fishing Price Guide",
    short: "Fishing prices",
    oneLiner:
      "All 76 fish with price, location, season, bait and coins-per-XP efficiency.",
    icon: "River_Fish_King.webp",
  },
  {
    slug: "gift-planner",
    name: "NPC Gift Planner",
    short: "Gift planner",
    oneLiner:
      "Look up any NPC’s favorite gifts, or find out who wants the item in your hand.",
    icon: "NPC_NewPortrait_Fay.webp",
  },
] as const;

export const GUIDES = [
  {
    slug: "best-crops-per-season",
    name: "The Best Crops for Every Season in Harvest Town",
    oneLiner:
      "Spring, summer, autumn and winter winners by gold per day, with unlock levels.",
  },
  {
    slug: "money-making-guide",
    name: "How to Make Money in Harvest Town",
    oneLiner:
      "Crops vs animals vs fishing compared, with the numbers behind each.",
  },
] as const;
