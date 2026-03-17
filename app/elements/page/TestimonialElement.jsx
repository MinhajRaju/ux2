'use client';
export default function TestimonialElement({ props, mode, onSelect, isSelected }) {
  const p = props || {};
  return (
    <div
      onClick={mode === 'edit' ? onSelect : undefined}
      style={{
        cursor: mode === 'edit' ? 'pointer' : 'default',
        outline: mode === 'edit' && isSelected ? '2px solid #6366f1' : 'none',
        outlineOffset: -2,
        background: p.bg || '#ffffff',
        border: `1px solid ${p.borderColor || '#e2e8f0'}`,
        borderRadius: (p.borderRadius || 16) + 'px',
        padding: (p.padding || 24) + 'px',
        boxShadow: p.shadow || '0 2px 12px rgba(0,0,0,0.06)',
        maxWidth: (p.maxWidth || 400) + 'px',
        fontFamily: 'inherit',
      }}
    >
      {/* Quote icon */}
      {p.showQuoteIcon !== false && (
        <div style={{ marginBottom: 12 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill={p.quoteColor || '#6366f1'} opacity={0.25}>
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
          </svg>
        </div>
      )}
      {/* Rating */}
      {p.showRating && (
        <div style={{ display: 'flex', gap: 2, marginBottom: 10 }}>
          {[1,2,3,4,5].map(i => (
            <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= (p.rating || 5) ? '#f59e0b' : '#e2e8f0'}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          ))}
        </div>
      )}
      {/* Text */}
      <p style={{ margin: '0 0 16px', fontSize: (p.textSize || 14) + 'px', color: p.textColor || '#334155', lineHeight: 1.7, fontStyle: p.italic ? 'italic' : 'normal' }}>
        "{p.text || 'This product is absolutely amazing! I love it so much. Highly recommended to everyone.'}"
      </p>
      {/* Author */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {p.avatarSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.avatarSrc} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
        ) : (
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: p.accentColor || '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
            {(p.name || 'A')[0].toUpperCase()}
          </div>
        )}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: p.nameColor || '#0f172a' }}>{p.name || 'Customer Name'}</div>
          {p.role && <div style={{ fontSize: 11, color: '#94a3b8' }}>{p.role}</div>}
        </div>
        {p.verifiedBuyer && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: '#10b981', fontWeight: 600 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
            Verified
          </div>
        )}
      </div>
    </div>
  );
}
