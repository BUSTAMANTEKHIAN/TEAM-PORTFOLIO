export function toast(message, type = "info") {
  const root = document.getElementById("toastRoot");
  if (!root) return;

  const item = document.createElement("div");
  item.className = `toast toast-${type}`;
  item.setAttribute("role", type === "error" ? "alert" : "status");

  const text = document.createElement("span");
  text.textContent = message;
  item.appendChild(text);

  const close = document.createElement("button");
  close.type = "button";
  close.className = "icon-btn";
  close.setAttribute("aria-label", "Dismiss notification");
  close.textContent = "×";
  close.addEventListener("click", () => item.remove());

  item.appendChild(close);
  root.appendChild(item);
  window.setTimeout(() => item.remove(), 5200);
}
