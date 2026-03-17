'use client';
import { create } from 'zustand';

const genId = () => Math.random().toString(36).slice(2, 10);

// ── Default card template (image top, info bottom) ─────────────────────────
export const DEFAULT_CARD_TEMPLATE = {
  cardBg: '#ffffff',
  cardRadius: 12,
  cardBorder: '#e2e8f0',
  rows: [
    {
      id: 'row-img',
      settings: { bg: '', padTop: 0, padBottom: 0, padH: 0 },
      columns: [
        {
          id: 'col-img',
          settings: { padTop: 0, padBottom: 0, padLeft: 0, padRight: 0, gap: 0, bg: '', radius: 0 },
          elements: [
            { id: 'el-image', type: 'pd-image', props: { height: 220, objectFit: 'cover', radius: 0 } },
          ],
          overlays: [
            { id: 'ov-badge', type: 'pd-badge', props: { top: 10, left: 10 } },
            { id: 'ov-wish',  type: 'pd-wishlist', props: { top: 8, right: 8 } },
          ],
        },
      ],
      colWidths: [100],
    },
    {
      id: 'row-info',
      settings: { bg: '', padTop: 12, padBottom: 14, padH: 14 },
      columns: [
        {
          id: 'col-info',
          settings: { padTop: 0, padBottom: 0, padLeft: 0, padRight: 0, gap: 6, bg: '' },
          elements: [
            { id: 'el-cat',   type: 'pd-category', props: {} },
            { id: 'el-title', type: 'pd-title',    props: {} },
            { id: 'el-rating',type: 'pd-rating',   props: {} },
            { id: 'el-price', type: 'pd-price',    props: {} },
            { id: 'el-atc',   type: 'pd-add-to-cart', props: {} },
          ],
          overlays: [],
        },
      ],
      colWidths: [100],
    },
  ],
};

