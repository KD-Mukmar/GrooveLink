window.addEventListener("DOMContentLoaded", function() {
    // Original hardcoded events with categories that will display on the browser
    const staticEvents = [
        {
            name: "Red Bull Dance Your Style",
            location: "Cape Town",
            date: "2025-08-30",
            description: "High-energy street dance battle featuring freestyle styles and crowd voting.",
            link: "https://www.redbull.com/za-en/events/red-bull-dance-your-style-south-africa",
            category: "Hip Hop"
        },
        {
            name: "Hip Hop International SA",
            location: "Gauteng",
            date: "2025-05-03",
            description: "Qualifier for the Hip Hop International world championships.",
            link: "https://hiphopinternational.com/",
            category: "Hip Hop"
        },
        {
            name: "Afro Dance Fest",
            location: "Durban",
            date: "2025-08-23",
            description: "Celebrating African dance styles from across the continent.",
            link: "https://afrodancefest.com/",
            category: "Cultural"
        },
        {
            name: "DanceStar South Africa Qualifiers",
            location: "Johannesburg",
            date: "2025-11-13",
            description: "South African qualifiers for the international DanceStar finals.",
            link: "https://dancestar.org/dancestar-live-qualifiers/",
            category: "Contemporary"
        },
        {
            name: "Boss Choreography Challenge",
            location: "Cape Town",
            date: "2025-07-20",
            description: "Showcase of innovative choreography and creative performances.",
            link: "https://www.bosschoreo.com/",
            category: "Hip Hop"
        },
        {
            name: "Dance to Las Vegas Regionals",
            location: "Johannesburg",
            date: "2025-08-09",
            description: "South African regional qualifier for the Dance to Las Vegas competition.",
            link: "https://www.dancetolasvegas.com/",
            category: "Hip Hop"
        },
        {
            name: "Battle of the Giants",
            location: "Sun City",
            date: "2025-06-29",
            description: "One of South Africa’s largest multi-style dance competitions.",
            link: "https://www.ido-dance.com/",
            category: "Other"
        },
        {
            name: "Udo SA Street Dance Champs",
            location: "Durban",
            date: "2025-09-13",
            description: "Street dance championships with international qualifiers.",
            link: "https://www.udostreetdance.com/",
            category: "Hip Hop"
        },
        {
            name: "Breaking SA Championships",
            location: "Cape Town",
            date: "2025-10-04",
            description: "National breaking competition showcasing top talent.",
            link: "https://www.redbull.com/za-en/events/red-bull-bc-one-cypher-south-africa",
            category: "Hip Hop"
        },
        {
            name: "Dance Africa Grand Finale",
            location: "Johannesburg",
            date: "2025-11-15",
            description: "Grand finale of Dance Africa series.",
            link: "https://www.ultrasouthafrica.com/",
            category: "Cultural"
        },
        {
            name: "MOVE! National Dance Competition",
            location: "Multiple Regions",
            date: "2025-10-03",
            description: "National dance competition with regional rounds.",
            link: "https://www.thetda.co.za/pages/move",
            category: "Other"
        },
        {
            name: "Talent Africa Performing Arts Competition",
            location: "Nationwide",
            date: "2025-10-01",
            description: "Performing arts competition with finals in October.",
            link: "https://www.talentafrica.co.za/",
            category: "Other"
        },
        {
            name: "Legacy Dance Competition SA",
            location: "Roodepoort",
            date: "2025-10-02",
            description: "New national dance competition open to all styles.",
            link: "https://www.facebook.com/CBAComp/",
            category: "Other"
        },
        {
            name: "A-Arts Festival – Mpumalanga",
            location: "Middelburg",
            date: "2025-06-27",
            description: "Arts festival including dance competitions.",
            link: "https://www.facebook.com/AArtsFestival/",
            category: "Other"
        },
        {
            name: "Elements of Dance SA",
            location: "Sasolburg",
            date: "2025-09-18",
            description: "Dance competition with regionals and nationals.",
            link: "https://www.facebook.com/elementsofdancesa/",
            category: "Other"
        },
        {
            name: "SA International Ballet Competition",
            location: "Cape Town",
            date: "2025-07-28",
            description: "International ballet competition in South Africa.",
            link: "https://www.saibc.com/",
            category: "Ballet"
        },
        {
            name: "DanceSport SA Inter-Provincial Championships",
            location: "Bloemfontein",
            date: "2025-08-08",
            description: "Inter-provincial dancesport championships.",
            link: "https://dancesportsa.co.za/",
            category: "Other"
        },
        {
            name: "Dance World Cup SA Qualifier",
            location: "Centurion",
            date: "2025-10-27",
            description: "South African qualifier for the Dance World Cup.",
            link: "https://danceworldcup.co.za/",
            category: "Contemporary"
        },
        {
            name: "SA Dance School Championships",
            location: "Centurion",
            date: "2025-10-13",
            description: "National school-level dance championships.",
            link: "https://www.dancetalent.co.za/",
            category: "Other"
        }
    ];

    // Load dynamic events from the browser's localStorage
    let dynamicEvents = JSON.parse(localStorage.getItem("events")) || [];

    // Combine and sort static + dynamic events
    let allEvents = [...staticEvents, ...dynamicEvents];
    allEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

    const container = document.querySelector(".event-cards");

    function displayEvents(list) {
        container.innerHTML = "";
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