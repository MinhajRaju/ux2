'use client';

// ── ID & slug helpers ─────────────────────────────────────────
/** Collision-proof ID using crypto.randomUUID (modern) or fallback */
export const uid = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 11);
};

export const slugify = (s) =>
  (s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'page';

// ── Storage keys ──────────────────────────────────────────────
const TEMPLATES_KEY = 'ux-theme-templates';
const SETTINGS_KEY  = 'ux-theme-settings';

export const DEFAULT_GLOBAL_SETTINGS = {
  activeHeaderId: null,
  activeFooterId: null,
  siteName: '',
  siteUrl: '',
};

// ── Persist ───────────────────────────────────────────────────
export function saveStore(templates, globalSettings) {
  try {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
    localStorage.setItem(SETTINGS_KEY,  JSON.stringify(globalSettings));
  } catch {}
}

export function loadStore() {
  try {
    const templates = JSON.parse(localStorage.getItem(TEMPLATES_KEY) || '[]');
    const raw = localStorage.getItem(SETTINGS_KEY);
    const globalSettings = raw
      ? JSON.parse(raw)
      : { ...DEFAULT_GLOBAL_SETTINGS };
    return { templates, globalSettings };
  } catch {
    return { templates: [], globalSettings: { ...DEFAULT_GLOBAL_SETTINGS } };
  }
}

/** Safe init — returns empty state during SSR */
export function getInitialData() {
  if (typeof window === 'undefined') {
    return { templates: [], globalSettings: { ...DEFAULT_GLOBAL_SETTINGS } };
  }
  return loadStore();
}