// src/components/builder/canvas/ColCanvas.jsx
'use client';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { T } from '@/constants/theme';
import { ELEMENT_MAP } from '../elements';

export function ColCanvas({
  col, rowId, secId, elGap,
  selectedId, selectedColId,
  onSelectEl, onSelectCol,
  onDropNewType, onMoveEl, onReorderEl,
}) {
  const [isOver, setIsOver] = useState(false);
  const [dropIndex, setDropIndex] = useState(null);

  const isSelectedCol = selectedColId === col.id;
  const s = col.settings || {};
  const gap = s.gap != null ? s.gap : (elGap || 12);

  const handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);
    setDropIndex(null);
    try {
      const payload = JSON.parse(e.dataTransfer.getData('pb-drag'));
      if (payload.newType) {
        onDropNewType(secId, rowId, col.id, payload.newType);
      } else if (payload.elId) {
        if (payload.fromRowId === rowId && payload.fromColId === col.id) {
          if (dropIndex !== null) onReorderEl(secId, rowId, col.id, payload.elId, dropIndex);
        } else {
          onMoveEl(payload.elId, payload.fromSecId, payload.fromRowId, payload.fromColId, secId, rowId, col.id);
        }
      }
    } catch {}
  };

  // Column background
  const colBgStyle = {};
  if (s.bgType === 'gradient' && s.gradientFrom && s.gradientTo) {
    colBgStyle.background = `linear-gradient(${s.gradientDir || '135deg'}, ${s.gradientFrom}, ${s.gradientTo})`;
  } else if (s.bgType === 'image' && s.bgImage) {
    colBgStyle.backgroundImage = `url(${s.bgImage})`;
    colBgStyle.backgroundSize = s.bgSize || 'cover';
    colBgStyle.backgroundPosition = s.bgPosition || 'center';
  } else if (s.bg) {
    colBgStyle.background = s.bg;
  }

  const borderStyle = s.borderStyle && s.borderStyle !== 'none'
    ? { border: `${s.borderWidth || 1}px ${s.borderStyle} ${s.borderColor || '#e2e8f0'}` }
    : {};

  return (
    <div
      onClick={e => { e.stopPropagation(); onSelectCol(isSelectedCol ? null : col.id); }}
      onDragOver={e => { e.preventDefault(); setIsOver(true); }}
      onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget)) { setIsOver(false); setDropIndex(null); } }}
      onDrop={handleDrop}
      style={{
        display: 'flex',
        flexDirection: s.direction === 'vertical' ? 'column' : 'row',
        flexWrap: s.direction === 'vertical' ? 'nowrap' : 'wrap',
        alignItems: s.valign === 'center' ? 'center' : s.valign === 'bottom' ? 'flex-end' : 'center',
        justifyContent: s.align || 'flex-start',
        gap,
        minHeight: 56,
        padding: `${s.padV || 0}px ${s.padH || 12}px`,
        borderRadius: s.radius ? `${s.radius}px` : 8,
        ...colBgStyle,
        ...borderStyle,
        boxShadow: isSelectedCol
          ? `inset 0 0 0 2px ${T.primary}, 0 4px 20px -5px ${T.primary}40`
          : isOver
            ? `inset 0 0 0 2px ${T.primary}80, inset 0 0 20px ${T.primary}10`
            : 'none',
        background: isOver ? '#f8fafc' : colBgStyle.background || 'transparent',
        transition: 'all 0.2s ease',
        position: 'relative',
        width: '100%', minWidth: 0, maxWidth: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Empty state */}
      {col.elements.length === 0 && (
        <div style={{
          width: '100%', minHeight: 48,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `2px dashed ${isOver ? T.primary : '#cbd5e1'}`,
          borderRadius: 8,
          background: isOver ? `${T.primary}08` : 'rgba(255,255,255,0.4)',
          transition: 'all 0.2s',
        }}>
          <span style={{
            fontSize: 12, fontWeight: 600,
            color: isOver ? T.primary : '#94a3b8',
            display: 'flex', gap: 8, alignItems: 'center',
          }}>
            {isOver ? <Plus size={16} /> : <span style={{ width: 6, height: 6, background: 'currentColor', borderRadius: '50%', display: 'inline-block' }} />}
            {isOver ? 'Drop Element' : 'Empty Column'}
          </span>
        </div>
      )}

      {col.elements.map((el, idx) => {
        const ElComp = ELEMENT_MAP[el.type];
        if (!ElComp) return null;
        const isSelected = selectedId === el.id;

        return (
          <div
            key={el.id}
            draggable
            onDragStart={e => {
              e.stopPropagation();
              e.dataTransfer.setData('pb-drag', JSON.stringify({ elId: el.id, fromSecId: secId, fromRowId: rowId, fromColId: col.id }));
              e.currentTarget.style.opacity = '0.5';
            }}
            onDragEnd={e => { e.currentTarget.style.opacity = '1'; }}
            onDragOver={e => { e.preventDefault(); e.stopPropagation(); setDropIndex(idx); }}
            onClick={e => { e.stopPropagation(); onSelectEl(el.id, { secId, rowId, colId: col.id }); }}
            style={{
              cursor: 'grab',
              position: 'relative',
              flexShrink: 1,
              maxWidth: '100%',
              minWidth: 0,
              boxShadow: isSelected ? `0 0 0 2px ${T.primary}` : '0 0 0 1px transparent',
              borderRadius: 6,
              transition: 'transform 0.15s, box-shadow 0.15s',
              transform: isSelected ? 'scale(1.01)' : 'scale(1)',
              zIndex: isSelected ? 10 : 1,
            }}
          >
            {/* Drop indicator */}
            {dropIndex === idx && (
              <div style={{
                position: 'absolute', left: -8, top: 4, bottom: 4, width: 4,
                borderRadius: 4, background: T.primary, zIndex: 50,
                boxShadow: `0 0 10px ${T.primary}80`,
              }} />
            )}

            <ElComp props={el.props} mode="edit" isSelected={isSelected} onSelect={() => {}} />
          </div>
        );
      })}
    </div>
  );
}
