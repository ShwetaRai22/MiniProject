// Get Started button
const getStartedBtn = document.querySelector(".b1 button:first-child");

// Explore Features button
const exploreBtn = document.querySelector(".b1 button:last-child");


// Get Started → Login page
getStartedBtn.addEventListener("click", function () {
    window.location.href = "auth/auth.html";
});


// Explore Features → Features section
exploreBtn.addEventListener("click", function () {
    document.querySelector("#feature").scrollIntoView({
        behavior: "smooth"
    });
});


// Smooth scrolling for navbar links
const navLinks = document.querySelectorAll("nav a");

navLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {

        const targetId = link.getAttribute("href");

        if (targetId.startsWith("#")) {
            event.preventDefault();

            document.querySelector(targetId).scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});

navLinks.forEach(function (link) {
    link.addEventListener("click", function () {

        // Remove active class from all links
        navLinks.forEach(function (item) {
            item.classList.remove("active");
        });

        // Add active class to clicked link
        link.classList.add("active");
    });
});