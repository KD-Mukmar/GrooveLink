document.addEventListener("DOMContentLoaded", function() {
    const sections = document.querySelectorAll(".reveal");
    const navLinks = document.querySelectorAll("nav a");

    function revealOnScroll() {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop < window.innerHeight - 100) {
                section.classList.add("active");
            } else {
                section.classList.remove("active");
            }
        });
    }

    function highlightNav() {
        let current = "";
        document.querySelectorAll("section").forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 60) {
                current = section.getAttribute("id");
            }
        });
        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href").includes(current)) {
                link.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", () => {
        revealOnScroll();
        highlightNav();
    });

    revealOnScroll();
    highlightNav();
});
