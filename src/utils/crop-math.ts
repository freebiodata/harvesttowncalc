import type { Crop } from "../data/crops";

export type Quality = "basic" | "good" | "great" | "best";

export const QUALITY_LABEL: Record<Quality, string> = {
  basic: "Basic",
  good: "Good (white star)",
  great: "Great (gold star)",
  best: "Best (purple star)",
};

export interface CropPlan {
  crop: Crop;
  plantings: number;
  harvests: number;
  yieldCoins: number;
  seedCost: number | null; // null = seed price unknown (not sold at the Grocery)
  profit: number;
  profitPerDay: number;
  daysUsed: number;
  priceUsed: number | null;
  priceFallback: boolean; // true when the chosen quality tier is missing on the wiki
}

export function priceFor(
  crop: Crop,
  quality: Quality,
): { price: number | null; fallback: boolean } {
  const tiers: Record<Quality, number | null> = {
    basic: crop.sellBasic,
    good: crop.sellGood,
    great: crop.sellGreat,
    best: crop.sellBest,
  };
  const p = tiers[quality];
  if (p !== null && p !== undefined) return { price: p, fallback: false };
  return { price: crop.sellBasic, fallback: true };
}

/**
 * Model a field plot over `days` days: plant, harvest (multi-harvest crops
 * regrow every `regrowDays` up to `maxHarvests`), replant when the crop is
 * done, stop when fewer than `growthDays` remain. Returns coins per plot.
 */
export function planCrop(crop: Crop, days: number, quality: Quality): CropPlan {
  let remaining = days;
  let plantings = 0;
  let harvests = 0;
  let daysUsed = 0;
  const guard = 200;
  while (remaining >= crop.growthDays && plantings < guard) {
    let h: number;
    let span: number;
    if (crop.multiHarvest && crop.regrowDays) {
      const maxH = crop.maxHarvests ?? 5;
      h = Math.min(
        maxH,
        1 + Math.floor((remaining - crop.growthDays) / crop.regrowDays),
      );
      span = crop.growthDays + (h - 1) * crop.regrowDays;
    } else {
      h = 1;
      span = crop.growthDays;
    }
    plantings += 1;
    harvests += h;
    daysUsed += span;
    remaining -= span;
  }
  const { price, fallback } = priceFor(crop, quality);
  const yieldCoins = price !== null ? harvests * price : 0;
  const seedCost = crop.seedCost !== null ? plantings * crop.seedCost : null;
  const profit = yieldCoins - (seedCost ?? 0);
  return {
    crop,
    plantings,
    harvests,
    yieldCoins,
    seedCost,
    profit,
    profitPerDay: days > 0 ? profit / days : 0,
    daysUsed,
    priceUsed: price,
    priceFallback: fallback,
  };
}

export function rankCrops(
  crops: Crop[],
  opts: {
    season: string;
    days: number;
    quality: Quality;
    maxUnlock: number | null;
  },
): CropPlan[] {
  return crops
    .filter((c) =>
      opts.season === "All"
        ? true
        : c.season === opts.season || c.season === "Any",
    )
    .filter((c) =>
      opts.maxUnlock === null || c.unlockLevel === null
        ? true
        : c.unlockLevel <= opts.maxUnlock,
    )
    .map((c) => planCrop(c, opts.days, opts.quality))
    .sort((a, b) => b.profitPerDay - a.profitPerDay);
}
