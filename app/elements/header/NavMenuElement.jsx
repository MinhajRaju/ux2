'use client';
export default function NavMenuElement({ props, mode }) {
  const p = props || {};
  const items = p.items || [];
  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: p.gap || 28 }}>
      {items.map(item => (
        <a
          key={item.id}
          href={mode === 'view' ? item.href : undefined}
          onClick={mode === 'edit' ? (e) => e.preventDefault() : undefined}
          style={{
            fontSize: p.fontSize || 14,
            fontWeight: p.fontWeight || '500',
            color: p.color || '#334155',
            textDecoration: 'none',
            cursor: mode === 'edit' ? 'default' : 'pointer',
            transition: 'color 0.2s',
          }}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
