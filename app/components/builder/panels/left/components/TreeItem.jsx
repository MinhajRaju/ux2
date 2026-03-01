'use client';
import { useState } from 'react';
import { Icons } from './Icons';

// ── Type color config ──────────────────────────────────────────
export const TREE_COLORS = {
  section: { bg: '#F5F3FF', border: '#8B5CF6', badgeBg: '#EDE9FE', badgeTxt: '#7C3AED', label: 'S' },
  row:     { bg: '#ECFDF5', border: '#10B981', badgeBg: '#D1FAE5', badgeTxt: '#059669', label: 'R' },
  col:     { bg: '#EFF6FF', border: '#3B82F6', badgeBg: '#DBEAFE', badgeTxt: '#2563EB', label: 'C' },
  elem:    { bg: '#F8FAFC', border: '#64748B', badgeBg: 'transparent', badgeTxt: '#94A3B8', label: '●' },
};

/**
 * Single row in the Layers tree.
 * Props:
 *  type         – 'section' | 'row' | 'col' | 'elem'
 *  label        – display string
 *  depth        – left margin in px
 *  isSel        – is this item selected?
 *  hasChildren  – show expand toggle?
 *  expanded     – is expanded?
 *  onToggle     – () => void
 *  onClick      – () => void
 *  onDelete     – () => void  (optional — shown on hover if provided)
 *  icon         – JSX (only for elem type)
 */
export function TreeItem({ type, label, depth, isSel, hasChildren, expanded, onToggle, onClick, onDelete, icon }) {
  const [hover, setHover] = useState(false);
  const theme = TREE_COLORS[type] || TREE_COLORS.elem;

  return (
    <div
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '5px 8px', paddingLeft: depth,
        marginRight: 8, marginTop: 2, marginBottom: 2,
        borderRadius: 6, cursor: 'pointer', userSelect: 'none',
        transition: 'all 0.15s ease',
        background: isSel ? theme.bg : (hover ? '#F1F5F9' : 'transparent'),
        borderLeft: `3px solid ${isSel ? theme.border : 'transparent'}`,
        color: isSel ? '#1E293B' : '#475569',
        position: 'relative',
      }}
    >
      {/* Expand toggle */}
      <div
        onClick={(e) => { e.stopPropagation(); onToggle?.(); }}
        style={{
          width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: hasChildren ? 'pointer' : 'default', color: '#94A3B8',
          opacity: hasChildren ? 1 : 0, flexShrink: 0,
        }}
      >
        <Icons.ChevronRight rotate={expanded} />
      </div>

      {/* Type badge */}
      <span style={{
        width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10, fontWeight: 700, borderRadius: 4, flexShrink: 0,
        background: type === 'elem' ? 'transparent' : theme.badgeBg,
        color: type === 'elem' ? '#94A3B8' : theme.badgeTxt,
      }}>
        {type === 'elem' && icon ? icon : theme.label}
      </span>

      {/* Label */}
      <span style={{
        fontSize: 12, fontWeight: isSel ? 600 : 500, flex: 1,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {label}
      </span>

      {/* Delete button — always in DOM, hidden when not hovered */}
      {onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          title={`Delete ${type}`}
          style={{
            width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#FEF2F2', color: '#EF4444', border: 'none', borderRadius: 5,
            cursor: 'pointer', flexShrink: 0, transition: 'background 0.15s',
            visibility: hover ? 'visible' : 'hidden',
            pointerEvents: hover ? 'auto' : 'none',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#FEE2E2'}
          onMouseLeave={e => e.currentTarget.style.background = '#FEF2F2'}
        >
          <Icons.Trash />
        </button>
      )}
    </div>
  );
}
