/**
 * Ranch animals with prices, buildings, feed and products.
 *
 * Source: Harvest Town Wiki (https://harvest-town.fandom.com), community-maintained.
 * Verified: 2026-10-07. Game version: HT 2.x values as published on the wiki.
 * Conflicts and gaps are flagged per row in the `notes` field - see /methodology/.
 * This file is generated from wiki exports; edit the pipeline, not the rows.
 */
export interface AnimalProduct {
  name: string;
  sellBasic: number | null; // coins per unit, basic quality; null = not published on the wiki yet
}

export interface Animal {
  name: string;
  icon: string;
  price: number;
  building: string;
  feed: string;
  products: AnimalProduct[];
  description: string;
  notes: string | null;
}

export const animals: Animal[] = [
  {
    name: "Chicken",
    icon: "Chicken.webp",
    price: 500,
    building: "Poultry House Level 1",
    feed: "Poultry Feed",
    products: [
      {
        name: "Egg",
        sellBasic: 20,
      },
    ],
    description:
      "Robust chicken with strong immunity and high egg production rate.",
    notes: "Egg produced once a day when fed (wiki: Egg page).",
  },
  {
    name: "Duck",
    icon: "Duck.webp",
    price: 900,
    building: "Adv. Poultry House",
    feed: "Poultry Feed",
    products: [
      {
        name: "Duck Egg",
        sellBasic: 31,
      },
      {
        name: "Duck Feather",
        sellBasic: null,
      },
    ],
    description: "Small-sized and swift duck with high egg production rate.",
    notes:
      "Produces a Duck Egg and a Duck Feather once a day when fed (wiki: Duck Feather page).",
  },
  {
    name: "Goose",
    icon: "Goose.webp",
    price: 1500,
    building: "Luxury Poultry House",
    feed: "Poultry Feed",
    products: [
      {
        name: "Goose Egg",
        sellBasic: 43,
      },
      {
        name: "Goose Feather",
        sellBasic: null,
      },
    ],
    description:
      "Long neck, flat and wide beak, long legs, short tail, high goose egg production rate.",
    notes: null,
  },
  {
    name: "Peacock",
    icon: "Peacock.webp",
    price: 2800,
    building: "Luxury Poultry House",
    feed: "Poultry Feed",
    products: [
      {
        name: "Peacock Feather",
        sellBasic: null,
      },
    ],
    description:
      "Blue peacock with fabulous feather suitable for making decoration.",
    notes: null,
  },
  {
    name: "Cow",
    icon: "Cow.webp",
    price: 600,
    building: "Barn",
    feed: "Livestock Feed",
    products: [
      {
        name: "Milk",
        sellBasic: 20,
      },
    ],
    description: "Black and white cow with high milk production rate.",
    notes: "Milk produced once a day when fed (wiki: Milk page).",
  },
  {
    name: "Goat",
    icon: "Goat.webp",
    price: 1100,
    building: "Adv. Barn",
    feed: "Livestock Feed",
    products: [
      {
        name: "Ewe's Milk",
        sellBasic: null,
      },
    ],
    description:
      "Milk-yielding goat that has good adaptability. Easy to raise, requires not much fine forage.",
    notes: "Ewes' Milk produced once a day when fed (wiki: Ewes' Milk page).",
  },
  {
    name: "Sheep",
    icon: "Sheep.webp",
    price: 1900,
    building: "Luxury Barn",
    feed: "Livestock Feed",
    products: [
      {
        name: "Wool",
        sellBasic: 49,
      },
    ],
    description:
      "Covered with dense fine wool which is excellent raw material for fine textile.",
    notes: null,
  },
  {
    name: "Piggy",
    icon: "Piggy.webp",
    price: 800,
    building: "Adv. Barn",
    feed: "Livestock Feed",
    products: [],
    description:
      "Big ears and head, straight nose, narrow waist and back. They propagate really fast!",
    notes: null,
  },
  {
    name: "Alpaca",
    icon: "Alpaca.webp",
    price: 2300,
    building: "Luxury Barn",
    feed: "Livestock Feed",
    products: [
      {
        name: "Alpaca Hair",
        sellBasic: null,
      },
    ],
    description:
      "Well-tamed, clever enough to understand human. Its bright and elastic hair is a good material for premium woolen.",
    notes: null,
  },
];
