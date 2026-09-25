import { teamMembers, projectsForMember } from "./data.js";
import { escapeHtml, photoMarkup } from "./dom.js";
import { openModal } from "./modal.js";

function cardHtml(member) {
  return `
    <article class="card member-card" data-reveal data-role="${escapeHtml(member.filter)}" data-open-member="${escapeHtml(member.id)}">
      <div class="member-photo">${photoMarkup(member)}</div>
      <h3>${escapeHtml(member.name)}</h3>
      <div class="member-role">${escapeHtml(member.role)}</div>
      <p>${escapeHtml(member.description)}</p>
      <p class="member-project-count">${projectsForMember(member).length} listed ${projectsForMember(member).length === 1 ? "project" : "projects"}</p>
      <div class="chip-row" style="margin-top:12px">${member.skills.slice(0, 4).map((skill) => `<span class="badge">${escapeHtml(skill)}</span>`).join("")}</div>
      <div class="hero-actions" style="margin-top:16px">
        <button class="btn btn-secondary" type="button" data-open-member="${escapeHtml(member.id)}">View profile</button>
        ${member.portfolio ? `<a class="btn btn-primary" href="${escapeHtml(member.portfolio)}" target="_blank" rel="noopener noreferrer">Portfolio</a>` : ""}
      </div>
    </article>
  `;
}

function profileHtml(member) {
  const work = projectsForMember(member);
  return `
    <p class="eyebrow">${escapeHtml(member.role)}</p>
    <h2>${escapeHtml(member.name)}</h2>
    <div class="member-photo" style="max-width:180px;margin:18px 0">${photoMarkup(member)}</div>
    <h3>About</h3>
    <p>${escapeHtml(member.description)}</p>
    ${member.responsibilities ? `<h3 style="margin-top:16px">Responsibilities</h3><p>${escapeHtml(member.responsibilities)}</p>` : ""}
    ${member.skills.length ? `<h3 style="margin-top:16px">Skills</h3><div class="chip-row">${member.skills.map((skill) => `<span class="badge">${escapeHtml(skill)}</span>`).join("")}</div>` : ""}
    <h3 style="margin-top:16px">Selected projects</h3>
    <p>${work.length} listed ${work.length === 1 ? "project" : "projects"}</p>
    ${work.length ? `<ul>${work.map((project) => `<li>${escapeHtml(project.name)}</li>`).join("")}</ul>` : "<p>No projects listed yet.</p>"}
    <div class="hero-actions">
      ${member.github ? `<a class="btn btn-secondary" href="${escapeHtml(member.github)}" target="_blank" rel="noopener noreferrer">GitHub</a>` : ""}
      ${member.portfolio ? `<a class="btn btn-primary" href="${escapeHtml(member.portfolio)}" target="_blank" rel="noopener noreferrer">Portfolio</a>` : ""}
      <a class="btn btn-secondary" href="contact.html">Contact</a>
    </div>
  `;
}

export function initTeam() {
  const grid = document.getElementById("teamGrid");
  if (!grid) return;
  grid.innerHTML = teamMembers.map(cardHtml).join("");

  function filter(role = "all") {
    grid.querySelectorAll(".member-card").forEach((card) => {
      const show = role === "all" || card.dataset.role === role;
      card.hidden = !show;
    });
    const visible = [...grid.querySelectorAll(".member-card")].some((card) => !card.hidden);
    let empty = grid.querySelector(".empty-state");
    if (!visible) {
      if (!empty) {
        empty = document.createElement("div");
        empty.className = "empty-state";
        empty.innerHTML = "<h3>No teammates in this role.</h3>";
        grid.appendChild(empty);
      }
    } else if (empty) {
      empty.remove();
    }
  }

  document.querySelectorAll("[data-team-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-team-filter]").forEach((item) => {
        item.classList.remove("is-active");
        item.setAttribute("aria-pressed", "false");
      });
      button.classList.add("is-active");
      button.setAttribute("aria-pressed", "true");
      filter(button.dataset.teamFilter);
    });
  });

  grid.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-open-member]");
    const card = event.target.closest(".member-card");
    const id = trigger?.dataset.openMember || card?.dataset.openMember;
    const member = id ? teamMembers.find((item) => item.id === id) : null;
    if (member && !event.target.closest("a")) openModal({ title: member.name, html: profileHtml(member) });
  });
}
