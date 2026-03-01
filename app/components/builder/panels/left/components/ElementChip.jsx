'use client';
import { useState } from 'react';

/**
 * Draggable element card shown in the Elements tab grid.
 * Props: type (string), def ({ label, icon, color })
 */
export function ElementChip({ type, def }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      draggable
      onDragStart={e => e.dataTransfer.setData('hb-drag', JSON.stringify({ newType: type }))}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
        padding: '16px 8px', borderRadius: 10, cursor: 'grab',
        background: '#FFF',
        border: hover ? '1px solid #6366F1' : '1px solid #E2E8F0',
        boxShadow: hover ? '0 4px 12px rgba(99,102,241,0.12)' : '0 1px 2px rgba(0,0,0,0.02)',
        transform: hover ? 'translateY(-2px)' : 'none',
        transition: 'all 0.2s ease-in-out',
        userSelect: 'none',
      }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: hover ? '#EEF2FF' : '#F8FAFC',
        color: def.color || '#64748B', fontSize: 16,
        transition: 'background 0.2s',
      }}>
        {def.icon}
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color: '#334155', textAlign: 'center' }}>
        {def.label}
      </span>
    </div>
  );
}
