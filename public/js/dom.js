export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function photoMarkup(person, className = "") {
  const fallback = escapeHtml(person.initials || person.name?.slice(0, 2) || "DS");
  if (!person.photo) return `<span class="initials ${className}" aria-hidden="true">${fallback}</span>`;
  return `<img src="${escapeHtml(person.photo)}" alt="${escapeHtml(person.name)}" loading="lazy" data-photo-fallback="${fallback}">`;
}

function handlePhotoError(event) {
  const image = event.target;
  if (!(image instanceof HTMLImageElement) || image.dataset.photoHandled) return;
  image.dataset.photoHandled = "true";
  const fallback = document.createElement("span");
  fallback.className = `initials ${image.dataset.photoClassName || ""}`.trim();
  fallback.setAttribute("aria-hidden", "true");
  fallback.textContent = image.dataset.photoFallback || "DS";
  image.replaceWith(fallback);
}

document.addEventListener("error", handlePhotoError, true);
