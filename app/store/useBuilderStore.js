'use client';
import { create } from 'zustand';
import { makeSection, makeRow, makeColumn, makeElement, makeGrid, makeGridCell } from '../constants/helpers';
import { genId } from '../constants/helpers';

// ── Recursive tree helpers ─────────────────────────────────────────────────────

/** Deep-find a col by id — searches col.columns AND col.subRows[*].columns */
function mapCol(columns, colId, fn) {
  return columns.map(col => {
    if (col.id === colId) return fn(col);
    let updated = col;
    if (Array.isArray(col.columns) && col.columns.length > 0) {
      updated = { ...updated, columns: mapCol(col.columns, colId, fn) };
    }
    if (Array.isArray(col.subRows) && col.subRows.length > 0) {
      updated = {
        ...updated,
        subRows: col.subRows.map(sr => ({
          ...sr,
          columns: mapCol(sr.columns, colId, fn),
        })),
      };
    }
    return updated;
  });
}

/** Map ALL columns at every depth — used for element ops */
function mapAllCols(columns, fn) {
  return columns.map(col => {
    let updated = fn(col);
    if (Array.isArray(updated.columns) && updated.columns.length > 0) {
      updated = { ...updated, columns: mapAllCols(updated.columns, fn) };
    }
    if (Array.isArray(updated.subRows) && updated.subRows.length > 0) {
      updated = {
        ...updated,
        subRows: updated.subRows.map(sr => ({
          ...sr,
          columns: mapAllCols(sr.columns, fn),
        })),
      };
    }
    return updated;
  });
}

function deleteColFromTree(columns, colId) {
  const idx = columns.findIndex(c => c.id === colId);
  if (idx >= 0) return columns.filter(c => c.id !== colId);
  return columns.map(col => {
    let updated = col;
    if (Array.isArray(col.columns) && col.columns.length > 0) {
      const next = deleteColFromTree(col.columns, colId);
      if (next !== col.columns) {
        if (next.length === 0) updated = { ...updated, columns: [], colWidths: [] };
        else updated = { ...updated, columns: next, colWidths: Array.from({ length: next.length }, () => 100 / next.length) };
      }
    }
    if (Array.isArray(col.subRows) && col.subRows.length > 0) {
      const nextSubRows = col.subRows.map(sr => {
        const nextCols = deleteColFromTree(sr.columns, colId);
        if (nextCols !== sr.columns) {
          return { ...sr, columns: nextCols, colWidths: Array.from({ length: nextCols.length }, () => 100 / nextCols.length) };
        }
        return sr;
      });
      updated = { ...updated, subRows: nextSubRows };
    }
    return updated;
  });
}

/** Find a col by id and update its subRows */
function mapColSubRows(columns, colId, fn) {
  return mapCol(columns, colId, col => ({ ...col, subRows: fn(col.subRows || []) }));
}

// ── Slice factory ──────────────────────────────────────────────────────────────

// ── Deep clone with fresh IDs (for duplicate ops) ──────────────────────────────
function deepCloneWithNewIds(node) {
  if (Array.isArray(node)) return node.map(deepCloneWithNewIds);
  if (node && typeof node === 'object') {
    const clone = {};
    for (const key of Object.keys(node)) {
      if (key === 'id') {
        clone.id = genId();
      } else {
        clone[key] = deepCloneWithNewIds(node[key]);
      }
    }
    return clone;
  }
  return node;
}