// ── Store ───────────────────────────────────────────────────────────────────
export const useCardDesignerStore = create((set, get) => ({
  open: false,
  template: DEFAULT_CARD_TEMPLATE,
  selectedId: null,
  selectedIsOverlay: false,
  past: [],
  future: [],

  // ── Open / Close ─────────────────────────────────────────────────────────
  // callback fired when user saves — set externally by the consumer
  _onSave: null,
  setOnSave: (fn) => set({ _onSave: fn }),

  openDesigner: (template, onSave) => set({
    open: true,
    template: template || DEFAULT_CARD_TEMPLATE,
    selectedId: null,
    selectedIsOverlay: false,
    past: [],
    future: [],
    _onSave: onSave || null,
  }),
  closeDesigner: () => set({ open: false }),

  // ── Undo / Redo ─────────────────────────────────────────────────────────
  _push() {
    const snap = JSON.parse(JSON.stringify(get().template));
    set(s => ({ past: [...s.past, snap].slice(-40), future: [] }));
  },
  undo() {
    const { past, template, future } = get();
    if (!past.length) return;
    set({
      past: past.slice(0, -1),
      future: [JSON.parse(JSON.stringify(template)), ...future],
      template: past[past.length - 1],
    });
  },
  redo() {
    const { past, template, future } = get();
    if (!future.length) return;
    set({
      future: future.slice(1),
      past: [...past, JSON.parse(JSON.stringify(template))],
      template: future[0],
    });
  },

  // ── Selection ────────────────────────────────────────────────────────────
  setSelected: (id, isOverlay = false) => set({ selectedId: id, selectedIsOverlay: isOverlay }),
  clearSelected: () => set({ selectedId: null, selectedIsOverlay: false }),

  // ── Card-level settings ──────────────────────────────────────────────────
  updateCard: (settings) => {
    get()._push();
    set(s => ({ template: { ...s.template, ...settings } }));
  },

  // ── Row ops ──────────────────────────────────────────────────────────────
  addRow: () => {
    get()._push();
    const row = {
      id: genId(),
      settings: { bg: '', padTop: 12, padBottom: 12, padH: 14 },
      columns: [{ id: genId(), settings: { padTop: 0, padBottom: 0, padLeft: 0, padRight: 0, gap: 8, bg: '' }, elements: [], overlays: [] }],
      colWidths: [100],
    };
    set(s => ({ template: { ...s.template, rows: [...s.template.rows, row] } }));
  },
  deleteRow: (rowId) => {
    get()._push();
    set(s => ({ template: { ...s.template, rows: s.template.rows.filter(r => r.id !== rowId) } }));
  },
  updateRow: (rowId, settings) => {
    get()._push();
    set(s => ({
      template: {
        ...s.template,
        rows: s.template.rows.map(r => r.id === rowId ? { ...r, settings: { ...r.settings, ...settings } } : r),
      },
    }));
  },
  splitRowColumn: (rowId) => {
    get()._push();
    set(s => ({
      template: {
        ...s.template,
        rows: s.template.rows.map(r => {
          if (r.id !== rowId) return r;
          const newCol = { id: genId(), settings: { padTop: 0, padBottom: 0, padLeft: 0, padRight: 0, gap: 8, bg: '' }, elements: [], overlays: [] };
          const n = r.columns.length + 1;
          return { ...r, columns: [...r.columns, newCol], colWidths: Array.from({ length: n }, () => 100 / n) };
        }),
      },
    }));
  },
  reorderRows: (newRows) => {
    get()._push();
    set(s => ({ template: { ...s.template, rows: newRows } }));
  },

  // ── Column ops ───────────────────────────────────────────────────────────
  updateColumn: (rowId, colId, settings) => {
    get()._push();
    set(s => ({
      template: {
        ...s.template,
        rows: s.template.rows.map(r =>
          r.id !== rowId ? r : {
            ...r,
            columns: r.columns.map(c => c.id !== colId ? c : { ...c, settings: { ...c.settings, ...settings } }),
          }
        ),
      },
    }));
  },
  deleteColumn: (rowId, colId) => {
    get()._push();
    set(s => ({
      template: {
        ...s.template,
        rows: s.template.rows.map(r => {
          if (r.id !== rowId) return r;
          const next = r.columns.filter(c => c.id !== colId);
          if (!next.length) return null;
          return { ...r, columns: next, colWidths: Array.from({ length: next.length }, () => 100 / next.length) };
        }).filter(Boolean),
      },
    }));
  },

  // ── Element ops ──────────────────────────────────────────────────────────
  addElement: (rowId, colId, type, defaultProps = {}) => {
    get()._push();
    const el = { id: genId(), type, props: { ...defaultProps } };
    set(s => ({
      template: {
        ...s.template,
        rows: s.template.rows.map(r =>
          r.id !== rowId ? r : {
            ...r,
            columns: r.columns.map(c =>
              c.id !== colId ? c : { ...c, elements: [...c.elements, el] }
            ),
          }
        ),
      },
    }));
    return el.id;
  },

  // addElementAt — insert at specific index in elements array
  addElementAt: (rowId, colId, type, defaultProps = {}, afterIndex = 999) => {
    get()._push();
    const el = { id: genId(), type, props: { ...defaultProps } };
    set(s => ({
      template: {
        ...s.template,
        rows: s.template.rows.map(r =>
          r.id !== rowId ? r : {
            ...r,
            columns: r.columns.map(c => {
              if (c.id !== colId) return c;
              const arr = [...c.elements];
              arr.splice(afterIndex, 0, el);
              return { ...c, elements: arr };
            }),
          }
        ),
      },
    }));
    return el.id;
  },

  // reorderElementsByIndex — swap by index
  reorderElementsByIndex: (rowId, colId, fromIdx, toIdx) => {
    get()._push();
    set(s => ({
      template: {
        ...s.template,
        rows: s.template.rows.map(r =>
          r.id !== rowId ? r : {
            ...r,
            columns: r.columns.map(c => {
              if (c.id !== colId) return c;
              const arr = [...c.elements];
              const [moved] = arr.splice(fromIdx, 1);
              arr.splice(toIdx, 0, moved);
              return { ...c, elements: arr };
            }),
          }
        ),
      },
    }));
  },

  // duplicateElementAt — clone element after given index
  duplicateElementAt: (rowId, colId, el, afterIdx) => {
    get()._push();
    const clone = { ...el, id: genId(), props: { ...el.props } };
    set(s => ({
      template: {
        ...s.template,
        rows: s.template.rows.map(r =>
          r.id !== rowId ? r : {
            ...r,
            columns: r.columns.map(c => {
              if (c.id !== colId) return c;
              const arr = [...c.elements];
              arr.splice(afterIdx + 1, 0, clone);
              return { ...c, elements: arr };
            }),
          }
        ),
      },
    }));
  },

  updateElement: (elId, props) => {
    set(s => ({
      template: {
        ...s.template,
        rows: s.template.rows.map(r => ({
          ...r,
          columns: r.columns.map(c => ({
            ...c,
            elements: c.elements.map(el => el.id !== elId ? el : { ...el, props: { ...el.props, ...props } }),
          })),
        })),
      },
    }));
  },
  deleteElement: (elId) => {
    get()._push();
    set(s => ({
      template: {
        ...s.template,
        rows: s.template.rows.map(r => ({
          ...r,
          columns: r.columns.map(c => ({
            ...c,
            elements: c.elements.filter(el => el.id !== elId),
          })),
        })),
      },
    }));
  },
  reorderElements: (rowId, colId, newElements) => {
    get()._push();
    set(s => ({
      template: {
        ...s.template,
        rows: s.template.rows.map(r =>
          r.id !== rowId ? r : {
            ...r,
            columns: r.columns.map(c => c.id !== colId ? c : { ...c, elements: newElements }),
          }
        ),
      },
    }));
  },

  // ── Overlay ops (absolute-positioned elements on image) ─────────────────
  addOverlay: (rowId, colId, type, defaultProps = {}) => {
    get()._push();
    const ov = { id: genId(), type, props: { top: 10, left: 10, ...defaultProps } };
    set(s => ({
      template: {
        ...s.template,
        rows: s.template.rows.map(r =>
          r.id !== rowId ? r : {
            ...r,
            columns: r.columns.map(c =>
              c.id !== colId ? c : { ...c, overlays: [...(c.overlays || []), ov] }
            ),
          }
        ),
      },
    }));
    return ov.id;
  },
  updateOverlay: (ovId, props) => {
    set(s => ({
      template: {
        ...s.template,
        rows: s.template.rows.map(r => ({
          ...r,
          columns: r.columns.map(c => ({
            ...c,
            overlays: (c.overlays || []).map(ov => ov.id !== ovId ? ov : { ...ov, props: { ...ov.props, ...props } }),
          })),
        })),
      },
    }));
  },
  deleteOverlay: (ovId) => {
    get()._push();
    set(s => ({
      template: {
        ...s.template,
        rows: s.template.rows.map(r => ({
          ...r,
          columns: r.columns.map(c => ({
            ...c,
            overlays: (c.overlays || []).filter(ov => ov.id !== ovId),
          })),
        })),
      },
    }));
  },

  // ── addRowBelow ─────────────────────────────────────────────────────────────
  addRowBelow: (afterRowId) => {
    get()._push();
    const row = {
      id: genId(),
      settings: { bg: '', padTop: 0, padBottom: 0, padH: 0 },
      columns: [{ id: genId(), settings: { padTop: 8, padBottom: 8, padLeft: 12, padRight: 12, gap: 8, bg: '' }, elements: [], overlays: [] }],
      colWidths: [100],
    };
    set(s => {
      const rows = s.template.rows;
      const idx = rows.findIndex(r => r.id === afterRowId);
      const next = [...rows];
      next.splice(idx >= 0 ? idx + 1 : next.length, 0, row);
      return { template: { ...s.template, rows: next } };
    });
  },

  moveElement: (elId, fromRowId, fromColId, toRowId, toColId) => {
    get()._push();
    set(s => {
      let movedEl = null;
      const rows1 = s.template.rows.map(r => ({
        ...r,
        columns: r.columns.map(c => {
          if (c.id !== fromColId) return c;
          const el = c.elements.find(e => e.id === elId);
          if (el) movedEl = el;
          return { ...c, elements: c.elements.filter(e => e.id !== elId) };
        }),
      }));
      if (!movedEl) return { template: { ...s.template, rows: rows1 } };
      const rows2 = rows1.map(r => ({
        ...r,
        columns: r.columns.map(c => c.id !== toColId ? c : { ...c, elements: [...c.elements, movedEl] }),
      }));
      return { template: { ...s.template, rows: rows2 } };
    });
  },

  moveOverlay: (ovId, fromRowId, fromColId, toRowId, toColId) => {
    get()._push();
    set(s => {
      let movedOv = null;
      const rows1 = s.template.rows.map(r => ({
        ...r,
        columns: r.columns.map(c => {
          if (c.id !== fromColId) return c;
          const ov = (c.overlays||[]).find(o => o.id === ovId);
          if (ov) movedOv = ov;
          return { ...c, overlays: (c.overlays||[]).filter(o => o.id !== ovId) };
        }),
      }));
      if (!movedOv) return { template: { ...s.template, rows: rows1 } };
      const rows2 = rows1.map(r => ({
        ...r,
        columns: r.columns.map(c => c.id !== toColId ? c : { ...c, overlays: [...(c.overlays||[]), movedOv] }),
      }));
      return { template: { ...s.template, rows: rows2 } };
    });
  },

  reorderOverlays: (rowId, colId, newOverlays) => {
    get()._push();
    set(s => ({
      template: {
        ...s.template,
        rows: s.template.rows.map(r =>
          r.id !== rowId ? r : {
            ...r,
            columns: r.columns.map(c => c.id !== colId ? c : { ...c, overlays: newOverlays }),
          }
        ),
      },
    }));
  },

  // ── Reset & Export ────────────────────────────────────────────────────────
  resetTemplate: () => {
    get()._push();
    set({ template: DEFAULT_CARD_TEMPLATE, selectedId: null });
  },
  getTemplate: () => get().template,
}));
