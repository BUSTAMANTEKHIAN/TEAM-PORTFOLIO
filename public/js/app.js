import { initThemeControls, cycleTheme } from "./theme.js";
import { initNav } from "./nav.js";
import { initModal } from "./modal.js";
import { initCookies } from "./cookies.js";
import { initCursor, initReveal } from "./effects.js";
import { initProjects } from "./projects.js";
import { initTeam } from "./team.js";
import { initContact } from "./contact.js";
import { services } from "./data.js";
import { openModal } from "./modal.js";
import { escapeHtml } from "./dom.js";

initThemeControls();
initNav();
initModal();
initCookies();
initCursor();
initProjects();
initTeam();
initContact();
initReveal();

document.getElementById("themeToggle")?.addEventListener("click", () => {
  const next = cycleTheme();
  const label = { system: "System theme", light: "Light theme", dark: "Dark theme" }[next];
  const live = document.getElementById("themeLive");
  if (live) live.textContent = label;
});

document.querySelectorAll("[data-open-service]").forEach((button) => {
  button.addEventListener("click", () => {
    const service = services.find((item) => item.id === button.dataset.openService);
    if (!service) return;
    openModal({
      title: service.title,
      html: `<h2>${escapeHtml(service.title)}</h2><p class="section-lead" style="margin-top:12px">${escapeHtml(service.detail)}</p>`
    });
  });
});

if (location.hash === "#cookies") {
  document.getElementById("cookiePrefsBtn")?.click();
}