const createBuilderSlice = (type, singleSection = false) => (set, get) => ({

  sections: singleSection
    ? [makeSection({ id: `${type}-section-1`, settings: { label: `${type} Section`, bg: '#ffffff', visible: true } })]
    : [],
  selectedId:    null,
  selectedMode:  null,
  selectionMeta: null,
  past:          [],
  future:        [],
  rowModal: { open: false, secId: null },
  colModal: { open: false, colId: null },
  gridModal: { open: false, secId: null },

  // ── Undo / Redo ────────────────────────────────────────────
  _push() {
    const snapshot = JSON.parse(JSON.stringify(get().sections));
    set(s => ({ past: [...s.past, snapshot].slice(-50), future: [] }));
  },
  undo() {
    const { past, sections, future } = get();
    if (!past.length) return;
    set({
      past:     past.slice(0, -1),
      future:   [JSON.parse(JSON.stringify(sections)), ...future],
      sections: past[past.length - 1],
    });
  },
  redo() {
    const { past, sections, future } = get();
    if (!future.length) return;
    set({
      future:   future.slice(1),
      past:     [...past, JSON.parse(JSON.stringify(sections))],
      sections: future[0],
    });
  },

  // ── Selection ──────────────────────────────────────────────
  setSelected:  (id, meta = null)     => set({ selectedId: id, selectedMode: meta?.mode || null, selectionMeta: meta }),
  clearSelected:()                    => set({ selectedId: null, selectedMode: null, selectionMeta: null }),

  // ── Modals ─────────────────────────────────────────────────
  openRowModal:  (secId) => set({ rowModal: { open: true,  secId } }),
  closeRowModal: ()      => set({ rowModal: { open: false, secId: null } }),
  openColModal:  (colId) => set({ colModal: { open: true,  colId } }),
  closeColModal: ()      => set({ colModal: { open: false, colId: null } }),
  openGridModal:  (secId) => set({ gridModal: { open: true,  secId } }),
  closeGridModal: ()      => set({ gridModal: { open: false, secId: null } }),

  // ── Section ops ────────────────────────────────────────────
  addSection: () => {
    if (singleSection) return;
    get()._push();
    const sec = makeSection();
    set(s => ({ sections: [...s.sections, sec] }));
    return sec.id;
  },
  updateSection: (secId, settings) => {
    get()._push();
    set(s => ({
      sections: s.sections.map(sec =>
        sec.id === secId ? { ...sec, settings: { ...sec.settings, ...settings } } : sec
      ),
    }));
  },
  deleteSection: (secId) => {
    if (singleSection) return;
    get()._push();
    set(s => ({ sections: s.sections.filter(sec => sec.id !== secId) }));
  },
  reorderSections: (newSections) => { get()._push(); set({ sections: newSections }); },

  // ── Row ops ────────────────────────────────────────────────
  addRow: (secId, cols = 1, widths = null) => {
    get()._push();
    const row = makeRow();
    const numCols = Math.max(1, cols);
    row.columns   = Array.from({ length: numCols }, () => makeColumn());
    row.colWidths = widths?.length === numCols ? widths : Array.from({ length: numCols }, () => 100 / numCols);
    set(s => ({
      sections: s.sections.map(sec =>
        sec.id === secId ? { ...sec, rows: [...sec.rows, row] } : sec
      ),
    }));
    return row.id;
  },
  updateRow: (rowId, settings) => {
    get()._push();
    set(s => ({
      sections: s.sections.map(sec => ({
        ...sec,
        rows: sec.rows.map(row =>
          row.id === rowId ? { ...row, settings: { ...row.settings, ...settings } } : row
        ),
      })),
    }));
  },
  deleteRow: (secId, rowId) => {
    get()._push();
    set(s => ({
      sections: s.sections.map(sec =>
        sec.id === secId ? { ...sec, rows: sec.rows.filter(r => r.id !== rowId) } : sec
      ),
    }));
  },
  reorderRows: (secId, newRows) => { get()._push(); set(s => ({ sections: s.sections.map(sec => sec.id === secId ? { ...sec, rows: newRows } : sec) })); },
  resizeColumns: (rowId, colWidths) =>
    set(s => ({ sections: s.sections.map(sec => ({ ...sec, rows: sec.rows.map(row => row.id === rowId ? { ...row, colWidths } : row) })) })),

  // ── Column ops ─────────────────────────────────────────────
  addColumn: (secId, rowId) => {
    get()._push();
    const col = makeColumn();
    set(s => ({
      sections: s.sections.map(sec =>
        sec.id === secId ? {
          ...sec,
          rows: sec.rows.map(row =>
            row.id === rowId ? {
              ...row,
              columns:   [...row.columns, col],
              colWidths: Array.from({ length: row.columns.length + 1 }, () => 100 / (row.columns.length + 1)),
            } : row
          ),
        } : sec
      ),
    }));
    return col.id;
  },
  deleteColumn: (secId, rowId, colId) => {
    get()._push();
    set(s => ({
      sections: s.sections.map(sec =>
        sec.id === secId ? {
          ...sec,
          rows: sec.rows.map(row => {
            if (row.id !== rowId) return row;
            const next = row.columns.filter(c => c.id !== colId);
            return { ...row, columns: next, colWidths: Array.from({ length: next.length }, () => 100 / next.length) };
          }),
        } : sec
      ),
    }));
  },

  updateColumn: (secId, rowId, colId, settings) => {
    get()._push();
    set(s => ({
      sections: s.sections.map(sec =>
        sec.id === secId ? {
          ...sec,
          rows: sec.rows.map(row =>
            row.id === rowId ? {
              ...row,
              columns: mapCol(row.columns, colId, col => ({ ...col, settings: { ...col.settings, ...settings } })),
            } : row
          ),
        } : sec
      ),
    }));
  },
  /** updateSubColSettings — flat by colId, works at any depth */
  updateSubColSettings: (colId, settings) => {
    get()._push();
    set(s => ({
      sections: s.sections.map(sec => ({
        ...sec,
        rows: sec.rows.map(row => ({
          ...row,
          columns: mapCol(row.columns, colId, col => ({ ...col, settings: { ...col.settings, ...settings } })),
        })),
      })),
    }));
  },

  // ── Nested column ops ──────────────────────────────────────
  addSubCols: (colId, cols = 1, widths = null) => {
    get()._push();
    const numCols = Math.max(1, cols);
    const newCols = Array.from({ length: numCols }, () => makeColumn());
    const colWidths = widths?.length === numCols ? widths : Array.from({ length: numCols }, () => 100 / numCols);
    set(s => ({
      sections: s.sections.map(sec => ({
        ...sec,
        rows: sec.rows.map(row => ({
          ...row,
          columns: mapCol(row.columns, colId, col => ({ ...col, columns: newCols, colWidths })),
        })),
      })),
    }));
  },
  deleteSubCol: (colId) => {
    get()._push();
    set(s => ({
      sections: s.sections.map(sec => ({
        ...sec,
        rows: sec.rows
          .map(row => {
            const topIdx = row.columns.findIndex(c => c.id === colId);
            if (topIdx >= 0) {
              const next = row.columns.filter(c => c.id !== colId);
              if (!next.length) return null;
              return { ...row, columns: next, colWidths: Array.from({ length: next.length }, () => 100 / next.length) };
            }
            const next = deleteColFromTree(row.columns, colId);
            if (next !== row.columns) {
              return { ...row, columns: next, colWidths: Array.from({ length: next.length }, () => 100 / next.length) };
            }
            return row;
          })
          .filter(Boolean),
      })),
    }));
  },
  clearNesting: (colId) => {
    get()._push();
    set(s => ({
      sections: s.sections.map(sec => ({
        ...sec,
        rows: sec.rows.map(row => ({
          ...row,
          columns: mapCol(row.columns, colId, col => ({ ...col, columns: [], colWidths: [] })),
        })),
      })),
    }));
  },

  resizeSubCols: (colId, widths) =>
    set(s => ({
      sections: s.sections.map(sec => ({
        ...sec,
        rows: sec.rows.map(row => ({
          ...row,
          columns: mapCol(row.columns, colId, col => ({ ...col, colWidths: widths })),
        })),
      })),
    })),

  // ── Sub-Row ops (vertical rows inside a column) ────────────
  /** Add a vertical sub-row inside a column */
  addSubRow: (colId) => {
    get()._push();
    const subRowId = genId();
    const newSubRow = {
      id: subRowId,
      columns: [makeColumn()],
      colWidths: [100],
      settings: {},
    };
    set(s => ({
      sections: s.sections.map(sec => ({
        ...sec,
        rows: sec.rows.map(row => ({
          ...row,
          columns: mapCol(row.columns, colId, col => ({
            ...col,
            elements: [],          // clear direct elements when switching to sub-row mode
            subRows: [...(col.subRows || []), newSubRow],
          })),
        })),
      })),
    }));
    return subRowId;
  },

  /** Delete a vertical sub-row from a column */
  deleteSubRow: (colId, subRowId) => {
    get()._push();
    set(s => ({
      sections: s.sections.map(sec => ({
        ...sec,
        rows: sec.rows.map(row => ({
          ...row,
          columns: mapCol(row.columns, colId, col => ({
            ...col,
            subRows: (col.subRows || []).filter(sr => sr.id !== subRowId),
          })),
        })),
      })),
    }));
  },

  /** Reorder sub-rows inside a column */
  reorderSubRows: (colId, newSubRows) => {
    get()._push();
    set(s => ({
      sections: s.sections.map(sec => ({
        ...sec,
        rows: sec.rows.map(row => ({
          ...row,
          columns: mapCol(row.columns, colId, col => ({ ...col, subRows: newSubRows })),
        })),
      })),
    }));
  },

  /** Add column to a sub-row */
  addSubRowCol: (colId, subRowId) => {
    get()._push();
    const newCol = makeColumn();
    set(s => ({
      sections: s.sections.map(sec => ({
        ...sec,
        rows: sec.rows.map(row => ({
          ...row,
          columns: mapCol(row.columns, colId, col => ({
            ...col,
            subRows: (col.subRows || []).map(sr => {
              if (sr.id !== subRowId) return sr;
              const n = sr.columns.length + 1;
              return {
                ...sr,
                columns: [...sr.columns, newCol],
                colWidths: Array.from({ length: n }, () => 100 / n),
              };
            }),
          })),
        })),
      })),
    }));
  },

  /** Delete column from a sub-row */
  deleteSubRowCol: (colId, subRowId, subColId) => {
    get()._push();
    set(s => ({
      sections: s.sections.map(sec => ({
        ...sec,
        rows: sec.rows.map(row => ({
          ...row,
          columns: mapCol(row.columns, colId, col => ({
            ...col,
            subRows: (col.subRows || []).map(sr => {
              if (sr.id !== subRowId) return sr;
              const next = sr.columns.filter(c => c.id !== subColId);
              if (!next.length) return null;
              return { ...sr, columns: next, colWidths: Array.from({ length: next.length }, () => 100 / next.length) };
            }).filter(Boolean),
          })),
        })),
      })),
    }));
  },

  /** Resize columns within a sub-row */
  resizeSubRowCols: (colId, subRowId, widths) => {
    set(s => ({
      sections: s.sections.map(sec => ({
        ...sec,
        rows: sec.rows.map(row => ({
          ...row,
          columns: mapCol(row.columns, colId, col => ({
            ...col,
            subRows: (col.subRows || []).map(sr =>
              sr.id !== subRowId ? sr : { ...sr, colWidths: widths }
            ),
          })),
        })),
      })),
    }));
  },

  /** Clear sub-rows from a column (back to normal element mode) */
  clearSubRows: (colId) => {
    get()._push();
    set(s => ({
      sections: s.sections.map(sec => ({
        ...sec,
        rows: sec.rows.map(row => ({
          ...row,
          columns: mapCol(row.columns, colId, col => ({ ...col, subRows: [] })),
        })),
      })),
    }));
  },

  updateSubRowSettings: (colId, subRowId, settings) => {
    get()._push();
    set(s => ({
      sections: s.sections.map(sec => ({
        ...sec,
        rows: sec.rows.map(row => ({
          ...row,
          columns: mapCol(row.columns, colId, col => ({
            ...col,
            subRows: (col.subRows || []).map(sr =>
              sr.id !== subRowId ? sr : { ...sr, settings: { ...(sr.settings || {}), ...settings } }
            ),
          })),
        })),
      })),
    }));
  },


  // ── Grid ops ───────────────────────────────────────────────
  addGrid: (secId, preset) => {
    get()._push();
    const grid = makeGrid({ settings: { ...makeGrid().settings, columns: preset.columns, rows: preset.rows, label: preset.label || 'Grid' } });
    grid.cells = preset.cells.map(c => makeGridCell({ colStart: c.colStart, colEnd: c.colEnd, rowStart: c.rowStart, rowEnd: c.rowEnd }));
    set(s => ({
      sections: s.sections.map(sec =>
        sec.id === secId ? { ...sec, rows: [...sec.rows, grid] } : sec
      ),
    }));
    return grid.id;
  },

  updateGrid: (gridId, settings) => {
    get()._push();
    set(s => ({
      sections: s.sections.map(sec => ({
        ...sec,
        rows: sec.rows.map(row =>
          row.id === gridId && row.type === 'grid'
            ? { ...row, settings: { ...row.settings, ...settings } }
            : row
        ),
      })),
    }));
  },

  deleteGrid: (secId, gridId) => {
    get()._push();
    set(s => ({
      sections: s.sections.map(sec =>
        sec.id === secId ? { ...sec, rows: sec.rows.filter(r => r.id !== gridId) } : sec
      ),
    }));
  },

  duplicateGrid: (secId, gridId) => {
    get()._push();
    set(s => ({
      sections: s.sections.map(sec => {
        if (sec.id !== secId) return sec;
        const idx = sec.rows.findIndex(r => r.id === gridId);
        if (idx === -1) return sec;
        const clone = deepCloneWithNewIds(sec.rows[idx]);
        clone.settings = { ...clone.settings, label: (clone.settings.label || 'Grid') + ' Copy' };
        const next = [...sec.rows];
        next.splice(idx + 1, 0, clone);
        return { ...sec, rows: next };
      }),
    }));
  },

  addGridCell: (gridId, cellData) => {
    get()._push();
    const cell = makeGridCell(cellData);
    set(s => ({
      sections: s.sections.map(sec => ({
        ...sec,
        rows: sec.rows.map(row =>
          row.id === gridId && row.type === 'grid'
            ? { ...row, cells: [...(row.cells || []), cell] }
            : row
        ),
      })),
    }));
    return cell.id;
  },

  updateGridCell: (gridId, cellId, settings) => {
    get()._push();
    set(s => ({
      sections: s.sections.map(sec => ({
        ...sec,
        rows: sec.rows.map(row => {
          if (row.id !== gridId || row.type !== 'grid') return row;
          return { ...row, cells: row.cells.map(c => c.id === cellId ? { ...c, settings: { ...c.settings, ...settings } } : c) };
        }),
      })),
    }));
  },

  updateGridCellSpan: (gridId, cellId, spanData) => {
    get()._push();
    set(s => ({
      sections: s.sections.map(sec => ({
        ...sec,
        rows: sec.rows.map(row => {
          if (row.id !== gridId || row.type !== 'grid') return row;
          return { ...row, cells: row.cells.map(c => c.id === cellId ? { ...c, ...spanData } : c) };
        }),
      })),
    }));
  },

  deleteGridCell: (gridId, cellId) => {
    get()._push();
    set(s => ({
      sections: s.sections.map(sec => ({
        ...sec,
        rows: sec.rows.map(row => {
          if (row.id !== gridId || row.type !== 'grid') return row;
          return { ...row, cells: row.cells.filter(c => c.id !== cellId) };
        }),
      })),
    }));
  },

  addElementToCell: (secId, gridId, cellId, elementType, elementMap) => {
    get()._push();
    const defaultProps = elementMap?.[elementType]?.defaultProps || {};
    const el = makeElement(elementType, defaultProps);
    set(s => ({
      sections: s.sections.map(sec => {
        if (sec.id !== secId) return sec;
        return {
          ...sec,
          rows: sec.rows.map(row => {
            if (row.id !== gridId || row.type !== 'grid') return row;
            return {
              ...row,
              cells: row.cells.map(c =>
                c.id === cellId ? { ...c, elements: [...(c.elements || []), el] } : c
              ),
            };
          }),
        };
      }),
    }));
    return el.id;
  },

  reorderCellElements: (gridId, cellId, newElements) => {
    get()._push();
    set(s => ({
      sections: s.sections.map(sec => ({
        ...sec,
        rows: sec.rows.map(row => {
          if (row.id !== gridId || row.type !== 'grid') return row;
          return { ...row, cells: row.cells.map(c => c.id === cellId ? { ...c, elements: newElements } : c) };
        }),
      })),
    }));
  },

  // ── Element ops ────────────────────────────────────────────
  addElement: (secId, rowId, colId, elementType, elementMap) => {
    get()._push();
    const defaultProps = elementMap?.[elementType]?.defaultProps || {};
    const el = makeElement(elementType, defaultProps);
    set(s => ({
      sections: s.sections.map(sec =>
        sec.id === secId ? {
          ...sec,
          rows: sec.rows.map(row =>
            row.id === rowId ? {
              ...row,
              columns: mapCol(row.columns, colId, col => ({
                ...col,
                elements: [...(col.elements || []), el],
              })),
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
        rows: sec.rows.map(row => {
          if (row.type === 'grid') {
            return { ...row, cells: row.cells.map(c => ({ ...c, elements: (c.elements||[]).map(el => el.id===elId?{...el,props:{...el.props,...props}}:el) })) };
          }
          return { ...row, columns: mapAllCols(row.columns, col => ({ ...col, elements: (col.elements||[]).map(el => el.id===elId?{...el,props:{...el.props,...props}}:el) })) };
        }),
      })),
    })),

  deleteElement: (elId) => {
    get()._push();
    set(s => ({
      sections: s.sections.map(sec => ({
        ...sec,
        rows: sec.rows.map(row => {
          if (row.type === 'grid') {
            return { ...row, cells: row.cells.map(c => ({ ...c, elements: (c.elements||[]).filter(el=>el.id!==elId) })) };
          }
          return { ...row, columns: mapAllCols(row.columns, col => ({ ...col, elements: (col.elements||[]).filter(el=>el.id!==elId) })) };
        }),
      })),
    }));
  },

  moveElement: (elId, fromSecId, fromRowId, fromColId, toSecId, toRowId, toColId) => {
    get()._push();
    set(s => {
      let movedEl = null;
      const withRemoved = s.sections.map(sec => ({
        ...sec,
        rows: sec.rows.map(row => ({
          ...row,
          columns: mapAllCols(row.columns, col => {
            if (col.id !== fromColId) return col;
            const el = (col.elements || []).find(e => e.id === elId);
            if (el) movedEl = el;
            return { ...col, elements: (col.elements || []).filter(e => e.id !== elId) };
          }),
        })),
      }));
      if (!movedEl) return { sections: withRemoved };
      return {
        sections: withRemoved.map(sec => ({
          ...sec,
          rows: sec.rows.map(row => ({
            ...row,
            columns: mapAllCols(row.columns, col =>
              col.id !== toColId ? col : { ...col, elements: [...(col.elements || []), movedEl] }
            ),
          })),
        })),
      };
    });
  },

  reorderElements: (colId, rowId, newElements) => {
    get()._push();
    set(s => ({
      sections: s.sections.map(sec => ({
        ...sec,
        rows: sec.rows.map(row => ({
          ...row,
          columns: mapAllCols(row.columns, col =>
            col.id === colId ? { ...col, elements: newElements } : col
          ),
        })),
      })),
    }));
  },

  // ── Duplicate ops ──────────────────────────────────────────
  duplicateSection: (secId) => {
    if (singleSection) return;
    get()._push();
    set(s => {
      const idx = s.sections.findIndex(sec => sec.id === secId);
      if (idx === -1) return s;
      const clone = deepCloneWithNewIds(s.sections[idx]);
      clone.settings = { ...clone.settings, label: (clone.settings.label || 'Section') + ' Copy' };
      const next = [...s.sections];
      next.splice(idx + 1, 0, clone);
      return { sections: next };
    });
  },

  duplicateRow: (secId, rowId) => {
    get()._push();
    set(s => ({
      sections: s.sections.map(sec => {
        if (sec.id !== secId) return sec;
        const idx = sec.rows.findIndex(r => r.id === rowId);
        if (idx === -1) return sec;
        const clone = deepCloneWithNewIds(sec.rows[idx]);
        const next = [...sec.rows];
        next.splice(idx + 1, 0, clone);
        return { ...sec, rows: next };
      }),
    }));
  },

  duplicateElement: (secId, rowId, colId, elId) => {
    get()._push();
    set(s => ({
      sections: s.sections.map(sec => {
        if (sec.id !== secId) return sec;
        return {
          ...sec,
          rows: sec.rows.map(row => {
            if (row.id !== rowId) return row;
            return {
              ...row,
              columns: mapAllCols(row.columns, col => {
                if (col.id !== colId) return col;
                const idx = (col.elements || []).findIndex(e => e.id === elId);
                if (idx === -1) return col;
                const clone = deepCloneWithNewIds(col.elements[idx]);
                const next = [...col.elements];
                next.splice(idx + 1, 0, clone);
                return { ...col, elements: next };
              }),
            };
          }),
        };
      }),
    }));
  },

  // ── Persistence ────────────────────────────────────────────
  loadData: (data) => set({ sections: data?.sections || [], past: [], future: [] }),
  getData:  ()     => ({ sections: get().sections }),
});

// ── Export stores ──────────────────────────────────────────────────────────────

export const useHeaderStore = create((set, get) => createBuilderSlice('header', true)(set, get));
export const usePageStore   = create((set, get) => createBuilderSlice('page',   false)(set, get));
export const useFooterStore = create((set, get) => createBuilderSlice('footer', true)(set, get));

export const useGlobalStore = create((set) => ({
  activeHeaderId: 'header-1',
  activeFooterId: 'footer-1',
  pages: [
    { id: 'home',    slug: '/',        title: 'Home' },
    { id: 'about',   slug: 'about-us', title: 'About Us' },
    { id: 'contact', slug: 'contact',  title: 'Contact' },
  ],
  setActiveHeader: (id) => set({ activeHeaderId: id }),
  setActiveFooter: (id) => set({ activeFooterId: id }),
  addPage: (page) => set(s => ({ pages: [...s.pages, page] })),
  updatePage: (id, data) => set(s => ({ pages: s.pages.map(p => p.id === id ? { ...p, ...data } : p) })),
  deletePage: (id) => set(s => ({ pages: s.pages.filter(p => p.id !== id) })),
}));
