document.addEventListener("DOMContentLoaded", function() {
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("navMenu");

        // Toggle menu on hamburger click
    hamburger.addEventListener("click", function(e) {
        e.stopPropagation(); // Prevent click from bubbling up
        navMenu.classList.toggle("show");
        hamburger.classList.toggle("active"); // animate to X
    });

    // Close menu when clicking outside
    document.addEventListener("click", function(e) {
        if (navMenu.classList.contains("show") && !navMenu.contains(e.target) && e.target !== hamburger) {
            navMenu.classList.remove("show");
            hamburger.classList.remove("active");
        }
    });
    });

    // Close menu when a nav link is clicked
    navMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("show");
            hamburger.classList.remove("active");
        });
    });
