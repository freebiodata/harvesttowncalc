interface Fish {
  name: string;
  icon: string;
  location: string;
  seasons: string[];
  time: string;
  weather: string;
  bait: string;
  level: number;
  price: number;
  exp: number;
}

const el = <T extends HTMLElement>(id: string) =>
  document.getElementById(id) as T;
const dataEl = document.getElementById("fish-data");

if (dataEl) {
  const fish = JSON.parse(dataEl.textContent || "[]") as Fish[];
  const loc = el<HTMLSelectElement>("fi-loc");
  const season = el<HTMLSelectElement>("fi-season");
  const level = el<HTMLInputElement>("fi-level");
  const sort = el<HTMLSelectElement>("fi-sort");
  const tbody = el<HTMLTableSectionElement>("fish-tbody");
  let started = false;

  const fmt = (n: number) => n.toLocaleString("en-US");

  function render() {
    const lvRaw = level.value.trim();
    const lv = lvRaw === "" ? null : Math.max(0, parseInt(lvRaw, 10) || 0);
    let rows = fish.filter(
      (f) =>
        (loc.value === "All" || f.location === loc.value) &&
        (season.value === "All" || f.seasons.includes(season.value)) &&
        (lv === null || f.level <= lv),
    );
    const key = sort.value;
    rows = [...rows].sort((a, b) => {
      if (key === "price") return b.price - a.price;
      if (key === "eff") return b.price / b.exp - a.price / a.exp;
      if (key === "exp") return b.exp - a.exp;
      return a.name.localeCompare(b.name);
    });

    if (!started) {
      started = true;
      window.htq?.("event", "tool_start", { tool_name: "fishing_price_guide" });
    }

    tbody.innerHTML =
      rows
        .map(
          (f, i) => `<tr${i < 3 ? ' class="top"' : ""}>
 <td><span class="item-cell"><img src="/icons/${f.icon}" width="32" height="32" alt="${f.name} icon" loading="lazy" />${f.name}</span></td>
 <td class="muted">${f.location}</td>
 <td>${f.seasons.length ? f.seasons.join(", ") : "Any"}</td>
 <td class="muted">${f.time}</td>
 <td class="muted">${f.weather}</td>
 <td>${f.bait}</td>
 <td class="num">${f.level}</td>
 <td class="num"><strong>${fmt(f.price)}</strong></td>
 <td class="num">${f.exp}</td>
 <td class="num">${f.exp ? (f.price / f.exp).toFixed(1) : "-"}</td>
 </tr>`,
        )
        .join("") ||
      '<tr><td colspan="10">No fish match these filters.</td></tr>';

    el<HTMLElement>("fi-count").textContent = String(rows.length);
    const top = [...rows].sort((a, b) => b.price - a.price)[0];
    const eff = [...rows]
      .filter((f) => f.exp > 0)
      .sort((a, b) => b.price / b.exp - a.price / a.exp)[0];
    el<HTMLElement>("fi-top").textContent = top ? fmt(top.price) : "-";
    el<HTMLElement>("fi-eff").textContent = eff
      ? (eff.price / eff.exp).toFixed(1)
      : "-";
    el<HTMLElement>("fi-note").textContent =
      `${rows.length} of ${fish.length} fish · base prices · ${loc.value === "All" ? "all locations" : loc.value}${season.value !== "All" ? " · " + season.value : ""}${lv !== null ? " · level ≤ " + lv : ""}`;
    window.htq?.("event", "tool_complete", {
      tool_name: "fishing_price_guide",
      location: loc.value,
      season: season.value,
      sort: key,
    });
  }

  [loc, season, sort].forEach((s) => s.addEventListener("change", render));
  level.addEventListener("input", render);
}
