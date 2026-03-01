/**
 * CanvasColumn.jsx
 * Supports:
 *  1. Leaf column  → direct elements
 *  2. Horizontal   → col.columns (sub-cols via "Make Row")  
 *  3. Vertical     → col.subRows (vertical stacked sub-rows, each with columns)
 */
'use client';
import { useState, useRef, useEffect } from 'react';
import { Plus, Rows3, X, Trash2, LayoutList, GripVertical, Copy } from 'lucide-react';
import { T, depthPalette } from '../../constants/theme';
import { resolveBgStyle } from '../../lib/bgStyle';
import { colSettingsToStyle, colAnimAttrs, colParallaxAttrs } from '../../lib/colSettingsToStyle';
import { ResizableGrid } from './ResizableGrid';

// ── CornerToolbar ─────────────────────────────────────────────────────────────
function CornerToolbar({ col, depth, isHRow, isVRows, p, onOpenColModal, onClearNesting, onDeleteSubCol, onAddSubRow, onClearSubRows }) {
  const [expanded, setExpanded] = useState(false);

  let label = depth === 0 ? 'COL' : `S${depth}`;
  if (isHRow)  label = depth === 0 ? 'C→R' : `S${depth}→R`;
  if (isVRows) label = 'C→ROWS';

  return (
    <div
      style={{ position: 'absolute', top: 3, right: 3, zIndex: 400, display: 'flex', alignItems: 'center', gap: 2 }}
      onClick={e => e.stopPropagation()}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, overflow: 'hidden', maxWidth: expanded ? 240 : 0, opacity: expanded ? 1 : 0, transition: 'max-width 0.18s ease, opacity 0.15s ease', pointerEvents: expanded ? 'auto' : 'none' }}>
        {/* Make Row (horizontal sub-cols) */}
        {!isVRows && (
          <button onClick={e => { e.stopPropagation(); onOpenColModal?.(col.id); setExpanded(false); }} title={isHRow ? 'Change layout' : 'Make H-Row'} style={iconBtn(p.accent, p.light)}>
            <Rows3 size={11} />
          </button>
        )}
        {/* Add vertical sub-rows */}
        {!isHRow && (
          <button onClick={e => { e.stopPropagation(); onAddSubRow?.(col.id); setExpanded(false); }} title={isVRows ? 'Add Row inside' : 'Make V-Rows'} style={iconBtn('#10b981', '#ecfdf5')}>
            <LayoutList size={11} />
          </button>
        )}
        {/* Remove H-Row */}
        {isHRow && onClearNesting && (
          <button onClick={e => { e.stopPropagation(); onClearNesting(col.id); setExpanded(false); }} title="Remove Row" style={iconBtn('#ea580c', '#fff7ed')}>
            <X size={11} />
          </button>
        )}
        {/* Remove V-Rows */}
        {isVRows && onClearSubRows && (
          <button onClick={e => { e.stopPropagation(); onClearSubRows(col.id); setExpanded(false); }} title="Remove all sub-rows" style={iconBtn('#ea580c', '#fff7ed')}>
            <X size={11} />
          </button>
        )}
        {/* Delete sub-col */}
        {depth > 0 && onDeleteSubCol && (
          <button onClick={e => { e.stopPropagation(); onDeleteSubCol(col.id); }} title="Delete column" style={iconBtn('#ef4444', '#fee2e2')}>
            <Trash2 size={10} />
          </button>
        )}
      </div>
      <span style={{ fontSize: 8, fontWeight: 800, color: p.accent, background: p.light, border: `1px solid ${p.accent}40`, padding: '2px 5px', borderRadius: 4, cursor: 'default', userSelect: 'none', whiteSpace: 'nowrap', lineHeight: 1.4, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        {label}
      </span>
    </div>
  );
}

