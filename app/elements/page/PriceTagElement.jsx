'use client';
export default function PriceTagElement({ props, mode, onSelect, isSelected }) {
  const p = props || {};
  const sale = p.salePrice && Number(p.salePrice) < Number(p.originalPrice || 0);
  return (
    <div
      onClick={mode === 'edit' ? onSelect : undefined}
      style={{ cursor: mode === 'edit' ? 'pointer' : 'default', outline: mode === 'edit' && isSelected ? '2px solid #6366f1' : 'none', display: 'inline-flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}
    >
      {sale ? (
        <>
          <span style={{ fontSize: (p.priceSize || 24) + 'px', fontWeight: 800, color: p.salePriceColor || '#ef4444', lineHeight: 1 }}>
            {p.currency || '$'}{p.salePrice}
          </span>
          <span style={{ fontSize: (p.priceSize || 24) - 6 + 'px', fontWeight: 400, color: '#94a3b8', textDecoration: 'line-through', lineHeight: 1 }}>
            {p.currency || '$'}{p.originalPrice}
          </span>
          {p.showDiscount && (
            <span style={{ fontSize: 11, fontWeight: 700, background: '#ef4444', color: '#fff', borderRadius: 4, padding: '2px 6px' }}>
              SAVE {Math.round((1 - p.salePrice / p.originalPrice) * 100)}%
            </span>
          )}
        </>
      ) : (
        <span style={{ fontSize: (p.priceSize || 24) + 'px', fontWeight: 800, color: p.priceColor || '#0f172a', lineHeight: 1 }}>
          {p.currency || '$'}{p.price || '29.99'}
        </span>
      )}
    </div>
  );
}
