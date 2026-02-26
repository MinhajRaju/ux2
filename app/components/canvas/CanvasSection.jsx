'use client';
import { useState } from 'react';
import { Reorder } from 'framer-motion';
import { Settings, Trash2, Plus, GripVertical } from 'lucide-react';
import { T } from '../../constants/theme';
import { CanvasRow } from './CanvasRow';

export function CanvasSection({ section, singleSection, selectedId, selectedColId, elementMap, onSelectEl, onSelectCol, onSelectSection, onUpdateSection, onDeleteSection, onAddRow, onDeleteRow, onUpdateRow, onAddCol, onDeleteCol, onResize, onReorderRows, onAddElement, onMoveEl }) {
  const [hovered, setHovered] = useState(false);
  const s = section.settings || {};

  const getBg = () => {
    if (s.bgType === 'gradient') return { background: `linear-gradient(${s.gradientDir || '135deg'}, ${s.gradientFrom || '#6366f1'}, ${s.gradientTo || '#a855f7'})` };
    if (s.bgType === 'image' && s.bgImage) return { backgroundImage: `url(${s.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    return { background: s.bg || '#ffffff' };
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => { e.stopPropagation(); onSelectSection(); }}
      style={{ position: 'relative', ...getBg(), padding: `${s.padV || 0}px 0`, marginBottom: 2 }}
    >
      {/* Section toolbar */}
      <div style={{
        position: 'absolute', top: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', gap: 3,
        padding: '5px 8px',
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(8px)',
        borderRadius: '0 0 0 10px',
        border: '1px solid rgba(226,232,240,0.6)',
        opacity: hovered ? 1 : 0,
        pointerEvents: hovered ? 'auto' : 'none',
        transition: 'opacity 0.2s',
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b', paddingRight: 8, borderRight: '1px solid #e2e8f0', marginRight: 2, textTransform: 'uppercase', letterSpacing: '0.05em', userSelect: 'none' }}>
          {s.label || 'Section'}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onAddRow(); }}
          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', fontSize: 11, fontWeight: 600, background: T.primary, color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
        >
          <Plus size={12} /> Add Row
        </button>
        {!singleSection && (
          <button
            onClick={(e) => { e.stopPropagation(); onDeleteSection(); }}
            style={{ width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: '#fff1f2', color: '#ef4444', borderRadius: 6, cursor: 'pointer' }}
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {/* Rows */}
      {section.rows.length === 0 ? (
        <div
          onClick={(e) => { e.stopPropagation(); onAddRow(); }}
          style={{
            margin: '12px 16px', padding: '24px 16px',
            border: '2px dashed #cbd5e1', borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#f8fafc', cursor: 'pointer', gap: 8, color: '#94a3b8',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = T.primary; e.currentTarget.style.color = T.primary; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#94a3b8'; }}
        >
          <Plus size={18} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>Add First Row</span>
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={section.rows}
          onReorder={(newRows) => onReorderRows(section.id, newRows)}
          style={{ listStyle: 'none', margin: 0, padding: 0 }}
        >
          {section.rows.map((row, i) => (
            <Reorder.Item
              key={row.id}
              value={row}
              style={{ listStyle: 'none', position: 'relative' }}
            >
              <CanvasRow
                row={row}
                secId={section.id}
                selectedId={selectedId}
                selectedColId={selectedColId}
                elementMap={elementMap}
                onSelectEl={onSelectEl}
                onSelectCol={onSelectCol}
                onSelectRow={() => {}}
                onAddRow={() => onAddRow(section.id, row.id)}
                onDeleteRow={() => onDeleteRow(section.id, row.id)}
                onAddCol={() => onAddCol(section.id, row.id)}
                onDeleteCol={() => onDeleteCol(section.id, row.id)}
                onUpdateRow={(settings) => onUpdateRow(row.id, settings)}
                onResize={onResize}
                onAddElement={onAddElement}
                onMoveEl={onMoveEl}
                isFirst={i === 0}
              />
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}
    </div>
  );
}
