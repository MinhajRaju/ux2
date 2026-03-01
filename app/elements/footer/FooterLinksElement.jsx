'use client';
export default function FooterLinksElement({ props }) {
  const p = props || {};
  return (
    <div style={{ maxWidth: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
      {p.title && (
        <div style={{
          fontSize: (p.titleSize || 14) + 'px',
          fontWeight: '700',
          color: p.titleColor || '#0f172a',
          marginBottom: 12,
          wordBreak: 'break-word',
        }}>
          {p.title}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: p.gap || 8 }}>
        {(p.items || []).map(item => (
          <a key={item.id} href={item.href || '#'} style={{
            fontSize: (p.linkSize || 13) + 'px',
            color: p.linkColor || '#64748b',
            textDecoration: 'none',
            wordBreak: 'break-word',
          }}>
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}
