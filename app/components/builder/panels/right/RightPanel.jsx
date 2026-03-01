'use client';
import { X, Trash2, Layout, Layers, Columns, MousePointer2, AlignVerticalDistributeCenter } from 'lucide-react';
import { SectionProps } from './props/SectionProps';
import { RowProps }     from './props/RowProps';
import { ColProps }     from './props/ColProps';
import { ElementProps } from './props/ElementProps';
import { GridProps }     from './props/GridProps';
import { GridCellProps } from './props/GridCellProps';

const MODE_META = {
  section: { color: '#8B5CF6', label: 'Section',  Icon: Layout },
  row:     { color: '#10B981', label: 'Row',       Icon: Layers },
  col:     { color: '#3B82F6', label: 'Column',    Icon: Columns },
  subrow:   { color: '#6366F1', label: 'V-Row',     Icon: AlignVerticalDistributeCenter },
  grid:     { color: '#6366f1', label: 'Grid',      Icon: Layout },
  gridcell: { color: '#8b5cf6', label: 'Grid Cell', Icon: Columns },
  element:  { color: '#6366F1', label: 'Element',   Icon: MousePointer2 },
};

function ModeIcon({ mode, color }) {
  const { Icon } = MODE_META[mode] || MODE_META.element;
  return (
    <div style={{
      width: 32, height: 32, borderRadius: 8,
      background: `linear-gradient(135deg, ${color} 0%, ${color}DD 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: `0 2px 8px ${color}40`,
    }}>
      <Icon size={16} style={{ color: '#fff' }} />
    </div>
  );
}

export function RightPanel({ store, elementMap, onClose }) {
  const selectedId           = store(s => s.selectedId);
  const selectionMeta        = store(s => s.selectionMeta);
  const sections             = store(s => s.sections);
  const updateSection        = store(s => s.updateSection);
  const updateRow            = store(s => s.updateRow);
  const updateColumn         = store(s => s.updateColumn);
  const updateSubColSettings = store(s => s.updateSubColSettings);
  const updateSubRowSettings = store(s => s.updateSubRowSettings);
  const updateGrid           = store(s => s.updateGrid);
  const updateGridCell       = store(s => s.updateGridCell);
  const updateGridCellSpan   = store(s => s.updateGridCellSpan);
  const updateElement        = store(s => s.updateElement);
  const deleteElement        = store(s => s.deleteElement);

  if (!selectedId || !selectionMeta) return null;

  const mode = selectionMeta.mode;
  const meta = MODE_META[mode] || MODE_META.element;

  function findInCols(columns, depth = 0) {
    for (const col of columns || []) {
      if (mode === 'col' && col.id === selectedId) return { colData: col, depth };
      if (Array.isArray(col.columns) && col.columns.length > 0) {
        const found = findInCols(col.columns, depth + 1);
        if (found) return found;
      }
      if (Array.isArray(col.subRows) && col.subRows.length > 0) {
        for (const sr of col.subRows) {
          if (mode === 'subrow' && sr.id === selectedId) return { subRowData: sr, parentColId: col.id };
          const found = findInCols(sr.columns, depth + 1);
          if (found) return found;
          for (const subCol of sr.columns || []) {
            for (const el of subCol.elements || []) {
              if (mode === 'element' && el.id === selectedId) return { elemData: { el, col: subCol } };
            }
          }
        }
      }
      for (const el of col.elements || []) {
        if (mode === 'element' && el.id === selectedId) return { elemData: { el, col } };
      }
    }
    return null;
  }

  let sectionData = null, rowData = null, colData = null, elemData = null;
  let subRowData = null, subRowParentColId = null;
  let colDepth = 0;

  let gridData = null, gridCellData = null;

  outer: for (const sec of sections) {
    if (mode === 'section' && sec.id === selectedId) { sectionData = sec; break; }
    for (const row of sec.rows || []) {
      if (mode === 'grid' && row.type === 'grid' && row.id === selectedId) {
        gridData = row; sectionData = sec; break outer;
      }
      if (mode === 'gridcell' && row.type === 'grid') {
        const cell = (row.cells || []).find(c => c.id === selectedId);
        if (cell) { gridCellData = cell; gridData = row; sectionData = sec; break outer; }
      }
      if (mode === 'row' && row.id === selectedId) { rowData = row; sectionData = sec; break outer; }
      const found = findInCols(row.columns);
      if (found) {
        sectionData = sec; rowData = row;
        if (found.colData)    { colData = found.colData; colDepth = found.depth || 0; }
        if (found.elemData)   { elemData = { ...found.elemData, row, sec }; }
        if (found.subRowData) { subRowData = found.subRowData; subRowParentColId = found.parentColId; }
        break outer;
      }
    }
  }
  const isSubCol = colDepth > 0;

  return (
    <div style={{
      width: 300, flexShrink: 0, display: 'flex', flexDirection: 'column',
      borderLeft: '1px solid #E2E8F0', background: '#FFFFFF', height: '100%',
      fontFamily: 'Inter, sans-serif', boxShadow: '-4px 0 24px rgba(0,0,0,0.02)',
    }}>
      <div style={{
        padding: '16px 20px', borderBottom: '1px solid #E2E8F0', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#FFFFFF',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ModeIcon mode={mode} color={meta.color} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>{meta.label}</span>
            <span style={{ fontSize: 10, fontWeight: 500, color: '#64748B' }}>Properties</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {mode === 'element' && elemData && (
            <button onClick={() => { deleteElement(selectedId); onClose?.(); }} title="Delete Element"
              style={{ width: 28, height: 28, borderRadius: 6, border: 'none', cursor: 'pointer', background: '#FEF2F2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#FEE2E2')}
              onMouseLeave={e => (e.currentTarget.style.background = '#FEF2F2')}
            ><Trash2 size={14} /></button>
          )}
          <button onClick={onClose} title="Close Panel"
            style={{ width: 28, height: 28, borderRadius: 6, border: 'none', cursor: 'pointer', background: '#F1F5F9', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#E2E8F0'; e.currentTarget.style.color = '#0F172A'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.color = '#64748B'; }}
          ><X size={16} /></button>
        </div>
      </div>

      <div style={{
        flex: 1, overflowY: 'auto', padding: '20px',
        scrollbarWidth: 'thin', scrollbarColor: '#CBD5E1 transparent',
        display: 'flex', flexDirection: 'column', gap: 0,
      }}>
        {mode === 'section' && sectionData && (
          <SectionProps section={sectionData} onChange={(s) => updateSection(sectionData.id, s)} />
        )}
        {mode === 'row' && rowData && (
          <RowProps row={rowData} onChange={(s) => updateRow(rowData.id, s)} />
        )}
        {mode === 'col' && colData && rowData && sectionData && (
          <ColProps
            col={colData} isSubCol={isSubCol} colDepth={colDepth}
            onChange={(s) => {
              if (isSubCol) updateSubColSettings(colData.id, s);
              else updateColumn(sectionData.id, rowData.id, colData.id, s);
            }}
          />
        )}
        {mode === 'subrow' && subRowData && subRowParentColId && (
          <ColProps
            col={{ id: subRowData.id, settings: subRowData.settings || {} }}
            isSubCol={true} colDepth={1}
            onChange={(s) => updateSubRowSettings(subRowParentColId, subRowData.id, s)}
          />
        )}
        {mode === 'grid' && gridData && (
          <GridProps grid={gridData} onChange={(s) => updateGrid(gridData.id, s)} />
        )}
        {mode === 'gridcell' && gridCellData && gridData && (
          <GridCellProps
            cell={gridCellData}
            grid={gridData}
            onChangeCellSettings={(s) => updateGridCell(gridData.id, gridCellData.id, s)}
            onChangeCellSpan={(s) => updateGridCellSpan(gridData.id, gridCellData.id, s)}
          />
        )}
        {mode === 'element' && elemData && (
          <ElementProps el={elemData.el} elementMap={elementMap} onChange={(patch) => updateElement(elemData.el.id, patch)} />
        )}
        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}
