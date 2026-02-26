// src/components/builder/canvas/RowCanvas.jsx
'use client';
import { useState } from 'react';
import { Settings, Trash2, Plus, Columns3, Minus } from 'lucide-react';
import { T, SHADOWS } from '@/constants/theme';
import { rowBgStyle } from '@/lib/propsToStyle';
import { ResizableGrid } from './ResizableGrid';
import { ColCanvas } from './ColCanvas';

function ToolBtn({ onClick, title, children, hoverColor }) {
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={e => {
        e.currentTarget.style.background = hoverColor ? `${hoverColor}18` : '#f1f5f9';
        e.currentTarget.style.color = hoverColor || '#0f172a';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = '#64748b';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
      style={{
        width: 28, height: 28, border: 'none', background: 'transparent',
        borderRadius: 6, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s', color: '#64748b',
      }}
    >
      {children}
    </button>
  );
}

export function RowCanvas({
  row, secId, shadow,
  selectedId, selectedColId,
  onSelectEl, onSelectCol,
  onDropNewType, onMoveEl, onReorderEl,
  onRowSettings, onDeleteRow, onAddRow, onAddCol, onDeleteCol, onResize,
  isFirst,
}) {
  const [hovered, setHovered] = useState(false);
  const s = row.settings || {};

  if (!s.visible) {
    return (
      <div style={{
        padding: '10px 20px',
        background: 'repeating-linear-gradient(45deg, #f8fafc, #f8fafc 10px, #f1f5f9 10px, #f1f5f9 20px)',
        border: '1px dashed #cbd5e1', margin: '8px 0', borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>
          Hidden: <span style={{ color: '#334155' }}>{s.label || 'Row'}</span>
        </span>
        <button onClick={onRowSettings} style={{
          padding: '5px 12px', fontSize: 12, fontWeight: 600,
          border: `1px solid ${T.border}`, borderRadius: 6,
          background: '#fff', cursor: 'pointer', color: T.primary,
        }}>Show</button>
      </div>
    );
  }

  const maxW = s.widthMode === 'full' ? '100%' : `min(${s.maxWidth || 1280}px, 100%)`;
  const bg = rowBgStyle(s);

  // Dynamic height: if s.height is a number, use it; otherwise auto
  const rowHeight = s.height && s.height !== 'auto' ? `${s.height}px` : 'auto';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...bg,
        boxShadow: SHADOWS[Math.min(+(shadow || 0), 5)],
        position: 'relative',
        flexShrink: 0,
        transition: 'all 0.3s ease',
        outline: hovered ? '1px solid rgba(99,102,241,0.25)' : '1px solid transparent',
        outlineOffset: -1,
      }}
    >
      {/* Background image overlay */}
      {s.bgType === 'image' && s.bgImage && s.bgOverlay && (
        <div style={{
          position: 'absolute', inset: 0,
          background: s.bgOverlay, opacity: (s.bgOverlayOpacity ?? 50) / 100,
          zIndex: 0, pointerEvents: 'none',
        }} />
      )}

      {/* Floating toolbar */}
      <div style={{
        position: 'absolute', top: -18, left: '50%',
        transform: `translateX(-50%) translateY(${hovered ? 0 : 8}px) scale(${hovered ? 1 : 0.95})`,
        zIndex: 100,
        opacity: hovered ? 1 : 0,
        pointerEvents: hovered ? 'auto' : 'none',
        transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        display: 'flex', alignItems: 'center', gap: 4,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.5)',
        borderRadius: 100,
        padding: '4px 6px',
        boxShadow: '0 8px 24px -4px rgba(0,0,0,0.1)',
      }}>
        <div style={{
          fontSize: 10, fontWeight: 700, color: '#64748b',
          textTransform: 'uppercase', letterSpacing: '0.05em',
          padding: '0 10px 0 12px',
          height: 20, display: 'flex', alignItems: 'center',
          borderRight: '1px solid #e2e8f0', marginRight: 2,
          userSelect: 'none',
        }}>
          {s.label || 'Row'}
        </div>

        <ToolBtn onClick={onRowSettings} title="Row Settings"><Settings size={15} /></ToolBtn>

        <div style={{ width: 1, height: 16, background: '#cbd5e1', margin: '0 2px' }} />
        <ToolBtn onClick={onAddCol} title="Add Column" hoverColor={T.primary}><Columns3 size={15} /></ToolBtn>
        {row.columns.length > 1 && (
          <ToolBtn onClick={onDeleteCol} title="Remove Column" hoverColor={T.danger}><Minus size={15} /></ToolBtn>
        )}

        <div style={{ width: 1, height: 16, background: '#cbd5e1', margin: '0 2px' }} />
        {!isFirst && <ToolBtn onClick={onDeleteRow} title="Delete Row" hoverColor={T.danger}><Trash2 size={15} /></ToolBtn>}
        <ToolBtn onClick={onAddRow} title="Add Row Below" hoverColor={T.primary}><Plus size={15} /></ToolBtn>
      </div>

      {/* Row content */}
      <div style={{
        minHeight: rowHeight === 'auto' ? undefined : rowHeight,
        width: maxW,
        margin: '0 auto',
        padding: `${s.padV || 16}px ${s.padH || 32}px`,
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 1,
      }}>
        {row.columns.length === 0 ? (
          <div
            onClick={onAddCol}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 60,
              border: '2px dashed #cbd5e1', borderRadius: 12,
              background: '#f8fafc', cursor: 'pointer', transition: 'all .2s',
              color: '#64748b', gap: 10,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.primary; e.currentTarget.style.color = T.primary; e.currentTarget.style.background = `${T.primary}06`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = '#f8fafc'; }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: '50%', background: '#fff',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0',
            }}>
              <Plus size={18} strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Add a column</span>
          </div>
        ) : (
          <ResizableGrid
            columns={row.columns}
            gap={s.colGap || 20}
            colWidths={row.colWidths}
            onResize={(rId, widths) => onResize?.(secId, rId, widths)}
            rowId={row.id}
            selectedColId={selectedColId}
          >
            {row.columns.map(col => (
              <ColCanvas
                key={col.id}
                col={col}
                rowId={row.id}
                secId={secId}
                elGap={s.elGap || 12}
                selectedId={selectedId}
                selectedColId={selectedColId}
                onSelectEl={onSelectEl}
                onSelectCol={onSelectCol}
                onDropNewType={onDropNewType}
                onMoveEl={onMoveEl}
                onReorderEl={onReorderEl}
              />
            ))}
          </ResizableGrid>
        )}
      </div>
    </div>
  );
}
