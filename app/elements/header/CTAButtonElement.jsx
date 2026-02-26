'use client';
export default function CTAButtonElement({ props, mode }) {
  const p = props || {};
  return (
    <button
      style={{
        background: p.bg || '#6366f1',
        color: p.color || '#fff',
        fontSize: p.fontSize || 14,
        fontWeight: p.fontWeight || '600',
        borderRadius: p.borderRadius || 8,
        padding: `${p.padV || 9}px ${p.padH || 18}px`,
        border: 'none',
        cursor: mode === 'edit' ? 'default' : 'pointer',
        transition: 'opacity 0.2s',
        whiteSpace: 'nowrap',
      }}
    >
      {p.text || 'Get Started'}
    </button>
  );
}
