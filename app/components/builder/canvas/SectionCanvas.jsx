// src/components/builder/canvas/SectionCanvas.jsx
'use client';
import { useState } from 'react';
import { Plus, Settings, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { T } from '@/constants/theme';
import { RowCanvas } from './RowCanvas';

export function SectionCanvas({
  section, selectedId, selectedColId, shadow,
  onSelectEl, onSelectCol,
  onDropNewType, onMoveEl, onReorderEl,
  onSectionSettings, onDeleteSection, onMoveSection, canMoveUp, canMoveDown,
  onRowSettings, onDeleteRow, onAddRow, onAddCol, onDeleteCol, onResize,
}) {
  const [hovered, setHovered] = useState(false);
  const s = section.settings || {};

  // Section background
  let sectionBg = {};
  if (s.bgType === 'gradient' && s.gradientFrom && s.gradientTo) {
    sectionBg.background = `linear-gradient(${s.gradientDir || '135deg'}, ${s.gradientFrom}, ${s.gradientTo})`;
  } else if (s.bgType === 'image' && s.bgImage) {
    sectionBg = {
      backgroundImage: `url(${s.bgImage})`,
      backgroundSize: s.bgSize || 'cover',
      backgroundPosition: s.bgPosition || 'center',
      backgroundRepeat: 'no-repeat',
    };
  } else {
    sectionBg.background = s.bg || '#ffffff';
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...sectionBg,
        position: 'relative',
        paddingTop: `${s.padTop || 0}px`,
        paddingBottom: `${s.padBottom || 0}px`,
        marginBottom: 2,
        outline: hovered ? `2px solid ${T.primary}20` : '2px solid transparent',
        transition: 'outline 0.2s',
      }}
    >
      {/* Overlay for bg image */}
      {s.bgType === 'image' && s.bgOverlay && (
        <div style={{
          position: 'absolute', inset: 0,
          background: s.bgOverlay,
          opacity: (s.bgOverlayOpacity ?? 40) / 100,
          pointerEvents: 'none', zIndex: 0,
        }} />
      )}

      {/* Section label strip */}
      {hovered && (
        <div style={{
          position: 'absolute', top: 0, left: 0,
          background: '#334155', color: '#fff',
          fontSize: 10, fontWeight: 700, padding: '3px 10px',
          borderRadius: '0 0 6px 0', zIndex: 99,
          display: 'flex', alignItems: 'center', gap: 8,
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          <span>S</span>
          <span>{s.label || 'Section'}</span>

          <div style={{ display: 'flex', gap: 2, marginLeft: 4 }}>
            {canMoveUp && (
              <button onClick={() => onMoveSection('up')} style={iconBtnSm}>
                <ChevronUp size={12} />
              </button>
            )}
            {canMoveDown && (
              <button onClick={() => onMoveSection('down')} style={iconBtnSm}>
                <ChevronDown size={12} />
              </button>
            )}
            <button onClick={onSectionSettings} style={iconBtnSm}>
              <Settings size={12} />
            </button>
            <button onClick={onDeleteSection} style={{ ...iconBtnSm, color: '#fca5a5' }}>
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Rows */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {section.rows.map((row, ri) => (
          <RowCanvas
            key={row.id}
            row={row}
            secId={section.id}
            shadow={shadow}
            selectedId={selectedId}
            selectedColId={selectedColId}
            onSelectEl={onSelectEl}
            onSelectCol={onSelectCol}
            onDropNewType={onDropNewType}
            onMoveEl={onMoveEl}
            onReorderEl={onReorderEl}
            onRowSettings={() => onRowSettings(section.id, row.id)}
            onDeleteRow={() => onDeleteRow(section.id, row.id)}
            onAddRow={() => onAddRow(section.id)}
            onAddCol={() => onAddCol(section.id, row.id)}
            onDeleteCol={() => onDeleteCol(section.id, row.id)}
            onResize={onResize}
            isFirst={ri === 0 && section.rows.length === 1}
          />
        ))}

        {/* Add row button */}
        <div
          onClick={() => onAddRow(section.id)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '10px', cursor: 'pointer', opacity: hovered ? 1 : 0,
            transition: 'opacity 0.2s',
          }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: `${T.primary}12`, color: T.primary,
            borderRadius: 20, padding: '5px 14px', fontSize: 12, fontWeight: 600,
          }}>
            <Plus size={14} /> Add Row
          </div>
        </div>
      </div>
    </div>
  );
}

const iconBtnSm = {
  width: 20, height: 20, border: 'none', background: 'rgba(255,255,255,0.15)',
  borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: '#fff', padding: 0,
};
