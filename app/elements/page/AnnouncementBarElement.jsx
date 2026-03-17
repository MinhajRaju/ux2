'use client';
export default function AnnouncementBarElement({ props, mode, onSelect, isSelected }) {
  const p = props || {};
  return (
    <div
      onClick={mode === 'edit' ? onSelect : undefined}
      style={{
        cursor: mode === 'edit' ? 'pointer' : 'default',
        outline: mode === 'edit' && isSelected ? '2px solid #6366f1' : 'none',
        outlineOffset: -2,
        background: p.bg || '#0f172a',
        color: p.color || '#fff',
        textAlign: 'center',
        padding: `${p.padV || 10}px ${p.padH || 20}px`,
        fontSize: (p.fontSize || 13) + 'px',
        fontWeight: p.fontWeight || '500',
        letterSpacing: p.letterSpacing ? p.letterSpacing + 'px' : undefined,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap',
      }}
    >
      {p.icon && <span>{p.icon}</span>}
      <span>{p.text || '🎉 Free shipping on orders over $50 — Use code FREESHIP'}</span>
      {p.ctaText && (
        <a href={p.ctaHref || '#'} style={{ color: p.ctaColor || '#f59e0b', fontWeight: 700, textDecoration: 'underline', fontSize: (p.fontSize || 13) + 'px' }}>
          {p.ctaText}
        </a>
      )}
    </div>
  );
}
