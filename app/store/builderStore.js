// src/store/builderStore.js
'use client';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuid } from 'uuid';

// ── Default props per element type ────────────────────────────
export const DEFAULT_PROPS = {
  heading: {
    content: 'Heading Text',
    fontSize: 32,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'left',
    padTop: 8, padBottom: 8, padLeft: 0, padRight: 0,
  },
  text: {
    content: 'Add your text here. Click to edit.',
    fontSize: 16,
    fontWeight: '400',
    color: '#334155',
    textAlign: 'left',
    lineHeight: 1.7,
    padTop: 4, padBottom: 4, padLeft: 0, padRight: 0,
  },
  image: {
    src: 'https://placehold.co/600x400/e2e8f0/94a3b8?text=Image',
    alt: 'Image',
    width: '100%',
    borderRadius: 8,
  },
  button: {
    label: 'Click Here',
    href: '#',
    bg: '#6366f1',
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    borderRadius: 8,
    padTop: 12, padBottom: 12, padLeft: 24, padRight: 24,
  },
  video: {
    src: '',
    poster: '',
    width: '100%',
    borderRadius: 8,
    controls: true,
  },
  divider: {
    color: '#e2e8f0',
    height: 1,
    style: 'solid',
    width: '100%',
    marginTop: 16, marginBottom: 16,
  },
  html: {
    code: '<p>Custom HTML here</p>',
  },
  logo: {
    src: '',
    text: 'Logo',
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    width: 120,
  },
  menu: {
    items: [
      { id: '1', label: 'Home',    href: '/' },
      { id: '2', label: 'About',   href: '/about' },
      { id: '3', label: 'Contact', href: '/contact' },
    ],
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
    gap: 24,
  },
  'search-bar': {
    placeholder: 'Search...',
    bg: '#f1f5f9',
    color: '#334155',
    borderRadius: 8,
    width: 200,
  },
  'cart-icon': { color: '#334155', size: 22, showCount: true },
  'wishlist-icon': { color: '#334155', size: 22 },
  'user-icon': { color: '#334155', size: 22 },
  categories: {
    label: 'Categories',
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },
};

// ── Factory helpers ────────────────────────────────────────────
export function makeElement(type) {
  return { id: uuid(), type, props: { ...(DEFAULT_PROPS[type] || {}) } };
}

export function makeColumn() {
  return { id: uuid(), elements: [], settings: { padH: 12, padV: 8, gap: 12, valign: 'center', align: 'flex-start' } };
}

export function makeRow(cols = 1) {
  return {
    id: uuid(),
    kind: 'row',
    settings: {
      label: '',
      bg: '#ffffff',
      bgType: 'color',
      height: 'auto',
      padH: 32,
      maxWidth: 1280,
      widthMode: 'boxed',
      colGap: 20,
      elGap: 12,
      visible: true,
    },
    columns: Array.from({ length: cols }, makeColumn),
    colWidths: Array.from({ length: cols }, () => 100 / cols),
  };
}

export function makeSection() {
  return {
    id: uuid(),
    kind: 'section',
    settings: {
      label: '',
      bg: '#ffffff',
      bgType: 'color',
      padTop: 40,
      padBottom: 40,
    },
    rows: [makeRow(1)],
  };
}

