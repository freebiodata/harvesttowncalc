interface AnimalProduct {
  name: string;
  sellBasic: number | null;
}
interface Animal {
  name: string;
  icon: string;
  price: number;
  building: string;
  feed: string;
  products: AnimalProduct[];
  description: string;
  notes: string | null;
}

const el = <T extends HTMLElement>(id: string) =>
  document.getElementById(id) as T;
const dataEl = document.getElementById("animal-data");

if (dataEl) {
  const animals = JSON.parse(dataEl.textContent || "[]") as Animal[];
  const priceOverrides: Record<string, number> = {}; // `${animal}::${product}` -> price

  const feedInput = el<HTMLInputElement>("a-feed");
  const windowInput = el<HTMLInputElement>("a-window");
  const tbody = el<HTMLTableSectionElement>("animal-tbody");
  let started = false;

  const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

  function compute() {
    const feed = Math.max(0, parseInt(feedInput.value, 10) || 0);
    const days = Math.max(
      1,
      Math.min(336, parseInt(windowInput.value, 10) || 28),
    );

    const results = animals.map((a) => {
      let revenue = 0;
      let missing = 0;
      for (const p of a.products) {
        const key = `${a.name}::${p.name}`;
        const price = priceOverrides[key] ?? p.sellBasic;
        if (price !== null && price !== undefined) revenue += price;
        else missing++;
      }
      const profitDay = revenue - feed;
      const payback = profitDay > 0 ? a.price / profitDay : null;
      const net = profitDay * days - a.price;
      return { a, revenue, missing, profitDay, payback, net };
    });

    if (!started) {
      started = true;
      window.htq?.("event", "tool_start", {
        tool_name: "animal_profit_calculator",
      });
    }

    tbody.innerHTML = results
      .map((r, i) => {
        const priceInputs = r.a.products
          .map((p) => {
            const key = `${r.a.name}::${p.name}`;
            const val = priceOverrides[key] ?? p.sellBasic;
            const id = `p-${r.a.name.replace(/[^a-z0-9]/gi, "")}-${p.name.replace(/[^a-z0-9]/gi, "")}`;
            return `<span class="item-cell" style="display:inline-flex; margin-right:10px;">
 <label class="visually-hidden" for="${id}">${p.name} sell price for ${r.a.name}</label>
 <input type="number" min="0" max="9999" step="1" value="${val ?? ""}"${val === null ? ` placeholder="${p.name}: not on wiki"` : ""} data-animal="${r.a.name}" data-product="${p.name}" style="width:110px; min-height:36px; padding:4px 8px; margin-right:6px;" id="${id}" />
 <span class="muted">${p.name}${val === null ? " ?" : ""}</span>
 </span>`;
          })
          .join("");
        const dash = r.a.products.length === 0;
        return `<tr${i < 3 ? ' class="top"' : ""}>
 <td><span class="item-cell"><img src="/icons/${r.a.icon}" width="32" height="32" alt="${r.a.name} icon" loading="lazy" /><span>${r.a.name}</span></span></td>
 <td class="num">${fmt(r.a.price)}</td>
 <td class="muted">${r.a.building}</td>
 <td>${dash ? '<span class="muted">breeder (no product)</span>' : priceInputs}</td>
 <td class="num">${dash ? "-" : fmt(r.revenue)}</td>
 <td class="num">${dash ? "-" : fmt(r.profitDay)}</td>
 <td class="num">${r.payback ? Math.round(r.payback) + " d" : "-"}</td>
 <td class="num">${dash ? "-" : fmt(r.net)}</td>
 </tr>`;
      })
      .join("");

    const withPayback = results
      .filter((r) => r.payback)
      .sort((a, b) => a.payback! - b.payback!);
    const bestDaily = [...results].sort((a, b) => b.profitDay - a.profitDay)[0];
    if (withPayback.length) {
      el<HTMLElement>("a-best").textContent = withPayback[0].a.name;
      el<HTMLElement>("a-best-days").textContent =
        Math.round(withPayback[0].payback!) + " d";
    }
    el<HTMLElement>("a-top-daily").textContent = fmt(
      Math.max(0, bestDaily.profitDay),
    );
    el<HTMLElement>("a-note").textContent =
      `Feed ${feed} coins/day, window ${days} days. Net = product income - feed - buy price.`;
    window.htq?.("event", "tool_complete", {
      tool_name: "animal_profit_calculator",
      feed,
      days,
    });

    // rebind the price inputs we just re-rendered
    tbody
      .querySelectorAll<HTMLInputElement>("[data-animal]")
      .forEach((input) => {
        input.addEventListener("input", onPriceInput);
      });
  }

  function onPriceInput(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const key = `${input.dataset.animal}::${input.dataset.product}`;
    const v = parseInt(input.value, 10);
    if (!Number.isNaN(v) && v >= 0) priceOverrides[key] = v;
    else delete priceOverrides[key];
    compute();
  }

  feedInput.addEventListener("input", compute);
  windowInput.addEventListener("input", compute);
  document
    .querySelectorAll<HTMLInputElement>("[data-animal]")
    .forEach((input) => {
      input.addEventListener("input", onPriceInput);
    });
}
