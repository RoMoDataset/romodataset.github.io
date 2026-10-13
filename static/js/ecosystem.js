const header = document.querySelector("#site-header");
const topButton = document.querySelector("#to-top");
const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".nav-links a")];

function updateChrome() {
  const y = window.scrollY;
  header?.classList.toggle("scrolled", y > 18);
  topButton?.classList.toggle("visible", y > 700);

  const active = [...sections]
    .reverse()
    .find((section) => section.getBoundingClientRect().top <= 120);
  navLinks.forEach((link) => {
    link.classList.toggle("active", Boolean(active) && link.hash === `#${active.id}`);
  });
}

window.addEventListener("scroll", updateChrome, { passive: true });
window.addEventListener("load", updateChrome);

topButton?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -48px" },
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

function formatCount(value, decimals) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

const countObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const element = entry.target;
      const target = Number(element.dataset.count);
      const decimals = (element.dataset.count.split(".")[1] ?? "").length;
      const suffix = element.dataset.suffix ?? "";
      const start = performance.now();
      const duration = 1100;

      function frame(now) {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = `${formatCount(target * eased, decimals)}${suffix}`;
        if (progress < 1) requestAnimationFrame(frame);
      }

      requestAnimationFrame(frame);
      observer.unobserve(element);
    });
  },
  { threshold: 0.6 },
);

document.querySelectorAll("[data-count]").forEach((element) => {
  countObserver.observe(element);
});

document.querySelectorAll(".hf-menu").forEach((menu) => {
  document.addEventListener("click", (event) => {
    if (!menu.contains(event.target)) menu.removeAttribute("open");
  });
});

document.querySelectorAll("[data-copy-target]").forEach((button) => {
  button.addEventListener("click", async () => {
    const source = document.getElementById(button.dataset.copyTarget);
    if (!source) return;
    await navigator.clipboard.writeText(source.textContent.trim());
    button.textContent = "Copied";
    setTimeout(() => {
      button.textContent = "Copy";
    }, 1600);
  });
});
