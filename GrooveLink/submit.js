document.getElementById("eventForm").addEventListener("submit", function(e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById("event-name").value;
    const location = document.getElementById("location").value;
    const date = document.getElementById("date").value;
    const description = document.getElementById("description").value;
    const link = document.getElementById("event-link").value;
    const category = document.getElementById("category").value;

    // Create event object
    const newEvent = {
        name,
        location,
        date,
        description,
        link,
        category
    };

    // Get existing events from localStorage or create empty array
    let events = JSON.parse(localStorage.getItem("events")) || [];

    // Add new event
    events.push(newEvent);

    // Save back to localStorage
    localStorage.setItem("events", JSON.stringify(events));

    alert("Event submitted successfully!");
    window.location.href = "events.html"; // Redirect to events page
});
