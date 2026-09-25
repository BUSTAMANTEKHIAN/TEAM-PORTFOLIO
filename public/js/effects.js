export function initCursor() {
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const reduced = document.documentElement.dataset.motion === "reduced";
  if (coarse || reduced || window.innerWidth < 900) return;

  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  const glow = document.getElementById("heroGlow");
  if (!dot || !ring) return;

  document.documentElement.dataset.cursor = "on";
  document.body.classList.add("custom-cursor-enabled");

  let x = 0;
  let y = 0;
  let rx = 0;
  let ry = 0;

  window.addEventListener("pointermove", (event) => {
    x = event.clientX;
    y = event.clientY;
    dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    if (glow) glow.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
  }, { passive: true });

  function follow() {
    rx += (x - rx) * 0.18;
    ry += (y - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(follow);
  }
  follow();
}

export function initReveal() {
  const nodes = document.querySelectorAll("[data-reveal]");
  if (document.documentElement.dataset.motion === "reduced") {
    nodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -48px 0px" });

  nodes.forEach((node) => {
    node.classList.add("reveal");
    observer.observe(node);
  });
}
