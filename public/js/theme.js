import { getThemePref, setThemePref, getMotionPref, setMotionPref } from "./storage.js";

let sessionTheme = null;
let sessionMotion = null;

function systemDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function systemReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function applyTheme(pref = sessionTheme || getThemePref()) {
  const resolved = pref === "dark" || (pref === "system" && systemDark()) ? "dark" : "light";
  document.documentElement.dataset.theme = resolved;
  document.documentElement.dataset.themePref = pref;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", resolved === "dark" ? "#0c0d0b" : "#f3f1eb");
}

export function applyMotion(pref = sessionMotion || getMotionPref()) {
  const reduced = pref === "reduced" || (pref === "system" && systemReducedMotion());
  document.documentElement.dataset.motion = reduced ? "reduced" : "full";
}

export function cycleTheme() {
  const order = ["system", "light", "dark"];
  const current = sessionTheme || getThemePref() || "system";
  const next = order[(Math.max(0, order.indexOf(current)) + 1) % order.length];
  sessionTheme = next;
  setThemePref(next);
  applyTheme(next);
  return next;
}

export function initThemeControls() {
  applyTheme();
  applyMotion();

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (getThemePref() === "system") applyTheme("system");
  });

  window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", () => {
    if (getMotionPref() === "system") applyMotion("system");
  });

  document.querySelectorAll("[data-theme-option]").forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.dataset.themeOption;
      sessionTheme = value;
      setThemePref(value);
      applyTheme(value);
    });
  });

  document.querySelectorAll("[data-motion-option]").forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.dataset.motionOption;
      sessionMotion = value;
      setMotionPref(value);
      applyMotion(value);
    });
  });
}

export { setMotionPref };
