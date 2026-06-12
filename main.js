const header = document.querySelector("[data-header]");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = [...document.querySelectorAll(".site-nav a[href^='#']")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const countdowns = [...document.querySelectorAll("[data-deadline]")];

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

function closeNav() {
  document.body.classList.remove("nav-open");
  header.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
}

function formatCountdown(milliseconds) {
  if (milliseconds <= 0) return "Deadline passed";

  const totalSeconds = Math.floor(milliseconds / 1000);
  const weeks = Math.floor(totalSeconds / (7 * 24 * 60 * 60));
  const days = Math.floor((totalSeconds % (7 * 24 * 60 * 60)) / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  return `${String(weeks).padStart(2, "0")} weeks ${String(days).padStart(
    2,
    "0",
  )} days ${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0",
  )}:${String(seconds).padStart(2, "0")}`;
}

function updateCountdowns() {
  const now = Date.now();

  countdowns.forEach((countdown) => {
    const deadline = new Date(countdown.dataset.deadline).getTime();
    const remaining = deadline - now;

    countdown.textContent = formatCountdown(remaining);
    countdown.classList.toggle("is-due", remaining <= 0);
  });
}

navToggle.addEventListener("click", () => {
  const isOpen = header.classList.toggle("is-open");
  document.body.classList.toggle("nav-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeNav);
});

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navLinks.forEach((link) => {
      link.classList.toggle(
        "is-active",
        link.getAttribute("href") === `#${visible.target.id}`,
      );
    });
  },
  {
    rootMargin: "-18% 0px -68% 0px",
    threshold: [0.08, 0.2, 0.4],
  },
);

sections.forEach((section) => observer.observe(section));
window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 980) closeNav();
});
updateHeader();
updateCountdowns();
if (countdowns.length) {
  window.setInterval(updateCountdowns, 1000);
}
