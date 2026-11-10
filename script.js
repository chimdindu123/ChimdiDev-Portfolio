const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuButton && navLinks) {
    menuButton.addEventListener("click", function () {
        const isOpen = navLinks.classList.toggle("open");
        menuButton.setAttribute("aria-expanded", isOpen);
        menuButton.textContent = isOpen ? "×" : "☰";
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            navLinks.classList.remove("open");
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.textContent = "☰";
        });
    });
}

// Project carousel: advances every three seconds and supports manual controls.
const track = document.getElementById("projectTrack");
const cards = document.querySelectorAll(".project-card");
const previousButton = document.getElementById("projectPrev");
const nextButton = document.getElementById("projectNext");
const dotsContainer = document.getElementById("sliderDots");
const slider = document.querySelector(".project-slider");

let currentProject = 0;
let projectTimer;
let visibleCards = 3;

function getVisibleCards() {
    if (window.innerWidth <= 650) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
}

function getLastProjectIndex() {
    return Math.max(0, cards.length - visibleCards);
}

function makeProjectDots() {
    dotsContainer.innerHTML = "";
    const numberOfPositions = getLastProjectIndex() + 1;

    for (let i = 0; i < numberOfPositions; i++) {
        const dot = document.createElement("button");
        dot.className = "slider-dot";
        dot.setAttribute("aria-label", "Show project " + (i + 1));
        dot.addEventListener("click", function () {
            showProject(i);
            restartProjectTimer();
        });
        dotsContainer.appendChild(dot);
    }
}

function showProject(index) {
    visibleCards = getVisibleCards();
    const lastIndex = getLastProjectIndex();

    if (index > lastIndex) index = 0;
    if (index < 0) index = lastIndex;

    currentProject = index;
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 20;
    track.style.transform = "translateX(-" + (currentProject * (cardWidth + gap)) + "px)";

    const dots = dotsContainer.querySelectorAll(".slider-dot");
    dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === currentProject);
    });
}

function nextProject() {
    showProject(currentProject + 1);
}

function previousProject() {
    showProject(currentProject - 1);
}

function startProjectTimer() {
    clearInterval(projectTimer);
    projectTimer = setInterval(nextProject, 3000);
}

function restartProjectTimer() {
    startProjectTimer();
}

if (track && cards.length > 0) {
    makeProjectDots();
    showProject(0);
    startProjectTimer();

    nextButton.addEventListener("click", function () {
        nextProject();
        restartProjectTimer();
    });

    previousButton.addEventListener("click", function () {
        previousProject();
        restartProjectTimer();
    });

    slider.addEventListener("mouseenter", function () {
        clearInterval(projectTimer);
    });

    slider.addEventListener("mouseleave", startProjectTimer);
    slider.addEventListener("focusin", function () {
        clearInterval(projectTimer);
    });
    slider.addEventListener("focusout", startProjectTimer);

    window.addEventListener("resize", function () {
        const newVisibleCards = getVisibleCards();
        if (newVisibleCards !== visibleCards) {
            currentProject = 0;
            makeProjectDots();
            showProject(0);
        } else {
            showProject(currentProject);
        }
    });
}

// Keep the copyright year current.
document.getElementById("year").textContent = new Date().getFullYear();
