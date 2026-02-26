// src/lib/db.js
// Simple localStorage-based persistence

const PREFIX = 'pb_';

function ls(key, fallback = null) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function lsSet(key, val) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(PREFIX + key, JSON.stringify(val)); } catch {}
}

// ── Pages ──────────────────────────────────────────────────────
export function getPages() {
  return ls('pages', [{ id: 'home', slug: '/', title: 'Home', sections: [] }]);
}

export function savePage(page) {
  const pages = getPages();
  const idx = pages.findIndex(p => p.id === page.id);
  if (idx >= 0) pages[idx] = page;
  else pages.push(page);
  lsSet('pages', pages);
}

export function getPageBySlug(slug) {
  return getPages().find(p => p.slug === slug) || null;
}

export function getPageById(id) {
  return getPages().find(p => p.id === id) || null;
}

// ── Headers ────────────────────────────────────────────────────
export function getHeaders() {
  return ls('headers', [{ id: 'default-header', name: 'Default Header', sections: [] }]);
}

export function saveHeader(header) {
  const list = getHeaders();
  const idx = list.findIndex(h => h.id === header.id);
  if (idx >= 0) list[idx] = header;
  else list.push(header);
  lsSet('headers', list);
}

export function getHeaderById(id) {
  return getHeaders().find(h => h.id === id) || null;
}

// ── Footers ────────────────────────────────────────────────────
export function getFooters() {
  return ls('footers', [{ id: 'default-footer', name: 'Default Footer', sections: [] }]);
}

export function saveFooter(footer) {
  const list = getFooters();
  const idx = list.findIndex(f => f.id === footer.id);
  if (idx >= 0) list[idx] = footer;
  else list.push(footer);
  lsSet('footers', list);
}

export function getFooterById(id) {
  return getFooters().find(f => f.id === id) || null;
}

// ── Global Settings ────────────────────────────────────────────
export function getGlobalSettings() {
  return ls('globalSettings', {
    activeHeaderId: 'default-header',
    activeFooterId: 'default-footer',
    siteName: 'My Site',
  });
}

export function saveGlobalSettings(s) {
  lsSet('globalSettings', s);
}

// ── Delete helpers ─────────────────────────────────────────────
export function deletePage(id) {
  const pages = getPages().filter(p => p.id !== id);
  lsSet('pages', pages);
}
