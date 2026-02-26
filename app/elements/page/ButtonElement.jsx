'use client';
export default function ButtonElement({ props, mode }) {
  const p = props || {};
  return (
    <div style={{ textAlign: p.align || 'left' }}>
      <a
        href={mode === 'view' ? (p.href || '#') : undefined}
        onClick={mode === 'edit' ? (e) => e.preventDefault() : undefined}
        style={{
          display: 'inline-block',
          background: p.bg || '#6366f1',
          color: p.color || '#fff',
          fontSize: (p.fontSize || 14) + 'px',
          fontWeight: p.fontWeight || '600',
          borderRadius: (p.borderRadius || 8) + 'px',
          padding: `${p.padV || 12}px ${p.padH || 24}px`,
          textDecoration: 'none',
          cursor: mode === 'edit' ? 'default' : 'pointer',
          border: p.borderColor ? `${p.borderWidth || 1}px solid ${p.borderColor}` : 'none',
          transition: 'opacity 0.2s',
        }}
      >
        {p.text || 'Click Me'}
      </a>
    </div>
  );
}
