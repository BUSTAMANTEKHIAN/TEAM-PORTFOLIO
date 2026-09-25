function closeDrawer(returnFocus = false) {
  const drawer = document.getElementById("mobileDrawer");
  const toggle = document.getElementById("menuToggle");
  if (!drawer || !toggle) return;
  drawer.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Open navigation");
  document.body.classList.remove("scroll-lock");
  if (returnFocus) toggle.focus();
}

function openDrawer() {
  const drawer = document.getElementById("mobileDrawer");
  const toggle = document.getElementById("menuToggle");
  if (!drawer || !toggle) return;
  drawer.classList.add("is-open");
  toggle.setAttribute("aria-expanded", "true");
  toggle.setAttribute("aria-label", "Close navigation");
  document.body.classList.add("scroll-lock");
  drawer.querySelector("a, button")?.focus();
}

function getDrawerFocusable() {
  const drawer = document.getElementById("mobileDrawer");
  return [...(drawer?.querySelectorAll("a[href], button:not([disabled])") || [])]
    .filter((element) => element.getClientRects().length > 0);
}

export function initNav() {
  const header = document.getElementById("siteHeader");
  const toggle = document.getElementById("menuToggle");
  const drawer = document.getElementById("mobileDrawer");

  const onScroll = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  toggle?.addEventListener("click", () => {
    if (drawer?.classList.contains("is-open")) closeDrawer();
    else openDrawer();
  });

  drawer?.querySelector(".drawer-backdrop")?.addEventListener("click", closeDrawer);
  drawer?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeDrawer));
  drawer?.addEventListener("keydown", (event) => {
    if (event.key !== "Tab" || !drawer.classList.contains("is-open")) return;
    const nodes = getDrawerFocusable();
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && drawer?.classList.contains("is-open")) closeDrawer(true);
  });

  const sections = [...document.querySelectorAll("main section[id]")];
  const links = [...document.querySelectorAll(".nav-links a, .drawer-panel a")];
  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      links.forEach((link) => {
        const href = link.getAttribute("href") || "";
        const active = href.endsWith(`#${id}`) || href === `#${id}`;
        link.classList.toggle("is-active", active);
      });
    });
  }, { rootMargin: "-45% 0px -45% 0px", threshold: 0.01 });

  sections.forEach((section) => observer.observe(section));
}