// ── SubRowBar — toolbar inside each vertical sub-row ─────────────────────────
function SubRowBar({ subRow, colId, isFirst, isLast, onAddCol, onDeleteCol, onDeleteSubRow, onAddSubRowBelow }) {
  const [show, setShow] = useState(false);
  return (
    <div
      style={{ position: 'absolute', top: 2, right: 2, zIndex: 300, display: 'flex', alignItems: 'center', gap: 2 }}
      onClick={e => e.stopPropagation()}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, overflow: 'hidden', maxWidth: show ? 220 : 0, opacity: show ? 1 : 0, transition: 'max-width 0.16s, opacity 0.14s', pointerEvents: show ? 'auto' : 'none' }}>
        <Btn onClick={onAddCol} title="Add Column" color={T.primary} bg={`${T.primary}15`}><Plus size={10} /></Btn>
        {subRow.columns.length > 1 && <Btn onClick={onDeleteCol} title="Remove last col" color="#f59e0b" bg="#fffbeb"><Trash2 size={9} /></Btn>}
        <div style={{ width: 1, height: 12, background: '#e2e8f0', margin: '0 1px' }} />
        <Btn onClick={onAddSubRowBelow} title="Add row below" color="#10b981" bg="#ecfdf5"><Plus size={10} /></Btn>
        <Btn onClick={onDeleteSubRow} title="Delete this row" color="#ef4444" bg="#fee2e2"><Trash2 size={9} /></Btn>
      </div>
      <span style={{ fontSize: 8, fontWeight: 700, color: '#64748b', background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '1px 5px', borderRadius: 4, userSelect: 'none', lineHeight: 1.5 }}>
        ROW
      </span>
    </div>
  );
}

