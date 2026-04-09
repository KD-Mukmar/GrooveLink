window.addEventListener("DOMContentLoaded", async function() {
    
    // ==================== SUPABASE CLIENT (already created in index.html) ====================
    // Use the global 'supabase' created in index.html
    // Wait a tiny bit in case scripts are still loading
    if (typeof supabase === 'undefined' || !supabase) {
        console.error("❌ Supabase client is not loaded. Check that the Supabase script is in index.html and loads before events.js");
        // Optional: show a user-friendly message on the page
        const container = document.querySelector(".event-cards");
        if (container) {
            container.innerHTML = "<h4 style='color:red;'>Error: Could not connect to database. Please refresh the page.</h4>";
        }
        return;
    }

    console.log("✅ Supabase client is ready");

    // ==================== FETCH EVENTS FROM SUPABASE ====================
    let allEvents = [];

    async function loadEventsFromSupabase() {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .order('date', { ascending: true });

        if (error) {
            console.error('Error loading events from Supabase:', error);
            return [];
        }

        return data || [];
    }

    // Load events
    allEvents = await loadEventsFromSupabase();

    const container = document.querySelector(".event-cards");

    // ====================  DISPLAY AND FILTER FUNCTIONS ====================
    function displayEvents(list) {
        container.innerHTML = "";
        if (list.length === 0) {
            container.innerHTML = "<h4>No events found matching your search.</h4>";
            return;
        }
        list.forEach(ev => {
            const card = document.createElement("div");
            card.classList.add("event-card");
            card.innerHTML = `
                <h3><a href="${ev.link}" target="_blank">${ev.name}</a></h3>
                <p>📍 ${ev.location}</p>
                <p>📅 ${ev.date}</p>
                <p>${ev.description}</p>
            `;
            container.appendChild(card);
        });
    }

    // Initial display
    displayEvents(allEvents);

    // Search + Category + Date filter (kept the same)
    document.getElementById("searchBar").addEventListener("input", filterEvents);
    document.getElementById("categoryFilter").addEventListener("change", filterEvents);
    document.getElementById("dateFilter").addEventListener("change", filterEvents);

    function filterEvents() {
        const searchTerm = document.getElementById("searchBar").value.toLowerCase();
        const category = document.getElementById("categoryFilter").value;
        const dateStr = document.getElementById("dateFilter").value;

        let filtered = allEvents.filter(ev => {
            const matchesSearch =
                !searchTerm || (ev.name?.toLowerCase().includes(searchTerm) ||
                               ev.location?.toLowerCase().includes(searchTerm) ||
                               ev.description?.toLowerCase().includes(searchTerm));

            const matchesCategory = !category || ev.category === category;

            let matchesDate = true;
            if (dateStr) {
                const filterDate = new Date(dateStr);
                filterDate.setHours(0, 0, 0, 0);
                const eventDate = new Date(ev.date);
                matchesDate = !isNaN(filterDate) && !isNaN(eventDate) && eventDate >= filterDate;
            }

            return matchesSearch && matchesCategory && matchesDate;
        });

        displayEvents(filtered);
    }
});
