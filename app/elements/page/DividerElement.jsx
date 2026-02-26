'use client';
export default function DividerElement({ props }) {
  const p = props || {};
  return (
    <div style={{ width: '100%', padding: `${p.marginV || 8}px 0` }}>
      <hr style={{
        border: 'none',
        borderTop: `${p.thickness || 1}px ${p.style || 'solid'} ${p.color || '#e2e8f0'}`,
        width: p.width || '100%',
        margin: 0,
      }} />
    </div>
  );
}