// ── Store ──────────────────────────────────────────────────────
export const useBuilderStore = create(
  immer((set, get) => ({
    // Current document being edited
    docType: 'page', // 'page' | 'header' | 'footer'
    docId: null,
    docSlug: '/',
    docTitle: 'Untitled',
    sections: [],

    // Selection
    selectedId: null,
    selectedMode: null, // 'section' | 'row' | 'col' | 'element'
    selectedMeta: {}, // { secId, rowId, colId }

    // History (undo/redo)
    past: [],
    future: [],

    // UI state
    isMobile: false,

    // ── Init ────────────────────────────────────────────────
    initDoc(docType, docId, docSlug, docTitle, sections) {
      set(s => {
        s.docType = docType;
        s.docId = docId;
        s.docSlug = docSlug;
        s.docTitle = docTitle;
        s.sections = sections || [];
        s.selectedId = null;
        s.selectedMode = null;
        s.past = [];
        s.future = [];
      });
    },

    // ── Snapshot helper ─────────────────────────────────────
    _snapshot() {
      return JSON.parse(JSON.stringify(get().sections));
    },
    _push() {
      set(s => {
        s.past.push(JSON.parse(JSON.stringify(s.sections)));
        if (s.past.length > 50) s.past.shift();
        s.future = [];
      });
    },

    undo() {
      set(s => {
        if (s.past.length === 0) return;
        s.future.push(JSON.parse(JSON.stringify(s.sections)));
        s.sections = s.past.pop();
      });
    },
    redo() {
      set(s => {
        if (s.future.length === 0) return;
        s.past.push(JSON.parse(JSON.stringify(s.sections)));
        s.sections = s.future.pop();
      });
    },

    // ── Selection ───────────────────────────────────────────
    select(id, mode, meta = {}) {
      set(s => { s.selectedId = id; s.selectedMode = mode; s.selectedMeta = meta; });
    },
    deselect() {
      set(s => { s.selectedId = null; s.selectedMode = null; s.selectedMeta = {}; });
    },

    // ── Section ops ─────────────────────────────────────────
    addSection() {
      get()._push();
      set(s => { s.sections.push(makeSection()); });
    },
    deleteSection(secId) {
      get()._push();
      set(s => { s.sections = s.sections.filter(sec => sec.id !== secId); });
    },
    updateSection(secId, settings) {
      get()._push();
      set(s => {
        const sec = s.sections.find(sec => sec.id === secId);
        if (sec) sec.settings = { ...sec.settings, ...settings };
      });
    },
    moveSection(secId, dir) {
      get()._push();
      set(s => {
        const idx = s.sections.findIndex(sec => sec.id === secId);
        if (idx < 0) return;
        const newIdx = dir === 'up' ? idx - 1 : idx + 1;
        if (newIdx < 0 || newIdx >= s.sections.length) return;
        [s.sections[idx], s.sections[newIdx]] = [s.sections[newIdx], s.sections[idx]];
      });
    },

    // ── Row ops ─────────────────────────────────────────────
    addRow(secId, cols = 1) {
      get()._push();
      set(s => {
        const sec = s.sections.find(sec => sec.id === secId);
        if (sec) sec.rows.push(makeRow(cols));
      });
    },
    deleteRow(secId, rowId) {
      get()._push();
      set(s => {
        const sec = s.sections.find(sec => sec.id === secId);
        if (sec) sec.rows = sec.rows.filter(r => r.id !== rowId);
      });
    },
    updateRow(secId, rowId, settings) {
      get()._push();
      set(s => {
        const sec = s.sections.find(sec => sec.id === secId);
        const row = sec?.rows.find(r => r.id === rowId);
        if (row) row.settings = { ...row.settings, ...settings };
      });
    },
    addCol(secId, rowId) {
      get()._push();
      set(s => {
        const sec = s.sections.find(sec => sec.id === secId);
        const row = sec?.rows.find(r => r.id === rowId);
        if (row) {
          row.columns.push(makeColumn());
          const n = row.columns.length;
          row.colWidths = Array.from({ length: n }, () => 100 / n);
        }
      });
    },
    deleteCol(secId, rowId) {
      get()._push();
      set(s => {
        const sec = s.sections.find(sec => sec.id === secId);
        const row = sec?.rows.find(r => r.id === rowId);
        if (row && row.columns.length > 1) {
          row.columns.pop();
          const n = row.columns.length;
          row.colWidths = Array.from({ length: n }, () => 100 / n);
        }
      });
    },
    resizeCols(secId, rowId, widths) {
      set(s => {
        const sec = s.sections.find(sec => sec.id === secId);
        const row = sec?.rows.find(r => r.id === rowId);
        if (row) row.colWidths = widths;
      });
    },
    updateCol(secId, rowId, colId, settings) {
      get()._push();
      set(s => {
        const sec = s.sections.find(sec => sec.id === secId);
        const row = sec?.rows.find(r => r.id === rowId);
        const col = row?.columns.find(c => c.id === colId);
        if (col) col.settings = { ...col.settings, ...settings };
      });
    },

    // ── Element ops ─────────────────────────────────────────
    addElement(secId, rowId, colId, type) {
      get()._push();
      const el = makeElement(type);
      set(s => {
        const sec = s.sections.find(sec => sec.id === secId);
        const row = sec?.rows.find(r => r.id === rowId);
        const col = row?.columns.find(c => c.id === colId);
        if (col) col.elements.push(el);
      });
      return el.id;
    },
    deleteElement(secId, rowId, colId, elId) {
      get()._push();
      set(s => {
        const sec = s.sections.find(sec => sec.id === secId);
        const row = sec?.rows.find(r => r.id === rowId);
        const col = row?.columns.find(c => c.id === colId);
        if (col) col.elements = col.elements.filter(e => e.id !== elId);
      });
    },
    updateElement(secId, rowId, colId, elId, props) {
      set(s => {
        const sec = s.sections.find(sec => sec.id === secId);
        const row = sec?.rows.find(r => r.id === rowId);
        const col = row?.columns.find(c => c.id === colId);
        const el = col?.elements.find(e => e.id === elId);
        if (el) el.props = { ...el.props, ...props };
      });
    },
    moveElement(elId, fromSecId, fromRowId, fromColId, toSecId, toRowId, toColId) {
      get()._push();
      set(s => {
        const fromSec = s.sections.find(sec => sec.id === fromSecId);
        const fromRow = fromSec?.rows.find(r => r.id === fromRowId);
        const fromCol = fromRow?.columns.find(c => c.id === fromColId);
        if (!fromCol) return;
        const elIdx = fromCol.elements.findIndex(e => e.id === elId);
        if (elIdx < 0) return;
        const [el] = fromCol.elements.splice(elIdx, 1);

        const toSec = s.sections.find(sec => sec.id === toSecId);
        const toRow = toSec?.rows.find(r => r.id === toRowId);
        const toCol = toRow?.columns.find(c => c.id === toColId);
        if (toCol) toCol.elements.push(el);
      });
    },
    reorderElement(secId, rowId, colId, elId, toIndex) {
      get()._push();
      set(s => {
        const sec = s.sections.find(sec => sec.id === secId);
        const row = sec?.rows.find(r => r.id === rowId);
        const col = row?.columns.find(c => c.id === colId);
        if (!col) return;
        const idx = col.elements.findIndex(e => e.id === elId);
        if (idx < 0) return;
        const [el] = col.elements.splice(idx, 1);
        col.elements.splice(toIndex, 0, el);
      });
    },

    toggleMobile() { set(s => { s.isMobile = !s.isMobile; }); },
  }))
);
