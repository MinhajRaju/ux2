'use client';
import { useState, useRef } from 'react';
import { Plus } from 'lucide-react';
import { T } from '../../constants/theme';

export function CanvasColumn({ col, rowId, secId, selectedId, selectedColId, elementMap, onSelectEl, onSelectCol, onAddElement, onMoveEl, onReorderEl }) {
  const [isOver, setIsOver] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const isSelected = selectedColId === col.id;
  const s = col.settings || {};
  const gap = s.gap ?? 12;

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);
    try {
      const payload = JSON.parse(e.dataTransfer.getData('hb-drag'));
      if (payload.newType) {
        onAddElement(secId, rowId, col.id, payload.newType);
      } else if (payload.elId) {
        if (payload.fromColId !== col.id) {
          onMoveEl?.(payload.elId, payload.fromSecId, payload.fromRowId, payload.fromColId, secId, rowId, col.id);
        }
      }
    } catch {}
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div
        onClick={(e) => { e.stopPropagation(); onSelectCol(isSelected ? null : col.id); }}
        onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
        onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setIsOver(false); }}
        onDrop={handleDrop}
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          alignItems: s.valign === 'center' ? 'center' : s.valign === 'bottom' ? 'flex-end' : 'center',
          justifyContent: s.align || 'flex-start',
          gap,
          minHeight: 56,
          padding: `${s.padV || 8}px ${s.padH || 12}px`,
          background: isOver ? `${T.primary}08` : (s.bg || 'transparent'),
          boxShadow: isSelected
            ? `inset 0 0 0 2px ${T.primary}, 0 4px 20px -5px ${T.primary}40`
            : isOver
              ? `inset 0 0 0 2px ${T.primary}80`
              : 'none',
          borderRadius: 10,
          transition: 'all 0.2s ease',
          position: 'relative',
          width: '100%',
          minWidth: 0,
          boxSizing: 'border-box',
        }}
      >
        {col.elements.length === 0 ? (
          <div style={{
            width: '100%', minHeight: 44,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `2px dashed ${isOver ? T.primary : '#cbd5e1'}`,
            borderRadius: 8,
            background: isOver ? `${T.primary}06` : 'rgba(255,255,255,0.4)',
            transition: 'all 0.2s',
          }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: isOver ? T.primary : '#94a3b8', display: 'flex', gap: 6, alignItems: 'center' }}>
              {isOver ? <><Plus size={14} /> Drop Here</> : '· Empty Column ·'}
            </span>
          </div>
        ) : (
          col.elements.map((el) => {
            const def = elementMap[el.type];
            if (!def) return null;
            const Component = def.component;
            const isElSelected = selectedId === el.id;

            return (
              <div
                key={el.id}
                draggable
                onDragStart={(e) => {
                  e.stopPropagation();
                  e.dataTransfer.setData('hb-drag', JSON.stringify({ elId: el.id, fromSecId: secId, fromRowId: rowId, fromColId: col.id }));
                  e.currentTarget.style.opacity = '0.4';
                }}
                onDragEnd={(e) => { e.currentTarget.style.opacity = '1'; }}
                onClick={(e) => { e.stopPropagation(); onSelectEl(el.id, { secId, rowId, colId: col.id }); }}
                style={{
                  cursor: 'grab',
                  position: 'relative',
                  flexShrink: 1,
                  maxWidth: '100%',
                  minWidth: 0,
                  boxShadow: isElSelected ? `0 0 0 2px ${T.primary}` : '0 0 0 1.5px transparent',
                  borderRadius: 6,
                  transition: 'box-shadow 0.15s, transform 0.15s',
                  transform: isElSelected ? 'scale(1.015)' : 'scale(1)',
                  zIndex: isElSelected ? 10 : 1,
                }}
              >
                <div style={{ pointerEvents: 'none' }}>
                  <Component props={el.props} mode="edit" isSelected={isElSelected} />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add element button */}
      {isSelected && (
        <div style={{ position: 'absolute', bottom: -16, left: '50%', transform: 'translateX(-50%)', zIndex: 50 }}>
          <div style={{ position: 'relative' }}>
            <button
              onClick={(e) => { e.stopPropagation(); setShowAddMenu(v => !v); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '4px 12px', fontSize: 11, fontWeight: 700,
                background: T.primary, color: '#fff', border: 'none',
                borderRadius: 20, cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
              }}
            >
              <Plus size={12} /> Add Element
            </button>
            {showAddMenu && (
              <div style={{
                position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                marginTop: 6, background: '#fff', borderRadius: 12, padding: 8,
                boxShadow: '0 10px 30px rgba(0,0,0,0.12)', border: `1px solid ${T.border}`,
                zIndex: 200, minWidth: 180, maxHeight: 300, overflowY: 'auto',
              }}>
                {Object.entries(elementMap).map(([type, def]) => (
                  <button
                    key={type}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddElement(secId, rowId, col.id, type);
                      setShowAddMenu(false);
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      width: '100%', padding: '8px 12px', border: 'none',
                      background: 'transparent', cursor: 'pointer', borderRadius: 7,
                      fontSize: 12, color: T.textMid, fontWeight: 500, textAlign: 'left',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = T.light; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <span style={{ fontSize: 14, width: 20, textAlign: 'center', color: def.color }}>{def.icon}</span>
                    {def.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
