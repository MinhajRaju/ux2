'use client';
import { create } from 'zustand';
import { makeSection, makeRow, makeColumn, makeElement, genId } from '../constants/helpers';

const createBuilderSlice = (type, singleSection = false) => (set, get) => ({
  sections: singleSection
    ? [makeSection({ id: `${type}-section-1`, settings: { label: `${type} Section`, bg: '#ffffff', visible: true } })]
    : [],
  selectedId: null,
  selectionMeta: null,

  // Selection
  setSelected: (id, meta = null) => set({ selectedId: id, selectionMeta: meta }),
  clearSelected: () => set({ selectedId: null, selectionMeta: null }),

  // Section ops
  addSection: () => {
    if (singleSection) return;
    const sec = makeSection();
    set(s => ({ sections: [...s.sections, sec] }));
    return sec.id;
  },
  updateSection: (secId, settings) =>
    set(s => ({
      sections: s.sections.map(sec =>
        sec.id === secId ? { ...sec, settings: { ...sec.settings, ...settings } } : sec
      ),
    })),
  deleteSection: (secId) => {
    if (singleSection) return;
    set(s => ({ sections: s.sections.filter(sec => sec.id !== secId) }));
  },
  reorderSections: (newSections) => set({ sections: newSections }),

  // Row ops
  addRow: (secId) => {
    const row = makeRow();
    set(s => ({
      sections: s.sections.map(sec =>
        sec.id === secId ? { ...sec, rows: [...sec.rows, row] } : sec
      ),
    }));
    return row.id;
  },
  updateRow: (rowId, settings) =>
    set(s => ({
      sections: s.sections.map(sec => ({
        ...sec,
        rows: sec.rows.map(row =>
          row.id === rowId ? { ...row, settings: { ...row.settings, ...settings } } : row
        ),
      })),
    })),
  deleteRow: (secId, rowId) =>
    set(s => ({
      sections: s.sections.map(sec =>
        sec.id === secId ? { ...sec, rows: sec.rows.filter(r => r.id !== rowId) } : sec
      ),
    })),
  reorderRows: (secId, newRows) =>
    set(s => ({
      sections: s.sections.map(sec => sec.id === secId ? { ...sec, rows: newRows } : sec),
    })),
  resizeColumns: (rowId, colWidths) =>
    set(s => ({
      sections: s.sections.map(sec => ({
        ...sec,
        rows: sec.rows.map(row =>
          row.id === rowId ? { ...row, colWidths } : row
        ),
      })),
    })),

  // Column ops
  addColumn: (secId, rowId) => {
    const col = makeColumn();
    set(s => ({
      sections: s.sections.map(sec =>
        sec.id === secId ? {
          ...sec,
          rows: sec.rows.map(row =>
            row.id === rowId ? {
              ...row,
              columns: [...row.columns, col],
              colWidths: [...(row.colWidths || []), 100 / (row.columns.length + 1)].map((_, __, arr) => 100 / arr.length),
            } : row
          ),
        } : sec
      ),
    }));
    return col.id;
  },
  deleteColumn: (secId, rowId, colId) =>
    set(s => ({
      sections: s.sections.map(sec =>
        sec.id === secId ? {
          ...sec,
          rows: sec.rows.map(row =>
            row.id === rowId ? {
              ...row,
              columns: row.columns.filter(c => c.id !== colId),
              colWidths: row.columns.length > 1
                ? row.columns.filter(c => c.id !== colId).map(() => 100 / (row.columns.length - 1))
                : [],
            } : row
          ),
        } : sec
      ),
    })),
  updateColumn: (secId, rowId, colId, settings) =>
    set(s => ({
      sections: s.sections.map(sec =>
        sec.id === secId ? {
          ...sec,
          rows: sec.rows.map(row =>
            row.id === rowId ? {
              ...row,
              columns: row.columns.map(col =>
                col.id === colId ? { ...col, settings: { ...col.settings, ...settings } } : col
              ),
            } : row
          ),
        } : sec
      ),
    })),

  // Element ops
  addElement: (secId, rowId, colId, elementType, elementMap) => {
    const def = elementMap[elementType];
    if (!def) return;
    const el = makeElement(elementType, def.defaultProps || {});
    set(s => ({
      sections: s.sections.map(sec =>
        sec.id === secId ? {
          ...sec,
          rows: sec.rows.map(row =>
            row.id === rowId ? {
              ...row,
              columns: row.columns.map(col =>
                col.id === colId ? { ...col, elements: [...col.elements, el] } : col
              ),
            } : row
          ),
        } : sec
      ),
    }));
    return el.id;
  },
  updateElement: (elId, props) =>
    set(s => ({
      sections: s.sections.map(sec => ({
        ...sec,
        rows: sec.rows.map(row => ({
          ...row,
          columns: row.columns.map(col => ({
            ...col,
            elements: col.elements.map(el =>
              el.id === elId ? { ...el, props: { ...el.props, ...props } } : el
            ),
          })),
        })),
      })),
    })),
  deleteElement: (elId) =>
    set(s => ({
      sections: s.sections.map(sec => ({
        ...sec,
        rows: sec.rows.map(row => ({
          ...row,
          columns: row.columns.map(col => ({
            ...col,
            elements: col.elements.filter(el => el.id !== elId),
          })),
        })),
      })),
    })),
  moveElement: (elId, fromSecId, fromRowId, fromColId, toSecId, toRowId, toColId) =>
    set(s => {
      let movedEl = null;
      const sections = s.sections.map(sec => ({
        ...sec,
        rows: sec.rows.map(row => ({
          ...row,
          columns: row.columns.map(col => {
            if (col.id === fromColId && row.id === fromRowId) {
              const el = col.elements.find(e => e.id === elId);
              if (el) movedEl = el;
              return { ...col, elements: col.elements.filter(e => e.id !== elId) };
            }
            return col;
          }),
        })),
      }));
      if (!movedEl) return { sections };
      return {
        sections: sections.map(sec => ({
          ...sec,
          rows: sec.rows.map(row => ({
            ...row,
            columns: row.columns.map(col => {
              if (col.id === toColId && row.id === toRowId) {
                return { ...col, elements: [...col.elements, movedEl] };
              }
              return col;
            }),
          })),
        })),
      };
    }),
  reorderElements: (colId, rowId, newElements) =>
    set(s => ({
      sections: s.sections.map(sec => ({
        ...sec,
        rows: sec.rows.map(row =>
          row.id === rowId ? {
            ...row,
            columns: row.columns.map(col =>
              col.id === colId ? { ...col, elements: newElements } : col
            ),
          } : row
        ),
      })),
    })),

  // Load data
  loadData: (data) => set({ sections: data.sections || [] }),
  getData: () => ({ sections: get().sections }),
});

export const useHeaderStore = create((set, get) => createBuilderSlice('header', true)(set, get));
export const usePageStore = create((set, get) => createBuilderSlice('page', false)(set, get));
export const useFooterStore = create((set, get) => createBuilderSlice('footer', true)(set, get));

// Global settings store
export const useGlobalStore = create((set) => ({
  activeHeaderId: 'header-1',
  activeFooterId: 'footer-1',
  pages: [
    { id: 'home', slug: '/', title: 'Home' },
    { id: 'about', slug: 'about-us', title: 'About Us' },
    { id: 'contact', slug: 'contact', title: 'Contact' },
  ],
  setActiveHeader: (id) => set({ activeHeaderId: id }),
  setActiveFooter: (id) => set({ activeFooterId: id }),
}));
