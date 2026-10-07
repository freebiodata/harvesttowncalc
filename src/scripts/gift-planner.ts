interface Npc {
  name: string;
  group: string;
  portrait: string;
  birthday: string | null;
  favorites: string[];
  likes: string[];
  dislikes: string[];
  questItems: string[];
}

const el = <T extends HTMLElement>(id: string) =>
  document.getElementById(id) as T;
const dataEl = document.getElementById("npc-data");

if (dataEl) {
  const npcs = JSON.parse(dataEl.textContent || "[]") as Npc[];
  const mode = el<HTMLSelectElement>("g-mode");
  const npcSel = el<HTMLSelectElement>("g-npc");
  const itemInput = el<HTMLInputElement>("g-item");
  const npcField = el<HTMLElement>("g-npc-field");
  const itemField = el<HTMLElement>("g-item-field");
  const result = el<HTMLElement>("g-result");
  let started = false;

  function trackStart() {
    if (!started) {
      started = true;
      window.htq?.("event", "tool_start", { tool_name: "gift_planner" });
    }
  }

  function card(title: string, items: string[], empty: string): string {
    return `<div class="tool-card" style="display:block;">
 <p><strong>${title}</strong></p>
 <p>${items.length ? items.join(", ") : empty}</p>
 </div>`;
  }

  function showNpc(n: Npc) {
    result.innerHTML = `
 <div style="display:flex; align-items:center; gap:14px; margin:10px 0 14px;">
 <img src="/icons/${n.portrait}" width="72" height="72" alt="${n.name} portrait" style="border-radius:10px; background:var(--cream-dark);" />
 <div>
 <h2 style="margin:0;">${n.name}</h2>
 <p class="muted" style="margin:0;">${n.group}${n.birthday ? " · 🎂 Birthday: " + n.birthday : ""} · Fondness: favorites +87~92, likes +43~47</p>
 </div>
 </div>
 <div class="grid-cards">
 ${card("❤️ Favorites (+87~92)", n.favorites, "Not documented on the wiki yet")}
 ${card("👍 Likes (+43~47)", n.likes, "Not documented yet")}
 ${card("👎 Dislikes (-10)", n.dislikes, "None documented")}
 ${n.questItems.length ? card("📦 Quest items", n.questItems, "") : ""}
 </div>`;
  }

  function showItem(query: string) {
    const q = query.trim().toLowerCase();
    if (!q) return;
    const favorites = npcs.filter((n) =>
      n.favorites.some((i) => i.toLowerCase() === q),
    );
    const likes = npcs.filter((n) =>
      n.likes.some((i) => i.toLowerCase() === q),
    );
    const dislikes = npcs.filter((n) =>
      n.dislikes.some((i) => i.toLowerCase() === q),
    );
    const exact = favorites.length + likes.length + dislikes.length > 0;
    const f2 = exact
      ? favorites
      : npcs.filter((n) =>
          n.favorites.some((i) => i.toLowerCase().includes(q)),
        );
    const l2 = exact
      ? likes
      : npcs.filter((n) => n.likes.some((i) => i.toLowerCase().includes(q)));
    const d2 = exact
      ? dislikes
      : npcs.filter((n) => n.dislikes.some((i) => i.toLowerCase().includes(q)));
    result.innerHTML = `
 <div style="margin:10px 0 14px;">
 <h2 style="margin:0;">“${query.trim()}” as a gift</h2>
 <p class="muted" style="margin:2px 0 0;">${exact ? "Exact item match" : "Partial match - pick the exact name from the suggestion list for precise results"}</p>
 </div>
 <div class="grid-cards">
 ${card(
   "❤️ Would love it (+87~92)",
   f2.map((n) => n.name),
   "Nobody in the current data",
 )}
 ${card(
   "👍 Would like it (+43~47)",
   l2.map((n) => n.name),
   "Nobody in the current data",
 )}
 ${card(
   "👎 Would dislike it (-10)",
   d2.map((n) => n.name),
   "Nobody in the current data",
 )}
 </div>`;
  }

  function render() {
    trackStart();
    if (mode.value === "npc") {
      const n = npcs.find((x) => x.name === npcSel.value);
      if (n) {
        showNpc(n);
        window.htq?.("event", "tool_complete", {
          tool_name: "gift_planner",
          mode: "npc",
          npc: n.name,
        });
      }
    } else {
      showItem(itemInput.value);
      window.htq?.("event", "tool_complete", {
        tool_name: "gift_planner",
        mode: "item",
        query: itemInput.value.trim().slice(0, 40),
      });
    }
  }

  mode.addEventListener("change", () => {
    const itemMode = mode.value === "item";
    itemField.hidden = !itemMode;
    npcField.hidden = itemMode;
    render();
  });
  npcSel.addEventListener("change", render);
  let debounce = 0;
  itemInput.addEventListener("input", () => {
    clearTimeout(debounce);
    debounce = window.setTimeout(render, 200);
  });
}
