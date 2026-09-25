import { getConsent, setConsent, getPreferenceFlags, canStorePreferences } from "./storage.js";
import { applyTheme, applyMotion, setMotionPref } from "./theme.js";
import { openModal, closeModal } from "./modal.js";

function prefsFormHtml() {
  const flags = getPreferenceFlags();
  const motion = canStorePreferences() ? (localStorage.getItem("ds_motion") || "system") : "system";
  return `
    <h2>Cookie preferences</h2>
    <p class="section-lead">Essential storage remembers this choice. Preference storage is optional and never includes passwords, messages, or account data.</p>
    <form id="cookiePrefsForm" class="form-group" style="margin-top:24px">
      <label class="choice" style="margin-bottom:10px">
        <input type="checkbox" checked disabled>
        <span><strong>Essential</strong><br>Required to save your consent decision.</span>
      </label>
      <label class="choice" style="margin-bottom:10px">
        <input type="checkbox" name="preferences" ${flags.preferences ? "checked" : ""}>
        <span><strong>Preferences</strong><br>Theme, motion, and recently viewed projects.</span>
      </label>
      <p class="section-lead">Analytics cookies are not used on this site.</p>
      <fieldset style="border:0;padding:0;margin:20px 0">
        <legend>Animation</legend>
        <div class="theme-menu">
          <button type="button" class="btn btn-secondary" data-motion-option="system">System</button>
          <button type="button" class="btn btn-secondary" data-motion-option="full">Motion on</button>
          <button type="button" class="btn btn-secondary" data-motion-option="reduced">Motion off</button>
        </div>
        <p class="visually-hidden">Current animation preference: ${motion}</p>
      </fieldset>
      <button class="btn btn-primary" type="submit">Save preferences</button>
    </form>
  `;
}

export function openCookiePreferences() {
  openModal({ title: "Cookie preferences", html: prefsFormHtml() });
  const form = document.getElementById("cookiePrefsForm");
  form?.querySelectorAll("[data-motion-option]").forEach((button) => {
    button.addEventListener("click", () => {
      setMotionPref(button.dataset.motionOption);
      applyMotion(button.dataset.motionOption);
    });
  });
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const preferences = Boolean(form.preferences?.checked);
    setConsent(preferences ? "customized" : "declined", { preferences, analytics: false });
    applyTheme();
    hideBanner();
    closeModal();
  });
}

function hideBanner() {
  const banner = document.getElementById("cookieBanner");
  if (banner) banner.hidden = true;
}

export function initCookies() {
  const banner = document.getElementById("cookieBanner");
  if (banner && !getConsent()) banner.hidden = false;

  document.getElementById("cookieAccept")?.addEventListener("click", () => {
    setConsent("accepted", { preferences: true, analytics: false });
    hideBanner();
    applyTheme();
  });

  document.getElementById("cookieDecline")?.addEventListener("click", () => {
    setConsent("declined", { preferences: false, analytics: false });
    hideBanner();
    applyTheme("system");
  });

  document.getElementById("cookiePrefsBtn")?.addEventListener("click", openCookiePreferences);
  document.querySelectorAll("[data-open-cookies]").forEach((el) => {
    el.addEventListener("click", openCookiePreferences);
  });
}
