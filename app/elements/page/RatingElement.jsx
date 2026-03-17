'use client';
export default function RatingElement({ props, mode, onSelect, isSelected }) {
  const p = props || {};
  const rating = p.rating || 4;
  const max = p.maxRating || 5;
  const size = p.size || 18;

  return (
    <div onClick={mode === 'edit' ? onSelect : undefined}
      style={{ cursor: mode === 'edit' ? 'pointer' : 'default', outline: mode === 'edit' && isSelected ? '2px solid #6366f1' : 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <div style={{ display: 'flex', gap: (p.gap || 2) + 'px' }}>
        {Array.from({ length: max }).map((_, i) => {
          const filled = i < Math.floor(rating);
          const half   = !filled && i < rating;
          return (
            <svg key={i} width={size} height={size} viewBox="0 0 24 24">
              <defs>
                {half && <linearGradient id={`h${i}`} x1="0" x2="1" y1="0" y2="0">
                  <stop offset="50%" stopColor={p.starColor || '#f59e0b'}/>
                  <stop offset="50%" stopColor={p.emptyColor || '#e2e8f0'}/>
                </linearGradient>}
              </defs>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill={filled ? (p.starColor || '#f59e0b') : half ? `url(#h${i})` : (p.emptyColor || '#e2e8f0')} />
            </svg>
          );
        })}
      </div>
      {p.showValue && <span style={{ fontSize: (p.fontSize || 13) + 'px', fontWeight: 600, color: p.textColor || '#334155' }}>{rating}</span>}
      {p.reviewText && <span style={{ fontSize: (p.fontSize || 13) + 'px', color: p.mutedColor || '#94a3b8' }}>{p.reviewText}</span>}
    </div>
  );
}
