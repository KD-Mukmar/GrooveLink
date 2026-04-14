// =============================================
// events.js — GrooveLink Events Page
// Supabase fetch, spotlight card, image support,
// category badges, clickable cards, date sorting
// =============================================

window.addEventListener("DOMContentLoaded", async function () {
  const container     = document.getElementById("event-cards-container");
  const spotlightWrap = document.getElementById("spotlight-container");

  // ── Helpers ──────────────────────────────────────────────────────────────
  function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" });
  }

  function categoryClass(cat) {
    const map = {
      "Hip Hop":      "cat-hip-hop",
      "Ballet":       "cat-ballet",
      "Contemporary": "cat-contemporary",
      "Cultural":     "cat-cultural",
      "Other":        "cat-other",
    };
    return map[cat] || "cat-other";
  }

  // ── Fetch all approved events ─────────────────────────────────────────────
  let allEvents = [];
  try {
    const { data, error } = await window._supabase
      .from("events")
      .select("*")
      .eq("approved", true)
      .order("date", { ascending: true });

    if (error) throw error;
    allEvents = data;
  } catch (err) {
    console.error("Supabase fetch error:", err);
    container.innerHTML = `<p style="color:#ff6b6b; text-align:center; grid-column:1/-1;">Could not load events. Please try again later.</p>`;
    return;
  }

  // ── Spotlight: next upcoming event ───────────────────────────────────────
  const today    = new Date().toISOString().split("T")[0];
  const upcoming = allEvents.filter(ev => ev.date >= today);
  const spotlight = upcoming[0];

  if (spotlight && spotlightWrap) {
    spotlightWrap.innerHTML = `
      <p class="spotlight-label">⭐ Next Up</p>
      <div class="spotlight-card ${spotlight.link ? 'spotlight-card--clickable' : ''}" ${spotlight.link ? `onclick="window.open('${spotlight.link}', '_blank')" role="link" tabindex="0"` : ""}>
        ${spotlight.image_url
          ? `<img class="spotlight-card-image" src="${spotlight.image_url}" alt="${spotlight.name}" loading="lazy">`
          : `<div class="spotlight-card-placeholder">🎵</div>`
        }
        <div class="spotlight-card-body">
          <span class="event-category ${categoryClass(spotlight.category)}">${spotlight.category || "Event"}</span>
          <h3>${spotlight.name}</h3>
          <p>📍 ${spotlight.location}${spotlight.province ? ` · ${spotlight.province}` : ""}</p>
          <p>📅 ${formatDate(spotlight.date)}</p>
          <p style="margin-top:0.5rem;">${spotlight.description || ""}</p>
          ${spotlight.link ? `<span class="btn" style="margin-top:1rem; margin-left:0; cursor:pointer;">More Info →</span>` : ""}
        </div>
      </div>
    `;
  }

  // ── Display events — entire card is clickable ─────────────────────────────
  function displayEvents(list) {
    container.innerHTML = "";

    if (list.length === 0) {
      container.innerHTML = `<h4 style="color:#aaa; text-align:center; grid-column:1/-1;">No events found matching your search.</h4>`;
      return;
    }

    list.forEach((ev) => {
      const card = document.createElement("div");
      card.classList.add("event-card");

      // Make entire card clickable if there's a link
      if (ev.link) {
        card.classList.add("event-card--clickable");
        card.setAttribute("role", "link");
        card.setAttribute("tabindex", "0");
        card.style.cursor = "pointer";
        card.addEventListener("click", () => window.open(ev.link, "_blank", "noopener"));
        card.addEventListener("keydown", (e) => {
          if (e.key === "Enter") window.open(ev.link, "_blank", "noopener");
        });
      }

      card.innerHTML = `
        ${ev.image_url
          ? `<img class="event-card-image" src="${ev.image_url}" alt="${ev.name}" loading="lazy">`
          : `<div class="event-card-image-placeholder">🎵</div>`
        }
        <div class="event-card-body">
          <span class="event-category ${categoryClass(ev.category)}">${ev.category || "Event"}</span>
          <h3>${ev.name}</h3>
          <p>📍 ${ev.location}${ev.province ? ` · ${ev.province}` : ""}</p>
          <p>📅 ${formatDate(ev.date)}</p>
          <p>${ev.description || ""}</p>
          ${ev.link ? `<p class="card-tap-hint">Tap to view event →</p>` : ""}
        </div>
      `;
      container.appendChild(card);
    });
  }

  // Initial render
  displayEvents(allEvents);

  // ── Filtering & Sorting ───────────────────────────────────────────────────
  function filterAndSort() {
    const searchTerm = document.getElementById("searchBar").value.toLowerCase().trim();
    const category   = document.getElementById("categoryFilter").value;
    const province   = document.getElementById("provinceFilter")?.value || "";
    const dateStr    = document.getElementById("dateFilter").value;
    const sortOrder  = document.getElementById("sortFilter").value;

    let filtered = allEvents.filter((ev) => {
      const matchesSearch =
        !searchTerm ||
        ev.name?.toLowerCase().includes(searchTerm) ||
        ev.location?.toLowerCase().includes(searchTerm) ||
        ev.description?.toLowerCase().includes(searchTerm) ||
        ev.province?.toLowerCase().includes(searchTerm);

      const matchesCategory = !category || ev.category === category;
      const matchesProvince = !province || ev.province === province;

      let matchesDate = true;
      if (dateStr) {
        const filterDate = new Date(dateStr);
        filterDate.setHours(0, 0, 0, 0);
        const eventDate = new Date(ev.date);
        matchesDate = !isNaN(filterDate) && !isNaN(eventDate) && eventDate >= filterDate;
      }

      return matchesSearch && matchesCategory && matchesProvince && matchesDate;
    });

    // Sort
    filtered.sort((a, b) => {
      const diff = new Date(a.date) - new Date(b.date);
      return sortOrder === "latest" ? -diff : diff;
    });

    displayEvents(filtered);
  }

  document.getElementById("searchBar").addEventListener("input", filterAndSort);
  document.getElementById("categoryFilter").addEventListener("change", filterAndSort);
  document.getElementById("dateFilter").addEventListener("change", filterAndSort);
  document.getElementById("provinceFilter")?.addEventListener("change", filterAndSort);
  document.getElementById("sortFilter").addEventListener("change", filterAndSort);
});