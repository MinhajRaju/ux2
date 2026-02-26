'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Settings, Trash2, Plus, Columns3, Minus, GripVertical } from 'lucide-react';
import { T, SHADOWS } from '../../constants/theme';
import { CanvasColumn } from './CanvasColumn';

function ResizableGrid({ columns, colWidths, onResize, rowId, selectedColId, gap, children }) {
  const containerRef = useRef(null);
  const widthsRef = useRef(null);
  const count = columns.length;
  const MIN = 8;

  const [widths, setWidths] = useState(() => colWidths?.length === count ? colWidths : columns.map(() => 100 / count));
  const [dragging, setDragging] = useState(null);

  useEffect(() => {
    const init = colWidths?.length === count ? colWidths : columns.map(() => 100 / count);
    setWidths(init);
    widthsRef.current = init;
  }, [count]);

  const startDrag = useCallback((e, i) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(i);
    const containerWidth = containerRef.current?.getBoundingClientRect().width || 1;
    const startX = e.clientX;
    const startWidths = [...(widthsRef.current || widths)];

    const onMove = me => {
      const delta = (me.clientX - startX) / containerWidth * 100;
      const next = [...startWidths];
      let l = startWidths[i] + delta;
      let r = startWidths[i + 1] - delta;
      if (l < MIN) { r -= (MIN - l); l = MIN; }
      if (r < MIN) { l -= (MIN - r); r = MIN; }
      next[i] = l; next[i + 1] = r;
      widthsRef.current = next;
      setWidths([...next]);
    };

    const onUp = () => {
      setDragging(null);
      if (onResize && widthsRef.current) onResize(rowId, [...widthsRef.current]);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [widths, onResize, rowId]);

  const cols = Array.isArray(children) ? children : [children];

  return (
    <div ref={containerRef} style={{ display: 'flex', gap, flex: 1, minWidth: 0, userSelect: dragging !== null ? 'none' : 'auto', position: 'relative' }}>
      {cols.map((col, i) => {
        const w = widths[i] ?? 100 / count;
        return (
          <div key={columns[i]?.id || i} style={{ flex: w, minWidth: 0, position: 'relative', transition: dragging === null ? 'flex 0.2s ease' : 'none' }}>
            {dragging === i && (
              <div style={{ position: 'absolute', top: -28, right: -16, zIndex: 200, background: '#0f172a', color: '#fff', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700, pointerEvents: 'none' }}>
                {Math.round(w)}%
              </div>
            )}
            {col}
            {i < count - 1 && (
              <div
                onPointerDown={e => startDrag(e, i)}
                style={{
                  position: 'absolute', top: 0, bottom: 0, right: -(gap / 2 + 6),
                  width: 20, cursor: 'col-resize', zIndex: 50,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: dragging === i ? 1 : 0, transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={e => { if (dragging !== i) e.currentTarget.style.opacity = '0'; }}
              >
                <div style={{
                  width: 4, height: 36, borderRadius: 4,
                  background: dragging === i ? T.primary : '#94a3b8',
                  boxShadow: dragging === i ? `0 0 0 4px ${T.primary}30` : 'none',
                  transition: 'all 0.2s',
                }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ToolBtn({ onClick, title, children, hoverColor }) {
  return (
    <button
      onClick={onClick} title={title}
      onMouseEnter={e => { e.currentTarget.style.background = hoverColor ? `${hoverColor}18` : '#f1f5f9'; e.currentTarget.style.color = hoverColor || '#0f172a'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
      style={{
        width: 28, height: 28, border: 'none', background: 'transparent',
        borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center',
        justifyContent: 'center', transition: 'all 0.15s', color: '#64748b',
      }}
    >
      {children}
    </button>
  );
}

export function CanvasRow({ row, secId, selectedId, selectedColId, elementMap, onSelectEl, onSelectCol, onSelectRow, onAddRow, onDeleteRow, onAddCol, onDeleteCol, onUpdateRow, onResize, onAddElement, onMoveEl, isFirst }) {
  const [hovered, setHovered] = useState(false);
  const s = row.settings || {};

  const getBg = () => {
    if (s.bgType === 'gradient') return { background: `linear-gradient(${s.gradientDir || '135deg'}, ${s.gradientFrom || '#6366f1'}, ${s.gradientTo || '#a855f7'})` };
    if (s.bgType === 'image' && s.bgImage) return { backgroundImage: `url(${s.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    return { background: s.bg || '#ffffff' };
  };

  const maxW = s.widthMode === 'full' ? '100%' : `min(${s.maxWidth || 1280}px, 100%)`;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => { e.stopPropagation(); onSelectRow?.(); }}
      style={{
        ...getBg(),
        position: 'relative',
        flexShrink: 0,
        outline: hovered ? `1px solid ${T.primary}30` : '1px solid transparent',
        outlineOffset: -1,
        transition: 'outline 0.2s',
      }}
    >
      {/* Floating row toolbar */}
      <div style={{
        position: 'absolute', top: -20, left: '50%',
        transform: `translateX(-50%) translateY(${hovered ? 0 : 8}px) scale(${hovered ? 1 : 0.95})`,
        zIndex: 100,
        opacity: hovered ? 1 : 0,
        pointerEvents: hovered ? 'auto' : 'none',
        transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        display: 'flex', alignItems: 'center', gap: 3,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(226,232,240,0.8)',
        borderRadius: 100,
        padding: '3px 5px',
        boxShadow: '0 8px 24px -4px rgba(0,0,0,0.1)',
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b', padding: '0 8px 0 10px', borderRight: '1px solid #e2e8f0', marginRight: 2, userSelect: 'none', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          {s.label || 'Row'}
        </span>
        <ToolBtn onClick={() => onUpdateRow?.({ visible: !s.visible })} title="Toggle Visibility">
          <span style={{ fontSize: 13 }}>{s.visible !== false ? '👁' : '👁‍🗨'}</span>
        </ToolBtn>
        <ToolBtn onClick={onAddCol} title="Add Column" hoverColor={T.primary}><Columns3 size={14} /></ToolBtn>
        {row.columns.length > 0 && <ToolBtn onClick={onDeleteCol} title="Remove Last Column" hoverColor={T.danger}><Minus size={14} /></ToolBtn>}
        <div style={{ width: 1, height: 14, background: '#e2e8f0', margin: '0 1px' }} />
        {!isFirst && <ToolBtn onClick={onDeleteRow} title="Delete Row" hoverColor={T.danger}><Trash2 size={13} /></ToolBtn>}
        <ToolBtn onClick={onAddRow} title="Add Row Below" hoverColor={T.primary}><Plus size={13} /></ToolBtn>
      </div>

      {/* Row content */}
      <div style={{
        minHeight: s.height || 60,
        width: maxW,
        margin: '0 auto',
        padding: `0 ${s.padH || 32}px`,
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 1,
      }}>
        {row.columns.length === 0 ? (
          <div
            onClick={(e) => { e.stopPropagation(); onAddCol(); }}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              minHeight: 50, border: '2px dashed #cbd5e1', borderRadius: 12,
              background: '#f8fafc', cursor: 'pointer', transition: 'all 0.2s',
              color: '#94a3b8', gap: 8,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.primary; e.currentTarget.style.color = T.primary; e.currentTarget.style.background = `${T.primary}05`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = '#f8fafc'; }}
          >
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
              <Plus size={15} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600 }}>Add a Column</span>
          </div>
        ) : (
          <ResizableGrid
            columns={row.columns}
            colWidths={row.colWidths}
            gap={s.colGap || 20}
            onResize={onResize}
            rowId={row.id}
            selectedColId={selectedColId}
          >
            {row.columns.map(col => (
              <CanvasColumn
                key={col.id}
                col={col}
                rowId={row.id}
                secId={secId}
                selectedId={selectedId}
                selectedColId={selectedColId}
                elementMap={elementMap}
                onSelectEl={onSelectEl}
                onSelectCol={onSelectCol}
                onAddElement={onAddElement}
                onMoveEl={onMoveEl}
              />
            ))}
          </ResizableGrid>
        )}
      </div>
    </div>
  );
}
