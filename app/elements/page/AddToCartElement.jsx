'use client';
export default function AddToCartElement({ props, mode, onSelect, isSelected }) {
  const p = props || {};
  const Tag = mode === 'view' ? 'button' : 'div';
  return (
    <div onClick={mode === 'edit' ? onSelect : undefined}
      style={{ cursor: mode === 'edit' ? 'pointer' : 'default', outline: mode === 'edit' && isSelected ? '2px solid #6366f1' : 'none', display: 'inline-block' }}>
      <Tag style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        background: p.bg || '#6366f1', color: p.color || '#fff',
        border: p.outline ? `2px solid ${p.bg || '#6366f1'}` : 'none',
        borderRadius: (p.borderRadius || 8) + 'px',
        fontSize: (p.fontSize || 15) + 'px', fontWeight: p.fontWeight || 700,
        padding: `${p.padV || 14}px ${p.padH || 28}px`,
        cursor: 'pointer', width: p.fullWidth ? '100%' : 'auto',
        opacity: p.disabled ? 0.5 : 1,
      }}>
        {p.showIcon !== false && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
        )}
        {p.text || 'Add to Cart'}
      </Tag>
    </div>
  );
}
