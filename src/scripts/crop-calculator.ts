import { rankCrops, type Crop, type Quality } from "../utils/crop-math";

interface CropRow {
  name: string;
  icon: string;
  season: string;
  unlockLevel: number | null;
  growthDays: number;
  regrowDays: number | null;
  maxHarvests: number | null;
  multiHarvest: boolean;
  seedCost: number | null;
  sellBasic: number | null;
  sellGood: number | null;
  sellGreat: number | null;
  sellBest: number | null;
}

const el = <T extends HTMLElement>(id: string) =>
  document.getElementById(id) as T;
const dataEl = document.getElementById("crop-data");
if (dataEl) {
  const crops = JSON.parse(dataEl.textContent || "[]") as CropRow[];
  const seedOverrides: Record<string, number> = {};

  const season = el<HTMLSelectElement>("f-season");
  const quality = el<HTMLSelectElement>("f-quality");
  const days = el<HTMLInputElement>("f-days");
  const plots = el<HTMLInputElement>("f-plots");
  const level = el<HTMLInputElement>("f-level");
  const tbody = el<HTMLTableSectionElement>("crop-tbody");
  const started = { value: false };

  const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
  const seasonClass = (s: string) => `chip season-${s.toLowerCase()}`;

  function currentCrops(): Crop[] {
    return crops.map((c) => ({
      ...c,
      seedCost: seedOverrides[c.name] ?? c.seedCost,
    })) as unknown as Crop[];
  }

  function readInt(
    input: HTMLInputElement,
    fallback: number,
    min: number,
    max: number,
  ): number {
    const v = parseInt(input.value, 10);
    if (Number.isNaN(v)) return fallback;
    return Math.max(min, Math.min(max, v));
  }

  function render() {
    const d = readInt(days, 28, 1, 336);
    const p = readInt(plots, 1, 1, 999);
    const lvRaw = level.value.trim();
    const lv = lvRaw === "" ? null : readInt(level, 99, 1, 99);
    const ranked = rankCrops(currentCrops(), {
      season: season.value,
      days: d,
      quality: quality.value as Quality,
      maxUnlock: lv,
    });

    if (!started.value) {
      started.value = true;
      window.htq?.("event", "tool_start", {
        tool_name: "crop_profit_calculator",
      });
    }

    const rows = ranked
      .map((r, i) => {
        const seedCell =
          r.seedCost === null
            ? '<span title="Seed price not published on the wiki">?</span>'
            : fmt(r.seedCost);
        return `<tr${i < 3 ? ' class="top"' : ""}>
 <td><span class="item-cell"><img src="/icons/${r.crop.icon}" width="32" height="32" alt="${r.crop.name} icon" loading="lazy" /><span>${r.crop.name}</span>${r.crop.multiHarvest ? `<span class="chip multi" title="Regrows every ${r.crop.regrowDays} days, up to ${r.crop.maxHarvests} harvests">multi</span>` : ""}</span></td>
 <td><span class="${seasonClass(r.crop.season)}">${r.crop.season}</span></td>
 <td class="num">${r.crop.growthDays}</td>
 <td class="num">${r.crop.regrowDays ?? "-"}</td>
 <td class="num">${r.harvests}</td>
 <td class="num">${seedCell}</td>
 <td class="num">${fmt(r.yieldCoins)}</td>
 <td class="num">${fmt(r.profit)}</td>
 <td class="num"><strong>${r.profitPerDay.toFixed(1)}</strong></td>
 <td class="num">${r.crop.unlockLevel === null ? "TBA" : "Lv " + r.crop.unlockLevel}</td>
 </tr>`;
      })
      .join("");
    tbody.innerHTML =
      rows ||
      '<tr><td colspan="10">No crops match - try another season or a higher Manor level.</td></tr>';

    if (ranked.length) {
      const b = ranked[0];
      el<HTMLElement>("s-best").textContent = b.crop.name;
      el<HTMLElement>("s-perday").textContent = b.profitPerDay.toFixed(1);
      el<HTMLElement>("s-total").textContent = fmt(b.profit);
      el<HTMLElement>("s-plots").textContent = fmt(b.profit * p);
      el<HTMLElement>("s-note").textContent =
        `Showing ${quality.options[quality.selectedIndex].text} prices over ${d} days. ${b.crop.name}: ${b.harvests} harvests from ${b.plantings} planting${b.plantings > 1 ? "s" : ""} in ${b.daysUsed} field-days.`;
      window.htq?.("event", "tool_complete", {
        tool_name: "crop_profit_calculator",
        season: season.value,
        quality: quality.value,
        days: d,
        plots: p,
        top_crop: b.crop.name,
      });
    }
  }

  [season, quality, days, plots, level].forEach((input) =>
    input.addEventListener("change", render),
  );
  [days, plots, level].forEach((input) =>
    input.addEventListener("input", render),
  );

  document
    .querySelectorAll<HTMLInputElement>("[data-seed-override]")
    .forEach((input) => {
      input.addEventListener("input", () => {
        const name = input.getAttribute("data-seed-override") || "";
        const v = parseInt(input.value, 10);
        if (!Number.isNaN(v) && v >= 0) seedOverrides[name] = v;
        else delete seedOverrides[name];
        render();
      });
    });
}
