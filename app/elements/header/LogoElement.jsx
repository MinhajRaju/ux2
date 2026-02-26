'use client';
export default function LogoElement({ props, mode }) {
  const p = props || {};
  return (
    <div style={{ display: 'flex', alignItems: 'center', cursor: mode === 'edit' ? 'default' : 'pointer' }}>
      {p.src ? (
        <img src={p.src} alt={p.alt || 'Logo'} style={{ height: p.height || 40, width: 'auto', objectFit: 'contain' }} />
      ) : (
        <span style={{
          fontSize: p.fontSize || 22,
          fontWeight: p.fontWeight || '700',
          color: p.color || '#0f172a',
          letterSpacing: '-0.5px',
          fontFamily: p.fontFamily || 'inherit',
        }}>
          {p.text || 'Brand'}
        </span>
      )}
    </div>
  );
}
