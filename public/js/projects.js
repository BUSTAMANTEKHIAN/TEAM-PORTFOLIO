import { projects, membersForProject, getProject, teamMembers } from "./data.js";
import { escapeHtml } from "./dom.js";
import { openModal } from "./modal.js";
import { rememberProject } from "./storage.js";

const safeUrl = (value) => {
  try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) ? url.href : ""; }
  catch { return ""; }
};

function cardHtml(project) {
  const personNames = membersForProject(project).map((member) => member.name).join(", ") || "Team project";
  const image = project.images?.[0];
  const media = image
    ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(project.name)} project image" loading="lazy">`
    : `<div class="project-placeholder" aria-hidden="true">${escapeHtml(project.name.slice(0, 2))}</div>`;
  return `<article class="card project-card" data-reveal>
    <div class="project-media">${media}</div><div class="project-body">
      <div class="project-meta"><span>${escapeHtml(project.category)}</span><span>${escapeHtml(project.status)}</span></div>
      <h3>${escapeHtml(project.name)}</h3><p>${escapeHtml(project.description)}</p>
      <p class="section-lead">${escapeHtml(personNames)}</p>
      <button class="btn btn-secondary" type="button" data-open-project="${escapeHtml(project.id)}">Project details</button>
    </div></article>`;
}

function detailHtml(project) {
  const owners = membersForProject(project).map((member) => member.name).join(", ") || "Not listed";
  const live = safeUrl(project.live);
  const image = project.images?.[0];
  const preview = live
    ? `<section class="live-preview" aria-label="Live website preview">
        <div class="browser-bar"><span class="browser-dots" aria-hidden="true">● ● ●</span><span class="browser-address">${escapeHtml(new URL(live).host)}</span></div>
        <iframe title="${escapeHtml(project.name)} live website" src="${escapeHtml(live)}" loading="lazy" referrerpolicy="no-referrer" sandbox="allow-forms allow-scripts allow-same-origin allow-popups" ></iframe>
        <p class="preview-note">If this site does not appear, its owner may block embedded previews. <a href="${escapeHtml(live)}" target="_blank" rel="noopener noreferrer">Open live website ↗</a></p>
      </section>`
    : `<p class="preview-note">Live preview unavailable.</p>`;
  const tech = (project.tech || []).length ? `<h3>Technologies</h3><div class="chip-row">${project.tech.map((item) => `<span class="badge">${escapeHtml(item)}</span>`).join("")}</div>` : "";
  return `<p class="eyebrow">${escapeHtml(project.category)} · ${escapeHtml(project.status)}</p>
    <h2>${escapeHtml(project.name)}</h2>${image ? `<img class="project-detail-image" src="${escapeHtml(image)}" alt="${escapeHtml(project.name)} project image" loading="lazy">` : ""}<p class="section-lead">${escapeHtml(project.overview || project.description)}</p>
    <p><strong>Team:</strong> ${escapeHtml(owners)}</p>${tech}${preview}
    <div class="hero-actions">${live ? `<a class="btn btn-primary" href="${escapeHtml(live)}" target="_blank" rel="noopener noreferrer">Open live website</a>` : ""}${project.repo ? `<a class="btn btn-secondary" href="${escapeHtml(safeUrl(project.repo))}" target="_blank" rel="noopener noreferrer">GitHub</a>` : ""}</div>`;
}

export function openProject(id) {
  const project = getProject(id);
  if (!project) return;
  rememberProject(id);
  openModal({ title: project.name, html: detailHtml(project), wide: true });
}

export function initProjects() {
  const home = document.getElementById("homeProjects");
  const all = document.getElementById("allProjects");
  const count = document.getElementById("projectCount");
  if (home) home.innerHTML = projects.filter((project) => project.featured).map(cardHtml).join("");
  if (!all) return;

  const search = document.getElementById("projectSearch");
  const category = document.getElementById("projectCategory");
  const member = document.getElementById("projectMember");
  const status = document.getElementById("projectStatus");
  if (member) member.innerHTML += teamMembers.map((person) => `<option value="${escapeHtml(person.id)}">${escapeHtml(person.name)}</option>`).join("");

  function render() {
    const query = (search?.value || "").trim().toLocaleLowerCase();
    const list = projects.filter((project) => {
      const people = membersForProject(project);
      const searchable = [project.name, project.description, project.category, project.status, ...(project.tech || []), ...people.map((person) => person.name)].join(" ").toLocaleLowerCase();
      return (!query || searchable.includes(query))
        && (!category?.value || (project.filters || [project.filter]).includes(category.value))
        && (!member?.value || (project.memberIds || []).includes(member.value))
        && (!status?.value || project.status.toLowerCase() === status.value.toLowerCase());
    });
    if (count) count.textContent = String(list.length);
    all.innerHTML = list.length ? list.map(cardHtml).join("") : `<div class="empty-state"><h3>No projects found.</h3><p>Try changing your search or filters.</p></div>`;
  }
  [search, category, member, status].filter(Boolean).forEach((control) => {
    control.addEventListener("input", render);
    if (control !== search) control.addEventListener("change", render);
  });
  all.addEventListener("click", (event) => {
    const button = event.target.closest("[data-open-project]");
    if (button) openProject(button.dataset.openProject);
  });
  render();
}
