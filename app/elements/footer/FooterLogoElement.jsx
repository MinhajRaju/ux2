'use client';
export default function FooterLogoElement({ props }) {
  const p = props || {};
  return (
    <span style={{
      fontSize: (p.fontSize || 20) + 'px',
      fontWeight: p.fontWeight || '700',
      color: p.color || '#0f172a',
    }}>
      {p.text || 'Brand'}
    </span>
  );
}
