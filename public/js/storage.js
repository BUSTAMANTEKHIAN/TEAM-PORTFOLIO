const CONSENT_KEY = "ds_consent";
const PREFS_KEY = "ds_prefs";
const THEME_KEY = "ds_theme";
const MOTION_KEY = "ds_motion";
const RECENT_KEY = "ds_recent_projects";

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage may be blocked */
  }
}

function writeCookie(name, value, days = 180) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; Expires=${expires}; Path=/; SameSite=Lax`;
}

function readCookie(name) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

export function getConsent() {
  const cookie = readCookie(CONSENT_KEY);
  if (cookie) return cookie;
  const stored = readJson(CONSENT_KEY, null);
  return stored?.status || "";
}

export function getPreferenceFlags() {
  const stored = readJson(PREFS_KEY, null);
  if (stored) return stored;
  const consent = getConsent();
  if (consent === "accepted") return { preferences: true, analytics: false };
  if (consent === "declined") return { preferences: false, analytics: false };
  return { preferences: false, analytics: false };
}

export function canStorePreferences() {
  return getPreferenceFlags().preferences === true;
}

export function setConsent(status, flags = { preferences: true, analytics: false }) {
  writeCookie(CONSENT_KEY, status);
  writeJson(CONSENT_KEY, { status, at: new Date().toISOString() });
  writeJson(PREFS_KEY, {
    preferences: Boolean(flags.preferences),
    analytics: false
  });
  if (!flags.preferences) {
    localStorage.removeItem(THEME_KEY);
    localStorage.removeItem(MOTION_KEY);
    localStorage.removeItem(RECENT_KEY);
  }
}

export function getThemePref() {
  if (canStorePreferences()) {
    return localStorage.getItem(THEME_KEY) || readCookie(THEME_KEY) || "system";
  }
  return "system";
}

export function setThemePref(value) {
  if (canStorePreferences()) {
    localStorage.setItem(THEME_KEY, value);
    writeCookie(THEME_KEY, value);
  }
}

export function getMotionPref() {
  if (canStorePreferences()) {
    return localStorage.getItem(MOTION_KEY) || "system";
  }
  return "system";
}

export function setMotionPref(value) {
  if (canStorePreferences()) {
    localStorage.setItem(MOTION_KEY, value);
  }
}

export function rememberProject(id) {
  if (!canStorePreferences() || !id) return;
  const current = readJson(RECENT_KEY, []).filter((item) => item !== id);
  current.unshift(id);
  writeJson(RECENT_KEY, current.slice(0, 8));
}

export function getRecentProjects() {
  return canStorePreferences() ? readJson(RECENT_KEY, []) : [];
}