function Btn({ onClick, title, color, bg, children }) {
  return (
    <button onClick={e => { e.stopPropagation(); onClick?.(); }} title={title}
      style={{ width: 20, height: 20, border: 'none', background: bg || '#f1f5f9', color: color || '#64748b', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {children}
    </button>
  );
}

// ── Main CanvasColumn ─────────────────────────────────────────────────────────
export function CanvasColumn({
  col,
  rowId, secId,
  selectedId, selectedColId,
  elementMap,
  onSelectEl,
  onSelectCol,
  onAddElement,
  onMoveEl,
  onReorderEl,
  onDuplicateEl,
  onDeleteEl,
  onOpenColModal,
  onDeleteSubCol,
  onClearNesting,
  onResizeSubCols,
  onSelectSubCol,
  onUpdateCol,
  onUpdateSubCol,
  // sub-row ops
  onAddSubRow,
  onDeleteSubRow,
  onAddSubRowCol,
  onDeleteSubRowCol,
  onResizeSubRowCols,
  onClearSubRows,
  onSelectSubRow,
  depth = 0,
}) {
  const [isOver,      setIsOver]      = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [hovered,     setHovered]     = useState(false);
  const [resizing,    setResizing]    = useState(false);

  const isSelected = selectedColId === col.id;
  const s          = col.settings || {};
  const isHRow     = Array.isArray(col.columns) && col.columns.length > 0;
  const isVRows    = !isHRow && Array.isArray(col.subRows) && col.subRows.length > 0;
  const p          = depthPalette(depth);
  const showTools  = hovered || isSelected;

  const settingsStyle = colSettingsToStyle(s, { depth, isRow: isHRow });
  const colRef = useRef(null);

  // ── Bottom height drag handle ─────────────────────────────────────────────
  const handleHeightDragStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const startY = e.clientY;
    const startH = colRef.current ? colRef.current.getBoundingClientRect().height : (s.minHeight || 0);
    setResizing(true);

    const onMove = (me) => {
      const newH = Math.max(40, Math.round(startH + (me.clientY - startY)));
      if (colRef.current) colRef.current.style.minHeight = `${newH}px`;
    };
    const onUp = (me) => {
      const newH = Math.max(40, Math.round(startH + (me.clientY - startY)));
      setResizing(false);
      if (colRef.current) colRef.current.style.minHeight = '';
      // persist: use updateCol for top-level, updateSubCol for nested
      if (depth === 0 && onUpdateCol) {
        onUpdateCol(secId, rowId, col.id, { minHeight: newH });
      } else if (depth > 0 && onUpdateSubCol) {
        onUpdateSubCol(col.id, { minHeight: newH });
      }
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // Entrance animation
  useEffect(() => {
    const el = colRef.current;
    if (!el || !s.animation || s.animation === 'none') return;
    const keyframes = {
      fadeIn:     [{ opacity: 0 }, { opacity: 1 }],
      fadeUp:     [{ opacity: 0, transform: 'translateY(30px)' }, { opacity: 1, transform: 'translateY(0)' }],
      fadeDown:   [{ opacity: 0, transform: 'translateY(-30px)' }, { opacity: 1, transform: 'translateY(0)' }],
      slideLeft:  [{ opacity: 0, transform: 'translateX(-40px)' }, { opacity: 1, transform: 'translateX(0)' }],
      slideRight: [{ opacity: 0, transform: 'translateX(40px)' }, { opacity: 1, transform: 'translateX(0)' }],
      zoomIn:     [{ opacity: 0, transform: 'scale(0.85)' }, { opacity: 1, transform: 'scale(1)' }],
      flipX:      [{ opacity: 0, transform: 'rotateX(60deg)' }, { opacity: 1, transform: 'rotateX(0)' }],
    };
    const frames = keyframes[s.animation];
    if (!frames) return;
    el.animate(frames, {
      duration: s.animDuration ?? 600,
      delay:    s.animDelay    ?? 0,
      easing:   s.animEasing   || 'ease',
      fill:     'both',
    });
  }, [s.animation, s.animDuration, s.animDelay, s.animEasing]);

  // Parallax scroll
  useEffect(() => {
    if (!s.parallax) return;
    const el = colRef.current;
    if (!el) return;
    const parallaxDepth = (s.parallaxDepth ?? 30) / 100;
    const handler = () => {
      const rect = el.getBoundingClientRect();
      const vy   = window.innerHeight;
      const offset = ((rect.top + rect.height / 2 - vy / 2) / vy) * parallaxDepth * 80;
      el.style.transform = `translateY(${offset}px)`;
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [s.parallax, s.parallaxDepth]);

  const processDropPayload = (e) => {
    try {
      const raw = e.dataTransfer.getData('hb-drag');
      if (!raw) return;
      const payload = JSON.parse(raw);
      if (payload.newType) {
        onAddElement(secId, rowId, col.id, payload.newType);
      } else if (payload.elId) {
        if (payload.fromColId !== col.id) {
          // Cross-column move
          onMoveEl?.(payload.elId, payload.fromSecId, payload.fromRowId, payload.fromColId, secId, rowId, col.id);
        }
      }
    } catch (err) {
      console.warn('[CanvasColumn] Drop parse error:', err);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setIsOver(false);
    if (isHRow || isVRows) return;
    processDropPayload(e);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    const selectFn = (onSelectSubCol && depth > 0) ? onSelectSubCol : onSelectCol;
    selectFn(isSelected ? null : col.id);
  };

  let outlineStyle = 'none';
  if (isSelected)    outlineStyle = `2px solid ${p.accent}`;
  else if (isOver)   outlineStyle = `3px dashed ${p.accent}`;
  else if (hovered)  outlineStyle = `1px solid ${p.accent}40`;

  return (
    <div
      style={{ position: 'relative', width: '100%', minWidth: 0, boxSizing: 'border-box', overflow: 'visible' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        ref={colRef}
        onClick={handleClick}
        onDragOver={e => { if (!isHRow && !isVRows) { e.preventDefault(); e.stopPropagation(); setIsOver(true); } }}
        onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget)) setIsOver(false); }}
        onDrop={handleDrop}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: isHRow ? 'row' : 'column',
          alignItems: isHRow ? 'stretch' : (s.valign === 'center' ? 'center' : s.valign === 'bottom' ? 'flex-end' : 'flex-start'),
          ...settingsStyle,
          minHeight: s.minHeight ? Math.max(s.minHeight, 36) : Math.max(36, 60 - depth * 5),
          width: '100%', minWidth: 0, boxSizing: 'border-box',
          cursor: 'pointer',
          ...(isHRow && !s.bg ? { background: p.light } : {}),
          ...(isHRow ? { border: `1.5px dashed ${p.accent}30` } : {}),
          ...(isVRows ? { background: '#f8fafc', border: `1.5px dashed #10b98130`, gap: 0, padding: 0 } : {}),
          ...(s.depthHover && hovered ? { boxShadow: `0 ${Math.round((s.depthIntensity ?? 40) / 5)}px ${Math.round((s.depthIntensity ?? 40) / 2)}px rgba(0,0,0,${(s.depthIntensity ?? 40) / 300})`, transform: 'translateY(-2px)' } : {}),
          outline: outlineStyle,
          outlineOffset: -2,
          transition: 'outline 0.15s',
          overflow: 'visible',
        }}
      >
        {/* ── Corner toolbar ──────────────────────────────── */}
        {showTools && (
          <CornerToolbar
            col={col}
            depth={depth}
            isHRow={isHRow}
            isVRows={isVRows}
            p={p}
            onOpenColModal={onOpenColModal}
            onClearNesting={onClearNesting}
            onDeleteSubCol={onDeleteSubCol}
            onAddSubRow={onAddSubRow}
            onClearSubRows={onClearSubRows}
          />
        )}

        {/* ── HORIZONTAL SUB-COLS ─────────────────────────── */}
        {isHRow && (
          <ResizableGrid columns={col.columns} colWidths={col.colWidths} gap={s.gap ?? 8} onResize={onResizeSubCols} containerId={col.id}>
            {col.columns.map(subCol => (
              <CanvasColumn
                key={subCol.id}
                col={subCol} rowId={rowId} secId={secId}
                selectedId={selectedId} selectedColId={selectedColId}
                elementMap={elementMap}
                onSelectEl={onSelectEl} onSelectCol={onSelectCol}
                onAddElement={onAddElement} onMoveEl={onMoveEl} onReorderEl={onReorderEl} onDuplicateEl={onDuplicateEl} onDeleteEl={onDeleteEl}
                onOpenColModal={onOpenColModal}
                onDeleteSubCol={onDeleteSubCol} onClearNesting={onClearNesting}
                onResizeSubCols={onResizeSubCols} onSelectSubCol={onSelectSubCol}
                onAddSubRow={onAddSubRow} onDeleteSubRow={onDeleteSubRow}
                onAddSubRowCol={onAddSubRowCol} onDeleteSubRowCol={onDeleteSubRowCol}
                onResizeSubRowCols={onResizeSubRowCols} onClearSubRows={onClearSubRows}
                onUpdateCol={onUpdateCol} onUpdateSubCol={onUpdateSubCol}
                onSelectSubRow={onSelectSubRow}
                depth={depth + 1}
              />
            ))}
          </ResizableGrid>
        )}

        {/* ── VERTICAL SUB-ROWS ───────────────────────────── */}
        {isVRows && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            {col.subRows.map((sr, sri) => (
              <CanvasSubRow
                key={sr.id}
                subRow={sr}
                parentColId={col.id}
                secId={secId} rowId={rowId}
                selectedId={selectedId} selectedColId={selectedColId}
                elementMap={elementMap}
                onSelectEl={onSelectEl} onSelectCol={onSelectCol}
                onAddElement={onAddElement} onMoveEl={onMoveEl} onReorderEl={onReorderEl} onDuplicateEl={onDuplicateEl} onDeleteEl={onDeleteEl}
                onOpenColModal={onOpenColModal}
                onDeleteSubCol={onDeleteSubCol} onClearNesting={onClearNesting}
                onResizeSubCols={onResizeSubCols} onSelectSubCol={onSelectSubCol}
                onAddSubRow={onAddSubRow} onDeleteSubRow={onDeleteSubRow}
                onAddSubRowCol={onAddSubRowCol} onDeleteSubRowCol={onDeleteSubRowCol}
                onResizeSubRowCols={onResizeSubRowCols} onClearSubRows={onClearSubRows}
                isFirst={sri === 0}
                isLast={sri === col.subRows.length - 1}
                depth={depth}
                onUpdateCol={onUpdateCol}
                onUpdateSubCol={onUpdateSubCol}
                onSelectSubRow={onSelectSubRow}
              />
            ))}
            {/* Add row at bottom */}
            <button
              onClick={e => { e.stopPropagation(); onAddSubRow?.(col.id); }}
              style={{ margin: '4px 6px 6px', padding: '5px', fontSize: 10, fontWeight: 600, color: '#10b981', background: '#f0fdf4', border: '1.5px dashed #10b98160', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
            >
              <Plus size={10} /> Add Row
            </button>
          </div>
        )}

        {/* ── LEAF ELEMENTS ───────────────────────────────── */}
        {!isHRow && !isVRows && (
          <>
            {(col.elements || []).length === 0 ? (
              <EmptySlot
                isOver={isOver}
                hovered={hovered}
                isSelected={isSelected}
                accent={p.accent}
                onAdd={type => onAddElement(secId, rowId, col.id, type)}
                elementMap={elementMap}
              />
            ) : (
              (col.elements || []).map((el, idx, arr) => (
                <ElementWrapper
                  key={el.id}
                  el={el} col={col} secId={secId} rowId={rowId}
                  selectedId={selectedId} elementMap={elementMap} onSelectEl={onSelectEl}
                  onColDrop={processDropPayload}
                  onMoveUp={idx > 0 ? () => { const n=[...arr]; [n[idx-1],n[idx]]=[n[idx],n[idx-1]]; onReorderEl?.(col.id,rowId,n); } : null}
                  onMoveDown={idx < arr.length-1 ? () => { const n=[...arr]; [n[idx],n[idx+1]]=[n[idx+1],n[idx]]; onReorderEl?.(col.id,rowId,n); } : null}
                  onDuplicate={() => onDuplicateEl?.(secId, rowId, col.id, el.id)}
                  onDelete={() => onDeleteEl?.(el.id)}
                />
              ))
            )}
            {isSelected && (col.elements || []).length > 0 && (
              <AddElementMenu show={showAddMenu} toggle={() => setShowAddMenu(v => !v)} elementMap={elementMap}
                onAdd={type => { onAddElement(secId, rowId, col.id, type); setShowAddMenu(false); }} />
            )}
          </>
        )}

        {/* ── Bottom height drag handle ── */}
        {showTools && (
          <div
            onMouseDown={handleHeightDragStart}
            title={`Drag to resize height (current min: ${s.minHeight || 0}px)`}
            style={{
              position: 'absolute',
              bottom: 0, left: '50%',
              transform: 'translateX(-50%)',
              width: 48, height: 8,
              cursor: 'ns-resize',
              zIndex: 500,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <div style={{
              width: 32, height: 4,
              background: resizing ? p.accent : `${p.accent}80`,
              borderRadius: 3,
              transition: 'background 0.15s, width 0.15s',
              boxShadow: resizing ? `0 0 0 2px ${p.accent}40` : 'none',
            }} />
          </div>
        )}
      </div>
    </div>
  );
}

// ── CanvasSubRow — one vertical sub-row inside a column ───────────────────────
function CanvasSubRow({ subRow, parentColId, secId, rowId, selectedId, selectedColId, elementMap, onSelectEl, onSelectCol, onAddElement, onMoveEl, onReorderEl, onDuplicateEl, onDeleteEl, onOpenColModal, onDeleteSubCol, onClearNesting, onResizeSubCols, onSelectSubCol, onAddSubRow, onDeleteSubRow, onAddSubRowCol, onDeleteSubRowCol, onResizeSubRowCols, onClearSubRows, isFirst, isLast, depth, onUpdateCol, onUpdateSubCol, onSelectSubRow }) {
  const [hovered, setHovered] = useState(false);
  const isSelected = selectedId === subRow.id;
  const s = subRow.settings || {};

  // compute bg/color from settings
  const subRowStyle = {};
  if (s.bg) subRowStyle.background = s.bg;
  if (s.padding) subRowStyle.padding = s.padding;
  if (s.minHeight) subRowStyle.minHeight = s.minHeight;

  return (
    <div
      style={{
        position: 'relative',
        borderBottom: '1.5px dashed #10b98125',
        minHeight: 50,
        ...subRowStyle,
        outline: isSelected ? '2px solid #6366f1' : hovered ? '1px solid #6366f140' : 'none',
        outlineOffset: -2,
        transition: 'outline 0.15s',
      }}
      onClick={e => { e.stopPropagation(); onSelectSubRow?.(subRow.id, { secId, rowId, colId: parentColId, subRowId: subRow.id }); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Sub-row toolbar */}
      {(hovered || isSelected) && (
        <SubRowBar
          subRow={subRow}
          colId={parentColId}
          isFirst={isFirst}
          isLast={isLast}
          onAddCol={() => onAddSubRowCol?.(parentColId, subRow.id)}
          onDeleteCol={() => {
            const last = subRow.columns[subRow.columns.length - 1];
            if (last) onDeleteSubRowCol?.(parentColId, subRow.id, last.id);
          }}
          onDeleteSubRow={() => onDeleteSubRow?.(parentColId, subRow.id)}
          onAddSubRowBelow={() => onAddSubRow?.(parentColId)}
        />
      )}
      {/* VROW selected badge */}
      {isSelected && (
        <div style={{ position: 'absolute', top: 3, left: 3, zIndex: 300, fontSize: 8, fontWeight: 800, color: '#6366f1', background: '#eef2ff', border: '1px solid #6366f140', padding: '2px 5px', borderRadius: 4, pointerEvents: 'none', userSelect: 'none' }}>
          VROW
        </div>
      )}

      {/* Columns inside this sub-row */}
      <ResizableGrid
        columns={subRow.columns}
        colWidths={subRow.colWidths}
        gap={8}
        onResize={(widths) => onResizeSubRowCols?.(parentColId, subRow.id, widths)}
        containerId={subRow.id}
      >
        {subRow.columns.map(subCol => (
          <CanvasColumn
            key={subCol.id}
            col={subCol} rowId={rowId} secId={secId}
            selectedId={selectedId} selectedColId={selectedColId}
            elementMap={elementMap}
            onSelectEl={onSelectEl} onSelectCol={onSelectCol}
            onAddElement={onAddElement} onMoveEl={onMoveEl} onReorderEl={onReorderEl}
            onDuplicateEl={onDuplicateEl} onDeleteEl={onDeleteEl}
            onOpenColModal={onOpenColModal}
            onDeleteSubCol={(subColId) => onDeleteSubRowCol?.(parentColId, subRow.id, subColId)}
            onClearNesting={onClearNesting}
            onResizeSubCols={onResizeSubCols} onSelectSubCol={onSelectSubCol}
            onAddSubRow={onAddSubRow} onDeleteSubRow={onDeleteSubRow}
            onAddSubRowCol={onAddSubRowCol} onDeleteSubRowCol={onDeleteSubRowCol}
            onResizeSubRowCols={onResizeSubRowCols} onClearSubRows={onClearSubRows}
            onUpdateCol={onUpdateCol} onUpdateSubCol={onUpdateSubCol}
            onSelectSubRow={onSelectSubRow}
            depth={depth + 1}
          />
        ))}
      </ResizableGrid>
    </div>
  );
}

// ── ElementDropdown ───────────────────────────────────────────────────────────
function ElementDropdown({ elementMap, onAdd, onClose }) {
  const [search, setSearch] = useState('');
  const entries = Object.entries(elementMap);
  const filtered = search ? entries.filter(([, d]) => d.label.toLowerCase().includes(search.toLowerCase())) : entries;
  const groups = {};
  filtered.forEach(([type, def]) => {
    const g = def.group || 'Elements';
    if (!groups[g]) groups[g] = [];
    groups[g].push([type, def]);
  });
  const groupColors = { Typography: '#8b5cf6', Media: '#10b981', Interactive: '#f59e0b', Layout: '#94a3b8', Advanced: '#6366f1', Elements: '#64748b' };
  return (
    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, background: '#fff', borderRadius: 10, boxShadow: '0 10px 30px rgba(0,0,0,0.14)', border: '1px solid #e2e8f0', zIndex: 600 }} onClick={e => e.stopPropagation()}>
      <div style={{ padding: '8px 8px 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f8fafc', borderRadius: 7, padding: '5px 10px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: 11, color: '#94a3b8' }}>🔍</span>
          <input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Search elements..." style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 11, color: '#334155', outline: 'none' }} />
          {search && <button onClick={() => setSearch('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, fontSize: 12 }}>✕</button>}
        </div>
      </div>
      <div style={{ maxHeight: 260, overflowY: 'auto', padding: '4px 0 6px' }}>
        {Object.keys(groups).length === 0 ? (
          <div style={{ padding: 16, textAlign: 'center', fontSize: 11, color: '#94a3b8' }}>No elements found</div>
        ) : (
          Object.entries(groups).map(([groupName, items]) => (
            <div key={groupName}>
              <div style={{ fontSize: 9, fontWeight: 800, color: groupColors[groupName] || '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '6px 12px 3px', display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ flex: 1, height: 1, background: `${groupColors[groupName] || '#94a3b8'}30` }} />
                {groupName}
                <div style={{ flex: 1, height: 1, background: `${groupColors[groupName] || '#94a3b8'}30` }} />
              </div>
              {items.map(([type, def]) => (
                <button key={type} onClick={e => { e.stopPropagation(); onAdd(type); onClose?.(); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '6px 12px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 12, color: '#334155', fontWeight: 500, textAlign: 'left' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{ fontSize: 14, width: 20, textAlign: 'center', color: def.color }}>{def.icon}</span>
                  {def.label}
                </button>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── EmptySlot ─────────────────────────────────────────────────────────────────
function EmptySlot({ isOver, hovered, isSelected, accent, onAdd, elementMap }) {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <div
        onClick={e => { e.stopPropagation(); if (isSelected) setShowMenu(v => !v); }}
        style={{ width: '100%', minHeight: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, border: `2px dashed ${isOver ? accent : isSelected ? accent : hovered ? accent + '60' : '#cbd5e1'}`, borderRadius: 8, background: isOver ? `${accent}08` : isSelected ? `${accent}05` : 'transparent', transition: 'all 0.18s', cursor: isSelected ? 'pointer' : 'default' }}
      >
        {isOver ? (
          <span style={{ fontSize: 11, fontWeight: 600, color: accent, display: 'flex', gap: 5, alignItems: 'center' }}><Plus size={12} /> Drop Here</span>
        ) : isSelected ? (
          <span style={{ fontSize: 11, fontWeight: 600, color: accent, display: 'flex', gap: 5, alignItems: 'center' }}><Plus size={12} /> Add Element</span>
        ) : (
          <span style={{ fontSize: 11, color: '#94a3b8' }}>· Empty ·</span>
        )}
      </div>
      {isSelected && showMenu && elementMap && (
        <ElementDropdown elementMap={elementMap} onAdd={onAdd} onClose={() => setShowMenu(false)} />
      )}
    </div>
  );
}

// ── ElementWrapper ────────────────────────────────────────────────────────────
/**
 * DRAG DESIGN — v2 (grip-as-drag-source):
 *
 * Previous approach (setAttribute on mousedown) was unreliable:
 *   When mouse moves from element body to grip (top:-30px area), React fires
 *   mouseleave → setHovered(false) → re-render → toolbar display:none before
 *   the browser even gets a chance to register dragstart.
 *
 * Fix: The GRIP DIV itself is draggable={true} permanently.
 *   - onDragStart / onDragEnd live directly on the grip div
 *   - No gripActive ref, no setAttribute, no timing issues
 *   - wrapperRef handles onDrop (forwarded to column) and visual fading via bodyRef
 *   - NO setState during drag — only direct DOM refs
 */
function ElementWrapper({ el, col, secId, rowId, selectedId, elementMap, onSelectEl, onMoveUp, onMoveDown, onDuplicate, onDelete, onColDrop }) {
  const [hovered, setHovered] = useState(false);
  const wrapperRef = useRef(null);
  const toolbarRef = useRef(null);
  const bodyRef    = useRef(null);

  const def = elementMap[el.type];
  const isElSel = selectedId === el.id;
  if (!def) return null;
  const Comp = def.component;

  // ── DragStart: fires directly on the grip div ────────────────────────────
  const handleGripDragStart = (e) => {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('hb-drag', JSON.stringify({
      elId: el.id, fromSecId: secId, fromRowId: rowId, fromColId: col.id,
    }));

    // Custom pill ghost
    const ghost = document.createElement('div');
    ghost.textContent = `⠿ ${el.type}`;
    Object.assign(ghost.style, {
      position: 'fixed', top: '-200px', left: '-200px',
      background: 'rgba(15,23,42,0.88)', color: '#fff',
      padding: '4px 10px', borderRadius: '6px',
      fontSize: '11px', fontWeight: '700', fontFamily: 'sans-serif',
      pointerEvents: 'none', whiteSpace: 'nowrap',
    });
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 0, 10);
    setTimeout(() => ghost.remove(), 0);

    // ⚠️ Direct DOM only — NO setState during drag (avoids React re-render cancelling drag)
    if (toolbarRef.current) toolbarRef.current.style.opacity = '0';
    if (bodyRef.current)    bodyRef.current.style.opacity    = '0.35';
  };

  // ── DragEnd: restore visuals ─────────────────────────────────────────────
  const handleGripDragEnd = () => {
    if (toolbarRef.current) toolbarRef.current.style.opacity = '';
    if (bodyRef.current)    bodyRef.current.style.opacity    = '';
  };

  const showControls = hovered || isElSel;

  return (
    <div
      ref={wrapperRef}
      onDragOver={e => { e.preventDefault(); /* let column handle isOver */ }}
      onDrop={e => {
        e.preventDefault();
        e.stopPropagation();
        // Restore in case dragEnd didn't fire (cross-browser edge case)
        if (toolbarRef.current) toolbarRef.current.style.opacity = '';
        if (bodyRef.current)    bodyRef.current.style.opacity    = '';
        onColDrop?.(e);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative', maxWidth: '100%', minWidth: 0, width: '100%' }}
    >
      {/* Floating toolbar */}
      <div
        ref={toolbarRef}
        style={{
          position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)',
          zIndex: 30, display: showControls ? 'flex' : 'none',
          alignItems: 'center', gap: 2,
          background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: 8, padding: '3px 6px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          pointerEvents: 'auto', whiteSpace: 'nowrap',
          userSelect: 'none',
        }}
      >
        {/* Grip — THIS div is the actual drag source (draggable={true} always) */}
        <div
          draggable={true}
          onDragStart={handleGripDragStart}
          onDragEnd={handleGripDragEnd}
          title="Drag to move element"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 20, height: 20, cursor: 'grab',
            color: 'rgba(255,255,255,0.55)',
            borderRight: '1px solid rgba(255,255,255,0.10)',
            paddingRight: 5, marginRight: 3, flexShrink: 0,
          }}
        >
          <GripVertical size={12} />
        </div>

        {/* Element type label */}
        <span style={{
          fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.4)',
          textTransform: 'uppercase', letterSpacing: '0.07em',
          paddingRight: 5, borderRight: '1px solid rgba(255,255,255,0.10)',
          marginRight: 3,
        }}>
          {el.type}
        </span>

        {onMoveUp && (
          <button
            onMouseDown={e => { e.stopPropagation(); e.preventDefault(); onMoveUp(); }}
            title="Move Up"
            style={{ width: 22, height: 22, border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.65)', borderRadius: 5, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}
          >↑</button>
        )}
        {onMoveDown && (
          <button
            onMouseDown={e => { e.stopPropagation(); e.preventDefault(); onMoveDown(); }}
            title="Move Down"
            style={{ width: 22, height: 22, border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.65)', borderRadius: 5, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}
          >↓</button>
        )}
        {onDuplicate && (
          <>
            <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.12)', margin: '0 2px' }} />
            <button
              onMouseDown={e => { e.stopPropagation(); e.preventDefault(); onDuplicate(); }}
              title="Duplicate Element"
              style={{ width: 22, height: 22, border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.65)', borderRadius: 5, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(16,185,129,0.25)'; e.currentTarget.style.color = '#6ee7b7'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}
            ><Copy size={11} /></button>
          </>
        )}
        {onDelete && (
          <>
            <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.12)', margin: '0 2px' }} />
            <button
              onMouseDown={e => { e.stopPropagation(); e.preventDefault(); onDelete(); }}
              title="Delete Element"
              style={{ width: 22, height: 22, border: 'none', background: 'transparent', color: 'rgba(255,100,100,0.7)', borderRadius: 5, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.25)'; e.currentTarget.style.color = '#fca5a5'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,100,100,0.7)'; }}
            ><Trash2 size={11} /></button>
          </>
        )}
      </div>

      {/* Element body */}
      <div
        ref={bodyRef}
        onClick={e => { e.stopPropagation(); onSelectEl(el.id, { secId, rowId, colId: col.id }); }}
        style={{
          cursor: 'default',
          position: 'relative', maxWidth: '100%', minWidth: 0, width: '100%',
          overflow: 'hidden', boxSizing: 'border-box', wordBreak: 'break-word',
          outline: isElSel ? `2px solid ${T.primary}` : hovered ? `1.5px dashed ${T.primary}55` : 'none',
          outlineOffset: 1, borderRadius: 4, transition: 'outline 0.1s',
          zIndex: isElSel ? 10 : 1,
        }}
      >
        <div style={{ pointerEvents: 'none', maxWidth: '100%' }}>
          <Comp props={el.props} mode="edit" isSelected={isElSel} />
        </div>
      </div>
    </div>
  );
}

// ── AddElementMenu ────────────────────────────────────────────────────────────
function AddElementMenu({ show, toggle, elementMap, onAdd }) {
  return (
    <div style={{ width: '100%', position: 'relative', marginTop: 4 }}>
      <button onClick={e => { e.stopPropagation(); toggle(); }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, width: '100%', padding: '4px 10px', fontSize: 10, fontWeight: 700, background: T.light, color: T.primary, border: `1px dashed ${T.primary}50`, borderRadius: 6, cursor: 'pointer' }}>
        <Plus size={11} /> Add Element
      </button>
      {show && <ElementDropdown elementMap={elementMap} onAdd={onAdd} onClose={toggle} />}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function iconBtn(color, bg) {
  return { width: 22, height: 22, border: 'none', background: bg || `${color}18`, color, borderRadius: 5, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.12s', boxShadow: '0 1px 4px rgba(0,0,0,0.10)' };
}
