'use client';
import { useState, useRef } from 'react';
import { TreeItem } from './components/TreeItem';
import { Icons } from './components/Icons';
import { depthPalette } from '../../../../constants/theme';

// dc(depth) → { col, bg } — maps to depthPalette accent/light
const dc = (d) => { const p = depthPalette(d); return { col: p.accent, bg: p.light }; };

/**
 * Recursive col tree item.
 * When col.columns.length > 0, the col acts as a "row" — we show "→ROW" badge.
 */
function ColTreeItem({
  col, depth, indent, label,
  selectedId, collapsed, toggle,
  elementMap,
  onSelectCol, onDeleteSubCol, onClearNesting, onSelectElem, onDeleteElement,
  onSelectSubRow,
  secId, rowId,
  onElDragStart, onElDragOver, onElDrop,
}) {
  const [hover, setHover] = useState(false);
  const color = dc(depth);

  const isRow = Array.isArray(col.columns) && col.columns.length > 0;
  const isVRows = !isRow && Array.isArray(col.subRows) && col.subRows.length > 0;
  const hasElements = !isRow && !isVRows && (col.elements || []).length > 0;
  const hasChildren = isRow || isVRows || hasElements;
  const isSelected = selectedId === col.id;
  const isOpen = !collapsed[col.id];

  return (
    <div>
      {/* ── Row ──────────────────────────────────────────────── */}
      <div
        onClick={e => { e.stopPropagation(); onSelectCol?.(col.id, { secId, rowId, colId: col.id }); }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '5px 8px', paddingLeft: indent,
          marginRight: 8, marginTop: 1, marginBottom: 1,
          borderRadius: 6, cursor: 'pointer', userSelect: 'none',
          transition: 'all 0.14s',
          background: isSelected ? color.bg : hover ? '#f1f5f9' : 'transparent',
          borderLeft: `3px solid ${isSelected ? color.col : 'transparent'}`,
        }}
      >
        {/* Toggle */}
        <div
          onClick={e => { e.stopPropagation(); toggle(col.id); }}
          style={{
            width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: hasChildren ? 'pointer' : 'default', color: '#94a3b8',
            opacity: hasChildren ? 1 : 0, flexShrink: 0,
          }}
        >
          <span style={{
            fontSize: 10, display: 'inline-block',
            transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.14s',
          }}>▶</span>
        </div>

        {/* Badge — "R" if this col acts as a row, "C" otherwise */}
        <span style={{
          width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 9, fontWeight: 800, borderRadius: 4, flexShrink: 0,
          background: color.bg, color: color.col,
        }}>
          {isRow ? 'R' : (depth === 0 ? 'C' : '↳')}
        </span>

        {/* Label */}
        <span style={{
          fontSize: 12, fontWeight: isSelected ? 600 : 500, flex: 1,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          color: isSelected ? '#1e293b' : '#475569',
        }}>
          {label}
        </span>

        {/* →ROW badge */}
        {isRow && (
          <span style={{
            fontSize: 8, fontWeight: 800, padding: '2px 5px',
            background: color.bg, color: color.col,
            borderRadius: 4, flexShrink: 0, letterSpacing: '0.04em',
          }}>
            →ROW
          </span>
        )}
        {/* →VROWS badge */}
        {isVRows && (
          <span style={{
            fontSize: 8, fontWeight: 800, padding: '2px 5px',
            background: '#eef2ff', color: '#6366f1',
            borderRadius: 4, flexShrink: 0, letterSpacing: '0.04em',
          }}>
            ↕VROWS
          </span>
        )}

        {/* Clear nesting (only on cols that are rows) — always reserve space */}
        {isRow && onClearNesting && (
          <button
            onClick={e => { e.stopPropagation(); onClearNesting(col.id); }}
            title="Remove Row (clear sub-columns)"
            style={{
              fontSize: 9, fontWeight: 700, padding: '2px 6px',
              background: '#fff7ed', color: '#ea580c',
              border: '1px solid #fed7aa', borderRadius: 5,
              cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap',
              visibility: hover ? 'visible' : 'hidden',
              pointerEvents: hover ? 'auto' : 'none',
            }}
          >✕ Row</button>
        )}

        {/* Delete col (any depth, non-row cols) — always reserve space */}
        {!isRow && onDeleteSubCol && (
          <button
            onClick={e => { e.stopPropagation(); onDeleteSubCol(col.id); }}
            title="Delete column"
            style={{
              width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: '#fee2e2', color: '#ef4444',
              border: 'none', borderRadius: 5, cursor: 'pointer', flexShrink: 0,
              visibility: hover ? 'visible' : 'hidden',
              pointerEvents: hover ? 'auto' : 'none',
            }}
          >✕</button>
        )}
      </div>

      {/* ── Children ─────────────────────────────────────────── */}
      {isOpen && (
        <>
          {/* Sub-cols (this col acts as a row) */}
          {isRow && col.columns.map((subCol, sci) => (
            <ColTreeItem
              key={subCol.id}
              col={subCol}
              depth={depth + 1}
              indent={indent + 16}
              label={`Col ${sci + 1}`}
              selectedId={selectedId}
              collapsed={collapsed}
              toggle={toggle}
              elementMap={elementMap}
              onSelectCol={onSelectCol}
              onDeleteSubCol={onDeleteSubCol}
              onClearNesting={onClearNesting}
              onSelectElem={onSelectElem}
              onDeleteElement={onDeleteElement}
              onSelectSubRow={onSelectSubRow}
              secId={secId} rowId={rowId}
              onElDragStart={onElDragStart}
              onElDragOver={onElDragOver}
              onElDrop={onElDrop}
            />
          ))}

          {/* Vertical sub-rows */}
          {isVRows && col.subRows.map((sr, sri) => (
            <SubRowTreeItem
              key={sr.id}
              subRow={sr}
              parentColId={col.id}
              indent={indent + 16}
              rowIndex={sri}
              selectedId={selectedId}
              collapsed={collapsed}
              toggle={toggle}
              elementMap={elementMap}
              onSelectCol={onSelectCol}
              onDeleteSubCol={onDeleteSubCol}
              onClearNesting={onClearNesting}
              onSelectElem={onSelectElem}
              onDeleteElement={onDeleteElement}
              onSelectSubRow={onSelectSubRow}
              secId={secId} rowId={rowId}
              onElDragStart={onElDragStart}
              onElDragOver={onElDragOver}
              onElDrop={onElDrop}
            />
          ))}

          {/* Direct elements */}
          {hasElements && col.elements.map((el, eli) => (
            <div
              key={el.id}
              draggable
              onDragStart={e => onElDragStart?.(e, col.id, rowId, secId, el.id, eli)}
              onDragOver={e => onElDragOver?.(e, col.id, el.id)}
              onDrop={e => onElDrop?.(e, col, el.id, eli)}
              onDragEnd={e => e.currentTarget.style.opacity = '1'}
              style={{ cursor: 'grab' }}
            >
              <TreeItem
                type="elem"
                label={el.props?.content || el.props?.text || elementMap?.[el.type]?.label || el.type}
                depth={indent + 16}
                isSel={selectedId === el.id}
                icon={elementMap?.[el.type]?.icon || '●'}
                onClick={() => onSelectElem(el.id, { secId, rowId, colId: col.id })}
                onDelete={onDeleteElement ? () => onDeleteElement(el.id) : undefined}
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// ── SubRowTreeItem — a vertical sub-row in the layer tree ─────────────────────
function SubRowTreeItem({
  subRow, parentColId, indent, rowIndex,
  selectedId, collapsed, toggle, elementMap,
  onSelectCol, onDeleteSubCol, onClearNesting, onSelectElem, onDeleteElement, onSelectSubRow,
  secId, rowId,
  onElDragStart, onElDragOver, onElDrop,
}) {
  const [hover, setHover] = useState(false);
  const isSelected = selectedId === subRow.id;
  const isOpen = !collapsed[subRow.id];
  const hasChildren = (subRow.columns || []).length > 0;

  return (
    <div>
      <div
        onClick={e => { e.stopPropagation(); onSelectSubRow?.(subRow.id, { secId, rowId, colId: parentColId, subRowId: subRow.id }); }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '5px 8px', paddingLeft: indent,
          marginRight: 8, marginTop: 1, marginBottom: 1,
          borderRadius: 6, cursor: 'pointer', userSelect: 'none',
          transition: 'all 0.14s',
          background: isSelected ? '#eef2ff' : hover ? '#f1f5f9' : 'transparent',
          borderLeft: `3px solid ${isSelected ? '#6366f1' : 'transparent'}`,
        }}
      >
        <div
          onClick={e => { e.stopPropagation(); toggle(subRow.id); }}
          style={{ width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: hasChildren ? 'pointer' : 'default', color: '#94a3b8', opacity: hasChildren ? 1 : 0, flexShrink: 0 }}
        >
          <span style={{ fontSize: 10, display: 'inline-block', transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.14s' }}>▶</span>
        </div>
        <span style={{ width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, borderRadius: 4, flexShrink: 0, background: '#eef2ff', color: '#6366f1' }}>↕</span>
        <span style={{ fontSize: 12, fontWeight: isSelected ? 600 : 500, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: isSelected ? '#1e293b' : '#475569' }}>
          V-Row {rowIndex + 1}
        </span>
        <span style={{ fontSize: 8, fontWeight: 800, padding: '2px 5px', background: '#eef2ff', color: '#6366f1', borderRadius: 4, flexShrink: 0 }}>VROW</span>
      </div>
      {isOpen && hasChildren && (
        <div>
          {subRow.columns.map((subCol, sci) => (
            <ColTreeItem
              key={subCol.id}
              col={subCol}
              depth={1}
              indent={indent + 16}
              label={`Col ${sci + 1}`}
              selectedId={selectedId}
              collapsed={collapsed}
              toggle={toggle}
              elementMap={elementMap}
              onSelectCol={onSelectCol}
              onDeleteSubCol={onDeleteSubCol}
              onClearNesting={onClearNesting}
              onSelectElem={onSelectElem}
              onDeleteElement={onDeleteElement}
              onSelectSubRow={onSelectSubRow}
              secId={secId} rowId={rowId}
              onElDragStart={onElDragStart}
              onElDragOver={onElDragOver}
              onElDrop={onElDrop}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Helper: check if a string matches a search term
function matchesSearch(str, term) {
  if (!term) return true;
  return str.toLowerCase().includes(term.toLowerCase());
}

// Check if any node in a col tree matches search
function colTreeMatches(col, elementMap, term) {
  if (!term) return true;
  const colLabel = col.settings?.label || '';
  if (matchesSearch(colLabel, term)) return true;
  for (const el of col.elements || []) {
    const elLabel = el.props?.content || el.props?.text || elementMap?.[el.type]?.label || el.type || '';
    if (matchesSearch(elLabel, term)) return true;
  }
  for (const subCol of col.columns || []) {
    if (colTreeMatches(subCol, elementMap, term)) return true;
  }
  for (const sr of col.subRows || []) {
    for (const c of sr.columns || []) {
      if (colTreeMatches(c, elementMap, term)) return true;
    }
  }
  return false;
}

export function LayersPanel({
  sections = [],
  selectedId,
  elementMap,
  searchTerm = '',
  onSelectSection,
  onSelectRow,
  onSelectCol,
  onSelectSubCol,
  onSelectElem,
  onSelectSubRow,
  onDeleteSection,
  onDeleteRow,
  onDeleteElement,
  onClearNesting,
  onDeleteSubCol,
  onReorderRows,
  onReorderElements,
  singleSection,
}) {
  const [collapsed, setCollapsed] = useState({});
  const toggle = (id) => setCollapsed(p => ({ ...p, [id]: !p[id] }));

  // ── drag state ─────────────────────────────────────────────
  const dragRef = useRef(null); // { type:'row'|'element', secId, rowId?, colId?, id, index }

  const handleRowDragStart = (e, secId, rowId, idx) => {
    e.stopPropagation();
    dragRef.current = { type: 'row', secId, id: rowId, index: idx };
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleRowDragOver = (e, secId, rowId, idx) => {
    const d = dragRef.current;
    if (!d || d.type !== 'row' || d.secId !== secId || d.id === rowId) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleRowDrop = (e, sec, targetRowId, targetIdx) => {
    e.preventDefault(); e.stopPropagation();
    const d = dragRef.current;
    if (!d || d.type !== 'row' || d.secId !== sec.id || d.id === targetRowId) return;
    const rows = [...sec.rows];
    const fromIdx = rows.findIndex(r => r.id === d.id);
    if (fromIdx < 0) return;
    const [moved] = rows.splice(fromIdx, 1);
    rows.splice(targetIdx, 0, moved);
    onReorderRows?.(sec.id, rows);
    dragRef.current = null;
  };

  const handleElDragStart = (e, colId, rowId, secId, elId, idx) => {
    e.stopPropagation();
    dragRef.current = { type: 'element', colId, rowId, secId, id: elId, index: idx };
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleElDragOver = (e, colId, elId) => {
    const d = dragRef.current;
    if (!d || d.type !== 'element' || d.colId !== colId || d.id === elId) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleElDrop = (e, col, targetElId, targetIdx) => {
    e.preventDefault(); e.stopPropagation();
    const d = dragRef.current;
    if (!d || d.type !== 'element' || d.colId !== col.id || d.id === targetElId) return;
    const elements = [...(col.elements || [])];
    const fromIdx = elements.findIndex(el => el.id === d.id);
    if (fromIdx < 0) return;
    const [moved] = elements.splice(fromIdx, 1);
    elements.splice(targetIdx, 0, moved);
    onReorderElements?.(col.id, d.rowId, elements);
    dragRef.current = null;
  };

  if (!sections.length) {
    return (
      <div style={{ padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.5 }}>
        <Icons.Layers />
        <span style={{ fontSize: 12, marginTop: 8, color: '#64748B' }}>No layers yet</span>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 20 }}>
      {searchTerm && (
        <div style={{ padding: '6px 12px 2px', fontSize: 10, fontWeight: 700, color: '#6366f1', background: '#eef2ff', borderBottom: '1px solid #e0e7ff' }}>
          Filtering layers: "{searchTerm}"
        </div>
      )}
      {sections.map((sec, si) => {
        const secLabel = sec.settings?.label || `Section ${si + 1}`;
        const secMatches = !searchTerm || matchesSearch(secLabel, searchTerm) ||
          (sec.rows || []).some(row => {
            const rowLabel = row.settings?.label || `Row ${si + 1}`;
            return matchesSearch(rowLabel, searchTerm) ||
              (row.columns || []).some(col => colTreeMatches(col, elementMap, searchTerm));
          });
        if (!secMatches) return null;
        return (
        <div key={sec.id}>
          <TreeItem
            type="section"
            label={secLabel}
            depth={4}
            isSel={selectedId === sec.id}
            hasChildren={(sec.rows || []).length > 0}
            expanded={!collapsed[sec.id]}
            onToggle={() => toggle(sec.id)}
            onClick={() => onSelectSection(sec.id)}
            onDelete={!singleSection && onDeleteSection ? () => onDeleteSection(sec.id) : undefined}
          />

          {!collapsed[sec.id] && sec.rows?.map((row, ri) => {
            const rowLabel = row.settings?.label || `Row ${ri + 1}`;
            const rowMatches = !searchTerm || matchesSearch(rowLabel, searchTerm) ||
              (row.columns || []).some(col => colTreeMatches(col, elementMap, searchTerm));
            if (!rowMatches) return null;
            return (
            <div
              key={row.id}
              draggable
              onDragStart={e => handleRowDragStart(e, sec.id, row.id, ri)}
              onDragOver={e => handleRowDragOver(e, sec.id, row.id, ri)}
              onDrop={e => handleRowDrop(e, sec, row.id, ri)}
              onDragEnd={() => { dragRef.current = null; }}
              style={{ cursor: 'grab' }}
            >
              <TreeItem
                type="row"
                label={row.settings?.label || `Row ${ri + 1}`}
                depth={20}
                isSel={selectedId === row.id}
                hasChildren={(row.columns || []).length > 0}
                expanded={!collapsed[row.id]}
                onToggle={() => toggle(row.id)}
                onClick={() => onSelectRow?.(row.id)}
                onDelete={onDeleteRow ? () => onDeleteRow(sec.id, row.id) : undefined}
                dragHandle
              />

              {!collapsed[row.id] && row.columns?.map((col, ci) => (
                <ColTreeItem
                  key={col.id}
                  col={col}
                  depth={0}
                  indent={36}
                  label={`Column ${ci + 1}`}
                  selectedId={selectedId}
                  collapsed={collapsed}
                  toggle={toggle}
                  elementMap={elementMap}
                  onSelectCol={onSelectCol}
                  onDeleteSubCol={onDeleteSubCol}
                  onClearNesting={onClearNesting}
                  onSelectElem={onSelectElem}
                  onDeleteElement={onDeleteElement}
                  onSelectSubRow={onSelectSubRow}
                  secId={sec.id} rowId={row.id}
                  onElDragStart={handleElDragStart}
                  onElDragOver={handleElDragOver}
                  onElDrop={handleElDrop}
                />
              ))}
            </div>
          );
          })}
        </div>
        );
      })}
    </div>
  );
}
