// =============================================
// events.js — GrooveLink Events Page
// Fetches from Supabase, filters by search/category/province/date
// =============================================

window.addEventListener("DOMContentLoaded", async function () {
  const container = document.querySelector(".event-cards");

  // Show loading state
  container.innerHTML = `<p style="color:#aaa; font-size:1.1rem;">Loading events...</p>`;

  // ── Fetch ALL approved events from Supabase ──────────────────────────────
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
    container.innerHTML = `<p style="color:#ff6b6b;">Could not load events. Please try again later.</p>`;
    return;
  }

  // ── Format date nicely ───────────────────────────────────────────────────
  function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  // ── Single display function (no duplicate) ───────────────────────────────
  function displayEvents(list) {
    container.innerHTML = "";

    if (list.length === 0) {
      container.innerHTML = `<h4 style="color:#aaa; text-align:center;">No events found matching your search.</h4>`;
      return;
    }

    list.forEach((ev) => {
      const card = document.createElement("div");
      card.classList.add("event-card");
      card.innerHTML = `
        <span class="event-category">${ev.category || "Event"}</span>
        <h3>${ev.link
          ? `<a href="${ev.link}" target="_blank" rel="noopener">${ev.name}</a>`
          : ev.name
        }</h3>
        <p>📍 ${ev.location}${ev.province ? ` · ${ev.province}` : ""}</p>
        <p>📅 ${formatDate(ev.date)}</p>
        <p>${ev.description || ""}</p>
      `;
      container.appendChild(card);
    });
  }

  // ── Initial render — show ALL events ────────────────────────────────────
  displayEvents(allEvents);

  // ── Filter logic ─────────────────────────────────────────────────────────
  function filterEvents() {
    const searchTerm = document.getElementById("searchBar").value.toLowerCase().trim();
    const category   = document.getElementById("categoryFilter").value;
    const province   = document.getElementById("provinceFilter")?.value || "";
    const dateStr    = document.getElementById("dateFilter").value;

    const filtered = allEvents.filter((ev) => {
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

    displayEvents(filtered);
  }

  // ── Attach filter listeners ──────────────────────────────────────────────
  document.getElementById("searchBar").addEventListener("input", filterEvents);
  document.getElementById("categoryFilter").addEventListener("change", filterEvents);
  document.getElementById("dateFilter").addEventListener("change", filterEvents);
  document.getElementById("provinceFilter")?.addEventListener("change", filterEvents);
});