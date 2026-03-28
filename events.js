window.addEventListener("DOMContentLoaded", function() {
    // Original hardcoded events with categories that will display on the browser
 

    // Load dynamic events from the browser's localStorage
    const API_URL = "https://qkdtgcvmygpivdcikhic.supabase.co";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrZHRnY3ZteWdwaXZkY2lraGljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NzcwNDAsImV4cCI6MjA4OTQ1MzA0MH0.wGCRhq3coiQtI47fQVwfjA_45-t6ekzIoL6EbEQhIlk";

let allEvents = [];

function loadEvents() {
    fetch(API_URL + "?select=*", {
        headers: {
            "apikey": API_KEY,
            "Authorization": "Bearer " + API_KEY
        }
    })
    .then(res => res.json())
    .then(data => {

        // Convert Supabase format → your format
        allEvents = data.map(ev => ({
            name: ev.name,
            location: ev.city || ev.province,
            date: ev.event_date,
            description: ev.description || "",
            link: ev.source_url || "#",
            category: ev.event_type || "Other"
        }));

        // Sort events
        allEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

        loadEvents();;
    });
}

    const container = document.querySelector(".event-cards");


    // Initial display
    displayEvents(allEvents);

    // Search + Category + Date filter
    document.getElementById("searchBar").addEventListener("input", filterEvents);
    document.getElementById("categoryFilter").addEventListener("change", filterEvents);
    document.getElementById("dateFilter").addEventListener("change", filterEvents);

    function filterEvents() {
        const searchTerm = document.getElementById("searchBar").value.toLowerCase();
        const category = document.getElementById("categoryFilter").value;
        const dateStr = document.getElementById("dateFilter").value;

        let filtered = allEvents.filter(ev => {
            const matchesSearch =
                !searchTerm || (ev.name.toLowerCase().includes(searchTerm) ||
                               ev.location.toLowerCase().includes(searchTerm) ||
                               ev.description.toLowerCase().includes(searchTerm));
            const matchesCategory = !category || ev.category === category;

            let matchesDate = true;
            if (dateStr) {
                const filterDate = new Date(dateStr);
                filterDate.setHours(0, 0, 0, 0); // Normalize to start of day
                const eventDate = new Date(ev.date);
                matchesDate = !isNaN(filterDate) && !isNaN(eventDate) && eventDate >= filterDate;
            }

            return matchesSearch && matchesCategory && matchesDate;
        });

        displayEvents(filtered);
    }
    
    // Function for when no events match
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
});
