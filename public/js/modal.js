let lastFocus = null;
let previousOverflow = "";

function getFocusable(root) {
  return [...root.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])')]
    .filter((el) => !el.hasAttribute("hidden") && el.getClientRects().length > 0);
}

export function openModal({ title, html, labelledBy = "modalTitle", wide = false }) {
  const root = document.getElementById("modalRoot");
  const dialog = document.getElementById("modalDialog");
  const body = document.getElementById("modalBody");
  if (!root || !dialog || !body) return;

  lastFocus = document.activeElement;
  previousOverflow = document.body.style.overflow;
  body.innerHTML = html;
  dialog.tabIndex = -1;
  dialog.classList.toggle("wide", wide);
  dialog.setAttribute("aria-modal", "true");
  root.hidden = false;
  root.setAttribute("aria-hidden", "false");
  document.body.classList.add("scroll-lock");
  document.body.style.overflow = "hidden";

  const heading = dialog.querySelector("h2, h3");
  if (heading) heading.id = labelledBy;
  dialog.setAttribute("aria-labelledby", labelledBy);

  const closeBtn = document.getElementById("modalClose");
  (closeBtn || getFocusable(dialog)[0] || dialog).focus();
}

export function closeModal() {
  const root = document.getElementById("modalRoot");
  const body = document.getElementById("modalBody");
  if (!root || root.hidden) return;
  root.hidden = true;
  root.setAttribute("aria-hidden", "true");
  if (body) body.innerHTML = "";
  document.body.classList.remove("scroll-lock");
  document.body.style.overflow = previousOverflow;
  if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  lastFocus = null;
  previousOverflow = "";
}

export function initModal() {
  const root = document.getElementById("modalRoot");
  if (!root) return;

  document.getElementById("modalClose")?.addEventListener("click", closeModal);
  root.querySelector(".modal-backdrop")?.addEventListener("click", closeModal);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !root.hidden) {
      event.preventDefault();
      closeModal();
    }
  });

  root.addEventListener("keydown", (event) => {
    if (event.key !== "Tab" || root.hidden) return;
    const dialog = document.getElementById("modalDialog");
    const nodes = getFocusable(dialog);
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
}
